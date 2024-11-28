#!/bin/bash
ContentVolumePath="/usr/lcstg/code/fatec/mongo-db/content-volume/"
ImageName="uv-dev"
ImageVersion="0.1"

MgServer="fatec-mongo"
MgUser="mongoadmin"
MgPswd="1234"
MongoUri="mongodb://$MgUser:$MgPswd@$MgServer"
Network="fatec-ntw"
MgDbName="fatec"

RBMQ_HOST="rbmq"
RBMQ_PORT=5672
RBMQ_USER="rbuser"
RBMQ_PASSWORD="pwd1234"

docker run \
 -it \
 --rm \
 --network $Network\
 -v .:/code \
 -v $ContentVolumePath:/content \
 -v .:/tts-script \
 -e DB_NAME=$MgDbName \
 -e MONGO_URI=$MongoUri \
 -e RBMQ_HOST=$RBMQ_HOST \
 -e RBMQ_PORT=$RBMQ_PORT \
 -e RBMQ_USER=$RBMQ_USER \
 -e RBMQ_PASSWORD=$RBMQ_PASSWORD \
 -v ./.uv-cache:/opt/uv-cache \
 -e CONTENT_PATH=/content \
 $ImageName:$ImageVersion bash
