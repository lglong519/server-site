
import Debug from '../../modules/Debug';
const debug = Debug('ws:bookshelves');

export const bookmark = async ctx => {
	try {
		let { bookId, sectionId } = ctx.params;
		let { me } = ctx.state;
		let check = await ctx.exec(`select * from books where id=${bookId}`);
		if (!check.length) {
			throw Error('BOOK_NOT_FOUND');
		}
		if (sectionId) {
			let check = await ctx.exec(`select * from sections where id=${sectionId}`);
			if (!check.length) {
				throw Error('SECTION_NOT_FOUND');
			}
		}
		let sql = `select * from bookshelves where user='${me._id}'`;
		debug('sql', sql);
		let results = await ctx.exec(sql);
		if (!results.length) {
			throw Error('BOOKSHELF_NOT_FOUND');
		}
		let bookshelf = results[0];
		let itemSql = `
		INSERT INTO bookshelf_items (book,bookshelf)
		SELECT ${bookId},${bookshelf.id}
		from DUAL
		where not exists(select id from bookshelf_items where book=${bookId} and bookshelf=${bookshelf.id});
	`;
		debug('itemSql', itemSql);
		await ctx.exec(itemSql);
		if (sectionId) {
			let updateSql = `UPDATE bookshelf_items SET mark=${sectionId} 
			where bookshelf=${bookshelf.id} and book=${bookId}`;
			debug('updateSql', updateSql);
			await ctx.exec(updateSql);
		}
		ctx.status = 204;
	} catch (e) {
		ctx.throw(400, e);
	}
};
