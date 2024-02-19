all: up

up:
	docker compose up -d

build:
	docker compose up -d --build

down:
	docker compose down

fclean:
	docker system prune -a

re: down build

.PHONY: all up build down fclean re
