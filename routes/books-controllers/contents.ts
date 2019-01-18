
export const insert = async ctx => {
	try {
		ctx.assert('section' in ctx.request.body && 'contents' in ctx.request.body, 400, 'INVALID_PARAMS');
		let sql = `
		INSERT INTO contents (section,contents)
		SELECT ${ctx.request.body.section},'${ctx.request.body.contents}'
		from DUAL
		where not exists(select id from contents where section=${ctx.request.body.section});
	`;
		await ctx.exec(sql);
		ctx.status = 204;
	} catch (e) {
		ctx.throw(400, e);
	}
};
