import MySQL from '../../libs/MySQL';

const controller = new MySQL('likes', {
	pageSize: 5,
	sort: '-createdAt'
});

export= {
	query: controller.query()
};
