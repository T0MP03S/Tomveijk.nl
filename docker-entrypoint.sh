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

# Deze database is ooit met `db push` opgezet en heeft dus geen migratie-
# geschiedenis. `migrate deploy` probeert daardoor de eerste migratie opnieuw
# toe te passen op tabellen die al bestaan, en faalt. Dan zet db push het schema
# alsnog gelijk, en markeren we de migraties als toegepast zodat de volgende
# start wél gewoon via migrate deploy loopt. Dit heelt zichzelf dus eenmalig.
if ! npx prisma migrate deploy; then
  echo "migrate deploy mislukt, terugvallen op db push"

  # Non-fataal, want set -e staat aan: een schemastap mag de hele site nooit
  # offline halen. Lukt het niet, dan start de app met het schema dat er al
  # staat en zie je dat hier in de logs terug.
  if npx prisma db push; then
    for map in prisma/migrations/*/; do
      [ -d "$map" ] || continue
      npx prisma migrate resolve --applied "$(basename "$map")" || true
    done
    echo "Schema gelijkgetrokken en migratiegeschiedenis bijgewerkt."
  else
    echo "db push mislukt, app start met het bestaande schema"
  fi
fi

echo "Creating admin user if needed..."
node scripts/create-admin.js || echo "Admin user already exists or script failed"

echo "Synchroniseren van portfolio-items..."
node scripts/sync-portfolio.js || echo "portfolio sync overgeslagen"

echo "Starting application..."
exec node server.js
