#!/usr/bin/env bash
# shipcrew-ai installer — macOS / Linux
# Usage: curl -fsSL https://raw.githubusercontent.com/solvemotive/shipcrew-ai/main/install.sh | bash
set -euo pipefail

REPO_URL="${SHIPCREW_AI_REPO:-${SHIPCREW_REPO:-https://github.com/solvemotive/shipcrew-ai.git}}"
NPM_PKG="${SHIPCREW_AI_NPM:-${SHIPCREW_NPM:-@solvemotive/shipcrew-ai}}"
CREW="${SHIPCREW_AI_CREW:-${SHIPCREW_CREW:-ship-crew}}"
INSTALL_DIR="${SHIPCREW_AI_DIR:-${SHIPCREW_DIR:-$(pwd)}}"

BLUE='\033[0;36m'
GREEN='\033[0;32m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BLUE}  ⚓  shipcrew-ai${NC}"
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

run_cli() {
  cd "$INSTALL_DIR"
  node "$1" init "$CREW" --yes
}

install_from_git() {
  if ! command -v git >/dev/null 2>&1; then
    echo "git is required to fall back to a source install."
    exit 1
  fi
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT
  echo "  Fetching shipcrew-ai from GitHub…"
  git clone --depth 1 "$REPO_URL" "$TMP/shipcrew-ai"
  run_cli "$TMP/shipcrew-ai/bin/cli.js"
}

cd "$INSTALL_DIR"

if command -v npx >/dev/null 2>&1; then
  if npx --yes "$NPM_PKG" init "$CREW" --yes; then
    :
  elif npx --yes "github:solvemotive/shipcrew-ai" init "$CREW" --yes; then
    echo -e "${DIM}  (installed via GitHub; npm package not required)${NC}"
  else
    echo "  npx failed — falling back to git clone…"
    install_from_git
  fi
else
  install_from_git
fi

echo ""
echo -e "${GREEN}${BOLD}  ⚓ Shipcrew-AI ready.${NC}"
echo -e "  Try: ${BLUE}claude 'use @captain and build auth'${NC}"
echo ""
