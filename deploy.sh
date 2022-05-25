#!/bin/sh

# working dir -> root vom projekt
cd "${0%/*}" || exit 1

docker-compose down
git pull
docker-compose build --build-arg HTTP_PROXY=http://starcarproxy.pop-i.cloud:8080 --build-arg HTTPS_PROXY=http://starcarproxy.pop-i.cloud:8080
docker-compose up -d
