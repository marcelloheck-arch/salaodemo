#!/usr/bin/env python3
"""
🗄️ DATABASE MANAGER
Gerenciamento de dados e persistência
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from loguru import logger
from dataclasses import dataclass, asdict
from supabase import create_client, Client

@dataclass
class Appointment:
    id: str
    client_name: str
    client_phone: str
    service_type: str
    service_name: str
    staff_id: str
    staff_name: str
    scheduled_date: str
    scheduled_time: str
    duration_minutes: int
    price: float
    status: str
    created_at: str
    notes: Optional[str] = None
    calendar_event_id: Optional[str] = None

class DatabaseManager:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.supabase: Optional[Client] = None
        
        # Fallback para arquivo local se Supabase não estiver configurado
        self.local_db_file = 'ai_agent_data.json'
        self.local_data = {
            'appointments': [],
            'clients': [],
            'conversations': [],
            'analytics': []
        }
        
    async def initialize(self):
        """Inicializa conexão com banco de dados"""
        try:
            if self.supabase_url and self.supabase_key:
                self.supabase = create_client(self.supabase_url, self.supabase_key)
                logger.info("✅ Supabase conectado")
            else:
                logger.warning("⚠️ Supabase não configurado - usando arquivo local")
                await self.load_local_data()
                
        except Exception as e:
            logger.error(f"❌ Erro ao conectar com banco: {e}")
            await self.load_local_data()
    
    async def load_local_data(self):
        """Carrega dados do arquivo local"""
        try:
            if os.path.exists(self.local_db_file):
                with open(self.local_db_file, 'r', encoding='utf-8') as f:
                    self.local_data = json.load(f)
                logger.info("✅ Dados locais carregados")
            else:
                await self.save_local_data()
                logger.info("✅ Arquivo de dados local criado")
        except Exception as e:
            logger.error(f"❌ Erro ao carregar dados locais: {e}")
    
    async def save_local_data(self):
        """Salva dados no arquivo local"""
        try:
            with open(self.local_db_file, 'w', encoding='utf-8') as f:
                json.dump(self.local_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"❌ Erro ao salvar dados locais: {e}")
    
    async def create_appointment(self, client_name: str, client_phone: str, 
                               service_type: str, scheduled_date: str, 
                               scheduled_time: str, **kwargs) -> str:
        """Cria novo agendamento"""
        try:
            appointment_id = f"apt_{datetime.now().timestamp()}"
            
            appointment_data = {
                "id": appointment_id,
                "client_name": client_name,
                "client_phone": client_phone,
                "service_type": service_type,
                "service_name": kwargs.get('service_name', service_type),
                "staff_id": kwargs.get('staff_id', 'staff_1'),
                "staff_name": kwargs.get('staff_name', 'Marina Souza'),
                "scheduled_date": scheduled_date,
                "scheduled_time": scheduled_time,
                "duration_minutes": kwargs.get('duration_minutes', 60),
                "price": kwargs.get('price', 45.0),
                "status": "confirmed",
                "created_at": datetime.now().isoformat(),
                "notes": kwargs.get('notes'),
                "calendar_event_id": kwargs.get('calendar_event_id')
            }
            
            if self.supabase:
                # Salvar no Supabase
                result = self.supabase.table('appointments').insert(appointment_data).execute()
                logger.info(f"✅ Agendamento salvo no Supabase: {appointment_id}")
            else:
                # Salvar localmente
                self.local_data['appointments'].append(appointment_data)
                await self.save_local_data()
                logger.info(f"✅ Agendamento salvo localmente: {appointment_id}")
            
            return appointment_id
            
        except Exception as e:
            logger.error(f"❌ Erro ao criar agendamento: {e}")
            raise e
    
    async def get_appointment(self, appointment_id: str) -> Optional[Dict]:
        """Busca agendamento por ID"""
        try:
            if self.supabase:
                result = self.supabase.table('appointments').select('*').eq('id', appointment_id).execute()
                return result.data[0] if result.data else None
            else:
                for appointment in self.local_data['appointments']:
                    if appointment['id'] == appointment_id:
                        return appointment
                return None
                
        except Exception as e:
            logger.error(f"❌ Erro ao buscar agendamento: {e}")
            return None
    
    async def update_appointment(self, appointment_id: str, updates: Dict) -> bool:
        """Atualiza agendamento"""
        try:
            updates['updated_at'] = datetime.now().isoformat()
            
            if self.supabase:
                result = self.supabase.table('appointments').update(updates).eq('id', appointment_id).execute()
                success = len(result.data) > 0
            else:
                success = False
                for i, appointment in enumerate(self.local_data['appointments']):
                    if appointment['id'] == appointment_id:
                        self.local_data['appointments'][i].update(updates)
                        await self.save_local_data()
                        success = True
                        break
            
            if success:
                logger.info(f"✅ Agendamento atualizado: {appointment_id}")
            
            return success
            
        except Exception as e:
            logger.error(f"❌ Erro ao atualizar agendamento: {e}")
            return False
    
    async def cancel_appointment(self, appointment_id: str, reason: str = None) -> bool:
        """Cancela agendamento"""
        return await self.update_appointment(appointment_id, {
            'status': 'cancelled',
            'cancellation_reason': reason,
            'cancelled_at': datetime.now().isoformat()
        })
    
    async def get_appointments_by_date(self, date: str, staff_id: str = None) -> List[Dict]:
        """Busca agendamentos por data"""
        try:
            if self.supabase:
                query = self.supabase.table('appointments').select('*').eq('scheduled_date', date)
                if staff_id:
                    query = query.eq('staff_id', staff_id)
                result = query.execute()
                return result.data
            else:
                appointments = []
                for appointment in self.local_data['appointments']:
                    if appointment['scheduled_date'] == date:
                        if not staff_id or appointment['staff_id'] == staff_id:
                            appointments.append(appointment)
                return appointments
                
        except Exception as e:
            logger.error(f"❌ Erro ao buscar agendamentos por data: {e}")
            return []
    
    async def get_appointments_by_phone(self, phone: str) -> List[Dict]:
        """Busca agendamentos por telefone"""
        try:
            if self.supabase:
                result = self.supabase.table('appointments').select('*').eq('client_phone', phone).execute()
                return result.data
            else:
                return [
                    appointment for appointment in self.local_data['appointments']
                    if appointment['client_phone'] == phone
                ]
                
        except Exception as e:
            logger.error(f"❌ Erro ao buscar agendamentos por telefone: {e}")
            return []
    
    async def save_conversation(self, phone: str, message: str, response: str, intent: str) -> bool:
        """Salva interação da conversa"""
        try:
            conversation_data = {
                "id": f"conv_{datetime.now().timestamp()}",
                "phone": phone,
                "user_message": message,
                "ai_response": response,
                "detected_intent": intent,
                "timestamp": datetime.now().isoformat()
            }
            
            if self.supabase:
                self.supabase.table('conversations').insert(conversation_data).execute()
            else:
                self.local_data['conversations'].append(conversation_data)
                await self.save_local_data()
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erro ao salvar conversa: {e}")
            return False
    
    async def get_client_history(self, phone: str) -> Dict:
        """Busca histórico completo do cliente"""
        try:
            appointments = await self.get_appointments_by_phone(phone)
            
            # Buscar conversas
            if self.supabase:
                conversations_result = self.supabase.table('conversations').select('*').eq('phone', phone).execute()
                conversations = conversations_result.data
            else:
                conversations = [
                    conv for conv in self.local_data['conversations']
                    if conv['phone'] == phone
                ]
            
            # Calcular métricas
            total_spent = sum(apt['price'] for apt in appointments if apt['status'] == 'completed')
            visit_count = len([apt for apt in appointments if apt['status'] == 'completed'])
            last_visit = max([apt['scheduled_date'] for apt in appointments], default=None)
            
            return {
                "phone": phone,
                "total_appointments": len(appointments),
                "completed_appointments": visit_count,
                "total_spent": total_spent,
                "average_ticket": total_spent / visit_count if visit_count > 0 else 0,
                "last_visit": last_visit,
                "appointments": appointments,
                "conversations_count": len(conversations),
                "client_segment": self.calculate_client_segment(total_spent, visit_count)
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar histórico do cliente: {e}")
            return {}
    
    def calculate_client_segment(self, total_spent: float, visit_count: int) -> str:
        """Calcula segmento do cliente baseado em RFM"""
        if total_spent >= 500 and visit_count >= 5:
            return "VIP"
        elif total_spent >= 200 and visit_count >= 3:
            return "Premium"
        elif visit_count >= 2:
            return "Regular"
        else:
            return "Novo"
    
    async def get_analytics_data(self, start_date: str, end_date: str) -> Dict:
        """Retorna dados para analytics"""
        try:
            # Buscar agendamentos no período
            if self.supabase:
                result = self.supabase.table('appointments').select('*').gte('scheduled_date', start_date).lte('scheduled_date', end_date).execute()
                appointments = result.data
            else:
                appointments = [
                    apt for apt in self.local_data['appointments']
                    if start_date <= apt['scheduled_date'] <= end_date
                ]
            
            # Calcular métricas
            total_appointments = len(appointments)
            completed_appointments = len([apt for apt in appointments if apt['status'] == 'completed'])
            cancelled_appointments = len([apt for apt in appointments if apt['status'] == 'cancelled'])
            total_revenue = sum(apt['price'] for apt in appointments if apt['status'] == 'completed')
            
            # Agrupamentos
            services_count = {}
            staff_performance = {}
            
            for apt in appointments:
                # Serviços
                service = apt['service_type']
                services_count[service] = services_count.get(service, 0) + 1
                
                # Performance por staff
                staff = apt['staff_name']
                if staff not in staff_performance:
                    staff_performance[staff] = {'appointments': 0, 'revenue': 0}
                staff_performance[staff]['appointments'] += 1
                if apt['status'] == 'completed':
                    staff_performance[staff]['revenue'] += apt['price']
            
            return {
                "period": {"start": start_date, "end": end_date},
                "summary": {
                    "total_appointments": total_appointments,
                    "completed_appointments": completed_appointments,
                    "cancelled_appointments": cancelled_appointments,
                    "completion_rate": (completed_appointments / total_appointments * 100) if total_appointments > 0 else 0,
                    "total_revenue": total_revenue,
                    "average_ticket": total_revenue / completed_appointments if completed_appointments > 0 else 0
                },
                "services_popularity": services_count,
                "staff_performance": staff_performance,
                "appointments": appointments
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao gerar dados de analytics: {e}")
            return {}
    
    async def health_check(self) -> str:
        """Verifica saúde do banco de dados"""
        try:
            if self.supabase:
                # Testar conexão
                result = self.supabase.table('appointments').select('id').limit(1).execute()
                return "supabase_connected"
            else:
                if os.path.exists(self.local_db_file):
                    return "local_file_ok"
                else:
                    return "local_file_missing"
        except:
            return "connection_error"