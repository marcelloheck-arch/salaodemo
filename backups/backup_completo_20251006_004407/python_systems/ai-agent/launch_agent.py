#!/usr/bin/env python3
"""
🚀 AGENDA SALÃO - AI AGENT LAUNCHER
Script robusto para inicialização do AI Agent com verificação completa de dependências
"""

import os
import sys
import subprocess
import importlib
import asyncio
from pathlib import Path
from typing import List, Dict, Tuple

# Banner do sistema
BANNER = """
┌─────────────────────────────────────────────────────────────┐
│                🤖 AI AGENT - AGENDA SALÃO                    │
│                                                             │
│  🎯 Sistema Estabilizado de Agendamento Inteligente        │
│  📱 WhatsApp Business Integration                           │
│  🧠 Processamento de Linguagem Natural                     │
│  📅 Google Calendar Sync                                   │
│  ⚡ Scheduler Engine Optimizado                            │
│  📊 Analytics em Tempo Real                                │
│                                                             │
│  🔧 Versão: 2.0 - Estabilizada                            │
└─────────────────────────────────────────────────────────────┘
"""

class AIAgentLauncher:
    def __init__(self):
        self.required_packages = [
            'fastapi',
            'uvicorn', 
            'requests',
            'loguru',
            'schedule',
            'apscheduler'
        ]
        
        self.optional_packages = [
            'openai',
            'google',
            'pandas',
            'numpy'
        ]
        
        self.errors = []
        self.warnings = []
        
    def print_banner(self):
        """Exibe banner do sistema"""
        print(BANNER)
        
    def check_python_version(self) -> bool:
        """Verifica versão do Python"""
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 8):
            self.errors.append(f"❌ Python 3.8+ necessário. Atual: {version.major}.{version.minor}")
            return False
        
        print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
        return True
        
    def check_package(self, package_name: str) -> bool:
        """Verifica se um pacote está instalado"""
        try:
            importlib.import_module(package_name)
            return True
        except ImportError:
            return False
            
    def install_package(self, package_name: str) -> bool:
        """Instala um pacote via pip"""
        try:
            print(f"📦 Instalando {package_name}...")
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", package_name
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
        except subprocess.CalledProcessError:
            return False
            
    def check_and_install_dependencies(self) -> bool:
        """Verifica e instala dependências necessárias"""
        print("🔍 Verificando dependências...")
        
        all_ok = True
        
        # Pacotes obrigatórios
        for package in self.required_packages:
            if self.check_package(package):
                print(f"✅ {package}")
            else:
                print(f"⚠️ {package} não encontrado - instalando...")
                if self.install_package(package):
                    print(f"✅ {package} instalado")
                else:
                    self.errors.append(f"❌ Falha ao instalar {package}")
                    all_ok = False
                    
        # Pacotes opcionais
        for package in self.optional_packages:
            if self.check_package(package):
                print(f"✅ {package} (opcional)")
            else:
                self.warnings.append(f"⚠️ {package} não disponível (modo básico)")
                
        return all_ok
        
    def check_environment(self) -> Dict[str, bool]:
        """Verifica configurações do ambiente"""
        print("⚙️ Verificando configurações...")
        
        configs = {
            'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY') is not None,
            'WHATSAPP_ACCESS_TOKEN': os.getenv('WHATSAPP_ACCESS_TOKEN') is not None,
            'SUPABASE_URL': os.getenv('SUPABASE_URL') is not None,
            'GOOGLE_CALENDAR_ID': os.getenv('GOOGLE_CALENDAR_ID') is not None
        }
        
        configured = sum(configs.values())
        total = len(configs)
        
        if configured == 0:
            print("🎨 Modo Simulação Completa (todas as integrações)")
        else:
            print(f"🔗 {configured}/{total} integrações configuradas")
            
        return configs
        
    def test_ports(self) -> bool:
        """Testa se as portas necessárias estão disponíveis"""
        import socket
        
        ports_to_test = [8001]  # AI Agent port
        
        for port in ports_to_test:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                self.warnings.append(f"⚠️ Porta {port} já está em uso")
                return False
                
        print("✅ Portas disponíveis")
        return True
        
    def check_files(self) -> bool:
        """Verifica se arquivos necessários existem"""
        required_files = [
            'main.py',
            'ai_engine.py', 
            'whatsapp_connector.py',
            'scheduler_engine.py'
        ]
        
        missing_files = []
        for file in required_files:
            if not Path(file).exists():
                missing_files.append(file)
                
        if missing_files:
            self.errors.append(f"❌ Arquivos não encontrados: {', '.join(missing_files)}")
            return False
            
        print("✅ Arquivos do sistema verificados")
        return True
        
    async def test_integrations(self) -> bool:
        """Testa integrações externas"""
        print("🔗 Testando integrações...")
        
        # Test frontend connection
        try:
            import requests
            response = requests.get("http://localhost:3001", timeout=3)
            if response.status_code == 200:
                print("✅ Frontend conectado")
            else:
                self.warnings.append("⚠️ Frontend não disponível")
        except:
            self.warnings.append("⚠️ Frontend não disponível")
            
        # Test analytics API
        try:
            response = requests.get("http://localhost:8000", timeout=3)
            if response.status_code == 200:
                print("✅ Analytics API conectada")
            else:
                self.warnings.append("⚠️ Analytics API não disponível")
        except:
            self.warnings.append("⚠️ Analytics API não disponível")
            
        return True
        
    def start_ai_agent(self) -> bool:
        """Inicia o AI Agent"""
        print("🚀 Iniciando AI Agent...")
        
        try:
            # Import main AI Agent
            from main import app
            import uvicorn
            
            print("✅ AI Agent iniciado com sucesso!")
            print("🔗 API disponível em: http://localhost:8001")
            print("📄 Documentação: http://localhost:8001/docs")
            print("📱 WhatsApp Webhook: http://localhost:8001/webhook/whatsapp")
            print("🎨 Simulação de chat: http://localhost:8001/chat/simulate")
            print("\n💡 Pressione Ctrl+C para parar o servidor")
            
            # Rodar servidor de forma síncrona
            uvicorn.run(
                app,
                host="0.0.0.0",
                port=8001,
                reload=True,
                reload_dirs=["."],
                log_level="info"
            )
            return True
            
        except ImportError as e:
            self.errors.append(f"❌ Erro ao importar módulos: {e}")
            return False
        except Exception as e:
            self.errors.append(f"❌ Erro ao iniciar servidor: {e}")
            return False
            
    def show_summary(self):
        """Mostra resumo da inicialização"""
        print("\n" + "="*60)
        print("📋 RESUMO DA INICIALIZAÇÃO")
        print("="*60)
        
        if self.errors:
            print("❌ ERROS:")
            for error in self.errors:
                print(f"   {error}")
                
        if self.warnings:
            print("⚠️ AVISOS:")
            for warning in self.warnings:
                print(f"   {warning}")
                
        if not self.errors:
            print("✅ Sistema pronto para uso!")

def main():
    """Função principal"""
    launcher = AIAgentLauncher()
    launcher.print_banner()
    
    try:
        # Executar verificações assíncronas primeiro
        async def run_checks():
            # Verificações básicas
            if not launcher.check_python_version():
                launcher.show_summary()
                return False
                
            if not launcher.check_and_install_dependencies():
                launcher.show_summary()
                return False
                
            if not launcher.check_files():
                launcher.show_summary()
                return False
                
            # Verificações opcionais
            launcher.check_environment()
            launcher.test_ports()
            await launcher.test_integrations()
            
            # Mostrar resumo
            launcher.show_summary()
            
            if launcher.errors:
                print(f"\n❌ {len(launcher.errors)} erro(s) encontrado(s). Corrigir antes de continuar.")
                return False
                
            return True
        
        # Executar verificações
        checks_ok = asyncio.run(run_checks())
        
        if not checks_ok:
            sys.exit(1)
            
        # Iniciar sistema
        print(f"\n⚠️ {len(launcher.warnings)} aviso(s) - sistema rodará em modo simulação")
        launcher.start_ai_agent()
        
    except KeyboardInterrupt:
        print("\n\n👋 AI Agent finalizado pelo usuário")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()