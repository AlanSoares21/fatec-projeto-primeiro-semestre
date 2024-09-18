#!/bin/bash
Network=fatec-ntw
ContentVol="$PWD/content-volume"
CodeVol="$PWD/code"
MgServer="fatec-mongo"
MgUser="mongoadmin"
MgPswd="1234"
MgUri="mongodb://$MgUser:$MgPswd@$MgServer"
MgDbName="fatec"
docker run -i --rm -v $CodeVol:/code -v $ContentVol:/content -e DB_NAME=$MgDbName -e MONGO_URI=$MgUri -e CONTENT_PATH=/content --network $Network my-python:dev bash << EOF
python /code/getdata.py
EOF

