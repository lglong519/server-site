const createTables = require('./createTables');
import * as requireDir from 'require-dir';
const zclDatas = requireDir('./zcl/data');
import { query } from '../libs/mysqlPool';

async function processDatas (): Promise<any> {
	await createTables;
	let select = 'select id from sites where name="zcl"';
	let zcl = await query(select);
	if (!zcl.length) {
		await query('INSERT INTO sites (name) values ("zcl")');
		zcl = await query(select);
	}
	console.log('zcl id:', zcl[0].id);
	Object.entries(zclDatas).map((item: Array<any>) => {
		let datas = item[1];
		datas.forEach(data => {
			let sql = `
				INSERT INTO ${item[0]} (${Object.keys(data).join(',')},sid) 
				SELECT '${Object.values(data).join('\',\'')}',${zcl[0].id}
				from DUAL  
				where not exists(select id from ${item[0]} where ${Object.keys(data)[0]}='${Object.values(data)[0]}');
			`;
			query(sql);
		});
	});
}
processDatas();
