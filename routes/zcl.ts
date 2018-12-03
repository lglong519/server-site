/* eslint prefer-template:0 */
import * as Router from 'koa-router';
import * as requireDir from 'require-dir';
const zcl = requireDir('./zcl-controllers');

const prefix = '/zcl';
const router = new Router();
router.get(prefix + '/likes', zcl.likes.query);
router.get(prefix + '/work-lists', zcl.work_lists.query);

export =router;
