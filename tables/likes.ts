export = `
CREATE TABLE IF NOT EXISTS likes (
	id INT UNSIGNED AUTO_INCREMENT,
	title VARCHAR(100),
	image VARCHAR(100),
	sid INT,
	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (id),
	FOREIGN KEY (sid) REFERENCES sites(id)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
`;
