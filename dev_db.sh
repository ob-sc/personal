#!/bin/sh

# Diese Datei für eine lokale Entwicklungs-DB sourcen und nie in prod benutzen! Für prod nur docker-compose.yml
# Nicht ausführen, muss gesourced werden damit die Aliases geladen werden.

# Docker-Container Name
CONTAINER=perso-dev

# Directory zum mounten
DEVDATA="$PWD/data/dev"

# working dir -> root vom projekt
cd "${0%/*}" || exit 1

mkdir -p $DEVDATA
cp ./sql/migration.sql $DEVDATA

# env variablen
set -o allexport
# shellcheck disable=SC3046
source .env.local
set +o allexport

alias dd="docker exec -it $CONTAINER mariadb -uroot -p$MARIADB_ROOT_PASSWORD"
alias dds="dd -e"
alias ddb="docker exec -it $CONTAINER /bin/bash"
alias ddm=migration

# nicht-interaktive version von dd
alias mariadb-exec="docker exec $CONTAINER mariadb -uroot -p$MARIADB_ROOT_PASSWORD "

echo
echo "Aliases:"
echo "  dd         mariadb als root"
echo "  dds        SQL direkt ausführen, z.B. dds \"SELECT * FROM development.users\""
echo "  ddb        Interaktives Terminal"
echo "  ddm        Migration"

migration() {
  echo "Erstelle Datenbanken"
  echo
  dds "CREATE DATABASE IF NOT EXISTS prod_old"
  dds "CREATE DATABASE IF NOT EXISTS dev_old"
  dds "CREATE DATABASE IF NOT EXISTS development CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci'"
  dds "GRANT ALL PRIVILEGES ON *.* TO 'starcar'@'%' WITH GRANT OPTION"
  dds "FLUSH PRIVILEGES"

  echo "Es müssen diese Befehle im Container (mit ddb) ausgeführt werden:"

  echo
  echo "  mariadb -uroot -p\$MARIADB_ROOT_PASSWORD prod_old < /data/dev/prod_old.sql"
  echo "  mariadb -uroot -p\$MARIADB_ROOT_PASSWORD dev_old < /data/dev/dev_old.sql"
  echo

  echo "Dann auf http://localhost:3000 anmelden, um die Datenbank zu synchronisieren"
  echo "Dafür muss lokal ein Next Entwicklungsserver mit NODE_ENV=development laufen (yarn dev)"
  echo "Erst danach fortfahren!"

  echo   
  echo "  mariadb -uroot -p\$MARIADB_ROOT_PASSWORD development < /data/dev/migration.sql"
  echo "  mysqldump -uroot -p\$MARIADB_ROOT_PASSWORD development > /data/dev/new_prod.sql"
  echo   

  echo "Neue Prod-Datenbank liegt unter $DEVDATA/new_prod.sql"

}

if [ ! "$(docker ps -q -f name=$CONTAINER)" ]; then
  echo
  if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER)" ]; then
    echo "  Entferne gestoppten Container"
    docker rm $CONTAINER
  fi
  echo "  Starte Container $CONTAINER"
  docker run \
    --detach \
    --publish 3306:3306 \
    --name $CONTAINER \
    --volume $PWD/data/dev:/data/dev \
    --env LANG=C.UTF-8 \
    --env LC_ALL=C.UTF-8 \
    --env MARIADB_USER=$MARIADB_USER \
    --env MARIADB_PASSWORD=$MARIADB_PASSWORD \
    --env MARIADB_ROOT_PASSWORD=$MARIADB_ROOT_PASSWORD \
    mariadb:10.7
fi
