# Variables
NPX := npx
NEXT := $(NPX) next
IMAGE := a-fisher-control-center

# Default target
.DEFAULT_GOAL := help

# Download ENV
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Internal Helpers
.PHONY: docker-build
docker-build: # Build Docker image
	docker build -t $(IMAGE):test .

.PHONY: docker-push
docker-push: # Build for linux/amd64 and push to GHCR
	docker buildx build \
		--platform linux/amd64 \
		-t ghcr.io/fisherbyu/$(IMAGE):latest \
		--push .

.PHONY: docker-run
docker-run: # Run Docker container, with runtime env vars from .env if there is one
	docker run -p 3000:3000 $(if $(wildcard .env),--env-file .env) $(IMAGE):test

.PHONY: docker-stop
docker-stop: # Stop running Docker container
	docker stop $$(docker ps -q --filter ancestor=$(IMAGE):test)


# Build Targets
.PHONY: help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@cat $(MAKEFILE_LIST) | grep -E '^[a-zA-Z_-]+:.*?## .*$$' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: build-next
build-next: ## Build Next.js Application
	$(NEXT) build

.PHONY: dev
dev: ## Start Next.js Development Server
	@echo 'Starting Development Server'
	$(NEXT) dev

.PHONY: build
build: docker-build ## Build Local Docker Image

.PHONY: up
up: docker-run ## Run Docker container

.PHONY: down
down: docker-stop ## Stop Docker container

.PHONY: push
push: docker-push ## Build Docker Image and Push to Registry
