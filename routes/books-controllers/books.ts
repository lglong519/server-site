import MySQL from '../../libs/MySQL';

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
		let results = await ctx.exec(`select title as lastSection from sections where id=${data.lastSection}`);
		if (results.length) {
			data.lastSection = results[0].lastSection;
		}
		return data;
	}
});

export const query = controller.query();
export const detail = controller.detail();
