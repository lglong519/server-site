/* eslint prefer-template:0 */
import * as Router from 'koa-router';
const router = new Router();

const prefix = '/zcl';
router.use((ctx, next) => {
	console.log(ctx.subdomains);

	let now = Date.now();
	if (now % 2 == 0) {
		return ctx.throw(400, Error(`ERR_CODE:${now}`));
	}
	next();
});
router.get(prefix + '/', (ctx, next) => {
	ctx.body = { m: 9527 };
	next();
});

export =router;
