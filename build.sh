#!/bin/bash

declare -a arr=("frontend" "user" "payments" "sale")
REPO_URL=${REPO_URL:-}
TAG="${TAG:-latest-dev}"
echo "test1 ${?}"
docker-compose build
echo "test2 ${?}"
for i in "${arr[@]}"
do
  docker push "${REPO_URL}ico-toolbox/${i}:${TAG}"
done