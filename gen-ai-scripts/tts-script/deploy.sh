#!/bin/bash

ImageName="genai-tts"
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
    docker build . -t $ImageName:$ImageVersion
    check-succes "fail on build container image"
    echo "docker image build: $ImageName:$ImageVersion"
}

ensure-docker-image-exists() {
    docker image ls | grep $ImageName | grep $ImageVersion
    result=$?
    if [ ! $result = 0 ]; then
        echo "docker image $ImageName:$ImageVersion not found. building it"
        build-docker-image
    fi
}

WORKER_INTERVAL=60

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

    if [ -z $RBMQ_TIMEOUT ]; then
        error "you need to set the variable RBMQ_TIMEOUT"
    fi
    echo "RBMQ_TIMEOUT= $RBMQ_TIMEOUT"

    if [ -z $TTS_WORKER_INTERVAL_IN_SECONDS ]; then
        echo "variable TTS_WORKER_INTERVAL_IN_SECONDS empty using default value"
    else
        WORKER_INTERVAL = $TTS_WORKER_INTERVAL_IN_SECONDS
    fi
    echo "WORKER_INTERVAL= $WORKER_INTERVAL"
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
CONTAINER_NAME="tts-worker"

docker run \
 --name $CONTAINER_NAME \
 --network $DOCKER_NETWORK \
 -d \
 -v $CONTENT_PATH:/$CONTENT_PATH_CONTAINER \
 -v uv-cache:/opt/uv-cache/ \
 -v uv-venv:/tts-script/.venv \
 -e CONTENT_PATH=$CONTENT_PATH_CONTAINER \
 -e MongoDbConnStr=$MongoDbConnStr \
 -e DB_NAME=$MongoDbName \
 -e RBMQ_HOST=$RBMQ_HOST \
 -e RBMQ_PORT=$RBMQ_PORT \
 -e RBMQ_USER=$RBMQ_USER \
 -e RBMQ_PASSWORD=$RBMQ_PASSWORD \
 $ImageName:$ImageVersion
