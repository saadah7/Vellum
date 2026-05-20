# ── Vellum — Start Backend + Frontend ──────────────────────────────────────────
#
# Launches the FastAPI backend (port 8000) and the Next.js frontend (port 3000)
# in two separate PowerShell windows, so each one's logs stay visible.
#
# Usage (from project root):
#     .\scripts\start.ps1
#
# Close both windows (or Ctrl+C in each) to stop.
#
# Pre-requisites:
#   - Ollama is running (the Ollama desktop app on Windows starts it automatically)
#   - `setup.ps1` has been run at least once on this machine

$ErrorActionPreference = "Stop"
$ROOT = (Get-Item (Split-Path -Parent $MyInvocation.MyCommand.Path)).Parent.FullName
Set-Location $ROOT

# ── Sanity checks ──────────────────────────────────────────────────────────────
$venvPython = Join-Path $ROOT "venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "[X] No venv found. Run: .\scripts\setup.ps1" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path (Join-Path $ROOT "ui\node_modules"))) {
    Write-Host "[X] No ui/node_modules found. Run: .\scripts\setup.ps1" -ForegroundColor Red
    exit 1
}

# Quick Ollama ping (non-fatal; warn only)
try {
    Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 | Out-Null
    Write-Host "[OK] Ollama is reachable" -ForegroundColor Green
} catch {
    Write-Host "[!]  Ollama not responding on port 11434." -ForegroundColor Yellow
    Write-Host "     Start the Ollama app, then re-run this script." -ForegroundColor Yellow
    exit 1
}

# ── Launch backend in a new window ─────────────────────────────────────────────
Write-Host ""
Write-Host "Starting backend on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
$backendCmd = @"
`$Host.UI.RawUI.WindowTitle = 'Vellum — Backend (FastAPI)'
Set-Location '$ROOT'
`$env:PYTHONPATH = '$ROOT'
`$env:PYTHONIOENCODING = 'utf-8'
& '$venvPython' -m uvicorn api.app:app --host 127.0.0.1 --port 8000
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Give the backend a head start so the frontend can call /health cleanly
Start-Sleep -Seconds 2

# ── Launch frontend in a new window ────────────────────────────────────────────
Write-Host "Starting frontend on http://localhost:3000 ..." -ForegroundColor Cyan
$frontendCmd = @"
`$Host.UI.RawUI.WindowTitle = 'Vellum — Frontend (Next.js)'
Set-Location '$ROOT\ui'
npm run dev
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

# ── Final hint ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Both services are starting in separate windows." -ForegroundColor Green
Write-Host ""
Write-Host "  Open in browser:  " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "  Backend health:   http://127.0.0.1:8000/health"
Write-Host "  First query takes ~30s while the LLM warms up."
Write-Host ""
