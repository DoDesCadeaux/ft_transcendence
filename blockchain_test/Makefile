# Define the default target
.DEFAULT_GOAL := all

all: migrate

migrate:
	@echo	"Migrating conntract and writing contract address to file..."
	@node get_contract_address.js

.PHONY: write_contract_address

# clean:
# 	@echo	"Cleaning up..."
# 	@rm		-rf build tempContractAddress

re: clean migrate write_contract_address

.PHONY: all migrate write_contract_address
