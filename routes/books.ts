/* eslint prefer-template:0 */
import * as Router from 'koa-router';
import * as requireDir from 'require-dir';
const books = requireDir('./books-controllers');
import applyToken from './middleWares/applyToken';

const router = new Router({
	prefix: '/books'
});
router.post('/', books.books.insert);
router.post('/sections', books.sections.insert);
router.post('/contents', books.contents.insert);

router.get('/', books.books.query);
router.get('/:id', books.books.detail);
router.get('/:bookId/sections', books.sections.query);
router.get('/sections/:id', books.sections.detail);
router.get('/sections/:section/contents', books.contents.detail);

router.post('/:bookId/mark', applyToken, books.bookshelves.bookmark);
router.post('/:bookId/sections/:sectionId/mark', applyToken, books.bookshelves.bookmark);

export default router;
