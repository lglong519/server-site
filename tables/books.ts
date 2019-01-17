export = `
CREATE TABLE IF NOT EXISTS sites (
	id INT UNSIGNED AUTO_INCREMENT,
	title VARCHAR(100) COMMENT '书名',
	uploadDate datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上架时间',
	updateDate datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
	firstSection INT COMMENT '首章',
	lastSection INT COMMENT '最近更新',
	views INT,
	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (id),
	FOREIGN KEY (firstSection) REFERENCES sections(id),
	FOREIGN KEY (lastSection) REFERENCES sections(id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
`;