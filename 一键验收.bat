@echo off
chcp 65001 >nul 2>nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
title 错题星图 - 一键验收

echo ========================================
echo   错题星图 - 一键验收
echo ========================================
echo.

node --version >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 Node.js
    echo 请先安装 Node.js LTS：https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js 可用
echo.

echo [1/4] 安装全部依赖...
call npm run install:all
if errorlevel 1 (
    echo [失败] install:all 失败
    pause
    exit /b 1
)
echo [OK] install:all 通过
echo.

echo [2/4] 构建前后端...
call npm run build
if errorlevel 1 (
    echo [失败] build 失败
    pause
    exit /b 1
)
echo [OK] build 通过
echo.

echo [3/4] 诊断评测（fixture，不调用大模型）...
call npm run eval:diagnosis
if errorlevel 1 (
    echo [失败] eval:diagnosis 失败
    pause
    exit /b 1
)
echo [OK] eval:diagnosis 通过
echo.

echo [4/4] 最终检查...
call npm run final-check
if errorlevel 1 (
    echo [失败] final-check 失败
    pause
    exit /b 1
)
echo [OK] final-check 通过
echo.

echo ========================================
echo   验收通过！
echo ========================================
echo.
echo 运行 一键启动.bat 启动项目
echo   前端: http://localhost:5173
echo   后端: http://localhost:3001
echo.
pause
