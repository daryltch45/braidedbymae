#!/bin/bash
# ============================================
# BraidedByMae — PostgreSQL Backup Script
# ============================================
# Usage: ./scripts/backup/backup.sh
# Cron:  0 3 * * * /path/to/braidedbymae/scripts/backup/backup.sh
#
# Keeps last 7 daily backups

set -euo pipefail

BACKUP_DIR="$(dirname "$0")"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/braidedbymae_${TIMESTAMP}.sql.gz"
KEEP_DAYS=7

echo "[$(date)] Starting backup..."

# Dump from the running postgres container
docker exec braidedbymae-db pg_dump \
  -U braidedbymae \
  -d braidedbymae \
  --no-owner \
  --no-privileges \
  | gzip > "${BACKUP_FILE}"

echo "[$(date)] Backup created: ${BACKUP_FILE} ($(du -h "${BACKUP_FILE}" | cut -f1))"

# Cleanup old backups
find "${BACKUP_DIR}" -name "braidedbymae_*.sql.gz" -mtime +${KEEP_DAYS} -delete
echo "[$(date)] Cleaned up backups older than ${KEEP_DAYS} days"
