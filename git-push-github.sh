#!/usr/bin/env bash
# Push to GitHub using GITHUB_TOKEN environment variable.
# Usage: ./git-push-github.sh [extra git push args...]
#
# Set GITHUB_TOKEN (Personal Access Token with repo scope) before running:
#   export GITHUB_TOKEN=ghp_xxxx
#   ./git-push-github.sh
# Or for force-push:
#   ./git-push-github.sh --force

set -euo pipefail

REPO_URL="https://github.com/Shejaoli/Wirfon-Website-04"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: GITHUB_TOKEN environment variable is not set."
  echo "Set it with: export GITHUB_TOKEN=ghp_your_token_here"
  exit 1
fi

AUTHED_URL="https://${GITHUB_TOKEN}@github.com/Shejaoli/Wirfon-Website-04"

# Configure temporary auth URL then restore
git remote set-url origin "$AUTHED_URL"
git push origin main "$@"
PUSH_EXIT=$?
git remote set-url origin "$REPO_URL"

exit $PUSH_EXIT
