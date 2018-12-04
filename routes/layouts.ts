/* eslint prefer-template:0 */
import * as Router from 'koa-router';
import * as requireDir from 'require-dir';
const layouts = requireDir('./layouts-controllers');

const prefix = '/layouts';
const router = new Router();
router.get(prefix + '/likes', layouts.likes.query);
router.get(prefix + '/work-lists', layouts.work_lists.query);
router.get(prefix + '/:sid/likes', layouts.likes.query);
router.get(prefix + '/:sid/work-lists', layouts.work_lists.query);

export =router;
