#!/usr/bin/env python3
"""
📱 WHATSAPP CONNECTOR
Integração com WhatsApp Business API
"""

import requests
import os
from typing import Dict, Optional
from loguru import logger
import json
from datetime import datetime

class WhatsAppConnector:
    def __init__(self):
        self.access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
        self.phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
        self.verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "agenda_salao_verify")
        self.api_version = "v18.0"
        self.base_url = f"https://graph.facebook.com/{self.api_version}"
        
    async def initialize(self):
        """Inicializa o conector WhatsApp"""
        try:
            if not self.access_token:
                logger.warning("⚠️ WhatsApp Access Token não configurado - modo simulação")
                return
                
            # Testar conexão
            await self.test_connection()
            logger.info("✅ WhatsApp Business API conectado")
            
        except Exception as e:
            logger.error(f"❌ Erro ao inicializar WhatsApp: {e}")
    
    async def test_connection(self) -> bool:
        """Testa conexão com a API"""
        try:
            if not self.access_token:
                return False
                
            url = f"{self.base_url}/{self.phone_number_id}"
            headers = {
                "Authorization": f"Bearer {self.access_token}"
            }
            
            response = requests.get(url, headers=headers)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"❌ Teste de conexão WhatsApp falhou: {e}")
            return False
    
    async def send_message(self, to_number: str, message: str, message_type: str = "text") -> Dict:
        """Envia mensagem via WhatsApp"""
        try:
            if not self.access_token:
                # Modo simulação
                logger.info(f"📱 [SIMULAÇÃO] Para {to_number}: {message}")
                return {
                    "success": True,
                    "message_id": f"sim_{datetime.now().timestamp()}",
                    "status": "sent_simulation"
                }
            
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            # Payload baseado no tipo de mensagem
            if message_type == "text":
                payload = {
                    "messaging_product": "whatsapp",
                    "to": to_number,
                    "type": "text",
                    "text": {
                        "body": message
                    }
                }
            
            elif message_type == "template":
                payload = {
                    "messaging_product": "whatsapp",
                    "to": to_number,
                    "type": "template",
                    "template": {
                        "name": "agendamento_confirmado",
                        "language": {
                            "code": "pt_BR"
                        }
                    }
                }
            
            else:
                # Fallback para texto
                payload = {
                    "messaging_product": "whatsapp",
                    "to": to_number,
                    "type": "text",
                    "text": {
                        "body": message
                    }
                }
            
            response = requests.post(url, headers=headers, json=payload)
            response_data = response.json()
            
            if response.status_code == 200:
                logger.info(f"✅ Mensagem enviada para {to_number}")
                return {
                    "success": True,
                    "message_id": response_data.get("messages", [{}])[0].get("id"),
                    "status": "sent"
                }
            else:
                logger.error(f"❌ Erro ao enviar mensagem: {response_data}")
                return {
                    "success": False,
                    "error": response_data,
                    "status": "failed"
                }
                
        except Exception as e:
            logger.error(f"❌ Erro no WhatsApp Connector: {e}")
            return {
                "success": False,
                "error": str(e),
                "status": "error"
            }
    
    async def send_confirmation_message(self, to_number: str, booking_details: Dict) -> Dict:
        """Envia mensagem de confirmação de agendamento"""
        message = f"""✅ *Agendamento Confirmado!*

📅 *Data:* {booking_details.get('date')}
🕐 *Horário:* {booking_details.get('time')}
💄 *Serviço:* {booking_details.get('service')}
👩‍💼 *Profissional:* {booking_details.get('staff')}
💰 *Valor:* R$ {booking_details.get('price')}

📍 *Salão Beleza Total*
Rua das Flores, 123 - Centro

📱 *Lembrete:* Você receberá uma mensagem 2h antes do seu horário.

❌ *Para cancelar:* Digite CANCELAR {booking_details.get('booking_code', 'XXXX')}

Obrigada por escolher nosso salão! ✨"""
        
        return await self.send_message(to_number, message, "text")
    
    async def send_reminder_message(self, to_number: str, booking_details: Dict, hours_before: int = 2) -> Dict:
        """Envia lembrete de agendamento"""
        message = f"""⏰ *Lembrete de Agendamento*

Olá! Você tem um agendamento em {hours_before}h:

📅 *Hoje* às {booking_details.get('time')}
💄 *{booking_details.get('service')}* com {booking_details.get('staff')}

📍 Salão Beleza Total
Rua das Flores, 123

✅ Confirme digitando: OK
❌ Para cancelar: CANCELAR

Te esperamos! 😊"""
        
        return await self.send_message(to_number, message, "text")
    
    async def send_promotional_message(self, to_number: str, promotion: Dict) -> Dict:
        """Envia mensagem promocional personalizada"""
        message = f"""🎉 *Oferta Especial para Você!*

{promotion.get('title', 'Promoção')}

💰 *{promotion.get('discount', '20')}% de desconto*
⏰ *Válido até:* {promotion.get('valid_until')}
💄 *Serviços:* {promotion.get('services', 'Todos')}

📱 Para agendar: Digite QUERO

Não perca! ✨"""
        
        return await self.send_message(to_number, message, "text")
    
    def verify_webhook(self, mode: str, token: str, challenge: str) -> Optional[int]:
        """Verifica webhook do WhatsApp"""
        if mode == "subscribe" and token == self.verify_token:
            logger.info("✅ Webhook WhatsApp verificado")
            return int(challenge)
        else:
            logger.warning("❌ Falha na verificação do webhook")
            return None
    
    def parse_webhook_message(self, webhook_data: Dict) -> Optional[Dict]:
        """Extrai dados da mensagem do webhook"""
        try:
            entry = webhook_data.get("entry", [])[0]
            changes = entry.get("changes", [])[0]
            value = changes.get("value", {})
            messages = value.get("messages", [])
            
            if not messages:
                return None
            
            message = messages[0]
            
            # Extrair dados básicos
            message_data = {
                "from": message.get("from"),
                "id": message.get("id"),
                "timestamp": message.get("timestamp"),
                "type": message.get("type", "text")
            }
            
            # Extrair conteúdo baseado no tipo
            if message_data["type"] == "text":
                message_data["text"] = message.get("text", {}).get("body", "")
            
            elif message_data["type"] == "button":
                message_data["button_text"] = message.get("button", {}).get("text", "")
                message_data["button_payload"] = message.get("button", {}).get("payload", "")
            
            # Informações do contato
            contacts = value.get("contacts", [])
            if contacts:
                contact = contacts[0]
                message_data["contact_name"] = contact.get("profile", {}).get("name", "")
            
            return message_data
            
        except Exception as e:
            logger.error(f"❌ Erro ao processar webhook: {e}")
            return None
    
    async def health_check(self) -> str:
        """Verifica saúde do componente"""
        try:
            if await self.test_connection():
                return "connected"
            else:
                return "simulation_mode"
        except:
            return "offline"