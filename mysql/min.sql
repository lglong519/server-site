use web_site_db;
-- 选择上一章 和 下一章
select * from sections as ms 
left join (select id as prev,sequence as pse,book as pbook from sections) as ps
on ps.pbook=ms.book and ps.pse=(select max(sequence) from sections where sequence<ms.sequence  limit 1)  
left join (select id as next,sequence as nse,book as nbook from sections) as ns
on ns.nbook=ms.book and ns.nse=(select min(sequence) from sections where sequence>ms.sequence limit 1) 
 where ms.id=2877624;

-- select max(sequence) from sections where sequence<200 and book=3714