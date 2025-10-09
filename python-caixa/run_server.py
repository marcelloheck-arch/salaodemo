"""
Script simples para manter o serviço de Caixa ativo
"""
import os
import sys

# Adicionar o diretório atual ao path
sys.path.append('.')

# Configurar variáveis de ambiente
os.environ['PYTHONPATH'] = '.'

if __name__ == "__main__":
    import uvicorn
    from main import app
    
    print("🏦 INICIANDO SERVIÇO DE CAIXA PYTHON")
    print("📍 URL: http://localhost:8002")
    print("📊 Dados financeiros processados com Python")
    print("-" * 50)
    
    try:
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=8002,
            reload=False,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Serviço finalizado")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        input("Pressione Enter para fechar...")