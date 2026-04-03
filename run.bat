@echo off
title DigiTwin — Healthcare AI Platform

echo.
echo  ============================================
echo   DigiTwin Healthcare AI — Starting Up
echo  ============================================
echo.

:: ── Start Backend (FastAPI on port 8000) ─────────────────────────────────────
echo  [1/2] Starting Backend (FastAPI)...
start "DigiTwin Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --reload --port 8000"

:: Small delay so backend gets a head start
timeout /t 3 /nobreak >nul

:: ── Start Frontend (Next.js on port 3000) ────────────────────────────────────
echo  [2/2] Starting Frontend (Next.js)...
start "DigiTwin Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: ── Wait then open browser ────────────────────────────────────────────────────
echo.
echo  Waiting for servers to be ready...
timeout /t 5 /nobreak >nul

echo.
echo  Opening browser...
start "" "http://localhost:3000"

echo.
echo  ============================================
echo   Both servers are running!
echo.
echo   Frontend  →  http://localhost:3000
echo   Backend   →  http://localhost:8000
echo   AI Analyzer → http://localhost:3000/analyze
echo  ============================================
echo.
echo  Close this window at any time.
echo  To stop servers, close the Backend and Frontend windows.
pause
