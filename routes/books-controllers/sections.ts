import MySQL from '../../libs/MySQL';

const controller = new MySQL('sections', {
	pageSize: 10,
	sort: 'sequence',
	filter (ctx) {
		let filter: any = {};
		if (ctx.params.bookId) {
			filter.book = ctx.params.bookId;
		}
		return filter as object;
	},
});

export const insert = async ctx => {
	try {
		ctx.assert(
			'id' in ctx.request.body
			&& 'sequence' in ctx.request.body
			&& 'book' in ctx.request.body
			&& 'title' in ctx.request.body,
			400,
			'INVALID_PARAMS'
		);
		let section = ctx.request.body;
		let sql = `
				INSERT INTO sections (${Object.keys(section).join(',')}) 
				SELECT '${Object.values(section).join('\',\'')}'
				from DUAL  
				where not exists(select id from sections where id=${section.id});
			`;
		await ctx.exec(sql);
		ctx.status = 204;
	} catch (e) {
		ctx.throw(400, e);
	}
};

export const query = controller.query();
export const detail = controller.detail();
