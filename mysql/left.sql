use web_site_db;
select * from bookshelf_items 
left join (select id as bid,title as btitle from books) as books 
on bookshelf_items.book=books.bid
left join (select id as mid,title as mtitle,book as mbook from sections) as ms 
on bookshelf_items.mark is not null and bookshelf_items.mark=ms.mid
left join (select id as sid,title as stitle,book as sbook,sequence from sections) as sections 
on sections.sbook=books.bid 
and sections.sequence=(select max(sequence) from sections where sections.book=bookshelf_items.book)
where bookshelf_items.bookshelf=1;
