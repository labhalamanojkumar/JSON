#!/usr/bin/env bash
# Start Next.js dev server in background and write PID to .dev_pid
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
echo "Starting Next.js dev server in background..."
# redirect output to server.log, save PID
nohup npm run dev > server.log 2>&1 &
PID=$!
echo $PID > .dev_pid
echo "Started (pid=$PID). Logs: $ROOT_DIR/server.log"
