const createTables = require('./createTables');
import * as requireDir from 'require-dir';
const zclDatas = requireDir('./zcl/data');
import { query } from '../libs/mysqlPool';
import Debug from '../modules/Debug';
const debug = Debug('ws:init-site-datas');
import * as assert from 'assert';

async function processDatas (siteDatas: object, siteName: string): Promise<any> {
	await createTables;
	let select = `select id from sites where name="${siteName}"`;
	debug(select);
	let site = await query(select);
	assert(site && site[0]);
	debug('site id:', site[0].id);
	Object.entries(siteDatas).map((item: Array<any>) => {
		let datas = item[1];
		datas.forEach(data => {
			let sql = `
				INSERT INTO ${item[0]} (${Object.keys(data).join(',')},sid) 
				SELECT '${Object.values(data).join('\',\'')}',${site[0].id}
				from DUAL  
				where not exists(select id from ${item[0]} where ${Object.keys(data)[0]}='${Object.values(data)[0]}');
			`;
			query(sql).catch(err => {
				debug(sql);
				debug(err);
				process.exit();
			});
		});
	});
}
processDatas(zclDatas, 'zcl');
