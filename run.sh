#!/bin/bash

CONTAINER_NAME="tracksplitter-container"
IMAGE_NAME="tracksplitter"

start_container() {
    # Check if the container already exists
    if [[ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]]; then
        echo "Container '$CONTAINER_NAME' already exists. Starting it..."
        docker start $CONTAINER_NAME
    else
        # Build the Docker image
        echo "Building Docker image..."
        docker build -t $IMAGE_NAME .

        # Run the Docker container in detached mode and expose necessary ports
        echo "Starting Docker container..."
        docker run -it -d -p 8000:8000 -p 5173:5173 --name $CONTAINER_NAME $IMAGE_NAME
    fi

    # Wait for the container to initialize (adjust sleep time as needed)
    echo "Waiting for the application to start..."
    sleep 10

    # Open the website in the default web browser (Linux/macOS/Windows)
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
    # Check if the container is running
    if [[ "$(docker ps -q -f name=$CONTAINER_NAME)" ]]; then
        echo "Stopping container '$CONTAINER_NAME'..."
        docker stop $CONTAINER_NAME
    else
        echo "Container '$CONTAINER_NAME' is not running."
    fi
}

remove_container() {
    # Stop the container if it's running
    stop_container

    # Remove the container
    echo "Removing container '$CONTAINER_NAME'..."
    docker rm $CONTAINER_NAME
}

remove_all() {
    # Stop and remove container, then remove the image
    remove_container

	# Remove the Docker image
    echo "Removing image '$IMAGE_NAME'..."
    docker rmi $IMAGE_NAME
}

case "$1" in
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
