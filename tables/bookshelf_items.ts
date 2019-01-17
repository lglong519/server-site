export = `
CREATE TABLE IF NOT EXISTS sites (
	id INT UNSIGNED AUTO_INCREMENT,
	book INT,
	section INT,
	bookshelf INT,
	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (id),
	FOREIGN KEY (book) REFERENCES books(id),
	FOREIGN KEY (section) REFERENCES sections(id),
	FOREIGN KEY (bookshelf) REFERENCES bookshelves(id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
`;