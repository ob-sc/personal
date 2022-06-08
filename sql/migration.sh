#!/bin/bash

mariadb -uroot -p$MARIADB_ROOT_PASSWORD prod_old < /data/dev/prod_old.sql
mariadb -uroot -p$MARIADB_ROOT_PASSWORD dev_old < /data/dev/dev_old.sql
mariadb -uroot -p$MARIADB_ROOT_PASSWORD development < /data/dev/migration.sql
mysqldump -uroot -p$MARIADB_ROOT_PASSWORD development > /data/dev/new_prod.sql