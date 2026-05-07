#!/bin/bash
set -e

echo "Building frontend..."
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/wirfoncloud run build

echo "Building API server..."
PORT=5000 NODE_ENV=production pnpm --filter @workspace/api-server run build

echo "Starting server on port 5000..."
exec PORT=5000 NODE_ENV=production node --enable-source-maps artifacts/api-server/dist/index.mjs
