#!/bin/sh

# Diese Datei für eine lokale Entwicklungs-DB sourcen und nie in prod benutzen! Für prod nur docker-compose.yml
# Nicht ausführen, muss gesourced werden damit die Aliases geladen werden.

# Docker-Container Name
CONTAINER=perso-dev

SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

# Directory zum mounten
DEVDATA="$SCRIPT_DIR/data/dev"

[ -z "$SCRIPT_DIR" ] && echo "Fehler, SCRIPTPATH Variable ist leer" && return 1

# working dir -> root vom projekt
cd "$SCRIPT_DIR" || (echo "Fehler, SCRIPTPATH nicht gefunden" && exit 1)

mkdir -p $DEVDATA
cp $SCRIPT_DIR/sql/* $DEVDATA

# check ob env datei existiert
[ ! -f ./.env.local ] && echo "Fehler, .env.local nicht gefunden" && return 1

# env variablen
set -o allexport
. .env.local
set +o allexport

alias dd="docker exec -it $CONTAINER mariadb --binary-as-hex -uroot -p$MARIADB_ROOT_PASSWORD"
alias ddb="docker exec -it $CONTAINER /bin/bash"
alias ddm=migration
alias ddme="docker exec -it $CONTAINER /data/dev/migration.sh"

# nicht-interaktive version von dd
alias mariadb-exec="docker exec $CONTAINER mariadb --binary-as-hex -uroot -p$MARIADB_ROOT_PASSWORD "

echo
echo "Aliases:"
echo "  dd         mariadb als root"
echo "  ddb        Interaktives Terminal"
echo "  ddm        Migration"
echo "  ddme       Migration beenden"

migration() {
  echo "Erstelle Datenbanken"

  dd -e "CREATE DATABASE IF NOT EXISTS prod_old"
  dd -e "CREATE DATABASE IF NOT EXISTS dev_old"
  dd -e "CREATE DATABASE IF NOT EXISTS development CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci'"
  dd -e "GRANT ALL PRIVILEGES ON *.* TO 'starcar'@'%' WITH GRANT OPTION"
  dd -e "FLUSH PRIVILEGES"

  echo "Fertig. Anmelden in App mit Benutzer bergen, dann ddme ausführen"
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
    --volume $DEVDATA:/data/dev \
    --env LANG=C.UTF-8 \
    --env LC_ALL=C.UTF-8 \
    --env MARIADB_USER=$MARIADB_USER \
    --env MARIADB_PASSWORD=$MARIADB_PASSWORD \
    --env MARIADB_ROOT_PASSWORD=$MARIADB_ROOT_PASSWORD \
    mariadb:10.7
fi
