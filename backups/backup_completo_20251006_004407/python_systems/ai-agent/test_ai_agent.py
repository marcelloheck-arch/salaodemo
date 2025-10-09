#!/usr/bin/env python3
"""
🧪 AI AGENT TESTER
Script de teste completo para validar todas as funcionalidades
"""

import asyncio
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path
from loguru import logger

# Adicionar diretório atual ao Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

class AIAgentTester:
    def __init__(self):
        self.test_results = []
        self.passed = 0
        self.failed = 0
    
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Registra resultado de um teste"""
        status = "✅ PASS" if success else "❌ FAIL"
        logger.info(f"{status} {test_name}")
        
        if details:
            logger.info(f"   📝 {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
        
        if success:
            self.passed += 1
        else:
            self.failed += 1
    
    async def test_imports(self):
        """Testa importação de todos os módulos"""
        logger.info("📦 Testando importações...")
        
        modules = [
            ('main', 'Módulo principal FastAPI'),
            ('ai_engine', 'Engine de IA conversacional'),
            ('whatsapp_connector', 'Conector WhatsApp'),
            ('scheduler_engine', 'Engine de agendamento'),
            ('calendar_manager', 'Gerenciador Calendar'),
            ('database_manager', 'Gerenciador Database'),
            ('mock_data_integration', 'Serviço de dados mock')
        ]
        
        for module_name, description in modules:
            try:
                __import__(module_name)
                self.log_test(f"Import {module_name}", True, description)
            except Exception as e:
                self.log_test(f"Import {module_name}", False, f"Erro: {e}")
    
    async def test_ai_engine(self):
        """Testa engine de IA"""
        logger.info("🧠 Testando AI Engine...")
        
        try:
            from ai_engine import AIConversationEngine
            
            ai_engine = AIConversationEngine()
            
            # Teste de detecção de intent
            test_messages = [
                ("Quero agendar um corte", "booking"),
                ("Que serviços vocês fazem?", "service_inquiry"),
                ("Qual o preço do corte?", "price_inquiry"),
                ("Oi", "greeting"),
                ("Obrigada", "goodbye")
            ]
            
            for message, expected_intent in test_messages:
                result = await ai_engine.detect_intent(message)
                intent_detected = result.get('intent', '').lower()
                
                success = expected_intent.lower() in intent_detected or intent_detected in expected_intent.lower()
                self.log_test(
                    f"Intent Detection: '{message}'",
                    success,
                    f"Esperado: {expected_intent}, Detectado: {intent_detected}"
                )
            
            # Teste de resposta
            response = await ai_engine.generate_response(
                "Quero agendar um corte",
                context={"client_name": "Maria"}
            )
            
            success = isinstance(response, dict) and 'message' in response
            self.log_test(
                "AI Response Generation",
                success,
                f"Resposta gerada: {response.get('message', '')[:50]}..."
            )
            
        except Exception as e:
            self.log_test("AI Engine", False, f"Erro: {e}")
    
    async def test_scheduler_engine(self):
        """Testa engine de agendamento"""
        logger.info("⚡ Testando Scheduler Engine...")
        
        try:
            from scheduler_engine import SmartScheduler
            
            scheduler = SmartScheduler()
            
            # Teste de verificação de disponibilidade
            tomorrow = datetime.now() + timedelta(days=1)
            availability = await scheduler.check_availability(
                service_type="corte",
                date=tomorrow.date(),
                duration=60
            )
            
            success = isinstance(availability, list) and len(availability) > 0
            self.log_test(
                "Availability Check",
                success,
                f"Encontrados {len(availability)} horários disponíveis"
            )
            
            if availability:
                # Teste de agendamento
                slot = availability[0]
                booking_result = await scheduler.create_booking(
                    service_type="corte",
                    client_name="João Teste",
                    client_phone="11987654321",
                    preferred_datetime=slot['datetime'],
                    staff_member=slot.get('staff_member')
                )
                
                success = booking_result.get('success', False)
                self.log_test(
                    "Create Booking",
                    success,
                    f"Agendamento: {booking_result.get('booking_id', 'N/A')}"
                )
            
        except Exception as e:
            self.log_test("Scheduler Engine", False, f"Erro: {e}")
    
    async def test_whatsapp_connector(self):
        """Testa conector WhatsApp"""
        logger.info("📱 Testando WhatsApp Connector...")
        
        try:
            from whatsapp_connector import WhatsAppConnector
            
            whatsapp = WhatsAppConnector()
            
            # Teste de processamento de mensagem
            mock_message = {
                "from": "11987654321",
                "text": "Quero agendar um corte",
                "timestamp": datetime.now().isoformat()
            }
            
            response = await whatsapp.process_message(mock_message)
            
            success = isinstance(response, dict) and 'message' in response
            self.log_test(
                "WhatsApp Message Processing",
                success,
                f"Processamento: {response.get('status', 'unknown')}"
            )
            
            # Teste de envio de mensagem (modo simulação)
            send_result = await whatsapp.send_message(
                phone="11987654321",
                message="Mensagem de teste"
            )
            
            success = send_result.get('sent', False) or send_result.get('simulated', False)
            self.log_test(
                "WhatsApp Send Message",
                success,
                f"Envio: {'Simulado' if send_result.get('simulated') else 'Real'}"
            )
            
        except Exception as e:
            self.log_test("WhatsApp Connector", False, f"Erro: {e}")
    
    async def test_calendar_manager(self):
        """Testa gerenciador de calendário"""
        logger.info("📅 Testando Calendar Manager...")
        
        try:
            from calendar_manager import GoogleCalendarManager
            
            calendar_mgr = GoogleCalendarManager()
            
            # Teste de criação de evento
            tomorrow = datetime.now() + timedelta(days=1)
            event_data = {
                "title": "Corte - João Teste",
                "start_time": tomorrow.replace(hour=14, minute=0),
                "end_time": tomorrow.replace(hour=15, minute=0),
                "description": "Agendamento de teste",
                "client_phone": "11987654321"
            }
            
            event_result = await calendar_mgr.create_event(event_data)
            
            success = event_result.get('created', False) or event_result.get('simulated', False)
            self.log_test(
                "Calendar Event Creation",
                success,
                f"Evento: {event_result.get('event_id', 'simulado')}"
            )
            
        except Exception as e:
            self.log_test("Calendar Manager", False, f"Erro: {e}")
    
    async def test_database_manager(self):
        """Testa gerenciador de banco de dados"""
        logger.info("🗄️ Testando Database Manager...")
        
        try:
            from database_manager import DatabaseManager
            
            db_mgr = DatabaseManager()
            
            # Teste de conexão
            connection_test = await db_mgr.test_connection()
            
            success = connection_test.get('connected', False)
            self.log_test(
                "Database Connection",
                success,
                f"Tipo: {connection_test.get('type', 'unknown')}"
            )
            
            # Teste de salvamento de agendamento
            booking_data = {
                "client_name": "Maria Teste",
                "client_phone": "11987654321",
                "service_type": "corte",
                "scheduled_datetime": datetime.now() + timedelta(days=1),
                "staff_member": "Marina",
                "status": "confirmed"
            }
            
            save_result = await db_mgr.save_booking(booking_data)
            
            success = save_result.get('saved', False)
            self.log_test(
                "Database Save Booking",
                success,
                f"ID: {save_result.get('booking_id', 'N/A')}"
            )
            
        except Exception as e:
            self.log_test("Database Manager", False, f"Erro: {e}")
    
    async def test_mock_data_integration(self):
        """Testa integração com dados mock"""
        logger.info("🎨 Testando Mock Data Integration...")
        
        try:
            from mock_data_integration import MockDataService
            
            mock_service = MockDataService()
            
            # Teste de dados de clientes
            clients = await mock_service.get_clients()
            
            success = isinstance(clients, list) and len(clients) > 0
            self.log_test(
                "Mock Data - Clients",
                success,
                f"Clientes carregados: {len(clients) if success else 0}"
            )
            
            # Teste de dados de serviços
            services = await mock_service.get_services()
            
            success = isinstance(services, list) and len(services) > 0
            self.log_test(
                "Mock Data - Services",
                success,
                f"Serviços disponíveis: {len(services) if success else 0}"
            )
            
            # Teste de analytics
            analytics = await mock_service.get_analytics_data()
            
            success = isinstance(analytics, dict) and 'revenue' in analytics
            self.log_test(
                "Mock Data - Analytics",
                success,
                f"Receita total: R$ {analytics.get('revenue', {}).get('total', 0):,.2f}"
            )
            
        except Exception as e:
            self.log_test("Mock Data Integration", False, f"Erro: {e}")
    
    async def test_complete_flow(self):
        """Testa fluxo completo de agendamento"""
        logger.info("🔄 Testando fluxo completo...")
        
        try:
            # Simular mensagem de WhatsApp completa
            from ai_engine import AIConversationEngine
            from scheduler_engine import SmartScheduler
            from whatsapp_connector import WhatsAppConnector
            
            # 1. Receber mensagem
            whatsapp = WhatsAppConnector()
            ai_engine = AIConversationEngine()
            scheduler = SmartScheduler()
            
            # 2. Processar intent
            user_message = "Oi, quero agendar um corte para amanhã de tarde"
            intent_result = await ai_engine.detect_intent(user_message)
            
            # 3. Verificar disponibilidade
            tomorrow = datetime.now() + timedelta(days=1)
            availability = await scheduler.check_availability(
                service_type="corte",
                date=tomorrow.date(),
                duration=60
            )
            
            # 4. Gerar resposta
            context = {
                "client_phone": "11999999999",
                "availability": availability[:3]  # Primeiros 3 horários
            }
            
            response = await ai_engine.generate_response(user_message, context)
            
            # 5. Validar fluxo
            success = (
                intent_result.get('intent') == 'booking' and
                len(availability) > 0 and
                isinstance(response, dict) and
                'message' in response
            )
            
            self.log_test(
                "Complete Booking Flow",
                success,
                f"Intent: {intent_result.get('intent')}, Slots: {len(availability)}"
            )
            
        except Exception as e:
            self.log_test("Complete Flow", False, f"Erro: {e}")
    
    def print_summary(self):
        """Exibe resumo dos testes"""
        total = self.passed + self.failed
        success_rate = (self.passed / total * 100) if total > 0 else 0
        
        summary = f"""
┌────────────────────────────────────────────────────────┐
│              🧪 RESULTADOS DOS TESTES - AI AGENT              │
│                                                        │
│  ✅ Testes Passaram: {self.passed:>2d}                              │
│  ❌ Testes Falharam:  {self.failed:>2d}                              │
│  📊 Taxa de Sucesso: {success_rate:>5.1f}%                         │
│                                                        │
│  Status: {'✅ SISTEMA PRONTO' if success_rate >= 80 else '⚠️ PRECISA AJUSTES' if success_rate >= 60 else '❌ PROBLEMAS CRÍTICOS':>20}                    │
└────────────────────────────────────────────────────────┘
"""
        print(summary)
        
        if success_rate >= 80:
            logger.success("🎆 AI Agent está pronto para uso!")
        elif success_rate >= 60:
            logger.warning("⚠️ AI Agent precisa de alguns ajustes")
        else:
            logger.error("❌ AI Agent tem problemas críticos")
        
        # Salvar relatório
        report = {
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total': total,
                'passed': self.passed,
                'failed': self.failed,
                'success_rate': success_rate
            },
            'tests': self.test_results
        }
        
        report_file = Path('test_report.json')
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        logger.info(f"📄 Relatório salvo: {report_file}")
    
    async def run_all_tests(self):
        """Executa todos os testes"""
        logger.info("🧪 Iniciando testes do AI Agent...")
        
        # Lista de testes
        tests = [
            self.test_imports,
            self.test_ai_engine,
            self.test_scheduler_engine,
            self.test_whatsapp_connector,
            self.test_calendar_manager,
            self.test_database_manager,
            self.test_mock_data_integration,
            self.test_complete_flow
        ]
        
        # Executar cada teste
        for test_func in tests:
            try:
                await test_func()
            except Exception as e:
                logger.error(f"❌ Erro no teste {test_func.__name__}: {e}")
        
        # Exibir resumo
        self.print_summary()

async def main():
    """Função principal de teste"""
    # Configurar logging
    logger.remove()
    logger.add(
        sys.stdout,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        level="INFO"
    )
    
    # Banner de início
    banner = """
┌────────────────────────────────────────────────────────┐
│              🧪 AI AGENT TESTER - AGENDA SALÃO              │
│                                                        │
│  Testando todas as funcionalidades do agente de IA     │
│  Validando integrações e fluxos de agendamento        │
│                                                        │
└────────────────────────────────────────────────────────┘
"""
    print(banner)
    
    # Executar testes
    tester = AIAgentTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("✅ Testes interrompidos pelo usuário")
    except Exception as e:
        logger.error(f"❌ Erro crítico nos testes: {e}")
        sys.exit(1)