#!/bin/bash

COMPOSE_FILE="docker-compose.yaml"

show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Manage the Docker Compose services for TrackSplitter."
    echo
    echo "Options:"
    echo "  --help                Show this help message and exit."
    echo "  --stop                Stop the running containers."
    echo "  --remove-container    Stop and remove all containers."
    echo "  --remove-all          Stop and remove all containers, then remove images."
    echo "  --logs                View logs of running services."
    echo "  (no option)           Start the services (builds if necessary)."
}

start_services() {
    echo "Starting services..."
    docker compose -f $COMPOSE_FILE up -d --build

    echo "Waiting for the application to start..."
    sleep 5

    open_browser
}

stop_services() {
    echo "Stopping services..."
    docker compose -f $COMPOSE_FILE stop
}

remove_containers() {
    echo "Removing containers..."
    docker compose -f $COMPOSE_FILE down
}

remove_all() {
    echo "Removing all containers and images..."
    docker compose -f $COMPOSE_FILE down --rmi all
}

view_logs() {
    echo "Displaying logs..."
    docker compose -f $COMPOSE_FILE logs -f
}

open_browser() {
    echo "Opening application in browser..."
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

case "$1" in
    --help)
        show_help
        ;;
    --stop)
        stop_services
        ;;
    --remove-container)
        remove_containers
        ;;
    --remove-all)
        remove_all
        ;;
    --logs)
        view_logs
        ;;
    *)
        start_services
        ;;
esac
