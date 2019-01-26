const TABLE = 'contents';
const PRIMARY_KEY = 'id';

export = `
CREATE TABLE IF NOT EXISTS ${TABLE} (
	${PRIMARY_KEY} INT UNSIGNED AUTO_INCREMENT,
	book INT NOT NULL,
	section INT NOT NULL,
	contents TEXT NOT NULL,
	createdAt datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
	PRIMARY KEY (${PRIMARY_KEY}),
	FOREIGN KEY (book) REFERENCES books(id),
	FOREIGN KEY (section) REFERENCES sections(id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;
/*
book: 53989
contents: ""
id: 5908797
next: 5908798
prev: 5908796
sequence: 9
title: "09章"
*/
