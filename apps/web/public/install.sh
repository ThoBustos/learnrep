#!/usr/bin/env bash
set -e

if ! command -v node &>/dev/null; then
  echo "Error: Node.js is required. Install it from https://nodejs.org" >&2
  exit 1
fi

if ! command -v npm &>/dev/null; then
  echo "Error: npm is required." >&2
  exit 1
fi

echo "Installing learnrep CLI..."
npm install -g learnrep
echo "Done. Run 'lr --help' to get started."
