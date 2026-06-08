@echo off
chcp 65001 >nul
title 错题星图 - 一键验收

echo ========================================
echo   错题星图 - 一键验收
echo ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js
    pause
    exit /b 1
)

:: Step 1: Install all
echo [1/4] 安装全部依赖...
call npm.cmd run install:all
if %errorlevel% neq 0 (
    echo [失败] install:all 失败
    pause
    exit /b 1
)
echo [OK] install:all 通过
echo.

:: Step 2: Build
echo [2/4] 构建前后端...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo [失败] build 失败
    pause
    exit /b 1
)
echo [OK] build 通过
echo.

:: Step 3: Eval (fixture, no LLM)
echo [3/4] 运行诊断评测（fixture 模式，不调用大模型）...
call npm.cmd run eval:diagnosis
if %errorlevel% neq 0 (
    echo [失败] eval:diagnosis 失败
    pause
    exit /b 1
)
echo [OK] eval:diagnosis 通过
echo.

:: Step 4: Final check
echo [4/4] 运行最终检查...
call npm.cmd run final-check
if %errorlevel% neq 0 (
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
echo 可运行 一键启动.bat 启动项目
echo   前端: http://localhost:5173
echo   后端: http://localhost:3001
echo.

pause
