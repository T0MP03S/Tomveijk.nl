#!/bin/sh
set -e

echo "Running database migrations..."

if [ -n "$DATABASE_URL" ]; then
  DB_FILE=$(echo "$DATABASE_URL" | sed -n 's/^file:\(.*\)$/\1/p')
  if [ -n "$DB_FILE" ]; then
    DB_DIR=$(dirname "$DB_FILE")
    mkdir -p "$DB_DIR"
  fi
fi

if ! npx prisma migrate deploy; then
  echo "prisma migrate deploy failed; falling back to prisma db push"
  npx prisma db push
fi

echo "Creating admin user if needed..."
node scripts/create-admin.js || echo "Admin user already exists or script failed"

echo "Starting application..."
exec node server.js
