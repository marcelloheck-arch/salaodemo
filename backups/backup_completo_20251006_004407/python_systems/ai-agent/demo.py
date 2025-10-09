#!/usr/bin/env python3
"""
🎬 AI AGENT DEMO
Demonstração interativa das funcionalidades do AI Agent
"""

import asyncio
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Adicionar diretório atual ao Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

class AIAgentDemo:
    def __init__(self):
        self.scenarios = [
            {
                'name': '🎯 Agendamento Simples',
                'description': 'Cliente quer agendar um corte',
                'messages': [
                    'Oi, quero agendar um corte',
                    'Pode ser amanhã de tarde',
                    'Às 14h está bom'
                ]
            },
            {
                'name': '💄 Múltiplos Serviços',
                'description': 'Cliente quer corte + escova',
                'messages': [
                    'Quero cortar e fazer escova',
                    'Tem para hoje?',
                    'E qual o preço total?'
                ]
            },
            {
                'name': '📅 Reagendamento',
                'description': 'Cliente quer remarcar horário',
                'messages': [
                    'Preciso remarcar meu horário',
                    'Tenho agendado para hoje às 15h',
                    'Pode ser na quinta?'
                ]
            },
            {
                'name': '❓ Informações',
                'description': 'Cliente quer saber sobre serviços',
                'messages': [
                    'Que serviços vocês fazem?',
                    'Qual o preço do corte feminino?',
                    'Vocês fazem progressiva?'
                ]
            }
        ]
    
    def print_banner(self):
        """Exibe banner de demonstração"""
        banner = """
┌────────────────────────────────────────────────────────┐
│           🎬 AI AGENT DEMO - AGENDA SALÃO              │
│                                                        │
│  Demonstração interativa do agente conversacional     │
│  Simule conversas reais de agendamento via WhatsApp   │
│                                                        │
└────────────────────────────────────────────────────────┘
"""
        print(banner)
    
    async def simulate_conversation(self, scenario: dict):
        """Simula uma conversa completa"""
        print(f"\n🎯 {scenario['name']}")
        print(f"📝 {scenario['description']}")
        print("=" * 60)
        
        try:
            # Importar componentes necessários
            from ai_engine import AIConversationEngine
            from whatsapp_connector import WhatsAppConnector
            from scheduler_engine import SmartScheduler
            
            ai_engine = AIConversationEngine()
            whatsapp = WhatsAppConnector()
            scheduler = SmartScheduler()
            
            conversation_context = {
                'client_phone': '11999887766',
                'client_name': 'Cliente Demo',
                'conversation_history': []
            }
            
            for i, message in enumerate(scenario['messages'], 1):
                print(f"\n👤 Cliente: {message}")
                
                # Detectar intent
                intent_result = ai_engine.detect_intent(message)  # Removido await
                intent = intent_result.get('intent', 'unknown')
                entities = intent_result.get('entities', {})
                
                print(f"🧠 Intent detectado: {intent}")
                if entities:
                    print(f"📋 Entidades: {entities}")
                
                # Se for agendamento, verificar disponibilidade
                if intent == 'booking':
                    tomorrow = datetime.now() + timedelta(days=1)
                    availability = await scheduler.check_availability(
                        service_type=entities.get('service_type', 'corte'),
                        date=tomorrow.date(),
                        duration=60
                    )
                    conversation_context['availability'] = availability[:3]
                
                # Gerar resposta
                response = await ai_engine.generate_response(
                    message, 
                    conversation_context
                )
                
                # Simular envio via WhatsApp
                ai_message = response.get('message', 'Desculpe, não entendi.')
                await whatsapp.send_message(
                    phone_number=conversation_context['client_phone'],  # Corrigido parâmetro
                    message=ai_message
                )
                
                print(f"🤖 AI Agent: {ai_message}")
                
                # Atualizar histórico
                conversation_context['conversation_history'].append({
                    'user': message,
                    'assistant': ai_message,
                    'intent': intent,
                    'timestamp': datetime.now().isoformat()
                })
                
                # Pausa dramática
                await asyncio.sleep(1)
            
            print("\n✅ Conversa concluída!")
            
        except Exception as e:
            print(f"❌ Erro na simulação: {e}")
    
    async def run_interactive_demo(self):
        """Executa demonstração interativa"""
        self.print_banner()
        
        print("🚀 Escolha um cenário para demonstrar:")
        print()
        
        for i, scenario in enumerate(self.scenarios, 1):
            print(f"{i}. {scenario['name']}")
            print(f"   {scenario['description']}")
            print()
        
        print("0. ⚡ Executar todos os cenários")
        print("q. 🚪 Sair")
        print()
        
        while True:
            try:
                choice = input("👉 Digite sua escolha: ").strip().lower()
                
                if choice == 'q':
                    print("👋 Até logo!")
                    break
                elif choice == '0':
                    print("\n🎬 Executando todos os cenários...")
                    for scenario in self.scenarios:
                        await self.simulate_conversation(scenario)
                        input("\nPressione Enter para continuar...")
                    break
                else:
                    try:
                        scenario_index = int(choice) - 1
                        if 0 <= scenario_index < len(self.scenarios):
                            await self.simulate_conversation(self.scenarios[scenario_index])
                            
                            # Perguntar se quer continuar
                            continue_choice = input("\n🔄 Quer executar outro cenário? (s/n): ").strip().lower()
                            if continue_choice not in ['s', 'sim', 'y', 'yes']:
                                break
                        else:
                            print("❌ Opção inválida!")
                    except ValueError:
                        print("❌ Digite um número válido!")
                        
            except KeyboardInterrupt:
                print("\n👋 Demo interrompida!")
                break
            except Exception as e:
                print(f"❌ Erro: {e}")
    
    async def test_components(self):
        """Testa componentes básicos"""
        print("\n🔧 Testando componentes...")
        
        try:
            # Testar importações
            components = [
                'main',
                'ai_engine', 
                'whatsapp_connector',
                'scheduler_engine',
                'calendar_manager',
                'database_manager',
                'mock_data_integration'
            ]
            
            for component in components:
                try:
                    __import__(component)
                    print(f"✅ {component}")
                except Exception as e:
                    print(f"❌ {component}: {e}")
            
            print("\n🎯 Teste básico de IA...")
            
            from ai_engine import AIConversationEngine
            ai_engine = AIConversationEngine()
            
            test_message = "Quero agendar um corte"
            result = ai_engine.detect_intent(test_message)  # Removido await
            
            print(f"📝 Mensagem: {test_message}")
            print(f"🧠 Intent: {result.get('intent', 'unknown')}")
            print(f"📊 Confidence: {result.get('confidence', 0):.2f}")
            
            return True
            
        except Exception as e:
            print(f"❌ Erro no teste: {e}")
            return False

async def main():
    """Função principal"""
    demo = AIAgentDemo()
    
    # Testar componentes primeiro
    components_ok = await demo.test_components()
    
    if components_ok:
        print("\n🎉 Componentes OK! Iniciando demo...")
        await demo.run_interactive_demo()
    else:
        print("\n⚠️ Alguns componentes têm problemas.")
        print("💡 Dica: Execute 'python start_ai_agent.py' para verificar dependências")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Demo finalizada!")
    except Exception as e:
        print(f"❌ Erro crítico: {e}")