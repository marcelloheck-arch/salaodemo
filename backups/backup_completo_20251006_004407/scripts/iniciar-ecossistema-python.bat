@echo off
echo 🚀 INICIANDO ECOSSISTEMA PYTHON COMPLETO - SALÃO DE BELEZA
echo.

echo 📦 Instalando dependências Python...
pip install -r requirements.txt
echo.

echo 💰 Iniciando Sistema Caixa (Porta 8002)...
start "Python Caixa" cmd /k "cd python-caixa && python main.py"
timeout /t 2 >nul

echo 📊 Iniciando Sistema Analytics (Porta 8000)...
start "Python Analytics" cmd /k "cd python-analytics && python main.py"
timeout /t 2 >nul

echo 📈 Iniciando Sistema Relatórios (Porta 8003)...
start "Python Relatorios" cmd /k "cd python-relatorios && python main.py"
timeout /t 2 >nul

echo 🤖 Iniciando Sistema Machine Learning (Porta 8004)...
start "Python ML" cmd /k "cd python-ml && python main.py"
timeout /t 2 >nul

echo 🖼️ Iniciando Sistema Processamento Imagens (Porta 8005)...
start "Python Imagens" cmd /k "cd python-imagens && python main.py"
timeout /t 2 >nul

echo 📊 Iniciando Sistema Processamento Dados (Porta 8006)...
start "Python Dados" cmd /k "cd python-dados && python main.py"
timeout /t 2 >nul

echo 🌐 Iniciando Frontend Next.js (Porta 3001)...
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 3 >nul

echo.
echo ✅ TODOS OS SISTEMAS PYTHON INICIADOS!
echo.
echo 🎯 PORTAS DOS SERVIÇOS:
echo    💰 Caixa: http://localhost:8002
echo    📊 Analytics: http://localhost:8000  
echo    📈 Relatórios: http://localhost:8003
echo    🤖 ML: http://localhost:8004
echo    🖼️ Imagens: http://localhost:8005
echo    📊 Dados: http://localhost:8006
echo    🌐 Frontend: http://localhost:3001
echo.
echo 🐍 PYTHON SUPERIOR EM:
echo    ✅ Cálculos financeiros complexos
echo    ✅ Análise estatística avançada  
echo    ✅ Machine Learning e IA
echo    ✅ Processamento de imagens
echo    ✅ Big Data e manipulação de dados
echo    ✅ Algoritmos matemáticos
echo.
pause