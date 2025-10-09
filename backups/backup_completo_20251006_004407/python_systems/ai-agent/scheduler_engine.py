#!/usr/bin/env python3
"""
⚡ SMART SCHEDULER ENGINE
Otimização inteligente de horários e disponibilidade
"""

from datetime import datetime, timedelta, time
from typing import Dict, List, Optional, Tuple
from loguru import logger
import json
import random
from dataclasses import dataclass
from enum import Enum

class DayOfWeek(Enum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6

@dataclass
class TimeSlot:
    start_time: datetime
    end_time: datetime
    staff_id: str
    staff_name: str
    available: bool = True
    service_type: Optional[str] = None
    client_name: Optional[str] = None

@dataclass
class ServiceInfo:
    id: str
    name: str
    duration_minutes: int
    price: float
    required_skills: List[str]
    popularity_score: float

class SmartScheduler:
    def __init__(self):
        # Horário de funcionamento
        self.opening_time = time(8, 0)  # 8:00
        self.closing_time = time(18, 0)  # 18:00
        self.slot_duration = 30  # 30 minutos por slot
        
        # Dias de funcionamento (Segunda a Sábado)
        self.working_days = [0, 1, 2, 3, 4, 5]  # 0=Segunda, 5=Sábado
        
        # Profissionais e especialidades
        self.staff = {
            "staff_1": {
                "name": "Marina Souza",
                "skills": ["corte", "tintura", "mechas"],
                "working_days": [0, 1, 2, 3, 4, 5],
                "working_hours": {"start": time(8, 0), "end": time(18, 0)},
                "efficiency_rating": 0.95
            },
            "staff_2": {
                "name": "Carla Santos",
                "skills": ["escova", "hidratacao", "progressiva"],
                "working_days": [1, 2, 3, 4, 5],  # Não trabalha segunda
                "working_hours": {"start": time(9, 0), "end": time(17, 0)},
                "efficiency_rating": 0.90
            },
            "staff_3": {
                "name": "Ana Lima",
                "skills": ["manicure", "pedicure", "sobrancelha", "unhas_gel"],
                "working_days": [0, 1, 2, 3, 4, 5],
                "working_hours": {"start": time(8, 0), "end": time(16, 0)},
                "efficiency_rating": 0.88
            }
        }
        
        # Serviços disponíveis
        self.services = {
            "corte": ServiceInfo("corte", "Corte Feminino", 60, 45.0, ["corte"], 0.95),
            "escova": ServiceInfo("escova", "Escova", 45, 35.0, ["escova"], 0.85),
            "tintura": ServiceInfo("tintura", "Tintura", 120, 120.0, ["tintura"], 0.70),
            "mechas": ServiceInfo("mechas", "Mechas", 180, 180.0, ["mechas"], 0.60),
            "hidratacao": ServiceInfo("hidratacao", "Hidratação", 90, 60.0, ["hidratacao"], 0.80),
            "progressiva": ServiceInfo("progressiva", "Progressiva", 240, 200.0, ["progressiva"], 0.45),
            "sobrancelha": ServiceInfo("sobrancelha", "Sobrancelha", 30, 25.0, ["sobrancelha"], 0.90),
            "manicure": ServiceInfo("manicure", "Manicure", 60, 30.0, ["manicure"], 0.85),
            "pedicure": ServiceInfo("pedicure", "Pedicure", 60, 35.0, ["pedicure"], 0.80),
            "unhas_gel": ServiceInfo("unhas_gel", "Unhas em Gel", 90, 80.0, ["unhas_gel"], 0.65)
        }
        
        # Cache de agendamentos (simulado)
        self.bookings_cache = {}
        
    async def get_availability(self, service_type: str, requested_date: str, duration_minutes: int = None) -> List[Dict]:
        """Retorna horários disponíveis para um serviço"""
        try:
            # Parse da data
            target_date = datetime.strptime(requested_date, "%Y-%m-%d").date()
            
            # Verificar se é dia útil
            if target_date.weekday() not in self.working_days:
                return []
            
            # Obter informações do serviço
            service_info = self.services.get(service_type)
            if not service_info:
                logger.warning(f"Serviço {service_type} não encontrado")
                return []
            
            duration = duration_minutes or service_info.duration_minutes
            
            # Encontrar profissionais qualificados
            qualified_staff = self.get_qualified_staff(service_type)
            
            available_slots = []
            
            for staff_id, staff_info in qualified_staff.items():
                # Verificar se trabalha neste dia
                if target_date.weekday() not in staff_info["working_days"]:
                    continue
                
                # Gerar slots de tempo
                slots = self.generate_time_slots(
                    target_date, 
                    staff_id, 
                    staff_info, 
                    duration
                )
                
                # Filtrar slots disponíveis
                available_slots.extend([
                    {
                        "start_time": slot.start_time.strftime("%H:%M"),
                        "end_time": slot.end_time.strftime("%H:%M"),
                        "staff_id": slot.staff_id,
                        "staff_name": slot.staff_name,
                        "duration": duration,
                        "service_type": service_type,
                        "available": slot.available
                    }
                    for slot in slots if slot.available
                ])
            
            # Ordenar por horário
            available_slots.sort(key=lambda x: x["start_time"])
            
            logger.info(f"📅 {len(available_slots)} horários disponíveis para {service_type} em {requested_date}")
            
            return available_slots[:10]  # Retornar no máximo 10 opções
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar disponibilidade: {e}")
            return []
    
    def get_qualified_staff(self, service_type: str) -> Dict:
        """Retorna profissionais qualificados para o serviço"""
        service_info = self.services.get(service_type)
        if not service_info:
            return {}
        
        qualified = {}
        required_skills = service_info.required_skills
        
        for staff_id, staff_info in self.staff.items():
            # Verificar se tem as habilidades necessárias
            if any(skill in staff_info["skills"] for skill in required_skills):
                qualified[staff_id] = staff_info
        
        return qualified
    
    def generate_time_slots(self, date: datetime.date, staff_id: str, staff_info: Dict, duration: int) -> List[TimeSlot]:
        """Gera slots de tempo para um profissional em uma data"""
        slots = []
        
        # Horários de trabalho do profissional
        work_start = staff_info["working_hours"]["start"]
        work_end = staff_info["working_hours"]["end"]
        
        # Criar datetime para o dia
        current_time = datetime.combine(date, work_start)
        end_time = datetime.combine(date, work_end)
        
        while current_time + timedelta(minutes=duration) <= end_time:
            slot_end = current_time + timedelta(minutes=duration)
            
            # Verificar se o slot está disponível (simulado)
            is_available = self.is_slot_available(current_time, slot_end, staff_id)
            
            slot = TimeSlot(
                start_time=current_time,
                end_time=slot_end,
                staff_id=staff_id,
                staff_name=staff_info["name"],
                available=is_available
            )
            
            slots.append(slot)
            current_time += timedelta(minutes=self.slot_duration)
        
        return slots
    
    def is_slot_available(self, start_time: datetime, end_time: datetime, staff_id: str) -> bool:
        """Verifica se um slot está disponível (simulado)"""
        # Simular ocupação baseada em padrões realistas
        hour = start_time.hour
        day_of_week = start_time.weekday()
        
        # Horários de maior demanda
        peak_hours = [10, 11, 14, 15, 16]  # 10h, 11h, 14h, 15h, 16h
        peak_days = [4, 5]  # Sexta e Sábado
        
        # Probabilidade base de estar ocupado
        base_probability = 0.3  # 30% chance de estar ocupado
        
        # Aumentar probabilidade em horários de pico
        if hour in peak_hours:
            base_probability += 0.2
        
        # Aumentar probabilidade em dias de pico
        if day_of_week in peak_days:
            base_probability += 0.15
        
        # Horários menos populares (muito cedo ou muito tarde)
        if hour <= 8 or hour >= 17:
            base_probability -= 0.1
        
        # Verificar cache de agendamentos existentes
        key = f"{staff_id}_{start_time.isoformat()}"
        if key in self.bookings_cache:
            return False
        
        # Simular disponibilidade
        import random
        return random.random() > base_probability
    
    async def validate_slot(self, service_type: str, date: str, time: str, staff_id: str = None) -> bool:
        """Valida se um slot específico está disponível"""
        try:
            # Parse da data e hora
            target_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            
            # Obter informações do serviço
            service_info = self.services.get(service_type)
            if not service_info:
                return False
            
            # Se staff_id não especificado, encontrar automaticamente
            if not staff_id:
                qualified_staff = self.get_qualified_staff(service_type)
                if not qualified_staff:
                    return False
                staff_id = list(qualified_staff.keys())[0]  # Pegar o primeiro disponível
            
            # Verificar se o profissional trabalha neste horário
            staff_info = self.staff.get(staff_id)
            if not staff_info:
                return False
            
            # Verificar dia da semana
            if target_datetime.weekday() not in staff_info["working_days"]:
                return False
            
            # Verificar horário de trabalho
            work_start = staff_info["working_hours"]["start"]
            work_end = staff_info["working_hours"]["end"]
            
            if target_datetime.time() < work_start or target_datetime.time() >= work_end:
                return False
            
            # Verificar se não conflita com outros agendamentos
            end_time = target_datetime + timedelta(minutes=service_info.duration_minutes)
            
            return self.is_slot_available(target_datetime, end_time, staff_id)
            
        except Exception as e:
            logger.error(f"❌ Erro ao validar slot: {e}")
            return False
    
    async def book_slot(self, service_type: str, date: str, time: str, client_info: Dict, staff_id: str = None) -> Dict:
        """Reserva um horário"""
        try:
            # Validar se está disponível
            is_available = await self.validate_slot(service_type, date, time, staff_id)
            
            if not is_available:
                return {
                    "success": False,
                    "error": "Horário não disponível"
                }
            
            # Encontrar staff se não especificado
            if not staff_id:
                qualified_staff = self.get_qualified_staff(service_type)
                staff_id = list(qualified_staff.keys())[0]
            
            # Gerar ID do agendamento
            booking_id = f"booking_{datetime.now().timestamp()}"
            
            # Criar registro do agendamento
            target_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            service_info = self.services[service_type]
            end_time = target_datetime + timedelta(minutes=service_info.duration_minutes)
            
            booking_data = {
                "id": booking_id,
                "service_type": service_type,
                "service_name": service_info.name,
                "client_name": client_info.get("name"),
                "client_phone": client_info.get("phone"),
                "staff_id": staff_id,
                "staff_name": self.staff[staff_id]["name"],
                "start_time": target_datetime.isoformat(),
                "end_time": end_time.isoformat(),
                "duration": service_info.duration_minutes,
                "price": service_info.price,
                "status": "confirmed",
                "created_at": datetime.now().isoformat()
            }
            
            # Adicionar ao cache
            key = f"{staff_id}_{target_datetime.isoformat()}"
            self.bookings_cache[key] = booking_data
            
            logger.info(f"✅ Agendamento criado: {booking_id}")
            
            return {
                "success": True,
                "booking_id": booking_id,
                "booking_data": booking_data
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao criar agendamento: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def create_booking(self, service_type: str, client_name: str, client_phone: str, 
                           preferred_datetime: datetime, staff_member: str = None) -> Dict:
        """Cria um novo agendamento com notificações automáticas"""
        try:
            # Gerar ID único do agendamento
            booking_id = f"booking_{int(datetime.now().timestamp())}_{random.randint(1000, 9999)}"
            
            # Obter informações do serviço
            service_info = self.services.get(service_type)
            if not service_info:
                return {"success": False, "error": "Serviço não encontrado"}
            
            # Dados do agendamento
            booking_data = {
                "booking_id": booking_id,
                "client_name": client_name,
                "client_phone": client_phone,
                "service_type": service_type,
                "service_name": service_info.name,
                "scheduled_datetime": preferred_datetime,
                "date": preferred_datetime.strftime('%d/%m/%Y'),
                "time": preferred_datetime.strftime('%H:%M'),
                "staff_member": staff_member or "Marina",
                "duration": service_info.duration_minutes,
                "price": f"{service_info.price:.2f}",
                "status": "confirmed",
                "created_at": datetime.now()
            }
            
            # Salvar no "banco de dados" (simulado)
            success = await self._save_booking(booking_data)
            
            if success:
                # Enviar confirmação e agendar lembretes
                try:
                    from notification_engine import NotificationEngine
                    notification_engine = NotificationEngine()
                    await notification_engine.send_booking_confirmation(booking_data)
                    logger.info(f"✅ Confirmação e lembretes enviados para {client_name}")
                except Exception as notif_error:
                    logger.warning(f"⚠️ Erro nas notificações: {notif_error}")
                
                logger.info(f"✅ Agendamento criado: {booking_id}")
                return {
                    "success": True,
                    "booking_id": booking_id,
                    "message": f"Agendamento confirmado para {client_name}",
                    "booking_data": booking_data
                }
            else:
                return {
                    "success": False,
                    "error": "Erro ao salvar agendamento"
                }
                
        except Exception as e:
            logger.error(f"❌ Erro ao criar agendamento: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_optimized_suggestions(self, service_type: str, preferred_date: str = None) -> List[Dict]:
        """Retorna sugestões otimizadas de horários"""
        try:
            # Se não tem data preferida, sugerir próximos 7 dias
            if not preferred_date:
                start_date = datetime.now().date()
            else:
                start_date = datetime.strptime(preferred_date, "%Y-%m-%d").date()
            
            suggestions = []
            
            # Buscar nos próximos 7 dias
            for days_ahead in range(7):
                check_date = start_date + timedelta(days=days_ahead)
                
                # Pular domingos
                if check_date.weekday() == 6:
                    continue
                
                date_str = check_date.strftime("%Y-%m-%d")
                availability = await self.get_availability(service_type, date_str)
                
                # Pegar os 3 melhores horários do dia
                best_slots = self.rank_time_slots(availability, check_date)[:3]
                suggestions.extend(best_slots)
            
            # Ordenar por pontuação
            suggestions.sort(key=lambda x: x.get("score", 0), reverse=True)
            
            return suggestions[:5]  # Top 5 sugestões
            
        except Exception as e:
            logger.error(f"❌ Erro ao gerar sugestões: {e}")
            return []
    
    def rank_time_slots(self, slots: List[Dict], date: datetime.date) -> List[Dict]:
        """Classifica slots por otimalidade"""
        ranked_slots = []
        
        for slot in slots:
            score = 0
            
            # Pontuação base
            score += 50
            
            # Horários populares (10h-16h)
            hour = int(slot["start_time"].split(":")[0])
            if 10 <= hour <= 16:
                score += 20
            
            # Início da semana (mais fácil de lembrar)
            if date.weekday() in [0, 1, 2]:  # Segunda, terça, quarta
                score += 10
            
            # Profissional mais eficiente
            staff_id = slot["staff_id"]
            if staff_id in self.staff:
                efficiency = self.staff[staff_id].get("efficiency_rating", 0.8)
                score += efficiency * 20
            
            # Adicionar pontuação ao slot
            slot["score"] = score
            slot["date"] = date.strftime("%Y-%m-%d")
            slot["day_name"] = date.strftime("%A")
            
            ranked_slots.append(slot)
        
        return ranked_slots
    
    async def get_daily_schedule(self, date: str, staff_id: str = None) -> Dict:
        """Retorna agenda do dia"""
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
            
            # Se staff_id especificado, mostrar apenas dele
            if staff_id:
                staff_list = {staff_id: self.staff[staff_id]} if staff_id in self.staff else {}
            else:
                staff_list = self.staff
            
            daily_schedule = {}
            
            for sid, staff_info in staff_list.items():
                # Verificar se trabalha neste dia
                if target_date.weekday() not in staff_info["working_days"]:
                    continue
                
                schedule = {
                    "staff_name": staff_info["name"],
                    "working_hours": {
                        "start": staff_info["working_hours"]["start"].strftime("%H:%M"),
                        "end": staff_info["working_hours"]["end"].strftime("%H:%M")
                    },
                    "appointments": [],
                    "available_slots": []
                }
                
                # Buscar agendamentos do cache
                for key, booking in self.bookings_cache.items():
                    if key.startswith(sid) and booking["start_time"].startswith(date):
                        schedule["appointments"].append(booking)
                
                daily_schedule[sid] = schedule
            
            return daily_schedule
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar agenda diária: {e}")
            return {}
    
    async def _save_booking(self, booking_data: Dict) -> bool:
        """Salva agendamento no sistema (simulado)"""
        try:
            # Simular salvamento em banco de dados
            booking_id = booking_data.get('booking_id')
            
            # Adicionar ao cache local
            if not hasattr(self, 'bookings_cache'):
                self.bookings_cache = {}
            
            self.bookings_cache[booking_id] = booking_data
            
            # Simular salvamento em arquivo
            from pathlib import Path
            bookings_file = Path('bookings_data.json')
            if bookings_file.exists():
                with open(bookings_file, 'r', encoding='utf-8') as f:
                    bookings = json.load(f)
            else:
                bookings = {}
            
            bookings[booking_id] = {
                **booking_data,
                'scheduled_datetime': booking_data['scheduled_datetime'].isoformat() if isinstance(booking_data['scheduled_datetime'], datetime) else booking_data['scheduled_datetime'],
                'created_at': booking_data['created_at'].isoformat() if isinstance(booking_data['created_at'], datetime) else booking_data['created_at']
            }
            
            with open(bookings_file, 'w', encoding='utf-8') as f:
                json.dump(bookings, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Agendamento salvo: {booking_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erro ao salvar agendamento: {e}")
            return False