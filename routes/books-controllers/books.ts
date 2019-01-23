import MySQL from '../../libs/MySQL';
import * as _ from 'lodash';

const controller = new MySQL('books', {
	pageSize: 10,
	sort: '-views',
	filter (ctx) {
		let filter: any = {};
		if (ctx.query.id) {
			filter.id = ctx.query.id;
		}
		return filter as object;
	},
	async detailProjection (ctx, data) {
		switch (data.sort) {
			case 'xuanhuan': data.sortn = '玄幻小说'; break;
			case 'xiuzhen': data.sortn = '修真小说'; break;
			case 'dushi': data.sortn = '都市小说'; break;
			case 'chuanyue': data.sortn = '穿越小说'; break;
			case 'wangyou': data.sortn = '网游小说'; break;
			case 'kehuan': data.sortn = '科幻小说'; break;
		}
		let first = await ctx.exec(`select id as fid,title as firstSection from sections 
		where book=${data.id}
		and sequence=(select min(sequence) from sections where book=${data.id})`);
		if (first.length) {
			data.firstSection = first[0].lastSection;
		}
		let last = await ctx.exec(`select id as lid,title as lastSection from sections 
		where book=${data.id}
		and sequence=(select max(sequence) from sections where book=${data.id})`);
		if (last.length) {
			data.lastSection = last[0].lastSection;
		}
		return data;
	}
});

export const insert = async ctx => {
	try {
		ctx.assert(
			'id' in ctx.request.body
			&& 'sequence' in ctx.request.body
			&& 'author' in ctx.request.body
			&& 'status' in ctx.request.body
			&& 'sort' in ctx.request.body
			&& 'title' in ctx.request.body,
			400,
			'INVALID_PARAMS'
		);
		let book = _.pick(ctx.request.body, [
			'id', 'title', 'author', 'sort', 'cover', 'info', 'views', 'sequence', 'status', 'uploadDate', 'updateDate', 'firstSection', 'lastSection',
			'dayvisit',
			'weekvisit',
			'monthvisit',
			'weekvote',
			'monthvote',
			'allvote',
			'goodnum',
			'size',
			'goodnew',
		]);
		let sql = `
				INSERT INTO books (${Object.keys(book).join(',')}) 
				SELECT '${Object.values(book).join('\',\'')}'
				from DUAL  
				where not exists(select _id from books where id=${book.id});
			`;
		await ctx.exec(sql);
		ctx.status = 204;
	} catch (e) {
		ctx.throw(400, e);
	}
};
export const query = controller.query();
export const detail = controller.detail();
