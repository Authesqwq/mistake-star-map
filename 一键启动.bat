@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title 错题星图 - 一键启动

echo ========================================
echo   错题星图 - AI 错题复练与知识点掌握系统
echo ========================================
echo.

:: Check Node.js
node --version >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 Node.js
    echo 请先安装 Node.js LTS：https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i

:: npm 随 Node.js 一起安装
npm --version >nul 2>nul
if errorlevel 1 (
    echo [错误] npm 不可用
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm %%i
echo.

:: Install root dependencies
if not exist "%CD%\node_modules" (
    echo [安装] 根目录依赖...
    call npm install
    if errorlevel 1 (
        echo [失败] 根目录依赖安装失败
        pause
        exit /b 1
    )
)

:: Install client dependencies
if not exist "%CD%\client\node_modules" (
    echo [安装] client 依赖...
    pushd "%CD%\client"
    call npm install
    if errorlevel 1 (
        popd
        echo [失败] client 依赖安装失败
        pause
        exit /b 1
    )
    popd
)

:: Install server dependencies
if not exist "%CD%\server\node_modules" (
    echo [安装] server 依赖...
    pushd "%CD%\server"
    call npm install
    if errorlevel 1 (
        popd
        echo [失败] server 依赖安装失败
        pause
        exit /b 1
    )
    popd
)

echo [OK] 依赖就绪
echo.
echo [启动] 启动前后端开发服务器...
echo   前端: http://localhost:5173
echo   后端: http://localhost:3001
echo.

:: Open browser
start "" http://localhost:5173

call npm run dev

pause
