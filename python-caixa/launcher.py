"""
Launcher definitivo para o Sistema de Caixa Python
"""
import sys
import os
import subprocess

def main():
    print("🏦 SISTEMA DE CAIXA - LAUNCHER PYTHON")
    print("=" * 50)
    
    # Verificar se estamos no diretório correto
    if not os.path.exists('main.py'):
        print("❌ Arquivo main.py não encontrado!")
        print("Execute este script do diretório python-caixa")
        return 1
    
    print("📂 Diretório: OK")
    print("📍 Iniciando na porta 8002...")
    print("🔄 O servidor manterá execução até ser interrompido")
    print("-" * 50)
    
    try:
        # Executar uvicorn diretamente como subprocess
        cmd = [
            sys.executable, 
            "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8002",
            "--reload", "False"
        ]
        
        subprocess.run(cmd, cwd=os.getcwd())
        
    except KeyboardInterrupt:
        print("\n🛑 Sistema finalizado pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        input("Pressione Enter para fechar...")

if __name__ == "__main__":
    main()