#!/usr/bin/env bash
# shipcrew installer — macOS / Linux
# Usage: curl -fsSL https://raw.githubusercontent.com/solvemotive/shipcrew-ai/main/install.sh | bash
set -euo pipefail

REPO_URL="${SHIPCREW_REPO:-https://github.com/solvemotive/shipcrew-ai.git}"
CREW="${SHIPCREW_CREW:-ship-crew}"
INSTALL_DIR="${SHIPCREW_DIR:-$(pwd)}"

BLUE='\033[0;36m'
GREEN='\033[0;32m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BLUE}  ⚓  shipcrew${NC}"
echo -e "${DIM}  Stop prompting. Command a crew.${NC}"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 18+ is required. Install from https://nodejs.org and retry."
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node.js 18+ required (found $(node -v))."
  exit 1
fi

echo -e "  Installing into: ${BOLD}${INSTALL_DIR}${NC}"
echo -e "  Crew: ${BOLD}${CREW}${NC}"
echo ""

if command -v npx >/dev/null 2>&1; then
  cd "$INSTALL_DIR"
  npx --yes @solvemotive/shipcrew-ai init "$CREW" --yes
else
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT
  if command -v git >/dev/null 2>&1; then
    git clone --depth 1 "$REPO_URL" "$TMP/shipcrew"
    node "$TMP/shipcrew/bin/cli.js" init "$CREW" --yes
  else
    echo "Need npx or git to install shipcrew."
    exit 1
  fi
fi

echo ""
echo -e "${GREEN}${BOLD}  ⚓ Shipcrew ready.${NC}"
echo -e "  Try: ${BLUE}claude 'use @captain and build auth'${NC}"
echo ""
