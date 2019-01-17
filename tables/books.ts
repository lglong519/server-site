export = `
CREATE TABLE IF NOT EXISTS sites (
	id INT UNSIGNED AUTO_INCREMENT,
	title VARCHAR(100) COMMENT '书名',
	author CHAR(20) COMMENT '作者',
	sort CHAR(10) COMMENT '类型',
	cover VARCHAR(2083) COMMENT '封面',
	views INT COMMENT '浏览人数',
	sequence INT COMMENT 'index',
	status CHAR(10) COMMENT '状态',
	uploadDate datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上架时间',
	updateDate datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
	firstSection INT COMMENT '首章',
	lastSection INT COMMENT '最近更新',

	dayvisit INT,
	weekvisit INT,
	monthvisit INT,
	weekvote INT,
	monthvote INT,
	allvote INT,
	goodnum INT,
	size INT,
	goodnew INT,

	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (id),
	FOREIGN KEY (firstSection) REFERENCES sections(id),
	FOREIGN KEY (lastSection) REFERENCES sections(id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
`;
