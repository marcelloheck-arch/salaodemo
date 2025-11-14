@echo off
echo ============================================
echo  REINSTALACAO E INICIO DO SERVIDOR
echo ============================================
echo.
echo [1/3] Removendo node_modules...
rmdir /s /q node_modules 2>nul
echo OK - node_modules removido
echo.
echo [2/3] Instalando dependencias (pode demorar 2-3 minutos)...
call npm install
echo OK - Dependencias instaladas
echo.
echo [3/3] Iniciando servidor de desenvolvimento...
echo.
echo ============================================
echo  SERVIDOR INICIANDO...
echo  Acesse: http://localhost:3000
echo ============================================
echo.
call npm run dev
