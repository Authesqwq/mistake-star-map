@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Mistake Star Map - Start

echo ========================================
echo   Mistake Star Map - One Click Start
echo ========================================
echo.

node --version >nul 2>nul
if errorlevel 1 (
    echo [ERR] Node.js not found.
    echo Please install Node.js LTS from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i
for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm %%i
echo.

if not exist "%CD%\node_modules" (
    echo [INSTALL] root dependencies...
    call npm install
    if errorlevel 1 ( echo [FAIL] root install & pause & exit /b 1 )
)

if not exist "%CD%\client\node_modules" (
    echo [INSTALL] client dependencies...
    pushd "%CD%\client"
    call npm install
    if errorlevel 1 ( popd & echo [FAIL] client install & pause & exit /b 1 )
    popd
)

if not exist "%CD%\server\node_modules" (
    echo [INSTALL] server dependencies...
    pushd "%CD%\server"
    call npm install
    if errorlevel 1 ( popd & echo [FAIL] server install & pause & exit /b 1 )
    popd
)

echo [OK] Dependencies ready
echo.
echo [START] Launching dev servers...
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:3001
echo.

start "" http://localhost:5173
call npm run dev
pause
