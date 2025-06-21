test-broadcast:
	@echo "Running broadcast tests..."
	rm -rf ./recordings/batata && docker compose -f ./example/broadcast/docker-compose.yml up --remove-orphans

test-rl:
	@echo "Running rl tests..."
	rm -rf ./recordings/batata && docker compose -f ./example/rl/docker-compose.yml up --remove-orphans

test-bot:
	@echo "Running bot tests..."
	rm -rf ./recordings/batata && docker compose -f ./example/bot/docker-compose.yml up --remove-orphans

run-server:
	@echo "Running server..."
	docker run --rm -p 8081:8080 -p 6000:5000 lugobots/server play --dev-mode --timer-mode=remote

run-rush:
	@echo "Running server..."
	docker run -p 8081:8080 -p 6000:5000 lugobots/server play --dev-mode --timer-mode=rush