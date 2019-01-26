use web_site_db;
-- 设置 contents.book
-- select id,section,book from contents limit 100;
-- select id,section,book from contents  where book is null;
-- select count(id) from contents where book is null;
update contents set book=(select book from sections where id=contents.section) where and book is null;