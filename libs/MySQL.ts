
import { query } from './mysqlPool';
import * as _ from 'lodash';

type options = {
	pageSize?: number;
maxPageSize?: number;
sort?: string;
};

export default class MySQL {

	table: string;
	options: options;
	constructor (table: string, {
		pageSize = 100,
		maxPageSize = 100,
		sort = '-createdAt'
	}: options) {
		this.table = table;
		this.options = {
			pageSize,
			maxPageSize,
			sort
		};
	}
	query () {
		return async ctx => {
			try {
				// 1.WHERE
				let where: string = '';
				if (ctx.query.q) {
					where = `WHERE ${ctx.query.q}`;
				}
				// 2.ORDER BY
				const sort: string = ctx.query.sort || this.options.sort;
				let orderBy: string = `ORDER BY '${sort}' ASC`;
				if (sort.startsWith('-')) {
					orderBy = `ORDER BY '${sort.replace('-', '')}' DESC`;
				}
				// 3.LIMIT & OFFSET
				const page = Number(ctx.query.p) >= 0 ? Number(ctx.query.p) : 0;
				const requestedPageSize = Number(ctx.query.pageSize) > 0 ? Number(ctx.query.pageSize) : this.options.pageSize;
				const pageSize = Math.min(requestedPageSize, this.options.maxPageSize);
				// query
				let sql = `select * from ${this.table} ${where} ${orderBy} LIMIT ${pageSize} OFFSET ${page * pageSize}`;
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
