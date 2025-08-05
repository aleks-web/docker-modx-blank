#!/usr/bin/make
# Makefile readme (ru): <http://linux.yaroslavl.ru/docs/prog/gnu_make_3-79_russian_manual.html>
# Makefile readme (en): <https://www.gnu.org/software/make/manual/html_node/index.html#SEC_Contents>

SHELL = /bin/bash
DC_RUN_ARGS = --rm --user "$(shell id -u):$(shell id -g)"
COMPOSE_TIMEOUT = 3000
FILE_NAME='test_file'
.DEFAULT_GOAL : help
include .env
export

# This will output the help for each task. thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## Show this help
	@printf "\033[33m%s:\033[0m\n" 'Available commands'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "  \033[32m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

migration-create:
	npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ./src/lib/server/migrations/$(FILE_NAME)

prod-restart:
	git pull && npm run build && forever stopall && sudo ORIGIN=http://77.232.132.198 forever start build