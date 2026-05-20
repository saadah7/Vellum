# =============================================================================
# Vellum -- One-Shot Setup for a Fresh Laptop
# =============================================================================
#
# Run this once after `git clone`. It builds the Python venv, installs all
# backend + frontend dependencies, verifies Ollama is reachable, pulls the
# Llama 3.2 model if missing, and ingests the design-rule knowledge base.
#
# Usage (from project root, in PowerShell):
#     .\scripts\setup.ps1
#
# If PowerShell blocks the script with an ExecutionPolicy error, run this once:
#     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
#
# Safe to re-run; each step is idempotent.

$ErrorActionPreference = "Stop"

# Resolve project root (one level up from this script)
$ROOT = (Get-Item (Split-Path -Parent $MyInvocation.MyCommand.Path)).Parent.FullName
Set-Location $ROOT

function Step($n, $msg) {
    Write-Host ""
    Write-Host "[$n] $msg" -ForegroundColor Cyan
    Write-Host ("-" * 60)
}

function Ok($msg)   { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "  [!]  $msg" -ForegroundColor Yellow }
function Die($msg)  { Write-Host "  [X]  $msg" -ForegroundColor Red; exit 1 }

# -----------------------------------------------------------------------------
# 1. Verify Python 3.11+ is available
# -----------------------------------------------------------------------------
Step 1 "Checking Python installation"
$pythonExe = $null
foreach ($candidate in @("py -3.14", "py -3.13", "py -3.12", "py -3.11", "python")) {
    try {
        $version = (& cmd /c "$candidate --version 2>&1") -join " "
        if ($version -match "Python 3\.(\d+)") {
            $minor = [int]$Matches[1]
            if ($minor -ge 11) {
                $pythonExe = $candidate
                Ok "Found $version via '$candidate'"
                break
            }
        }
    } catch {}
}
if (-not $pythonExe) {
    Die "Python 3.11+ not found. Install from https://www.python.org/downloads/"
}

# -----------------------------------------------------------------------------
# 2. Create venv if missing
# -----------------------------------------------------------------------------
Step 2 "Setting up Python virtual environment (./venv)"
$venvPython = Join-Path $ROOT "venv\Scripts\python.exe"
if (Test-Path $venvPython) {
    try {
        & $venvPython --version | Out-Null
        Ok "venv already exists and is healthy"
    } catch {
        Warn "venv exists but is broken (likely a removed Python version) - rebuilding"
        Remove-Item -Recurse -Force (Join-Path $ROOT "venv")
        Invoke-Expression "$pythonExe -m venv venv"
        Ok "venv rebuilt"
    }
} else {
    Invoke-Expression "$pythonExe -m venv venv"
    Ok "venv created"
}

# -----------------------------------------------------------------------------
# 3. Install Python dependencies
# -----------------------------------------------------------------------------
Step 3 "Installing Python packages (this can take 3 to 5 minutes on first run)"
& $venvPython -m pip install --upgrade pip --quiet
& $venvPython -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { Die "pip install failed" }
Ok "Python packages installed"

# -----------------------------------------------------------------------------
# 4. Install frontend dependencies
# -----------------------------------------------------------------------------
Step 4 "Installing frontend packages (Next.js / React)"
$nodeOk = $false
try { node --version | Out-Null; $nodeOk = $true } catch {}
if (-not $nodeOk) {
    Die "Node.js not found. Install LTS from https://nodejs.org/ then re-run this script."
}
Push-Location (Join-Path $ROOT "ui")
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) { Pop-Location; Die "npm install failed" }
    Ok "Frontend packages installed"
} else {
    Ok "node_modules already present"
}
Pop-Location

# -----------------------------------------------------------------------------
# 5. Verify Ollama is reachable; pull model if missing
# -----------------------------------------------------------------------------
Step 5 "Checking Ollama runtime and Llama 3.2 model"
$ollamaUrl = if ($env:OLLAMA_BASE_URL) { $env:OLLAMA_BASE_URL } else { "http://localhost:11434" }
try {
    $tags = Invoke-RestMethod -Uri "$ollamaUrl/api/tags" -TimeoutSec 3
    Ok "Ollama is running at $ollamaUrl"
    $hasModel = $tags.models | Where-Object { $_.name -match "^llama3\.2" }
    if (-not $hasModel) {
        Warn "Llama 3.2 not found locally - pulling now (this downloads about 2 GB)"
        ollama pull llama3.2
        if ($LASTEXITCODE -ne 0) { Die "ollama pull failed. Try manually: 'ollama pull llama3.2'" }
        Ok "Llama 3.2 pulled"
    } else {
        Ok "Llama 3.2 is available locally"
    }
} catch {
    Warn "Cannot reach Ollama at $ollamaUrl"
    Warn "Install from https://ollama.com/download and start it (it runs as a background app on Windows)."
    Warn "After Ollama is running, re-run this script."
}

# -----------------------------------------------------------------------------
# 6. Ingest the knowledge base if it is empty
# -----------------------------------------------------------------------------
Step 6 "Checking / ingesting the design-rule knowledge base"
$dbPath = Join-Path $ROOT "db\chroma.sqlite3"
if (-not (Test-Path $dbPath)) {
    Warn "No knowledge base found - ingesting now"
    & $venvPython scripts\ingest.py
    if ($LASTEXITCODE -ne 0) { Die "Ingestion failed" }
    Ok "Knowledge base built"
} else {
    # The backend may be holding the SQLite db open. Try to count; if anything
    # fails, just trust that the db file exists and move on.
    $count = $null
    try {
        $raw = & $venvPython -c "from core.knowledge import get_vectorstore; print(get_vectorstore()._collection.count())" 2>$null
        if ($LASTEXITCODE -eq 0 -and $raw) { $count = [int]$raw }
    } catch {}
    if ($null -ne $count -and $count -lt 100) {
        Warn "Knowledge base has only $count chunks - re-ingesting"
        & $venvPython scripts\ingest.py
        Ok "Knowledge base rebuilt"
    } elseif ($null -ne $count) {
        Ok "Knowledge base already populated ($count chunks)"
    } else {
        Ok "Knowledge base file present (chunk count not probed - db may be in use)"
    }
}

# -----------------------------------------------------------------------------
# 7. Done
# -----------------------------------------------------------------------------
Step 7 "Setup complete"
Write-Host ""
Write-Host "  Next step:  " -NoNewline
Write-Host ".\scripts\start.ps1" -ForegroundColor Green -NoNewline
Write-Host "   - starts backend (port 8000) + frontend (port 3000)"
Write-Host ""
Write-Host "  Or run them manually in two terminals:"
Write-Host "    Backend:   " -NoNewline; Write-Host ".\venv\Scripts\python.exe -m uvicorn api.app:app --host 127.0.0.1 --port 8000" -ForegroundColor Gray
Write-Host "    Frontend:  " -NoNewline; Write-Host "cd ui; npm run dev" -ForegroundColor Gray
Write-Host ""

exit 0
