const sections = require(`${process.cwd()}/scripts/data/book/sections.json`);
import { query } from '../libs/mysqlPool';
import Debug from '../modules/Debug';
const debug = Debug('ws:init-sections');
const createTables = require('./createTables');

async function processDatas (sections: object[]): Promise<any> {
	await createTables;
	let createSections = sections.map((section: any) => {
		let sql = `
				INSERT INTO sections (${Object.keys(section).join(',')}) 
				SELECT '${Object.values(section).join('\',\'')}'
				from DUAL  
				where not exists(select id from sections where id=${section.id});
			`;
		return query(sql).catch(err => {
			debug('error sql', sql);
			debug(err);
			process.exit();
		});
	});
	return Promise.all(createSections);
}
processDatas(sections);
