const books = require(`${process.cwd()}/scripts/data/book/books.json`);
import { query } from '../libs/mysqlPool';
import Debug from '../modules/Debug';
const debug = Debug('ws:init-books');
const createTables = require('./createTables');
import * as _ from 'lodash';

async function processDatas (books: object[]): Promise<any> {
	await createTables;
	let createBooks = books.map((item: any) => {
		let book = _.pick(item, [
			'id', 'title', 'author', 'sort', 'cover', 'info', 'views', 'sequence', 'status', 'uploadDate', 'updateDate', 'firstSection', 'lastSection',
			'dayvisit',
			'weekvisit',
			'monthvisit',
			'weekvote',
			'monthvote',
			'allvote',
			'goodnum',
			'size',
			'goodnew',
		]);
		let sql = `
				INSERT INTO books (${Object.keys(book).join(',')}) 
				SELECT '${Object.values(book).join('\',\'')}'
				from DUAL  
				where not exists(select _id from books where id=${book.id});
			`;
		return query(sql).catch(err => {
			debug('error sql', sql);
			debug(err);
			process.exit();
		});
	});
	debug();
	return Promise.all(createBooks);
}
processDatas(books);
