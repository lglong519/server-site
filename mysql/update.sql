-- 获取当前时间
use web_site_db;
-- UPDATE likes set updatedAt=now() where id=4;
-- 更新时间
-- select id,title,updateDate from books order by updateDate+0 desc limit 10;
-- select id,title from sections order by createdAt+0 desc limit 10;
UPDATE books set updateDate=(
	select max(createdAt) from sections where book=books.id);