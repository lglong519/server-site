export = `
CREATE TABLE IF NOT EXISTS work_lists (
	id INT UNSIGNED AUTO_INCREMENT,
	cover VARCHAR(100),
	title VARCHAR(100),
	type VARCHAR(100),
	view VARCHAR(100) default '0',
	comment VARCHAR(20) default '0',
	zan VARCHAR(20) default '0',
	avatar VARCHAR(100),
	un VARCHAR(100),
	uid VARCHAR(20) default '0',
	time VARCHAR(100),
	sid INT,
	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (id),
	FOREIGN KEY (sid) REFERENCES sites(id)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
`;
