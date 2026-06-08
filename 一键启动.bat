@echo off
chcp 65001 >nul
title 错题星图 - 一键启动

echo ========================================
echo   错题星图 - AI 错题复练与知识点掌握系统
echo ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js LTS 版本。
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js 已安装

:: Check npm.cmd
where npm.cmd >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 npm.cmd
    pause
    exit /b 1
)
echo [OK] npm 可用
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo [安装] 正在安装根目录依赖...
    call npm.cmd install
)
if not exist "client\node_modules" (
    echo [安装] 正在安装 client 依赖...
    cd client
    call npm.cmd install
    cd ..
)
if not exist "server\node_modules" (
    echo [安装] 正在安装 server 依赖...
    cd server
    call npm.cmd install
    cd ..
)
echo [OK] 依赖就绪
echo.

:: Start dev servers
echo [启动] 正在启动前后端开发服务器...
echo   前端: http://localhost:5173
echo   后端: http://localhost:3001
echo.

:: Open browser
start "" http://localhost:5173

call npm.cmd run dev

pause
