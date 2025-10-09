#!/usr/bin/env python3
"""
🧠 AI CONVERSATION ENGINE
Core de processamento conversacional com NLP avançado
"""

import openai
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from loguru import logger
import json
import os
from dataclasses import dataclass

@dataclass
class Intent:
    name: str
    confidence: float
    entities: Dict

class AIConversationEngine:
    def __init__(self):
        self.openai_client = None
        self.conversation_history = {}
        
        # Intents suportados
        self.intents = {
            "AGENDAR_SERVICO": ["agendar", "marcar", "quero fazer", "preciso", "gostaria"],
            "CONSULTAR_DISPONIBILIDADE": ["disponível", "horário", "quando", "que horas"],
            "CANCELAR_AGENDAMENTO": ["cancelar", "desmarcar", "não vou"],
            "REAGENDAR": ["remarcar", "mudar", "trocar horário"],
            "CONSULTAR_PRECO": ["quanto custa", "preço", "valor"],
            "SAUDACAO": ["oi", "olá", "bom dia", "boa tarde", "hey"],
            "DESPEDIDA": ["tchau", "obrigada", "até logo", "bye"]
        }
        
        # Serviços reconhecidos
        self.services = {
            "corte": ["corte", "cortar cabelo", "cortar"],
            "escova": ["escova", "escovar", "penteado"],
            "tintura": ["pintar", "tintura", "colorir", "cor"],
            "mechas": ["mechas", "luzes", "reflexos"],
            "hidratacao": ["hidratação", "hidratar", "tratamento"],
            "progressiva": ["progressiva", "alisar", "alisamento"],
            "sobrancelha": ["sobrancelha", "design"],
            "manicure": ["manicure", "unha", "esmalte"],
            "pedicure": ["pedicure", "pé"],
            "unhas_gel": ["gel", "unhas em gel", "alongamento"]
        }
    
    async def initialize(self):
        """Inicializa o engine de IA"""
        try:
            # Configurar OpenAI (se disponível)
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key:
                openai.api_key = api_key
                self.openai_client = openai
                logger.info("✅ OpenAI configurado")
            else:
                logger.warning("⚠️ OpenAI não configurado - usando NLP básico")
                
        except Exception as e:
            logger.error(f"❌ Erro ao inicializar AI Engine: {e}")
    
    async def process_message(self, message: str, context: any, user_phone: str) -> Dict:
        """Processa mensagem e retorna resposta inteligente"""
        try:
            # Detectar intent
            intent_result = self.detect_intent(message)
            intent = intent_result.get("intent")
            entities = intent_result.get("entities", {})
            
            # Gerar resposta baseada no intent
            response = await self.generate_response(message, context)
            
            return {
                "response_text": response.get("message", "Desculpe, não entendi. Pode repetir?"),
                "intent": intent,
                "entities": entities,
                "next_state": response.get("next_state", "waiting")
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao processar mensagem: {e}")
            return {
                "response_text": "Desculpe, não entendi. Pode repetir?",
                "intent": "UNKNOWN",
                "next_state": "error"
            }
    
    def detect_intent(self, message: str) -> Dict:
        """Detecta a intenção da mensagem"""
        message_lower = message.lower()
        best_intent = "UNKNOWN"
        best_confidence = 0.0
        
        # Buscar padrões nos intents
        for intent_name, keywords in self.intents.items():
            confidence = 0.0
            for keyword in keywords:
                if keyword in message_lower:
                    confidence += 1.0 / len(keywords)
            
            if confidence > best_confidence:
                best_confidence = confidence
                best_intent = intent_name
        
        return {
            "intent": best_intent,
            "confidence": best_confidence,
            "entities": self.extract_entities(message),
            "original_message": message
        }
    
    def extract_entities(self, message: str) -> Dict:
        """Extrai entidades da mensagem"""
        entities = {
            "services": [],
            "dates": [],
            "times": [],
            "names": []
        }
        
        message_lower = message.lower()
        
        # Detectar serviços
        for service, keywords in self.services.items():
            for keyword in keywords:
                if keyword in message_lower:
                    entities["services"].append(service)
        
        # Detectar datas (padrões simples)
        date_patterns = [
            r"(segunda|terça|quarta|quinta|sexta|sábado|domingo)",
            r"(amanhã|hoje|depois de amanhã)",
            r"(\d{1,2}[/\-]\d{1,2})",
            r"(dia \d{1,2})"
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, message_lower)
            entities["dates"].extend(matches)
        
        # Detectar horários
        time_patterns = [
            r"(\d{1,2}[:h]\d{0,2})",
            r"(\d{1,2}h)",
            r"(manhã|tarde|noite)"
        ]
        
        for pattern in time_patterns:
            matches = re.findall(pattern, message_lower)
            entities["times"].extend(matches)
        
        return entities
    
    async def generate_response(self, message: str, context: any = None) -> Dict:
        """Gera resposta contextual baseada na mensagem"""
        # Detectar intent e entidades
        intent_result = self.detect_intent(message)
        intent_name = intent_result.get("intent")
        entities = intent_result.get("entities", {})
        
        if intent_name == "SAUDACAO":
            return await self.handle_greeting(entities, context)
        
        elif intent_name == "AGENDAR_SERVICO":
            return await self.handle_booking_request(entities, context)
        
        elif intent_name == "CONSULTAR_DISPONIBILIDADE":
            return await self.handle_availability_query(entities, context)
        
        elif intent_name == "CONSULTAR_PRECO":
            return await self.handle_price_query(entities, context)
        
        elif intent_name == "CANCELAR_AGENDAMENTO":
            return await self.handle_cancellation(entities, context)
        
        elif intent_name == "DESPEDIDA":
            return await self.handle_goodbye(entities, context)
        
        else:
            return await self.handle_unknown_intent(message, context)
    
    async def handle_greeting(self, entities: Dict, context: any) -> Dict:
        """Resposta para saudações"""
        responses = [
            "Olá! 👋 Bem-vinda ao Salão Beleza Total! Como posso ajudar você hoje?",
            "Oi! 😊 Sou a assistente virtual do salão. Em que posso ajudar?",
            "Olá! ✨ Pronta para ficar ainda mais linda? Que serviço gostaria de agendar?"
        ]
        
        import random
        response = random.choice(responses)
        
        return {
            "message": response,
            "intent": "SAUDACAO",
            "next_state": "awaiting_service",
            "message_type": "text"
        }
    
    async def handle_booking_request(self, entities: Dict, context: any) -> Dict:
        """Processa solicitação de agendamento"""
        services = entities.get("services", [])
        
        if not services:
            response = """Que serviço você gostaria de agendar? Oferecemos:
            
✂️ Corte feminino - R$ 45
🎨 Tintura - R$ 120  
💫 Mechas - R$ 180
💆‍♀️ Hidratação - R$ 60
✨ Progressiva - R$ 200
💅 Manicure - R$ 30
👑 Sobrancelha - R$ 25

Digite o nome do serviço que deseja!"""
            
            return {
                "message": response,
                "intent": "AGENDAR_SERVICO",
                "next_state": "selecting_service",
                "booking_update": {"step": "service_selection"}
            }
        
        else:
            service_name = services[0]
            service_info = self.get_service_info(service_name)
            
            response = f"""Perfeito! {service_info['emoji']} {service_info['name']}
💰 Valor: R$ {service_info['price']}
⏰ Duração: {service_info['duration']} min

Qual dia você prefere? Temos disponibilidade:
📅 Segunda a Sábado
🕐 8h às 18h

Digite o dia da semana ou uma data!"""
            
            return {
                "message": response,
                "intent": "AGENDAR_SERVICO",
                "next_state": "selecting_date",
                "booking_update": {
                    "service": service_name,
                    "step": "date_selection"
                }
            }
    
    async def handle_availability_query(self, entities: Dict, context: any) -> Dict:
        """Consulta disponibilidade"""
        from scheduler_engine import SmartScheduler
        scheduler = SmartScheduler()
        
        # Simular consulta de disponibilidade
        today = datetime.now()
        tomorrow = today + timedelta(days=1)
        
        response = f"""📅 Disponibilidade para os próximos dias:

🗓️ Hoje ({today.strftime('%d/%m')}):
   • 14h00 - Marina
   • 16h30 - Carla

🗓️ Amanhã ({tomorrow.strftime('%d/%m')}):
   • 9h00 - Marina
   • 11h30 - Ana
   • 14h00 - Carla
   • 16h00 - Marina

Qual horário prefere? Digite o dia e horário!"""
        
        return {
            "message": response,
            "intent": "CONSULTAR_DISPONIBILIDADE",
            "next_state": "showing_availability"
        }
    
    async def handle_price_query(self, entities: Dict, context: any) -> Dict:
        """Consulta de preços"""
        services = entities.get("services", [])
        
        if services:
            service_name = services[0]
            service_info = self.get_service_info(service_name)
            response = f"{service_info['emoji']} {service_info['name']}: R$ {service_info['price']}"
        else:
            response = """💰 Tabela de Preços:

✂️ Corte Feminino - R$ 45
🎨 Tintura - R$ 120
💫 Mechas - R$ 180  
💆‍♀️ Hidratação - R$ 60
✨ Progressiva - R$ 200
💅 Manicure - R$ 30
🦶 Pedicure - R$ 35
👑 Sobrancelha - R$ 25
💎 Unhas em Gel - R$ 80

Qual serviço te interessa?"""
        
        return {
            "message": response,
            "intent": "CONSULTAR_PRECO",
            "next_state": "price_shown"
        }
    
    async def handle_cancellation(self, entities: Dict, context: any) -> Dict:
        """Cancelamento de agendamento"""
        response = """Para cancelar seu agendamento, preciso de algumas informações:

📱 Seu telefone ou nome
📅 Data do agendamento

Ou me envie o código de confirmação se tiver!"""
        
        return {
            "message": response,
            "intent": "CANCELAR_AGENDAMENTO",
            "next_state": "cancellation_process"
        }
    
    async def handle_goodbye(self, entities: Dict, context: any) -> Dict:
        """Despedida"""
        responses = [
            "Obrigada pelo contato! 😊 Até logo e volte sempre! ✨",
            "Foi um prazer atendê-la! 💕 Te esperamos no salão! 👋",
            "Tchau! 🌟 Qualquer dúvida, é só chamar! 📱"
        ]
        
        import random
        response = random.choice(responses)
        
        return {
            "message": response,
            "intent": "DESPEDIDA",
            "next_state": "conversation_ended"
        }
    
    async def handle_unknown_intent(self, message: str, context: any) -> Dict:
        """Intent não reconhecido"""
        responses = [
            "Não entendi muito bem 🤔 Você quer agendar um serviço? Digite 'AGENDAR'",
            "Desculpe, pode reformular? Para agendar, digite 'QUERO AGENDAR'",
            "Não compreendi. Precisa de ajuda com agendamento? Digite 'SIM'"
        ]
        
        import random
        response = random.choice(responses)
        
        return {
            "message": response,
            "intent": "UNKNOWN",
            "next_state": "clarification_needed"
        }
    
    def get_service_info(self, service_name: str) -> Dict:
        """Retorna informações do serviço"""
        service_data = {
            "corte": {"name": "Corte Feminino", "price": 45, "duration": 60, "emoji": "✂️"},
            "escova": {"name": "Escova", "price": 35, "duration": 45, "emoji": "💨"},
            "tintura": {"name": "Tintura", "price": 120, "duration": 120, "emoji": "🎨"},
            "mechas": {"name": "Mechas", "price": 180, "duration": 180, "emoji": "💫"},
            "hidratacao": {"name": "Hidratação", "price": 60, "duration": 90, "emoji": "💆‍♀️"},
            "progressiva": {"name": "Progressiva", "price": 200, "duration": 240, "emoji": "✨"},
            "sobrancelha": {"name": "Sobrancelha", "price": 25, "duration": 30, "emoji": "👑"},
            "manicure": {"name": "Manicure", "price": 30, "duration": 60, "emoji": "💅"},
            "pedicure": {"name": "Pedicure", "price": 35, "duration": 60, "emoji": "🦶"},
            "unhas_gel": {"name": "Unhas em Gel", "price": 80, "duration": 90, "emoji": "💎"}
        }
        
        return service_data.get(service_name, {
            "name": "Serviço", "price": 0, "duration": 60, "emoji": "💄"
        })
    
    async def health_check(self) -> str:
        """Verifica saúde do componente"""
        try:
            if self.openai_client:
                return "online_with_openai"
            else:
                return "online_basic_nlp"
        except:
            return "offline"