docker build -t aria2one-server server
docker stack deploy -c docker-compose.yml aria2one
