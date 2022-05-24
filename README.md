# STARCAR Personalmanagent

Directory auf dem Server ist `opt/personal`.

## DEV

`. ./db_alias.sh`

| Alias        | Funktion                                  |
| ------------ | ----------------------------------------- |
| start-dev-db | Docker Container mit MariaDB starten      |
| ddb          | `mariadb` als root im Container           |
| ddb-bash     | `bash` interaktives Terminal im Container |

## PROD

Bauen geht nur mit dem POP-I Proxy

`docker-compose build --build-arg HTTP_PROXY=http://starcarproxy.pop-i.cloud:8080 --build-arg HTTPS_PROXY=http://starcarproxy.pop-i.cloud:8080`

`docker-compose up -d`
