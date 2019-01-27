const TABLE = 'books';
const PRIMARY_KEY = '_id';

export = `
CREATE TABLE IF NOT EXISTS ${TABLE} (
	${PRIMARY_KEY} INT UNSIGNED AUTO_INCREMENT,
	id INT NOT NULL UNIQUE,
	title VARCHAR(100) NOT NULL COMMENT '书名',
	author CHAR(20) COMMENT '作者',
	sort CHAR(10) COMMENT '类型',
	cover VARCHAR(2083) COMMENT '封面',
	info VARCHAR(2083) default '' COMMENT '简介',
	views INT default 0 COMMENT '浏览人数',
	sequence INT COMMENT 'index',
	status CHAR(10) default '连载中' COMMENT '状态',
	uploadDate datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上架时间',
	updateDate datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',

	dayvisit INT default 0,
	weekvisit INT default 0,
	monthvisit INT default 0,

	weekvote INT default 0,
	monthvote INT default 0,
	allvote INT default 0,

	goodnum INT default 0,
	size INT default 0,
	goodnew INT default 0,

	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (${PRIMARY_KEY}),
	FOREIGN KEY (firstSection) REFERENCES sections(id),
	FOREIGN KEY (lastSection) REFERENCES sections(id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
`;
// firstSection INT COMMENT '首章',
// lastSection INT COMMENT '最近更新',
