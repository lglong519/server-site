use web_site_db;
ALTER table sections ADD INDEX sections_index(id,book,sequence);
show index from sections;