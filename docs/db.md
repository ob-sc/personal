# Datenbank

## Prod

```sh
docker cp /opt/personal/data/dev/new_prod.sql db:/tmp/new_prod.sql
docker exec -it db /bin/bash
mariadb -uroot -p$MARIADB_ROOT_PASSWORD production < /tmp/new_prod.sql
rm /tmp/new_prod.sql
```
