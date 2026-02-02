@echo off
chcp 65001 >nul
title BURMALDA

echo.
echo   BURMALDA CASINO
echo.

:: проверяем что всё стоит
python --version >nul 2>&1
if errorlevel 1 (
    echo Python не найден
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js не найден
    pause
    exit /b 1
)

:: ставим пакеты
cd /d "%~dp0backend"
pip install -r requirements.txt --quiet

cd /d "%~dp0frontend"
call npm install --silent

echo.
echo   Запуск...
echo.

:: бэк
cd /d "%~dp0backend"
start "Backend" cmd /k "python app.py"

timeout /t 3 /nobreak >nul

:: фронт
cd /d "%~dp0frontend"
start "Frontend" cmd /k "npm start"

echo.
echo   http://localhost:3000
echo.
pause