
import MySQL from '../../libs/MySQL';
import Debug from '../../modules/Debug';
const debug = Debug('ws:contents');

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
	select: 's.sequence,s.book,s.title,s.prev,s.next,s.id,c.contents',
	filter () {
		return {
			's.id': 'c.section'
		};
	},
	async detailProjection (ctx, data: any) {
		/*
		let sql = `select * from sections as ms
		 left join (select title as btitle,id as bid from books) as books on books.bid=ms.book
		 left join (select id as prev,sequence as pse,book as pbook from sections) as ps
		 on ps.pbook=ms.book and ps.pse=(select max(sequence) from sections where sequence<ms.sequence limit 1)
		 left join (select id as next,sequence as nse,book as nbook from sections) as ns
		 on ns.nbook=ms.book and ns.nse=(select min(sequence) from sections where sequence>ms.sequence limit 1)
		 where id=${data.id};`;
		 */
		// book
		let bookSql = `select title as btitle,author from books where id=${data.book}`;
		debug('bookSql', bookSql);
		let book = await ctx.exec(bookSql);
		ctx.validate(book).then(value => {
			Object.assign(data, value);
		});
		// 上一章
		let prevSql = `select id as prev from sections 
		 where book=${data.book} and sequence<${data.sequence} order by sequence desc limit 1`;
		debug('prevSql', prevSql);
		let prev = await ctx.exec(prevSql);
		ctx.validate(prev).then(value => {
			Object.assign(data, value);
		});
		// 下一章
		let nextSql = `select id as next from sections 
		 where book=${data.book} and sequence>${data.sequence} order by sequence limit 1`;
		debug('nextSql', nextSql);
		let next = await ctx.exec(nextSql);
		ctx.validate(next).then(value => {
			Object.assign(data, value);
		});
		return data as any;
	}
});

export const detail = controller.detail();
