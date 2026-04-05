#!/bin/bash

set -euo pipefail

# Environment Variables
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-password}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="digital_twin_db"
SCHEMA_FILE="schema.sql"

# Export password for psql non-interactive
export PGPASSWORD="$DB_PASSWORD"

echo "----------------------------------------"
echo "Starting PostgreSQL Initialization"
echo "----------------------------------------"

if [[ ! -f "$SCHEMA_FILE" ]]; then
    echo "ERROR: $SCHEMA_FILE not found in the current directory."
    exit 1
fi

echo "Checking PostgreSQL connection..."
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c '\q' >/dev/null 2>&1; then
    echo "ERROR: Cannot connect to PostgreSQL server at $DB_HOST:$DB_PORT"
    exit 1
fi

echo "Checking if database '$DB_NAME' exists..."
DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [[ "$DB_EXISTS" == "1" ]]; then
    echo "Database '$DB_NAME' already exists."
else
    echo "Creating database '$DB_NAME'..."
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo "Database '$DB_NAME' created successfully."
fi

echo "Applying schema from $SCHEMA_FILE..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SCHEMA_FILE"

echo "----------------------------------------"
echo "Database Initialization Complete"
echo "----------------------------------------"
