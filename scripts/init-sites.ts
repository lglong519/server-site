const createTables = require('./createTables');
const sites = require(`${process.cwd()}/scripts/data/sites.json`);
import { query } from '../libs/mysqlPool';
import Debug from '../modules/Debug';
const debug = Debug('ws:init-site-datas');

async function processDatas (siteDatas: object[]): Promise<any> {
	await createTables;
	let createSites = siteDatas.map(site => {
		let sql = `
				INSERT INTO sites (${Object.keys(site).join(',')}) 
				SELECT '${Object.values(site).join('\',\'')}'
				from DUAL  
				where not exists(select id from sites where ${Object.keys(site)[0]}='${Object.values(site)[0]}');
			`;
		return query(sql).catch(err => {
			debug('error sql', sql);
			debug(err);
			process.exit();
		});
	});
	return Promise.all(createSites);
}
export = processDatas(sites);
