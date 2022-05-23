-- DROP DATABASE development;
-- CREATE DATABASE IF NOT EXISTS development
--   CHARACTER SET = 'utf8mb4'
--   COLLATE = 'utf8mb4_unicode_ci';
USE development;

UPDATE users SET access = X'ffff' WHERE username = "bergen";
INSERT INTO floats (`name`,`value`) VALUES ("min_wage", 9.82);

INSERT INTO regions (`name`) VALUES ("Nord 1");
INSERT INTO regions (`name`) VALUES ("Nord 2");
INSERT INTO regions (`name`) VALUES ("Ost");
INSERT INTO regions (`name`) VALUES ("Berlin");
INSERT INTO regions (`name`) VALUES ("Mitte");
INSERT INTO regions (`name`) VALUES ("West 1");
INSERT INTO regions (`name`) VALUES ("West 2");
INSERT INTO regions (`name`) VALUES ("Frankfurt");
INSERT INTO regions (`name`) VALUES ("Süd");
INSERT INTO regions (`name`) VALUES ("Süd-West");

DELETE FROM dev_old.stationen WHERE name = "Verwaltung";
UPDATE dev_old.stationen SET `region` = 1 WHERE `region` = "nord1";
UPDATE dev_old.stationen SET `region` = 2 WHERE `region` = "nord2";
UPDATE dev_old.stationen SET `region` = 3 WHERE `region` = "ost";
UPDATE dev_old.stationen SET `region` = 4 WHERE `region` = "berlin";
UPDATE dev_old.stationen SET `region` = 5 WHERE `region` = "mitte";
UPDATE dev_old.stationen SET `region` = 6 WHERE `region` = "west1";
UPDATE dev_old.stationen SET `region` = 7 WHERE `region` = "west2";
UPDATE dev_old.stationen SET `region` = 8 WHERE `region` = "frankfurt";
UPDATE dev_old.stationen SET `region` = 9 WHERE `region` = "süd";
UPDATE dev_old.stationen SET `region` = 10 WHERE `region` = "süd-west";
INSERT INTO stations (`id`,`name`,`address`,`city`,`telephone`,`fax`,`email`,`region_id`) SELECT `id`,`name`,`anschrift`,`stadt`,`telefon`,`fax`,`email`,`region` FROM dev_old.stationen;
