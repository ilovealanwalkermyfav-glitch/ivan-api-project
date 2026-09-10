@echo off
title HalluGuard AI Launcher
setlocal enabledelayedexpansion

echo ========================================================
echo        STARTING HALLUGUARD AI (FULL-STACK PROJECT)
echo ========================================================
echo.

:: Ensure Node.js directories are always in PATH if present
if exist "C:\Program Files\nodejs" set "PATH=C:\Program Files\nodejs;%PATH%"
if exist "%LOCALAPPDATA%\Programs\nodejs" set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

:: Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js was not found on this computer!
    echo Please download and install Node.js LTS version from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected.
echo.

:: Check and auto-install server dependencies if missing
if not exist "%~dp0server\node_modules" (
    echo [INFO] Installing server dependencies for the first time...
    cd /d "%~dp0server"
    call npm install
)

:: Check and auto-install client dependencies if missing
if not exist "%~dp0client\node_modules" (
    echo [INFO] Installing client dependencies for the first time...
    cd /d "%~dp0client"
    call npm install
)

echo Starting Backend Server on port 5000...
start "HalluGuard Backend" cmd /k "set PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\nodejs;%%PATH%% && cd /d %~dp0server && node server.js"

echo Waiting 2 seconds for server to initialize...
ping 127.0.0.1 -n 3 >nul

echo Starting Frontend Web Client on port 5173...
start "HalluGuard Frontend" cmd /k "set PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\nodejs;%%PATH%% && cd /d %~dp0client && npm run dev"

echo.
echo ========================================================
echo  Opening browser at http://localhost:5173 ...
echo ========================================================
ping 127.0.0.1 -n 3 >nul
start http://localhost:5173

echo.
echo HalluGuard AI is now running! 
echo Keep the two black command windows open while using the app.
echo.
pause
