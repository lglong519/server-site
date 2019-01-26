import * as rp from 'request-promise';
import * as Joi from 'joi';
import Debug from '../../modules/Debug';
const debug = Debug('ws:me');

export const create = async ctx => {
	try {
		const schema = Joi.object().keys({
			username: Joi.string().min(3).required(),
			password: Joi.string().min(6).required(),
			email: Joi.string().allow(''),
			client: Joi.string().valid('BOOK').required(),
		}).required();
		const validate = Joi.validate(ctx.request.body, schema);
		if (validate.error) {
			debug('validate.error', validate.error);
			throw validate.error;
		}
		const params = validate.value;

		let token = await rp.post('http://127.0.0.1:50901/dis/users', {
			headers: {
				'x-serve': 'service'
			},
			body: params,
			json: true
		});
		let sql = `
		INSERT INTO bookshelves (user)
		SELECT ?
		from DUAL
		where not exists(select id from bookshelves where user=?);
	`;
		await ctx.exec(ctx.mysql.format(sql, [token.user, token.user]));
		ctx.body = token;
	} catch (e) {
		ctx.throw(400, e);
	}
};

export const bookshelf = async ctx => {
	try {
		const { me } = ctx.state;
		let sql = `select * from bookshelves where user='${me._id}'`;
		debug('sql', sql);
		let results = await ctx.exec(sql);
		if (!results.length) {
			let insertSql = `INSERT INTO bookshelves (user) VALUES ('${me._id}')`;
			debug('insertSql', insertSql);
			await ctx.exec(insertSql);
			results = await ctx.exec(sql);
		}
		if (!results.length) {
			throw Error('UNKNOWN_ERR');
		}
		let bookshelf = results[0];
		/*
		let itemSql = `select * from bookshelf_items
		 left join (select id as bid,title as btitle from books) as books
		 on bookshelf_items.book=books.bid
		 left join (select id as mid,title as mtitle,book as mbook from sections) as ms
		 on bookshelf_items.mark is not null and bookshelf_items.mark=ms.mid
		 left join (select id as sid,title as stitle,book as sbook,sequence from sections) as sections
		 on sections.sbook=books.bid
		 and sections.sequence=(select max(sequence) from sections where sections.book=bookshelf_items.book)
		 where bookshelf_items.bookshelf=${bookshelf.id} ORDER BY updatedAt+0 DESC;
		`;
		debug('itemSql', itemSql);
		bookshelf.books = await ctx.exec(itemSql);
		*/
		let itemSql = `select * from bookshelf_items
		 left join (select id as bid,title as btitle from books) as books
		 on bookshelf_items.book=books.bid
		 where bookshelf=${bookshelf.id} ORDER BY updatedAt+0 DESC`;
		debug('itemSql', itemSql);
		bookshelf.books = await ctx.exec(itemSql);
		let tasks = bookshelf.books.map(async item => {
			if (item.mark) {
				let markSql = `select id as mid,title as mtitle,book as mbook from sections where id=${item.mark}`;
				debug('bookmark item', markSql);
				let result = await ctx.exec(markSql);
				ctx.validate(result).then(value => {
					Object.assign(item, value);
				});
			}
			let newSectionSql = `select id as sid,title as stitle,book as sbook from sections
				 where book=${item.book} order by sequence DESC LIMIT 1`;
			debug('bookmark item', newSectionSql);
			let result = await ctx.exec(newSectionSql);
			ctx.validate(result).then(value => {
				Object.assign(item, value);
			});
		});
		await Promise.all(tasks);
		ctx.body = bookshelf;
	} catch (e) {
		ctx.throw(400, e);
	}
};
export const removeBook = async ctx => {
	try {
		const { me } = ctx.state;
		const { id: bookId } = ctx.params;
		let delSql = `DELETE FROM bookshelf_items WHERE book=${bookId} and bookshelf=(select id from bookshelves where user='${me._id}')`;
		debug('delSql', delSql);
		await ctx.exec(delSql);
		ctx.status = 204;
	} catch (e) {
		ctx.throw(400, e);
	}
};
