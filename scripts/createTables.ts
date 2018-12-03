import * as nconf from 'nconf';
import * as requireDir from 'require-dir';
import * as _ from 'lodash';
import Debug from '../modules/Debug';
import { query } from '../libs/mysqlPool';
const debug = Debug('ws:createTables');

nconf.required(['MYSQL']);
const tables = requireDir('../tables');

const createTables = Object.entries(tables).map(async item => {
	try {
		let queryStr: string = String(item[1]);
		let table: string = item[0];
		let checkTable = `SELECT count(0) FROM information_schema.TABLES WHERE table_schema='${nconf.get('MYSQL').database}' and table_name='${table}'`;
		let results = await query(checkTable);
		if (_.get(results, '[0][\'count(0)\']') == 0) {
			let results = await query(queryStr);
			debug(`--------------------------CREATED:${table}----------------------------`);
			debug('CREATE TABLE:', results);
			debug('------------------------------------------------------------\n\n');
		}
		return Promise.resolve();
	} catch (e) {
		debug(e);
		return Promise.reject(e);
	}
});
export =Promise.all(createTables);
