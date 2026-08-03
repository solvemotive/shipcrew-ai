# shipcrew installer — Windows PowerShell
# Usage: irm https://raw.githubusercontent.com/solvemotive/shipcrew/main/install.ps1 | iex
param(
  [string]$Crew = $(if ($env:SHIPCREW_CREW) { $env:SHIPCREW_CREW } else { "ship-crew" }),
  [string]$InstallDir = $(Get-Location)
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

Push-Location $InstallDir
try {
  if (Get-Command npx -ErrorAction SilentlyContinue) {
    npx --yes @solvemotive/shipcrew-ai init $Crew --yes
  } else {
    Write-Host "npx is required to install shipcrew." -ForegroundColor Red
    exit 1
  }
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "  ⚓ Shipcrew ready." -ForegroundColor Green
Write-Host "  Try: claude 'use @captain and build auth'" -ForegroundColor Cyan
Write-Host ""
