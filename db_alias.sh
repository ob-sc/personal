#!/bin/sh

# Diese Datei für eine lokale Entwicklungs-DB sourcen und nie in prod benutzen! Für prod nur docker-compose.yml

# .env.local anpassen:
# MARIADB_ROOT_PASSWORD=root

# .env.local darf keine leeren zeilen / kommentare haben

# working dir -> root vom projekt
cd "${0%/*}" || exit 1

mkdir -p /tmp/scdump
cp ./migration/migration.sql /tmp/scdump/

# env variablen
set -o allexport
source .env.local
set +o allexport

alias start-dev-db="docker run \
--detach \
--publish 3306:3306 \
--name scp-dev-db \
--volume /tmp/scdump:/dump \
--env LANG=C.UTF-8 \
--env LC_ALL=C.UTF-8 \
--env MARIADB_USER=$MARIADB_USER \
--env MARIADB_PASSWORD=$MARIADB_PASSWORD \
--env MARIADB_ROOT_PASSWORD=$MARIADB_ROOT_PASSWORD \
mariadb:10.7"

alias ddb="docker exec -it scp-dev-db mariadb -uroot -proot"
alias ddb-bash="docker exec -it scp-dev-db /bin/bash"

echo "  start-dev-db     Docker Container starten"
echo "  ddb              mariadb als root"
echo "  ddb-bash         Interaktives Terminal"