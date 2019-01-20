use web_site_db;

-- select title as firstSection from sections where id=2852982
-- UNION 
-- select title as lastSection from sections where id=2872632

SELECT id, MAX(CASE id WHEN 2852982 THEN title END) AS firstSection, 
      MAX(CASE id WHEN 2872632 THEN title  END) AS lastSection
FROM sections where id=2852982 or id=2872632  GROUP BY id

/*
	id	     firstSection	    lastSection
	2852982	 第十四章 十万两银子   null
	2872632	 null	            第十八章 灵果
*/