const TABLE = 'sections';
const PRIMARY_KEY = '_id';

export = `
CREATE TABLE IF NOT EXISTS ${TABLE} (
	${PRIMARY_KEY} INT UNSIGNED AUTO_INCREMENT,
	id INT,
	book INT COMMENT '书本 id',
	title VARCHAR(100),
	sequence INT COMMENT 'index',
	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (${PRIMARY_KEY}),
	INDEX ${TABLE}_index(id,book,sequence),
	FOREIGN KEY (book) REFERENCES books(id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
`;
// prev INT COMMENT '上一章 id',
// next INT COMMENT '下一章 id',
// FOREIGN KEY (prev) REFERENCES sections(id),
// FOREIGN KEY (next) REFERENCES sections(id)
