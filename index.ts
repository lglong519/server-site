import * as nconf from 'nconf';
/**
 * @description 加载配置,必需应用在所有自定义模块前
 */
nconf.file('./.config').env();
nconf.required([
	'NODE_ENV',
	'HOST',
	'PORT',
	'CORS',
]);
import Debug, { enable } from './modules/Debug';
import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import * as morgan from './modules/koa-morgan';
import * as koaBody from 'koa-body';
import * as localhost from './libs/getHost';
import history from './libs/history';
import { query } from './libs/mysqlPool';

const cors = require('./modules/cors');
/**
 * @description 初始化必要的数据
 */
import './scripts';

enable('ws:*');

const debug = Debug('ws:index');
const server = new Koa();

server.context.exec = query;
server.use(history({
	rewrites: [
		{ from: /\/acc\/[^.]*$/, to: '/acc/index.html' },
		{ from: /^\/cool\/$/, to: '/cool/index.html' },
	]
}));

/**
 * @name 设置静态资源目录
 */
server.use(koaStatic(`${process.cwd()}/public`));
server.use(morgan('dev'));
server.use(cors(nconf.get('CORS')));
server.use(koaBody());

/**
 * @description load routes
 */
import * as layouts from './routes/layouts';
server.use(layouts.routes());
import books from './routes/books';
server.use(books.routes());

server.listen(nconf.get('PORT'), () => {
	debug('ready on \x1B[33mhttp://%s:%s\x1B[39m ,NODE_ENV: \x1B[32m%s\x1B[39m\n', localhost, nconf.get('PORT'), nconf.get('NODE_ENV'));
});

server.on('error', (err, ctx) => {
	debug('server error', err, ctx);
});
