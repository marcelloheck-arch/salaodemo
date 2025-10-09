@echo off
echo 🚀 INICIANDO ECOSSISTEMA PYTHON SUPREMO - SALÃO DE BELEZA
echo.

echo 📦 Instalando dependências Python...
pip install -r requirements.txt
echo.

echo 💰 Iniciando Sistema Caixa (Porta 8002)...
start "Python Caixa" cmd /k "cd python-caixa && python main.py"
timeout /t 1 >nul

echo 📊 Iniciando Sistema Analytics (Porta 8000)...
start "Python Analytics" cmd /k "cd python-analytics && python main.py"
timeout /t 1 >nul

echo 📈 Iniciando Sistema Relatórios (Porta 8003)...
start "Python Relatorios" cmd /k "cd python-relatorios && python main.py"
timeout /t 1 >nul

echo 🤖 Iniciando Sistema Machine Learning (Porta 8004)...
start "Python ML" cmd /k "cd python-ml && python main.py"
timeout /t 1 >nul

echo 🖼️ Iniciando Sistema Processamento Imagens (Porta 8005)...
start "Python Imagens" cmd /k "cd python-imagens && python main.py"
timeout /t 1 >nul

echo 📊 Iniciando Sistema Processamento Dados (Porta 8006)...
start "Python Dados" cmd /k "cd python-dados && python main.py"
timeout /t 1 >nul

echo ⏰ Iniciando Sistema Automação (Porta 8007)...
start "Python Automacao" cmd /k "cd python-automacao && python main.py"
timeout /t 1 >nul

echo 🌐 Iniciando Frontend Next.js (Porta 3001)...
start "Frontend Next.js" cmd /k "npm run dev"
timeout /t 3 >nul

echo.
echo ✅ ECOSSISTEMA PYTHON SUPREMO INICIADO!
echo.
echo 🎯 ARQUITETURA COMPLETA:
echo    🌐 Frontend Next.js: http://localhost:3001
echo    💰 Caixa Python: http://localhost:8002
echo    📊 Analytics Python: http://localhost:8000  
echo    📈 Relatórios Python: http://localhost:8003
echo    🤖 ML Python: http://localhost:8004
echo    🖼️ Imagens Python: http://localhost:8005
echo    📊 Big Data Python: http://localhost:8006
echo    ⏰ Automação Python: http://localhost:8007
echo.
echo 🐍 PYTHON DOMINA EM:
echo    ✅ Cálculos financeiros complexos (Pandas/NumPy)
echo    ✅ Machine Learning e IA (Scikit-learn)
echo    ✅ Processamento de imagens (OpenCV + Face Recognition)
echo    ✅ Big Data e análise estatística (SciPy)
echo    ✅ Automação inteligente (APScheduler)
echo    ✅ Algoritmos matemáticos avançados
echo    ✅ Análise preditiva e forecasting
echo.
echo 💻 JAVASCRIPT DOMINA EM:
echo    ✅ Interface de usuário (React/Next.js)
echo    ✅ Interatividade web
echo    ✅ Real-time (WebSockets)
echo    ✅ Experiência do usuário
echo.
echo 🏆 RESULTADO: PRODUTO TOP DE LINHA!
echo    Frontend moderno + Backend Python científico
echo.
pause