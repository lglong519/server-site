import * as nconf from 'nconf';
import * as mysql from 'mysql';
import Debug from '../modules/Debug';
const debug = Debug('ws:mysql');

nconf.required(['MYSQL']);

const connection = mysql.createConnection(nconf.get('MYSQL'));
connection.connect(err => {
	if (err) {
		debug('mysql connect Error', err);
		process.exit();
	}
	debug('mysql connect success');
});
export default connection;

export function query (sql: string): Promise<any> {
	return new Promise((res, rej) => {
		connection.query(sql, (err, results, fields) => {
			if (err) {
				return rej(err);
			}
			res(results);
		});
	});
}
