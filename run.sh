#!/bin/bash

CONTAINER_NAME="tracksplitter-container"
IMAGE_NAME="tracksplitter"

show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Manage the Docker container for TrackSplitter."
    echo
    echo "Options:"
    echo "  --help                Show this help message and exit."
    echo "  --stop                Stop the running container if it exists."
    echo "  --remove-container    Stop and remove the container."
    echo "  --remove-all          Stop and remove the container, then remove the image."
    echo "  (no option)           Start the container (builds if necessary)."
}

start_container() {
    if [[ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]]; then
        echo "Container '$CONTAINER_NAME' already exists. Starting it..."
        docker start $CONTAINER_NAME
    else
        echo "Building Docker image..."
        docker build -t $IMAGE_NAME .
        echo "Starting Docker container..."
        docker run -it -d -p 8000:8000 -p 5173:5173 --name $CONTAINER_NAME $IMAGE_NAME
    fi

    echo "Waiting for the application to start..."
    sleep 10

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "http://localhost:5173/"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        start "http://localhost:5173/"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:5173/"
    else
        echo "Unsupported OS for opening the browser."
    fi
}

stop_container() {
    if [[ "$(docker ps -q -f name=$CONTAINER_NAME)" ]]; then
        echo "Stopping container '$CONTAINER_NAME'..."
        docker stop $CONTAINER_NAME
    else
        echo "Container '$CONTAINER_NAME' is not running."
    fi
}

remove_container() {
    stop_container
    echo "Removing container '$CONTAINER_NAME'..."
    docker rm $CONTAINER_NAME
}

remove_all() {
    remove_container
    echo "Removing image '$IMAGE_NAME'..."
    docker rmi $IMAGE_NAME
}

case "$1" in
    --help)
        show_help
        ;;
    --stop)
        stop_container
        ;;
    --remove-container)
        remove_container
        ;;
    --remove-all)
        remove_all
        ;;
    *)
        start_container
        ;;
esac
