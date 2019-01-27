
import { query } from './mysqlPool';
import * as _ from 'lodash';
import Debug from '../modules/Debug';
const debug = Debug('ws:MySQL');

interface Projection{
	<T>(ctx: any, data: T): Promise<T>;
}
interface Options {
	pageSize?: number;
	maxPageSize?: number;
	sort?: string;
	select?: string;
	queryString?: string;
	filter?(ctx: any): object;
	projection?: Projection;
	detailProjection?: Projection;
	listProjection?: Projection;
}

export default class MySQL {

	table: string;
	options: Options;
	ctx: any;
	constructor (table: string, {
		pageSize = 10,
		maxPageSize = 100,
		sort = '-createdAt',
		select = '*',
		queryString = 'id',
		filter,
		detailProjection, // = async (ctx,data) => Promise.resolve(data),
		listProjection, // = async (ctx,data) => Promise.resolve(data)
		projection
	}: Options) {
		this.table = table;
		this.options = {
			pageSize,
			maxPageSize,
			sort,
			select,
			queryString,
			filter,
			detailProjection,
			listProjection,
			projection
		};
	}
	query () {
		return async ctx => {
			try {
				this.ctx = ctx;
				// 1.WHERE
				let conditions: string[] = [];
				let where: string = await this.setConditions(conditions);

				// 2.ORDER BY
				const sort: string = ctx.query.sort || this.options.sort;
				let orderBy: string = `ORDER BY ${sort}+0 ASC`;
				if (sort.startsWith('-')) {
					orderBy = `ORDER BY ${sort.replace('-', '')}+0 DESC`;
				}
				// 3.LIMIT & OFFSET
				const currentPage = Number(ctx.query.p) >= 0 ? Number(ctx.query.p) : 0;
				const requestedPageSize = Number(ctx.query.pageSize) > 0 ? Number(ctx.query.pageSize) : this.options.pageSize;
				const pageSize = Math.min(requestedPageSize, this.options.maxPageSize);
				// query
				let sql = `select ${this.options.select} from ${this.table} ${where} ${orderBy} LIMIT ${pageSize} OFFSET ${currentPage * pageSize}`;
				debug('query sql:', sql);
				let results = await query(sql);

				let countSql = `select count(*) as count from ${this.table} ${where}`;
				await this.applyHeaders(ctx, countSql, pageSize, currentPage);

				let projection = this.options.listProjection || this.options.projection;
				if (projection) {
					let outputs = results.map(async item => {
						return await projection(ctx, item);
					});
					ctx.body = await Promise.all(outputs);
					return;
				}
				ctx.body = results;
			} catch (e) {
				ctx.throw(400, e);
			}
		};
	}
	detail () {
		return async ctx => {
			try {
				this.ctx = ctx;
				// 1.WHERE
				// 默认使用 id
				let conditions: string[] = [`${this.options.queryString}=${ctx.params[this.options.queryString]}`];
				let where: string = await this.setConditions(conditions);

				// query
				let sql = `select ${this.options.select} from ${this.table} ${where} LIMIT 1`;
				debug('detail sql:', sql);
				let output;
				ctx.validate(await query(sql)).then(value => {
					output = value;
				}).error();
				let projection = this.options.detailProjection || this.options.projection;
				if (projection) {
					ctx.body = await projection(ctx, output);
					return;
				}
				ctx.body = output;
			} catch (e) {
				ctx.throw(400, e);
			}
		};
	}
	delete () {
		return async ctx => {
			try {
				this.ctx = ctx;
				// 1.WHERE
				// 默认使用 id
				let conditions: string[] = [`${this.options.queryString}=${ctx.params[this.options.queryString]}`];
				let where: string = await this.setConditions(conditions);

				// query
				let sql = `select * from ${this.table} ${where} LIMIT 1`;
				debug('findone sql:', sql);
				let data;
				ctx.validate(await query(sql)).then(value => {
					data = value;
				}).error();
				// recycle
				let recycleSql = `
				INSERT INTO recycles (id,collection,data) 
				VALUES (?,?,?);`;
				await ctx.exec(ctx.mysql.format(recycleSql, [data.id, this.table, JSON.stringify(data)]));
				// delete
				let deleteSql = `delete from ${this.table} ${where}`;
				debug('deleteSql:', deleteSql);
				await ctx.exec(deleteSql);
				ctx.status = 204;
			} catch (e) {
				ctx.throw(400, e);
			}
		};
	}
	// 使用 this.ctx 会导致设置 headers 失败
	private async applyHeaders (ctx, countSql, pageSize, currentPage) {
		let count = await query(countSql);
		// set headers
		ctx.set({
			'X-Page-Size': pageSize,
			'X-Current-Page': currentPage,
			'X-Total-Count': _.get(count, '[0].count'),
			'X-Total-Pages': Math.ceil(_.get(count, '[0].count') / pageSize),
		});
	}
	private async setConditions (conditions: string[]): Promise<string> {
		if (this.ctx.query.q) {
			let q: object = JSON.parse(this.ctx.query.q);
			this.serialize(q, conditions);
		}
		if (this.ctx.query.like) {
			let like: object = JSON.parse(this.ctx.query.like);
			Object.keys(like).forEach(key => {
				conditions.push(`${key} LIKE '%${like[key]}%'`);
			});
		}
		if (this.options.filter) {
			let q: object = await this.options.filter(this.ctx);
			this.serialize(q, conditions);
		}
		conditions = [...new Set(conditions)];
		if (conditions.length) {
			return `where ${conditions.join(' and ')}`;
		}
		return '';
	}
	private serialize (q, conditions) {
		Object.keys(q).forEach(key => {
			let value = q[key];
			if (value && !(/^\d+$|\./).test(value)) {
				value = `'${value}'`;
			}
			conditions.push(`${key}=${value}`);
		});
	}

}
