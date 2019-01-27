/* eslint prefer-template:0 */
import * as Router from 'koa-router';
import * as requireDir from 'require-dir';
const dis = requireDir('./dis-controllers');
import applyToken from './middleWares/applyToken';
import applyPublicToken from './middleWares/applyPublicToken';

const router = new Router({
	prefix: '/dis'
});
router.post('/access-tokens', dis.accessTokens.create);
router.post('/me', dis.me.create);
router.get('/me/bookshelf', applyToken, dis.me.bookshelf);
router.del('/me/bookshelf/books/:book', applyToken, dis.bookshelfItems.deleteOne);
router.post('/footsteps/:type', applyPublicToken, dis.footsteps.create);
router.get('/me/footsteps/:type', applyToken, dis.footsteps.query);

export default router;
