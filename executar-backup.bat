@echo off
echo 🚀 EXECUTANDO BACKUP COMPLETO - SISTEMA SALÃO DE BELEZA
echo 🐍 Python Superior em Backup e Automação
echo ================================================================

cd /d "C:\Users\desha\OneDrive - Academico - Secretaria do Estado da Educação de São Paulo\agenda_salao"

echo 📁 Verificando ambiente Python...
if not exist ".venv\Scripts\python.exe" (
    echo ❌ Ambiente virtual não encontrado!
    echo 💡 Execute: python -m venv .venv
    pause
    exit /b 1
)

echo ✅ Ambiente virtual encontrado
echo 🏃‍♂️ Executando sistema de backup...
echo.

".venv\Scripts\python.exe" sistema_backup.py

echo.
echo ================================================================
echo 🎉 BACKUP FINALIZADO!
echo 📁 Verifique a pasta 'backups' para os arquivos gerados
echo ================================================================
pause