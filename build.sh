#clean up and rebuild

docker stop $(docker ps -aq)
docker system prune -a
docker-compose up
