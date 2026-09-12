#!/usr/bin/env bash
# اسکریپت بکاپ‌گیری روزانه از دیتابیس PostgreSQL
# استفاده: DATABASE_URL="postgresql://..." ./scripts/backup-db.sh

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "خطا: متغیر DATABASE_URL تنظیم نشده است" >&2
  exit 1
fi

BACKUP_DIR="$(dirname "$0")/../backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/hemayatgar-backup-$TIMESTAMP.sql.gz"

echo "در حال گرفتن بکاپ از دیتابیس..."
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"
echo "✅ بکاپ با موفقیت در $BACKUP_FILE ذخیره شد"

# نگه‌داشتن فقط ۱۴ بکاپ آخر (حدود دو هفته در صورت اجرای روزانه)
find "$BACKUP_DIR" -name "hemayatgar-backup-*.sql.gz" -type f | sort | head -n -14 | xargs -r rm --
