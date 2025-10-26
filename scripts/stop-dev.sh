#!/usr/bin/env bash
# Stop the background Next.js dev server started by start-dev.sh
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
if [ ! -f .dev_pid ]; then
  echo "No .dev_pid file found. Is the dev server running?"
  exit 1
fi
PID=$(cat .dev_pid)
if kill -0 "$PID" 2>/dev/null; then
  echo "Stopping pid $PID..."
  kill "$PID"
  rm -f .dev_pid
  echo "Stopped."
else
  echo "Process $PID not running. Removing .dev_pid file."
  rm -f .dev_pid
fi
