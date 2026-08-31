# Makefile for GameOps AI Data Pipelines

.PHONY: install dev build start test lint clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

test:
	npm test

lint:
	npm run lint

clean:
	rm -rf .next node_modules out
