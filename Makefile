OS := $(shell uname)

all: up

up:
ifeq ($(OS),Linux)
	sudo docker compose up -d
else
	docker compose up -d
endif

build:
ifeq ($(OS),Linux)
	sudo docker compose up -d --build
else
	docker compose up -d --build
endif

down:
ifeq ($(OS),Linux)
	sudo docker compose down
else
	docker compose down
endif

fclean:
ifeq ($(OS),Linux)
	sudo docker system prune -a
else
	docker system prune -a
endif

re: down build

.PHONY: all up build down fclean re
