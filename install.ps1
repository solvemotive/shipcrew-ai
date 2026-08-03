# shipcrew installer — Windows PowerShell
# Usage: irm https://raw.githubusercontent.com/solvemotive/shipcrew-ai/main/install.ps1 | iex
param(
  [string]$Crew = $(if ($env:SHIPCREW_CREW) { $env:SHIPCREW_CREW } else { "ship-crew" }),
  [string]$InstallDir = $(Get-Location),
  [string]$NpmPkg = $(if ($env:SHIPCREW_NPM) { $env:SHIPCREW_NPM } else { "@solvemotive/shipcrew-ai" }),
  [string]$RepoUrl = $(if ($env:SHIPCREW_REPO) { $env:SHIPCREW_REPO } else { "https://github.com/solvemotive/shipcrew-ai.git" })
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ⚓  shipcrew" -ForegroundColor Cyan
Write-Host "  Stop prompting. Command a crew." -ForegroundColor DarkGray
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js 18+ is required. Install from https://nodejs.org and retry." -ForegroundColor Red
  exit 1
}

$nodeMajor = [int]((node -p "process.versions.node.split('.')[0]").Trim())
if ($nodeMajor -lt 18) {
  Write-Host "Node.js 18+ required (found $(node -v))." -ForegroundColor Red
  exit 1
}

Write-Host "  Installing into: $InstallDir"
Write-Host "  Crew: $Crew"
Write-Host ""

function Install-FromGit {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "git is required to fall back to a source install." -ForegroundColor Red
    exit 1
  }
  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("shipcrew-ai-" + [guid]::NewGuid().ToString())
  Write-Host "  Fetching shipcrew from GitHub…"
  git clone --depth 1 $RepoUrl $tmp
  Push-Location $InstallDir
  try {
    node (Join-Path $tmp "bin/cli.js") init $Crew --yes
  } finally {
    Pop-Location
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
  }
}

Push-Location $InstallDir
try {
  $ok = $false
  if (Get-Command npx -ErrorAction SilentlyContinue) {
    npx --yes $NpmPkg init $Crew --yes
    if ($LASTEXITCODE -eq 0) { $ok = $true }
    if (-not $ok) {
      npx --yes "github:solvemotive/shipcrew-ai" init $Crew --yes
      if ($LASTEXITCODE -eq 0) {
        $ok = $true
        Write-Host "  (installed via GitHub; npm package not required)" -ForegroundColor DarkGray
      }
    }
  }
  if (-not $ok) {
    Write-Host "  npx failed — falling back to git clone…"
    Pop-Location
    Install-FromGit
    Push-Location $InstallDir
  }
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "  ⚓ Shipcrew ready." -ForegroundColor Green
Write-Host "  Try: claude 'use @captain and build auth'" -ForegroundColor Cyan
Write-Host ""
