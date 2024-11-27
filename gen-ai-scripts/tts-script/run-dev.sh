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

docker run \
 -it \
 --rm \
 --network $Network\
 -v .:/code \
 -v $ContentVolumePath:/content \
 -v .:/tts-script \
 -e DB_NAME=$MgDbName \
 -e MONGO_URI=$MongoUri \
 -v ./.uv-cache:/opt/uv-cache \
 -e CONTENT_PATH=/content \
 $ImageName:$ImageVersion bash