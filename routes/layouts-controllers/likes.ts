import MySQL from '../../libs/MySQL';

const controller = new MySQL('likes', {
	pageSize: 5,
	sort: '-createdAt',
	filter (ctx) {
		let filter: any = {};
		if (ctx.query.sid) {
			filter.sid = ctx.query.sid;
		}
		return filter as object;
	}
});

export= {
	query: controller.query()
};
