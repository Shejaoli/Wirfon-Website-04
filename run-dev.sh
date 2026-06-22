#!/bin/bash
set -e

echo "Building API server..."
PORT=8080 node ./artifacts/api-server/build.mjs

echo "Starting API server on port 8080..."
PORT=8080 NODE_ENV=development node --enable-source-maps artifacts/api-server/dist/index.mjs &
API_PID=$!

echo "Starting frontend dev server on port 5000..."
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/wirfoncloud run dev &
VITE_PID=$!

# Wait for either process to exit
wait -n $API_PID $VITE_PID
echo "A process exited. Shutting down..."
kill $API_PID $VITE_PID 2>/dev/null || true
