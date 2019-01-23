
import MySQL from '../../libs/MySQL';

export const insert = async ctx => {
	try {
		ctx.assert('section' in ctx.request.body && 'contents' in ctx.request.body, 400, 'INVALID_PARAMS');
		let book = ctx.request.body.book || null;
		let sql = `
		INSERT INTO contents (book,section,contents)
		SELECT ${book},${ctx.request.body.section},?
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
	select: 's.book,s.title,s.prev,s.next,s.id,c.contents',
	filter () {
		return {
			's.id': 'c.section'
		};
	},
	async detailProjection (ctx, data) {
		let sql = `select * from sections as ms 
		left join (select id as prev,sequence as pse,book as pbook from sections) as ps 
		on ps.pbook=ms.book and ps.pse=(select max(sequence) from sections where sequence<ms.sequence limit 1) 
		left join (select id as next,sequence as nse,book as nbook from sections) as ns 
		on ns.nbook=ms.book and ns.nse=(select min(sequence) from sections where sequence>ms.sequence limit 1) 
		 where id=${data.id};`;
		let result = await ctx.exec(sql);
		if (ctx.validate(result)) {
			Object.assign(data, ctx.detail(result));
		}
		return data;
	}
});

export const detail = controller.detail();
