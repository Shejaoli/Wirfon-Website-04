#!/bin/bash
set -e

echo "Building frontend..."
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/wirfoncloud run build

echo "Building API server..."
PORT=5000 node ./artifacts/api-server/build.mjs

echo "Starting server on port 5000..."
export PORT=5000
export NODE_ENV=development
exec node --enable-source-maps artifacts/api-server/dist/index.mjs
