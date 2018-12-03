import MySQL from '../../libs/MySQL';

const controller = new MySQL('work_lists', {
	pageSize: 50,
	sort: '-createdAt'
});

export= {
	query: controller.query()
};
