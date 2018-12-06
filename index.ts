import Debug from './modules/Debug';
import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import * as morgan from './modules/koa-morgan';
import * as koaBody from 'koa-body';
import * as localhost from './libs/getHost';
import * as nconf from 'nconf';
const cors = require('./modules/cors');
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
/**
 * @description 初始化必要的数据
 */
import './scripts';

Debug.enable('ws:*');

const debug = Debug('ws:index');
const server = new Koa();

/**
  * @name 设置静态资源目录
*/
server.use(koaStatic(`${process.cwd()}/public`));
server.use(morgan('dev'));
server.use(cors(nconf.get('CORS')));
server.use(koaBody({
	multipart: true, // 支持文件上传
	encoding: 'gzip',
	formidable: {
		uploadDir: `${process.cwd()}/public/upload/`, // 设置文件上传目录
		keepExtensions: true,
		maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小 2g
	}
}));

/**
 * @description load routes
 */
import * as layouts from './routes/layouts';
server.use(layouts.routes());

server.listen(nconf.get('PORT'), () => {
	debug('\nready on \x1B[33mhttp://%s:%s\x1B[39m ,NODE_ENV: \x1B[32m%s\x1B[39m\n', localhost, nconf.get('PORT'), nconf.get('NODE_ENV'));
});

server.on('error', (err, ctx) => {
	debug('server error', err, ctx);
});
