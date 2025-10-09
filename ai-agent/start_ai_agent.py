#!/usr/bin/env python3
"""
🤖 AI AGENT STARTUP SCRIPT
Inicialização do Agente IA com todas as verificações necessárias
"""

import sys
import os
import asyncio
from pathlib import Path
from loguru import logger
from dotenv import load_dotenv

# Adicionar diretório atual ao Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Carregar variáveis de ambiente
load_dotenv()

async def check_dependencies():
    """Verifica dependências e configurações"""
    logger.info("🔍 Verificando dependências...")
    
    # Verificar Python
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        logger.error("❌ Python 3.8+ é necessário")
        return False
    
    logger.info(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Verificar módulos essenciais
    required_modules = [
        ('fastapi', 'FastAPI'),
        ('uvicorn', 'Uvicorn'),
        ('requests', 'Requests'),
        ('loguru', 'Loguru')
    ]
    
    missing_modules = []
    for module, name in required_modules:
        try:
            __import__(module)
            logger.info(f"✅ {name}")
        except ImportError:
            logger.error(f"❌ {name} não encontrado")
            missing_modules.append(name)
    
    if missing_modules:
        logger.error(f"❌ Módulos faltando: {', '.join(missing_modules)}")
        logger.info("💻 Execute: pip install -r requirements.txt")
        return False
    
    return True

async def check_configuration():
    """Verifica configurações opcionais"""
    logger.info("⚙️ Verificando configurações...")
    
    # Verificar configurações opcionais
    configs = {
        'OPENAI_API_KEY': 'OpenAI (IA avançada)',
        'WHATSAPP_ACCESS_TOKEN': 'WhatsApp Business API',
        'SUPABASE_URL': 'Supabase (Banco de dados)',
        'GOOGLE_CALENDAR_ID': 'Google Calendar'
    }
    
    configured_services = []
    simulation_services = []
    
    for env_var, service_name in configs.items():
        if os.getenv(env_var):
            configured_services.append(service_name)
            logger.info(f"✅ {service_name} configurado")
        else:
            simulation_services.append(service_name)
            logger.warning(f"⚠️ {service_name} em modo simulação")
    
    if configured_services:
        logger.info(f"🚀 Serviços ativos: {', '.join(configured_services)}")
    
    if simulation_services:
        logger.info(f"🎨 Simulação: {', '.join(simulation_services)}")
    
    return True

async def test_integrations():
    """Testa integrações com outros serviços"""
    logger.info("🔗 Testando integrações...")
    
    # Testar conexão com frontend
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3001')
    try:
        import requests
        response = requests.get(frontend_url, timeout=5)
        if response.status_code == 200:
            logger.info(f"✅ Frontend conectado ({frontend_url})")
        else:
            logger.warning(f"⚠️ Frontend responde com código {response.status_code}")
    except Exception as e:
        logger.info(f"ℹ️ Frontend em inicialização ou não disponível: {frontend_url}")
    
    # Testar conexão com analytics
    analytics_url = os.getenv('ANALYTICS_URL', 'http://localhost:8000')
    try:
        response = requests.get(f"{analytics_url}/health", timeout=5)
        if response.status_code == 200:
            logger.info(f"✅ Analytics API conectada ({analytics_url})")
        else:
            logger.warning(f"⚠️ Analytics API responde com código {response.status_code}")
    except Exception as e:
        logger.info(f"ℹ️ Analytics API em inicialização ou não disponível: {analytics_url}")
    
    return True

async def initialize_components():
    """Inicializa componentes do AI Agent"""
    logger.info("🚀 Inicializando componentes...")
    
    try:
        # Importar componentes essenciais primeiro
        from ai_engine import AIConversationEngine
        from whatsapp_connector import WhatsAppConnector
        from scheduler_engine import SmartScheduler
        from database_manager import DatabaseManager
        from mock_data_integration import MockDataService
        from notification_engine import NotificationEngine
        
        # Inicializar cada componente com tratamento de erro individual
        components = {
            'AI Engine': AIConversationEngine(),
            'WhatsApp Connector': WhatsAppConnector(),
            'Smart Scheduler': SmartScheduler(),
            'Database Manager': DatabaseManager(),
            'Mock Data Service': MockDataService(),
            'Notification Engine': NotificationEngine()
        }
        
        # Tentar importar componentes opcionais
        try:
            from calendar_manager import GoogleCalendarManager
            components['Calendar Manager'] = GoogleCalendarManager()
        except ImportError as e:
            logger.warning(f"⚠️ Google Calendar não disponível: {e}")
        
        initialized_count = 0
        failed_count = 0
        
        for name, component in components.items():
            try:
                if hasattr(component, 'initialize'):
                    await component.initialize()
                logger.info(f"✅ {name} inicializado")
                initialized_count += 1
            except Exception as e:
                logger.warning(f"⚠️ {name} erro na inicialização: {e}")
                failed_count += 1
        
        if initialized_count > 0:
            logger.info(f"✅ {initialized_count} componentes inicializados com sucesso")
            if failed_count > 0:
                logger.warning(f"⚠️ {failed_count} componentes em modo simulação")
            return True
        else:
            logger.error("❌ Nenhum componente foi inicializado")
            return False
        
    except Exception as e:
        logger.error(f"❌ Erro crítico na inicialização: {e}")
        return False

def print_startup_banner():
    """Exibe banner de inicialização"""
    banner = """
┌──────────────────────────────────────────────────────────┐
│            🤖 AI AGENT - AGENDA SALÃO DE BELEZA            │
│                                                          │
│  📱 Agendamento automático via WhatsApp                │
│  🧠 Processamento de linguagem natural               │
│  📅 Integração com Google Calendar                    │
│  ⚡ Otimização inteligente de horários               │
│  📊 Analytics em tempo real                         │
│                                                          │
│  🚀 Iniciando sistema...                             │
└──────────────────────────────────────────────────────────┘
"""
    print(banner)

async def main():
    """Função principal de inicialização"""
    print_startup_banner()
    
    # Configurar logging
    logger.remove()
    logger.add(
        sys.stdout,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=os.getenv('LOG_LEVEL', 'INFO')
    )
    
    # Verificar dependências
    if not await check_dependencies():
        logger.error("❌ Falha na verificação de dependências")
        return False
    
    # Verificar configurações
    await check_configuration()
    
    # Testar integrações
    await test_integrations()
    
    # Inicializar componentes
    if not await initialize_components():
        logger.error("❌ Falha na inicialização dos componentes")
        return False
    
    logger.info("✅ AI Agent inicializado com sucesso!")
    logger.info("🔗 API disponível em: http://localhost:8001")
    logger.info("📄 Documentação: http://localhost:8001/docs")
    logger.info("📱 WhatsApp Webhook: http://localhost:8001/webhook/whatsapp")
    logger.info("🎨 Simulação de chat: http://localhost:8001/chat/simulate")
    
    return True

if __name__ == "__main__":
    try:
        # Executar inicialização
        success = asyncio.run(main())
        
        if success:
            # Inicializar servidor FastAPI
            logger.info("🚀 Iniciando servidor FastAPI...")
            
            import uvicorn
            uvicorn.run(
                "main:app",
                host="0.0.0.0",
                port=8001,
                reload=True,
                log_level="info",
                access_log=True
            )
        else:
            logger.error("❌ Falha na inicialização - servidor não iniciado")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("✅ AI Agent finalizado pelo usuário")
    except Exception as e:
        logger.error(f"❌ Erro crítico: {e}")
        sys.exit(1)