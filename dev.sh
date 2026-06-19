#!/bin/bash
set -e

echo "Freeing port 5000 if in use..."
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

echo "Building frontend..."
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/wirfoncloud run build

echo "Building API server..."
PORT=5000 node ./artifacts/api-server/build.mjs

echo "Starting server on port 5000..."
export PORT=5000
export NODE_ENV=development
exec node --enable-source-maps artifacts/api-server/dist/index.mjs
