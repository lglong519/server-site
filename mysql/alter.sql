/*
	添加 createdAt，updatedAt
*/
DROP PROCEDURE IF EXISTS schema_change;  
DELIMITER //
CREATE PROCEDURE schema_change() BEGIN 
DECLARE  CurrentDatabase VARCHAR(100);
SELECT DATABASE() INTO CurrentDatabase;
-- likes ++
IF NOT EXISTS (SELECT * FROM information_schema.columns WHERE table_schema=CurrentDatabase AND table_name = 'likes' AND column_name = 'createdAt') 
THEN  
    ALTER TABLE likes
    ADD COLUMN `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
END IF;
IF NOT EXISTS (SELECT * FROM information_schema.columns WHERE table_schema=CurrentDatabase AND table_name = 'likes' AND column_name = 'updatedAt') 
THEN  
    ALTER TABLE likes
    ADD COLUMN `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间';
END IF; 
-- likes --

-- sites ++
IF NOT EXISTS (SELECT * FROM information_schema.columns WHERE table_schema=CurrentDatabase AND table_name = 'sites' AND column_name = 'createdAt') 
THEN  
    ALTER TABLE sites
    ADD COLUMN `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
END IF;
IF NOT EXISTS (SELECT * FROM information_schema.columns WHERE table_schema=CurrentDatabase AND table_name = 'sites' AND column_name = 'updatedAt') 
THEN  
    ALTER TABLE sites
    ADD COLUMN `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间';
END IF; 
-- sites --

-- work_lists ++
IF NOT EXISTS (SELECT * FROM information_schema.columns WHERE table_schema=CurrentDatabase AND table_name = 'work_lists' AND column_name = 'createdAt') 
THEN  
    ALTER TABLE work_lists
    ADD COLUMN `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
END IF;
IF NOT EXISTS (SELECT * FROM information_schema.columns WHERE table_schema=CurrentDatabase AND table_name = 'work_lists' AND column_name = 'updatedAt') 
THEN  
    ALTER TABLE work_lists
    ADD COLUMN `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间';
END IF; 
-- work_lists --

END//  
DELIMITER ;  
CALL schema_change();