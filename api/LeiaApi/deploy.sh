#!/bin/bash

ApiImageName="eiind-api"
ApiVersion="0.1"

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
    docker build . -t $ApiImageName:$ApiVersion
    check-succes "fail on build container image"
    echo "docker image build: $ApiImageName:$ApiVersion"
}

ensure-docker-image-exists() {
    docker image ls | grep $ApiImageName | grep $ApiVersion
    result=$?
    if [ ! $result = 0 ]; then
        echo "docker image $ApiImageName:$ApiVersion not found. building it"
        build-docker-image
    fi
}

ensure-env-variables-are-seted() {
    if [ -z $CONTENT_PATH ]; then
        error "you need to set the variable CONTENT_PATH"
    fi
    echo "CONTENT_PATH= $CONTENT_PATH"
    
    if [ -z $MongoDbConnStr ]; then
        error "you need to set the variable MongoDbConnStr"
    fi
    echo "MongoDbConnStr= **hidden**"

    if [ -z $MongoDbName ]; then
        error "you need to set the variable MongoDbName"
    fi
    echo "MongoDbName= $MongoDbName"

    if [ -z $DOCKER_NETWORK ]; then
        error "you need to set the variable DOCKER_NETWORK"
    fi
    echo "DOCKER_NETWORK= $DOCKER_NETWORK"
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
CONTAINER_NAME="zread-api"

docker run \
 --name $CONTAINER_NAME \
 --network $DOCKER_NETWORK \
 -dp 4000:8080 \
 -v $CONTENT_PATH:/$CONTENT_PATH_CONTAINER \
 -e ChaptersContentPath=$CONTENT_PATH_CONTAINER \
 -e MongoDbConnStr=$MongoDbConnStr \
 -e MongoDbName=$MongoDbName \
 $ApiImageName:$ApiVersion