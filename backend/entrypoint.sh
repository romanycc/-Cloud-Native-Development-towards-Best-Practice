#!/bin/bash

# Function to wait for PostgreSQL
wait_for_postgres() {
    echo "Waiting for postgres..."

    while ! nc -z "0.0.0.0" 5432; do
      sleep 3
      echo 'wait'
    done

    echo "PostgreSQL started"
}

# Wait for PostgreSQL
wait_for_postgres 0.0.0.0 5432

# Run setup.py
python3 /setup.py

# Run the main container command
exec "$@"
