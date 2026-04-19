# ============================================
# BraidedByMae — Makefile
# ============================================
# All project commands in one place.
# Usage: make <target>

.PHONY: dev dev-build dev-down dev-logs prod prod-build prod-down prod-logs db-studio db-migrate db-reset db-backup db-shell clean

# ─── Development ───────────────────────────
dev:                   ## Start dev environment (hot reload)
	docker compose -f docker-compose.dev.yml up

dev-build:             ## Rebuild and start dev environment
	docker compose -f docker-compose.dev.yml up --build

dev-down:              ## Stop dev environment
	docker compose -f docker-compose.dev.yml down

dev-logs:              ## Tail dev logs
	docker compose -f docker-compose.dev.yml logs -f app

# ─── Production ────────────────────────────
prod:                  ## Start production environment
	docker compose -f docker-compose.prod.yml up -d

prod-build:            ## Rebuild and start production
	docker compose -f docker-compose.prod.yml up --build -d

prod-down:             ## Stop production environment
	docker compose -f docker-compose.prod.yml down

prod-logs:             ## Tail production logs
	docker compose -f docker-compose.prod.yml logs -f

# ─── Database ──────────────────────────────
db-studio:             ## Open Prisma Studio (DB GUI on :5555)
	@echo "Opening Prisma Studio at http://localhost:5555"

db-migrate:            ## Run Prisma migrations in dev
	docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev

db-reset:              ## Reset database (WARNING: deletes all data)
	docker compose -f docker-compose.dev.yml exec app npx prisma migrate reset --force

db-shell:              ## Open psql shell
	docker compose -f docker-compose.dev.yml exec db psql -U braidedbymae -d braidedbymae

db-backup:             ## Backup production database
	./scripts/backup/backup.sh

# ─── Utilities ─────────────────────────────
clean:                 ## Remove all containers, volumes, and build cache
	docker compose -f docker-compose.dev.yml down -v --rmi local
	docker compose -f docker-compose.prod.yml down -v --rmi local
	docker system prune -f

help:                  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
