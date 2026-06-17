@echo off
echo ====================================================
echo Teacher Management System - Quick Start
echo ====================================================
echo.

echo Starting Backend Server on port 4000...
echo.
cd /d "%~dp0backend"
start "Teacher Backend" cmd /k npm start
timeout /t 2 /nobreak

echo.
echo Starting Frontend on port 3000...
echo.
cd /d "%~dp0frontend"
start "Teacher Frontend" cmd /k npm start

echo.
echo ====================================================
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo ====================================================
echo.
echo Two windows should have opened:
echo - Teacher Backend (port 4000)
echo - Teacher Frontend (port 3000)
echo.
echo The frontend will open automatically in your browser.
echo.
echo Note: Make sure npm packages are installed first:
echo   cd backend && npm install
echo   cd frontend && npm install
echo.
pause
