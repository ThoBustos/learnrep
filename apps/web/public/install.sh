#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
  echo "Warning: running as root. Consider using a user-local npm prefix." >&2
fi

if ! command -v node &>/dev/null; then
  echo "Error: Node.js is required. Install it from https://nodejs.org" >&2
  exit 1
fi

if ! command -v npm &>/dev/null; then
  echo "Error: npm is required." >&2
  exit 1
fi

VERSION="${1:-latest}"
echo "Installing learnrep CLI@${VERSION}..."
npm install -g "learnrep@${VERSION}"
echo "Done. Run 'lr --help' to get started."
