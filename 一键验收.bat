@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Mistake Star Map - Verify

echo ========================================
echo   Mistake Star Map - One Click Verify
echo ========================================
echo.

node --version >nul 2>nul
if errorlevel 1 (
    echo [ERR] Node.js not found.
    echo Please install Node.js LTS from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js ready
echo REM LLM config is optional - fallback works without it
echo.

echo [1/4] npm run install:all
call npm run install:all
if errorlevel 1 ( echo [FAIL] install:all & pause & exit /b 1 )
echo [OK] install:all passed
echo.

echo [2/4] npm run build
call npm run build
if errorlevel 1 ( echo [FAIL] build & pause & exit /b 1 )
echo [OK] build passed
echo.

echo [3/4] npm run eval:diagnosis (fixture, no LLM call)
call npm run eval:diagnosis
if errorlevel 1 ( echo [FAIL] eval:diagnosis & pause & exit /b 1 )
echo [OK] eval:diagnosis passed
echo.

echo [4/4] npm run final-check
call npm run final-check
if errorlevel 1 ( echo [FAIL] final-check & pause & exit /b 1 )
echo [OK] final-check passed
echo.

echo ========================================
echo   VERIFY PASSED
echo ========================================
echo.
echo Run YiJianQiDong.bat to launch the app
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:3001
echo   Health   : http://localhost:3001/api/health
echo.

pause
