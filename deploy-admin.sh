#!/bin/bash

DOCKER_FILE="admin/AdminPortal/Dockerfile"
ImageName="zread-admin"
ImageVersion="0.1"

error() {
    echo $1
    exit 1
}

check-succes() {
    result=$?
    if [ ! $result = 0 ]; then
        error $1
    fi
}

build-docker-image() {
    docker build . -f $DOCKER_FILE -t $ImageName:$ImageVersion
    check-succes "fail on build container image"
    echo "docker image build: $ImageName:$ImageVersion"
}

ensure-docker-image-exists() {
    docker image ls | grep $$ImageName | grep $ImageVersion
    result=$?
    if [ ! $result = 0 ]; then
        echo "docker image $ImageName:$ImageVersion not found. building it"
        build-docker-image
    fi
}

WK_PRODUCER_INTERVAL=60
WK_CLEANER_INTERVAL=120

ensure-env-variables-are-seted() {
    if [ -z $CONTENT_PATH ]; then
        error "you need to set the variable CONTENT_PATH"
    fi
    echo "CONTENT_PATH= $CONTENT_PATH"
    
    # MONGO_URI=
    if [ -z $MongoDbConnStr ]; then
        error "you need to set the variable MongoDbConnStr"
    fi
    echo "MongoDbConnStr= **hidden**"

    # DB_NAME=
    if [ -z $MongoDbName ]; then
        error "you need to set the variable MongoDbName"
    fi
    echo "MongoDbName= $MongoDbName"

    if [ -z $DOCKER_NETWORK ]; then
        error "you need to set the variable DOCKER_NETWORK"
    fi
    echo "DOCKER_NETWORK= $DOCKER_NETWORK"

    if [ -z $RBMQ_HOST ]; then
        error "you need to set the variable RBMQ_HOST"
    fi
    echo "RBMQ_HOST= $RBMQ_HOST"

    if [ -z $RBMQ_PORT ]; then
        error "you need to set the variable RBMQ_PORT"
    fi
    echo "RBMQ_PORT= $RBMQ_PORT"

    if [ -z $RBMQ_USER ]; then
        error "you need to set the variable RBMQ_USER"
    fi
    echo "RBMQ_USER= $RBMQ_USER"
    
    if [ -z $RBMQ_PASSWORD ]; then
        error "you need to set the variable RBMQ_PASSWORD"
    fi
    echo "RBMQ_PASSWORD= ---"

    if [ -z $API_URL ]; then
        error "you need to set the variable API_URL"
    fi
    echo "API_URL= $API_URL"

    if [ -z $GenAiQueueProducerInSeconds ]; then
        echo "variable GenAiQueueProducerInSeconds empty using default value"
    else
        WK_PRODUCER_INTERVAL = $GenAiQueueProducerInSeconds
    fi
    echo "WK_PRODUCER_INTERVAL= $WK_PRODUCER_INTERVAL"

    if [ -z $GenAiQueueCleanerInSeconds ]; then
        echo "variable GenAiQueueCleanerInSeconds empty using default value"
    else
        WK_CLEANER_INTERVAL = $GenAiQueueCleanerInSeconds
    fi
    echo "WK_CLEANER_INTERVAL= $WK_CLEANER_INTERVAL"
}

for ARG in $@; do

    case "${ARG}" in
        --build | -b)
            build-docker-image
        ;;
        --build-only | -bo)
            build-docker-image
            exit 0
        ;;
        *)
            error "unknowed arg ${ARG}"
        ;;
    esac
done

ensure-docker-image-exists
ensure-env-variables-are-seted

CONTENT_PATH_CONTAINER="/book-content"
CONTAINER_NAME="zread-admin-portal"

docker run \
 --name $CONTAINER_NAME \
 --network $DOCKER_NETWORK \
 -dp 4001:8080 \
 -v $CONTENT_PATH:/$CONTENT_PATH_CONTAINER \
 -e ChaptersContentPath=$CONTENT_PATH_CONTAINER \
 -e ApiUrl=$API_URL \
 -e MongoDbConnStr=$MongoDbConnStr \
 -e MongoDbName=$MongoDbName \
 -e "RabbitMQ:Hostname"=$RBMQ_HOST \
 -e "RabbitMQ:Port"=$RBMQ_PORT \
 -e "RabbitMQ:User"=$RBMQ_USER \
 -e "RabbitMQ:Password"=$RBMQ_PASSWORD \
 -e "WorkerInterval:GenAiQueueProducerInSeconds"=$WK_PRODUCER_INTERVAL \
 -e "WorkerInterval:GenAiQueueCleanerInSeconds"=$WK_CLEANER_INTERVAL \
 $ImageName:$ImageVersion
