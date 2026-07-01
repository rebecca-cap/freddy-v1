#!/bin/sh

APP_DIR="/usr/src/app/build"

echo "Injecting runtime environment variables..."
echo "Contents of $APP_DIR:"
ls -al "$APP_DIR"

envsubst < "$APP_DIR/meta.template.json" > "$APP_DIR/meta.json"

echo "Starting server..."
exec "$@"