#!/bin/bash

docker run -p 4018:27017 --name fatec-mongo --network fatec-ntw -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=1234 -e MONGO_INITDB_DATABASE=fatec -d --rm -v "$PWD/data":/data/db mongo:latest
