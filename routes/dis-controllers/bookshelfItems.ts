import MySQL from '../../libs/MySQL';
import * as _ from 'lodash';
import Debug from '../../modules/Debug';
const debug = Debug('ws:bookshelfItems');

const controller = new MySQL('bookshelf_items', {
	queryString: 'book',
	async filter (ctx) {
		let filter: any = {};
		const { me } = ctx.state;
		let sql = `select id from bookshelves where user='${me._id}'`;
		let bookshelf;
		debug('bookshelf sql', sql);
		ctx.validate(await ctx.exec(sql)).then(value => {
			bookshelf = value;
		}).error();
		filter.bookshelf = bookshelf.id;
		return filter;
	}
});

export const deleteOne = controller.delete();
