#!/usr/bin/env bash
# Project Hub launcher.
# First time: chmod +x start.sh
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Project Hub (web :5174, api :3030)..."
npm run dev
