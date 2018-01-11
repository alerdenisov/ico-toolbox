#!/bin/bash

set -ex
declare -a arr=("frontend" "user" "payments" "sale")
REPO_URL=${REPO_URL:-}
TAG="${1:-latest-dev}"
docker-compose build
for i in "${arr[@]}"
do
  docker push "${REPO_URL}ico-toolbox/${i}:${TAG}"
done