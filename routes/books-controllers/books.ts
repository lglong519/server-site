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
	}
});

export const query = controller.query();
export const detail = controller.detail();
