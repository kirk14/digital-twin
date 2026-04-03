@echo off
title DigiTwin — Healthcare Simulator

echo.
echo  ============================================
echo   DigiTwin Healthcare Sim — Starting Up
echo  ============================================
echo.

:: ── Start Backend (FastAPI on port 8000) ─────────────────────────────────────
echo  [1/2] Starting Backend (FastAPI)...
start "DigiTwin Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --reload --port 8000"

:: Small delay so backend gets a head start
timeout /t 3 /nobreak >nul

:: ── Start Frontend (Vite on port 5173) ───────────────────────────────────────
echo  [2/2] Starting Frontend (Vite React)...
start "DigiTwin Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: ── Wait then open browser ────────────────────────────────────────────────────
echo.
echo  Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo.
echo  Opening browser...
start "" "http://localhost:5173"

echo.
echo  ============================================
echo   All systems are online!
echo.
echo   Frontend  -^>  http://localhost:5173
echo   Backend   -^>  http://localhost:8000
echo  ============================================
echo.
echo  Close this window at any time.
echo  To stop everything, simply close the Backend and Frontend command windows.
pause
