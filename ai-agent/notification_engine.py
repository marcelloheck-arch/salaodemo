#!/usr/bin/env python3
"""
📱 NOTIFICATION ENGINE
Sistema de confirmações e lembretes automáticos
"""

import asyncio
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path
import schedule
from loguru import logger

class NotificationEngine:
    def __init__(self):
        self.data_file = Path("notifications_data.json")
        self.notifications_queue = []
        self.active_reminders = {}
        
        # Templates de mensagens
        self.templates = {
            "booking_confirmation": """✅ **AGENDAMENTO CONFIRMADO** ✅

🎯 **Serviço:** {service_name}
👤 **Cliente:** {client_name}
📅 **Data:** {date}
🕐 **Horário:** {time}
💆‍♀️ **Profissional:** {staff_member}
💰 **Valor:** R$ {price}

📍 **Salão Beleza Total**
📱 **Telefone:** (11) 9876-5432
📧 **Endereço:** Rua das Flores, 123

⚡ **Importante:**
• Chegue 10 min antes
• Cancele com 2h de antecedência
• Traga documento com foto

🌟 Mal posso esperar para te deixar ainda mais linda! ✨""",

            "reminder_24h": """⏰ **LEMBRETE - 24 HORAS** ⏰

Oi {client_name}! 😊

Amanhã você tem agendamento conosco:

🎯 **{service_name}**
📅 **{date} às {time}**
💆‍♀️ **Com {staff_member}**

📍 **Salão Beleza Total**
Rua das Flores, 123

✅ **Confirme sua presença** respondendo:
• SIM - para confirmar
• CANCELAR - para desmarcar

🌟 Te esperamos! ✨""",

            "reminder_2h": """🚨 **LEMBRETE - 2 HORAS** 🚨

Oi {client_name}! 

Seu horário é daqui a pouco:

🕐 **HOJE às {time}**
🎯 **{service_name}**
💆‍♀️ **{staff_member}**

📍 **Estamos te esperando!**
Salão Beleza Total
Rua das Flores, 123

⚡ Chegue 10 min antes!

🌟 Até já! ✨""",

            "no_show_followup": """😔 **SENTIMOS SUA FALTA** 😔

Oi {client_name},

Você tinha agendamento hoje às {time} e não compareceu.

🤔 **Aconteceu algum imprevisto?**

✨ **Reagende quando quiser:**
• Digite AGENDAR
• Escolha novo horário

💕 **Não fique assim!**
Queremos te deixar linda sempre! 🌟

📱 Responda quando puder! 😊""",

            "review_request": """🌟 **COMO FOI SEU ATENDIMENTO?** 🌟

Oi {client_name}! 

Esperamos que tenha amado seu:
🎯 **{service_name}** com {staff_member}

⭐ **Avalie nosso serviço:**
5⭐ - AMEI!
4⭐ - Muito bom
3⭐ - Bom
2⭐ - Regular  
1⭐ - Ruim

💬 **Deixe um comentário** (opcional)

🎁 **Próximo agendamento:**
Desconto de 10% até {discount_date}!

💕 Obrigada pela confiança! ✨""",

            "promotion": """🎉 **PROMOÇÃO ESPECIAL** 🎉

Oi {client_name}! 

{promo_title}

💰 **{discount}% OFF** em:
{services_list}

⏰ **Válido até:** {expiry_date}
📱 **Para agendar:** Digite QUERO

🌟 **Aproveite essa oportunidade!** ✨

💕 Te esperamos no salão! 😊""",

            "birthday": """🎂 **FELIZ ANIVERSÁRIO** 🎂

Parabéns, {client_name}! 🎉

🎁 **Seu presente de aniversário:**
• 20% OFF em qualquer serviço
• Válido por 30 dias
• Use o código: ANIVER{client_id}

✨ **Serviços disponíveis:**
• Corte + Escova
• Hidratação + Corte  
• Progressiva + Corte
• Pacote Completo

📱 **Agende já:** Digite ANIVERSARIO

💕 Que você tenha um ano incrível! 🌟""",

            "cancellation_confirmation": """❌ **CANCELAMENTO CONFIRMADO** ❌

Oi {client_name},

Seu agendamento foi cancelado:

📅 **{date} às {time}**
🎯 **{service_name}**

✅ **Nenhuma cobrança será feita**

🔄 **Reagendar?**
• Digite NOVO HORARIO
• Escolha data/hora

💕 **Te esperamos em breve!** 🌟

📱 Qualquer dúvida, é só chamar! 😊""",

            "reschedule_confirmation": """🔄 **REAGENDAMENTO CONFIRMADO** 🔄

Oi {client_name}! ✨

📅 **HORÁRIO ANTERIOR:** {old_date} às {old_time}
✅ **NOVO HORÁRIO:** {new_date} às {new_time}

🎯 **Serviço:** {service_name}
💆‍♀️ **Profissional:** {staff_member}
💰 **Valor:** R$ {price}

📍 **Salão Beleza Total**
Rua das Flores, 123

⏰ **Lembrete será enviado** 24h antes!

🌟 Te esperamos! 💕"""
        }
    
    async def initialize(self):
        """Inicializa o sistema de notificações"""
        try:
            # Carregar dados existentes
            await self.load_data()
            
            # Configurar agendamentos automáticos
            await self.setup_scheduled_tasks()
            
            logger.info("✅ Notification Engine inicializado")
            
        except Exception as e:
            logger.error(f"❌ Erro ao inicializar Notification Engine: {e}")
    
    async def load_data(self):
        """Carrega dados de notificações"""
        try:
            if self.data_file.exists():
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.active_reminders = data.get('active_reminders', {})
                    self.notifications_queue = data.get('notifications_queue', [])
            else:
                await self.save_data()
                
        except Exception as e:
            logger.error(f"❌ Erro ao carregar dados: {e}")
    
    async def save_data(self):
        """Salva dados de notificações"""
        try:
            data = {
                'active_reminders': self.active_reminders,
                'notifications_queue': self.notifications_queue,
                'last_update': datetime.now().isoformat()
            }
            
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            logger.error(f"❌ Erro ao salvar dados: {e}")
    
    async def send_booking_confirmation(self, booking_data: Dict) -> bool:
        """Envia confirmação de agendamento"""
        try:
            message = self.templates["booking_confirmation"].format(
                service_name=booking_data.get('service_name', 'Serviço'),
                client_name=booking_data.get('client_name', 'Cliente'),
                date=booking_data.get('date', ''),
                time=booking_data.get('time', ''),
                staff_member=booking_data.get('staff_member', 'Profissional'),
                price=booking_data.get('price', '0,00')
            )
            
            # Enviar via WhatsApp
            success = await self._send_whatsapp_message(
                phone=booking_data.get('client_phone'),
                message=message
            )
            
            if success:
                # Agendar lembretes automáticos
                await self.schedule_reminders(booking_data)
                logger.info(f"✅ Confirmação enviada para {booking_data.get('client_name')}")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Erro ao enviar confirmação: {e}")
            return False
    
    async def schedule_reminders(self, booking_data: Dict):
        """Agenda lembretes automáticos"""
        try:
            booking_datetime = datetime.fromisoformat(
                f"{booking_data.get('date')} {booking_data.get('time')}"
            )
            booking_id = booking_data.get('booking_id', f"booking_{int(datetime.now().timestamp())}")
            
            # Lembrete 24h antes
            reminder_24h = booking_datetime - timedelta(hours=24)
            if reminder_24h > datetime.now():
                await self._schedule_reminder(
                    booking_id=booking_id,
                    reminder_type="24h",
                    send_time=reminder_24h,
                    booking_data=booking_data
                )
            
            # Lembrete 2h antes
            reminder_2h = booking_datetime - timedelta(hours=2)
            if reminder_2h > datetime.now():
                await self._schedule_reminder(
                    booking_id=booking_id,
                    reminder_type="2h",
                    send_time=reminder_2h,
                    booking_data=booking_data
                )
            
            # Follow-up pós no-show (30 min após)
            followup_time = booking_datetime + timedelta(minutes=30)
            await self._schedule_reminder(
                booking_id=booking_id,
                reminder_type="no_show_check",
                send_time=followup_time,
                booking_data=booking_data
            )
            
            # Solicitação de avaliação (2h após)
            review_time = booking_datetime + timedelta(hours=2)
            await self._schedule_reminder(
                booking_id=booking_id,
                reminder_type="review_request",
                send_time=review_time,
                booking_data=booking_data
            )
            
            logger.info(f"✅ Lembretes agendados para booking {booking_id}")
            
        except Exception as e:
            logger.error(f"❌ Erro ao agendar lembretes: {e}")
    
    async def _schedule_reminder(self, booking_id: str, reminder_type: str, 
                                send_time: datetime, booking_data: Dict):
        """Agenda um lembrete específico"""
        reminder = {
            'booking_id': booking_id,
            'type': reminder_type,
            'send_time': send_time.isoformat(),
            'booking_data': booking_data,
            'status': 'scheduled',
            'created_at': datetime.now().isoformat()
        }
        
        reminder_key = f"{booking_id}_{reminder_type}"
        self.active_reminders[reminder_key] = reminder
        
        await self.save_data()
    
    async def send_24h_reminder(self, booking_data: Dict) -> bool:
        """Envia lembrete 24h antes"""
        try:
            message = self.templates["reminder_24h"].format(
                client_name=booking_data.get('client_name', 'Cliente'),
                service_name=booking_data.get('service_name', 'Serviço'),
                date=booking_data.get('date', ''),
                time=booking_data.get('time', ''),
                staff_member=booking_data.get('staff_member', 'Profissional')
            )
            
            return await self._send_whatsapp_message(
                phone=booking_data.get('client_phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro no lembrete 24h: {e}")
            return False
    
    async def send_2h_reminder(self, booking_data: Dict) -> bool:
        """Envia lembrete 2h antes"""
        try:
            message = self.templates["reminder_2h"].format(
                client_name=booking_data.get('client_name', 'Cliente'),
                service_name=booking_data.get('service_name', 'Serviço'),
                time=booking_data.get('time', ''),
                staff_member=booking_data.get('staff_member', 'Profissional')
            )
            
            return await self._send_whatsapp_message(
                phone=booking_data.get('client_phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro no lembrete 2h: {e}")
            return False
    
    async def send_no_show_followup(self, booking_data: Dict) -> bool:
        """Envia follow-up para no-show"""
        try:
            message = self.templates["no_show_followup"].format(
                client_name=booking_data.get('client_name', 'Cliente'),
                time=booking_data.get('time', '')
            )
            
            return await self._send_whatsapp_message(
                phone=booking_data.get('client_phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro no follow-up no-show: {e}")
            return False
    
    async def send_review_request(self, booking_data: Dict) -> bool:
        """Solicita avaliação do serviço"""
        try:
            discount_date = (datetime.now() + timedelta(days=30)).strftime('%d/%m/%Y')
            
            message = self.templates["review_request"].format(
                client_name=booking_data.get('client_name', 'Cliente'),
                service_name=booking_data.get('service_name', 'Serviço'),
                staff_member=booking_data.get('staff_member', 'Profissional'),
                discount_date=discount_date
            )
            
            return await self._send_whatsapp_message(
                phone=booking_data.get('client_phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro na solicitação de avaliação: {e}")
            return False
    
    async def send_birthday_message(self, client_data: Dict) -> bool:
        """Envia mensagem de aniversário"""
        try:
            message = self.templates["birthday"].format(
                client_name=client_data.get('name', 'Cliente'),
                client_id=client_data.get('id', '000')
            )
            
            return await self._send_whatsapp_message(
                phone=client_data.get('phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro na mensagem de aniversário: {e}")
            return False
    
    async def send_promotional_message(self, client_data: Dict, promo_data: Dict) -> bool:
        """Envia mensagem promocional"""
        try:
            services_list = "\n".join([f"• {service}" for service in promo_data.get('services', [])])
            
            message = self.templates["promotion"].format(
                client_name=client_data.get('name', 'Cliente'),
                promo_title=promo_data.get('title', 'Promoção Especial'),
                discount=promo_data.get('discount', 10),
                services_list=services_list,
                expiry_date=promo_data.get('expiry_date', '')
            )
            
            return await self._send_whatsapp_message(
                phone=client_data.get('phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro na mensagem promocional: {e}")
            return False
    
    async def send_cancellation_confirmation(self, booking_data: Dict) -> bool:
        """Confirma cancelamento"""
        try:
            message = self.templates["cancellation_confirmation"].format(
                client_name=booking_data.get('client_name', 'Cliente'),
                date=booking_data.get('date', ''),
                time=booking_data.get('time', ''),
                service_name=booking_data.get('service_name', 'Serviço')
            )
            
            # Cancelar lembretes agendados
            await self.cancel_reminders(booking_data.get('booking_id'))
            
            return await self._send_whatsapp_message(
                phone=booking_data.get('client_phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro na confirmação de cancelamento: {e}")
            return False
    
    async def send_reschedule_confirmation(self, old_booking: Dict, new_booking: Dict) -> bool:
        """Confirma reagendamento"""
        try:
            message = self.templates["reschedule_confirmation"].format(
                client_name=new_booking.get('client_name', 'Cliente'),
                old_date=old_booking.get('date', ''),
                old_time=old_booking.get('time', ''),
                new_date=new_booking.get('date', ''),
                new_time=new_booking.get('time', ''),
                service_name=new_booking.get('service_name', 'Serviço'),
                staff_member=new_booking.get('staff_member', 'Profissional'),
                price=new_booking.get('price', '0,00')
            )
            
            # Cancelar lembretes antigos e agendar novos
            await self.cancel_reminders(old_booking.get('booking_id'))
            await self.schedule_reminders(new_booking)
            
            return await self._send_whatsapp_message(
                phone=new_booking.get('client_phone'),
                message=message
            )
            
        except Exception as e:
            logger.error(f"❌ Erro na confirmação de reagendamento: {e}")
            return False
    
    async def cancel_reminders(self, booking_id: str):
        """Cancela lembretes de um agendamento"""
        try:
            keys_to_remove = [
                key for key in self.active_reminders.keys() 
                if key.startswith(booking_id)
            ]
            
            for key in keys_to_remove:
                del self.active_reminders[key]
                logger.info(f"✅ Lembrete cancelado: {key}")
            
            await self.save_data()
            
        except Exception as e:
            logger.error(f"❌ Erro ao cancelar lembretes: {e}")
    
    async def process_pending_reminders(self):
        """Processa lembretes pendentes"""
        try:
            current_time = datetime.now()
            processed_reminders = []
            
            for reminder_key, reminder in self.active_reminders.items():
                if reminder['status'] != 'scheduled':
                    continue
                
                send_time = datetime.fromisoformat(reminder['send_time'])
                
                if send_time <= current_time:
                    success = await self._process_single_reminder(reminder)
                    
                    if success:
                        reminder['status'] = 'sent'
                        reminder['sent_at'] = current_time.isoformat()
                    else:
                        reminder['status'] = 'failed'
                        reminder['failed_at'] = current_time.isoformat()
                    
                    processed_reminders.append(reminder_key)
            
            if processed_reminders:
                await self.save_data()
                logger.info(f"✅ Processados {len(processed_reminders)} lembretes")
            
        except Exception as e:
            logger.error(f"❌ Erro ao processar lembretes: {e}")
    
    async def _process_single_reminder(self, reminder: Dict) -> bool:
        """Processa um lembrete específico"""
        try:
            reminder_type = reminder['type']
            booking_data = reminder['booking_data']
            
            if reminder_type == "24h":
                return await self.send_24h_reminder(booking_data)
            elif reminder_type == "2h":
                return await self.send_2h_reminder(booking_data)
            elif reminder_type == "no_show_check":
                return await self.send_no_show_followup(booking_data)
            elif reminder_type == "review_request":
                return await self.send_review_request(booking_data)
            else:
                logger.warning(f"⚠️ Tipo de lembrete desconhecido: {reminder_type}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erro ao processar lembrete: {e}")
            return False
    
    async def _send_whatsapp_message(self, phone: str, message: str) -> bool:
        """Envia mensagem via WhatsApp"""
        try:
            # Importar connector apenas quando necessário
            from whatsapp_connector import WhatsAppConnector
            
            whatsapp = WhatsAppConnector()
            result = await whatsapp.send_message(to_number=phone, message=message)
            
            return result.get('sent', False) or result.get('simulated', False) or result.get('success', False)
            
        except Exception as e:
            logger.error(f"❌ Erro ao enviar WhatsApp: {e}")
            return False
    
    async def setup_scheduled_tasks(self):
        """Configura tarefas agendadas"""
        try:
            # Verificar lembretes a cada 5 minutos
            schedule.every(5).minutes.do(lambda: asyncio.create_task(self.process_pending_reminders()))
            
            # Verificar aniversários diariamente às 9h
            schedule.every().day.at("09:00").do(lambda: asyncio.create_task(self.check_birthdays()))
            
            # Enviar promoções semanalmente às sextas 15h
            schedule.every().friday.at("15:00").do(lambda: asyncio.create_task(self.send_weekly_promotions()))
            
            logger.info("✅ Tarefas agendadas configuradas")
            
        except Exception as e:
            logger.error(f"❌ Erro ao configurar tarefas: {e}")
    
    async def check_birthdays(self):
        """Verifica aniversários do dia"""
        try:
            from mock_data_integration import MockDataService
            
            mock_service = MockDataService()
            clients = await mock_service.get_clients()
            
            today = datetime.now()
            birthday_clients = []
            
            for client in clients:
                if 'birthday' in client:
                    birthday = datetime.strptime(client['birthday'], '%Y-%m-%d')
                    if birthday.month == today.month and birthday.day == today.day:
                        birthday_clients.append(client)
            
            for client in birthday_clients:
                await self.send_birthday_message(client)
                logger.info(f"🎂 Mensagem de aniversário enviada para {client.get('name')}")
            
        except Exception as e:
            logger.error(f"❌ Erro ao verificar aniversários: {e}")
    
    async def send_weekly_promotions(self):
        """Envia promoções semanais"""
        try:
            promo_data = {
                'title': 'Promoção de Sexta-feira!',
                'discount': 15,
                'services': ['Corte + Escova', 'Hidratação', 'Manicure'],
                'expiry_date': (datetime.now() + timedelta(days=7)).strftime('%d/%m/%Y')
            }
            
            from mock_data_integration import MockDataService
            mock_service = MockDataService()
            clients = await mock_service.get_clients()
            
            # Enviar para clientes ativos (últimos 60 dias)
            for client in clients[:10]:  # Limitar para teste
                await self.send_promotional_message(client, promo_data)
                await asyncio.sleep(2)  # Intervalo entre envios
            
            logger.info("✅ Promoções semanais enviadas")
            
        except Exception as e:
            logger.error(f"❌ Erro ao enviar promoções: {e}")
    
    async def get_reminder_stats(self) -> Dict:
        """Retorna estatísticas dos lembretes"""
        try:
            total_reminders = len(self.active_reminders)
            sent_reminders = sum(1 for r in self.active_reminders.values() if r['status'] == 'sent')
            failed_reminders = sum(1 for r in self.active_reminders.values() if r['status'] == 'failed')
            pending_reminders = sum(1 for r in self.active_reminders.values() if r['status'] == 'scheduled')
            
            return {
                'total_reminders': total_reminders,
                'sent_reminders': sent_reminders,
                'failed_reminders': failed_reminders,
                'pending_reminders': pending_reminders,
                'success_rate': (sent_reminders / total_reminders * 100) if total_reminders > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao gerar estatísticas: {e}")
            return {}

# Instância global
notification_engine = NotificationEngine()