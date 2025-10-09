#!/usr/bin/env python3
"""
Launcher para o Sistema de Caixa Python
"""

import sys
import subprocess
import importlib
import os

def check_dependencies():
    """Verifica e instala dependências necessárias"""
    required_packages = [
        'fastapi',
        'uvicorn[standard]',
        'pandas',
        'numpy',
        'python-multipart'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'uvicorn[standard]':
                importlib.import_module('uvicorn')
            else:
                importlib.import_module(package.replace('-', '_'))
            print(f"✅ {package} - OK")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} - FALTANDO")
    
    if missing_packages:
        print(f"\n📦 Instalando dependências faltantes: {', '.join(missing_packages)}")
        for package in missing_packages:
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
                print(f"✅ {package} instalado com sucesso")
            except subprocess.CalledProcessError:
                print(f"❌ Erro ao instalar {package}")
                return False
    
    return True

def main():
    print("🏦 SISTEMA DE CAIXA - MICROSERVIÇO PYTHON")
    print("=" * 50)
    print("📊 Especializado em cálculos financeiros")
    print("💰 Análises de fluxo de caixa")
    print("📈 Relatórios e comissões")
    print("=" * 50)
    
    # Verificar dependências
    print("\n🔍 Verificando dependências...")
    if not check_dependencies():
        print("❌ Erro nas dependências. Sistema não pode ser iniciado.")
        return 1
    
    print("\n✅ Todas as dependências OK!")
    
    # Verificar se o arquivo main.py existe
    if not os.path.exists('main.py'):
        print("❌ Arquivo main.py não encontrado!")
        return 1
    
    print("\n🚀 Iniciando Sistema de Caixa...")
    print("📍 URL: http://localhost:8002")
    print("📚 Documentação: http://localhost:8002/docs")
    print("⚡ Para parar: Ctrl+C")
    print("-" * 50)
    
    try:
        # Importar e executar o sistema
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=False)
    except KeyboardInterrupt:
        print("\n🛑 Sistema de Caixa finalizado pelo usuário")
        return 0
    except Exception as e:
        print(f"\n❌ Erro ao iniciar sistema: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())