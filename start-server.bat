@echo off
cd /d "%~dp0"
echo Iniciando servidor Next.js...
call npm run dev
pause
