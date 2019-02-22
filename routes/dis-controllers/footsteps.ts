import MySQL from '../../libs/MySQL';
import * as _ from 'lodash';
import Debug from '../../modules/Debug';
const debug = Debug('ws:footsteps');

export const create = async ctx => {
	try {
		ctx.assert(Object.keys(ctx.request.body).length, 400, 'INVALID_PARAMS');
		const { me } = ctx.state;
		let user = 'Anonymous';
		if (me) {
			user = me._id;
		}
		let insertSql = `INSERT INTO footsteps (user,type,data) VALUES ('${user}','${ctx.params.type}',?)`;
		debug('footsteps create sql', insertSql);
		await ctx.exec(ctx.mysql.format(insertSql, [JSON.stringify(ctx.request.body)]));
		ctx.status = 204;
	} catch (e) {
		ctx.throw(400, e);
	}
};

const controller = new MySQL('footsteps', {
	pageSize: 20,
	sort: '-createdAt',
	filter (ctx) {
		let filter: any = {};
		const { me } = ctx.state;
		filter.user = me._id;
		filter.type = ctx.params.type;
		return filter as object;
	},
	async projection (ctx, data: any) {
		try {
			let parse = JSON.parse(data.data);
			if (typeof parse === 'string') {
				data.data = JSON.parse(parse);
			} else {
				data.data = parse;
			}
		} catch (e) {
			debug('INVALID_JSON');
		}
		return data;
	}
});
export const query = controller.query();
export const detail = controller.detail();
