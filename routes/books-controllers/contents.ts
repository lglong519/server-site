
import MySQL from '../../libs/MySQL';

export const insert = async ctx => {
	try {
		ctx.assert('section' in ctx.request.body && 'contents' in ctx.request.body, 400, 'INVALID_PARAMS');
		let sql = `
		INSERT INTO contents (section,contents)
		SELECT ${ctx.request.body.section},?
		from DUAL
		where not exists(select id from contents where section=${ctx.request.body.section});
	`;
		await ctx.exec(ctx.mysql.format(sql, [ctx.request.body.contents]));
		ctx.status = 204;
	} catch (e) {
		ctx.throw(400, e);
	}
};

const controller = new MySQL('sections as s,contents as c', {
	pageSize: 10,
	sort: 'sequence',
	queryString: 'section',
	select: 's.book,s.title,s.prev,s.next,c.contents',
	filter () {
		return {
			's.id': 'c.section'
		};
	}
});

export const detail = controller.detail();
