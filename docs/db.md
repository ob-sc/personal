# Datenbank

## Dev

DB initialisieren

```sh
. ./db_alias.sh
start-dev-db
```

Alle Datenbanken sollten am besten noch nicht exisitieren.
Mit alias `ddb` (aus `./db_alias.sh`):

```sql
CREATE DATABASE IF NOT EXISTS prod_old;
CREATE DATABASE IF NOT EXISTS dev_old;
CREATE DATABASE IF NOT EXISTS development
  CHARACTER SET = 'utf8mb4'
  COLLATE = 'utf8mb4_unicode_ci';
GRANT ALL PRIVILEGES ON *.* TO 'starcar'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

Mit alias `ddb-bash`:

```sh
mariadb -uroot -p$MARIADB_ROOT_PASSWORD prod_old < dump/prod_old.sql
mariadb -uroot -p$MARIADB_ROOT_PASSWORD dev_old < dump/dev_old.sql

# -> anmelden mit sync (bergen in db ohne access)

# migration durchführen und user bergen zum admin machen
mariadb -uroot -p$MARIADB_ROOT_PASSWORD development < dump/migration.sql

# -> db testen (neu anmelden), wenn okay exportieren

mysqldump -uroot -p$MARIADB_ROOT_PASSWORD development > new_prod.sql
```

## Prod

Auf dem Host ausführen, `<CONTAINER ID>` austauschen

```sh
docker cp dump/new_prod.sql <CONTAINER ID>:dump/new_prod.sql
docker exec -it <CONTAINER ID> /bin/bash
mysql -u root -p production < dump/new_prod.sql
```
