#!/usr/bin/env python3
"""
Script para inicializar o servidor de analytics Python
"""

import uvicorn
import sys
import os

# Adicionar o diretório atual ao PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Iniciando Agenda Salão Analytics API...")
    print("🔗 Servidor disponível em: http://localhost:8000")
    print("📄 Documentação da API: http://localhost:8000/docs")
    print("✨ Ctrl+C para parar o servidor\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )