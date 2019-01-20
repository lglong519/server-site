/* eslint prefer-template:0 */
import * as Router from 'koa-router';
import * as requireDir from 'require-dir';
const layouts = requireDir('./layouts-controllers');

const router = new Router({
	prefix: '/layouts'
});
router.get('/likes', layouts.likes.query);
router.get('/work-lists', layouts.work_lists.query);
router.get('/:sid/likes', layouts.likes.query);
router.get('/:sid/work-lists', layouts.work_lists.query);
router.get('/:sid/swipers', layouts.swipers.query);

export default router;
