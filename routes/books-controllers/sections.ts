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
	}
});

export const query = controller.query();
export const detail = controller.detail();
