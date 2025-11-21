@echo off
title SalaoGerent - Demonstração Local

echo.
echo 🎭 SalaoGerent - Iniciando Demonstração Local
echo =============================================
echo.

:: Verificar se estamos na pasta correta
if not exist "index.html" (
    echo ❌ Erro: Execute este arquivo na pasta demo
    pause
    exit /b 1
)

:: Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐍 Iniciando servidor Python...
    echo 📱 Acesse: http://localhost:8000
    echo ⏹️  Pressione Ctrl+C para parar
    echo.
    python -m http.server 8000
    goto :end
)

:: Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo 📦 Iniciando servidor Node.js...
    echo 📱 Acesse: http://localhost:8080
    echo ⏹️  Pressione Ctrl+C para parar
    echo.
    npx http-server -p 8080
    goto :end
)

:: Verificar se PHP está instalado
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐘 Iniciando servidor PHP...
    echo 📱 Acesse: http://localhost:8000
    echo ⏹️  Pressione Ctrl+C para parar
    echo.
    php -S localhost:8000
    goto :end
)

:: Nenhum servidor encontrado, abrir diretamente
echo ❌ Nenhum servidor local encontrado!
echo 💡 Abrindo demo diretamente no navegador...
echo.
start index.html

:end
echo.
echo 📋 Credenciais de teste:
echo    Email: admin@salao.com
echo    Senha: demo123
echo.
echo 🎯 Ou use os botões de acesso rápido!
echo.
pause