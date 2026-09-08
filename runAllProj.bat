@echo off
setlocal EnableExtensions
title Marriage Suite - Local Development Launcher

rem This file can be started from any directory.
set "ROOT=%~dp0"

rem Service entry points are launched in separate, labelled terminal windows.
if /I "%~1"==":backend" goto backend
if /I "%~1"==":frontend" goto frontend
if /I "%~1"==":dashboard" goto dashboard

cls
echo.
echo ================================================================
echo                  MARRIAGE SUITE - LOCAL RUNNER
echo ================================================================
echo.
echo   Backend:   http://localhost:8000
echo   Frontend:  http://localhost:3000
echo   Dashboard: http://localhost:3001
echo.

call :requireFolder "backend-mariage" || goto startupError
call :requireFolder "frontend-mariage" || goto startupError
call :requireFolder "dashboard-marriage" || goto startupError
call :requireCommand php || goto startupError
call :requireCommand npm.cmd || goto startupError

if not exist "%ROOT%backend-mariage\vendor\autoload.php" (
    echo [ERROR] Backend dependencies are missing. Run: composer install
    goto startupError
)
if not exist "%ROOT%frontend-mariage\node_modules" (
    echo [ERROR] Frontend dependencies are missing. Run: npm install in frontend-mariage
    goto startupError
)
if not exist "%ROOT%dashboard-marriage\node_modules" (
    echo [ERROR] Dashboard dependencies are missing. Run: npm install in dashboard-marriage
    goto startupError
)

call :requireFreePort 8000 || goto startupError
call :requireFreePort 3000 || goto startupError
call :requireFreePort 3001 || goto startupError

echo [OK] Environment check completed. Starting services...
echo.

start "Marriage Backend - :8000" cmd /k call "%~f0" :backend
start "Marriage Frontend - :3000" cmd /k call "%~f0" :frontend
start "Marriage Dashboard - :3001" cmd /k call "%~f0" :dashboard

echo Services were launched in three separate windows.
echo Close those windows or press Ctrl+C inside each one to stop a service.
timeout /t 3 /nobreak >nul
exit /b 0

:backend
title Marriage Backend - http://localhost:8000
cd /d "%ROOT%backend-mariage"
echo Starting Laravel API on http://localhost:8000 ...
php artisan serve --host=127.0.0.1 --port=8000
goto :eof

:frontend
title Marriage Frontend - http://localhost:3000
cd /d "%ROOT%frontend-mariage"
set "PORT=3000"
echo Starting public frontend on http://localhost:3000 ...
call npm.cmd start
goto :eof

:dashboard
title Marriage Dashboard - http://localhost:3001
cd /d "%ROOT%dashboard-marriage"
set "PORT=3001"
echo Starting dashboard on http://localhost:3001 ...
call npm.cmd start
goto :eof

:requireFolder
if exist "%ROOT%%~1\" exit /b 0
echo [ERROR] Required folder was not found: %~1
exit /b 1

:requireCommand
where %~1 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Required command was not found: %~1
    exit /b 1
)
exit /b 0

:requireFreePort
netstat -ano | findstr /R /C:":%~1 .*LISTENING" >nul
if not errorlevel 1 (
    echo [ERROR] Port %~1 is already in use. Stop the process using it and try again.
    exit /b 1
)
exit /b 0

:startupError
echo.
echo Startup cancelled. Resolve the error above, then run this file again.
pause
exit /b 1
