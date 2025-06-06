test-broadcast:
	@echo "Running broadcast tests..."
	rm -rf ./recordings/batata && docker compose -f ./example/broadcast/docker-compose.yml up