const TABLE = 'recycles';
const PRIMARY_KEY = '_id';

export = `
CREATE TABLE IF NOT EXISTS ${TABLE} (
	${PRIMARY_KEY} INT UNSIGNED AUTO_INCREMENT,
	id INT NOT NULL,
	collection VARCHAR(100),
	data TEXT NOT NULL,
	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (${PRIMARY_KEY})
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;