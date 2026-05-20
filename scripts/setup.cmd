@echo off
:: Double-click-friendly wrapper for setup.ps1.
:: Bypasses PowerShell ExecutionPolicy so users don't have to fight it.
setlocal
cd /d "%~dp0\.."
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1" %*
set EXITCODE=%ERRORLEVEL%
echo.
echo Press any key to close this window...
pause >nul
exit /b %EXITCODE%
