@echo off
echo 🐍 Configurando ambiente Python para Analytics...

REM Criar ambiente virtual
python -m venv venv

REM Ativar ambiente virtual
call venv\Scripts\activate.bat

REM Instalar dependências
echo 📦 Instalando dependências...
pip install -r requirements.txt

echo ✅ Ambiente configurado com sucesso!
echo 🚀 Para iniciar o servidor, execute: python start_server.py
pause