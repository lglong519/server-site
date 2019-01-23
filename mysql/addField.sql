-- 添加 book 字段
use web_site_db;
-- ALTER TABLE contents ADD book INT;
alter table contents add constraint book foreign key(book) references books(id)
