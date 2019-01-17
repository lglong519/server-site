
import { query } from './mysqlPool';
import * as _ from 'lodash';
import Debug from '../modules/Debug';
const debug = Debug('ws:MySQL');

interface Options {
	pageSize?: number;
	maxPageSize?: number;
	sort?: string;
	select?: string;
	filter?(ctx: any): object;
}

export default class MySQL {

	table: string;
	options: Options;
	constructor (table: string, {
		pageSize = 100,
		maxPageSize = 100,
		sort = '-createdAt',
		select = '*'
	}: Options) {
		this.table = table;
		this.options = {
			pageSize,
			maxPageSize,
			sort,
			select
		};
	}
	query () {
		return async ctx => {
			try {
				// 1.WHERE
				let where: string = '';
				let conditions: string[] = [];
				if (ctx.query.q) {
					let q: object = JSON.parse(ctx.query.q);
					Object.keys(q).forEach(key => {
						conditions.push(`${key}=${q[key]}`);
					});
				}
				if (this.options.filter) {
					let q: object = this.options.filter(ctx);
					Object.keys(q).forEach(key => {
						conditions.push(`${key}=${q[key]}`);
					});
				}
				conditions = [...new Set(conditions)];
				if (conditions.length) {
					where = `where ${conditions.join(' and ')}`;
				}
				// 2.ORDER BY
				const sort: string = ctx.query.sort || this.options.sort;
				let orderBy: string = `ORDER BY ${sort}+0 ASC`;
				if (sort.startsWith('-')) {
					orderBy = `ORDER BY ${sort.replace('-', '')}+0 DESC`;
				}
				// 3.LIMIT & OFFSET
				const page = Number(ctx.query.p) >= 0 ? Number(ctx.query.p) : 0;
				const requestedPageSize = Number(ctx.query.pageSize) > 0 ? Number(ctx.query.pageSize) : this.options.pageSize;
				const pageSize = Math.min(requestedPageSize, this.options.maxPageSize);
				// query
				let sql = `select ${this.options.select} from ${this.table} ${where} ${orderBy} LIMIT ${pageSize} OFFSET ${page * pageSize}`;
				debug('sql:', sql);
				let countSql = `select count(*) as count from ${this.table} ${where}`;
				let results = await query(sql);
				let count = await query(countSql);
				// set headers
				ctx.set({
					'X-Page-Size': pageSize,
					'X-Current-Page': page,
					'X-Total-Count': _.get(count, '[0].count')
				});
				ctx.body = results;
			} catch (e) {
				ctx.throw(400, e);
			}
		};
	}

}
