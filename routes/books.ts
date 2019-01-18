/* eslint prefer-template:0 */
import * as Router from 'koa-router';
import * as requireDir from 'require-dir';
const books = requireDir('./books-controllers');

const router = new Router({
	prefix: '/books'
});
router.get('/', books.books.query);
router.get('/:id', books.books.detail);
router.get('/:bookId/sections', books.sections.query);
router.post('/contents', books.contents.insert);
router.get('/sections/:id', books.sections.detail);

export default router;
