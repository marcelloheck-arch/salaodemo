#!/usr/bin/env python3
"""
📋 MOCK DATA INTEGRATION
Integração com dados mock do frontend para desenvolvimento
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from loguru import logger

class MockDataService:
    def __init__(self):
        self.frontend_url = "http://localhost:3001"
        self.analytics_url = "http://localhost:8000"
        
        # Cache local dos dados
        self.cache = {
            "clients": [],
            "services": [],
            "staff": [],
            "appointments": [],
            "transactions": [],
            "last_updated": None
        }
        
    async def initialize(self):
        """Inicializa e carrega dados mock"""
        try:
            await self.load_mock_data()
            logger.info("✅ Dados mock carregados")
        except Exception as e:
            logger.error(f"❌ Erro ao carregar dados mock: {e}")
            self.generate_fallback_data()
    
    async def load_mock_data(self):
        """Carrega dados mock do frontend ou analytics"""
        try:
            # Tentar carregar do analytics API primeiro
            response = requests.get(f"{self.analytics_url}/analytics/mock-data", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    # Estruturar dados do analytics
                    self.cache = {
                        "clients": data.get("sample_data", {}).get("clients", []),
                        "services": [],
                        "staff": [],
                        "appointments": [],
                        "transactions": [],
                        "last_updated": datetime.now().isoformat()
                    }
                    logger.info("✅ Dados carregados do Analytics API")
                    return
        except Exception as e:
            logger.warning(f"⚠️ Não foi possível carregar do Analytics API: {e}")
        
        # Fallback: gerar dados localmente
        self.generate_fallback_data()
    
    def generate_fallback_data(self):
        """Gera dados de fallback quando APIs não estão disponíveis"""
        logger.info("🔄 Gerando dados mock localmente...")
        
        # Clientes
        self.cache["clients"] = [
            {
                "id": "client_1",
                "name": "Maria Silva",
                "phone": "11987654321",
                "email": "maria@email.com",
                "segment": "premium",
                "total_spent": 450.0,
                "last_visit": "2025-09-28"
            },
            {
                "id": "client_2",
                "name": "Ana Santos",
                "phone": "11976543210",
                "email": "ana@email.com",
                "segment": "regular",
                "total_spent": 180.0,
                "last_visit": "2025-09-25"
            },
            {
                "id": "client_3",
                "name": "Juliana Costa",
                "phone": "11965432109",
                "email": "juliana@email.com",
                "segment": "new",
                "total_spent": 45.0,
                "last_visit": "2025-10-01"
            }
        ]
        
        # Serviços
        self.cache["services"] = [
            {"id": "corte", "name": "Corte Feminino", "price": 45, "duration": 60},
            {"id": "tintura", "name": "Tintura", "price": 120, "duration": 120},
            {"id": "mechas", "name": "Mechas", "price": 180, "duration": 180},
            {"id": "hidratacao", "name": "Hidratação", "price": 60, "duration": 90},
            {"id": "escova", "name": "Escova", "price": 35, "duration": 45},
            {"id": "manicure", "name": "Manicure", "price": 30, "duration": 60},
            {"id": "sobrancelha", "name": "Sobrancelha", "price": 25, "duration": 30}
        ]
        
        # Profissionais
        self.cache["staff"] = [
            {
                "id": "staff_1",
                "name": "Marina Souza",
                "specialties": ["corte", "tintura", "mechas"],
                "working_days": [0, 1, 2, 3, 4, 5],
                "working_hours": {"start": "08:00", "end": "18:00"}
            },
            {
                "id": "staff_2",
                "name": "Carla Santos",
                "specialties": ["escova", "hidratacao"],
                "working_days": [1, 2, 3, 4, 5],
                "working_hours": {"start": "09:00", "end": "17:00"}
            },
            {
                "id": "staff_3",
                "name": "Ana Lima",
                "specialties": ["manicure", "sobrancelha"],
                "working_days": [0, 1, 2, 3, 4, 5],
                "working_hours": {"start": "08:00", "end": "16:00"}
            }
        ]
        
        # Agendamentos simulados para hoje e próximos dias
        today = datetime.now().date()
        self.cache["appointments"] = []
        
        for days_ahead in range(7):
            date = today + timedelta(days=days_ahead)
            if date.weekday() == 6:  # Pular domingo
                continue
                
            date_str = date.strftime("%Y-%m-%d")
            
            # 3-5 agendamentos por dia
            import random
            num_appointments = random.randint(3, 5)
            
            for i in range(num_appointments):
                client = random.choice(self.cache["clients"])
                service = random.choice(self.cache["services"])
                staff = random.choice([
                    s for s in self.cache["staff"] 
                    if any(spec in s["specialties"] for spec in [service["id"]])
                ] or self.cache["staff"])
                
                hour = random.randint(8, 16)
                minute = random.choice([0, 30])
                time_str = f"{hour:02d}:{minute:02d}"
                
                appointment = {
                    "id": f"apt_{date_str}_{i}",
                    "client_id": client["id"],
                    "client_name": client["name"],
                    "client_phone": client["phone"],
                    "service_id": service["id"],
                    "service_name": service["name"],
                    "staff_id": staff["id"],
                    "staff_name": staff["name"],
                    "date": date_str,
                    "time": time_str,
                    "duration": service["duration"],
                    "price": service["price"],
                    "status": "confirmed" if days_ahead > 0 else random.choice(["confirmed", "completed"])
                }
                
                self.cache["appointments"].append(appointment)
        
        self.cache["last_updated"] = datetime.now().isoformat()
        logger.info(f"✅ Dados mock gerados: {len(self.cache['clients'])} clientes, {len(self.cache['appointments'])} agendamentos")
    
    def get_clients(self) -> List[Dict]:
        """Retorna lista de clientes"""
        return self.cache.get("clients", [])
    
    def get_client_by_phone(self, phone: str) -> Optional[Dict]:
        """Busca cliente por telefone"""
        for client in self.cache.get("clients", []):
            if client.get("phone") == phone:
                return client
        return None
    
    def get_services(self) -> List[Dict]:
        """Retorna lista de serviços"""
        return self.cache.get("services", [])
    
    def get_service_by_id(self, service_id: str) -> Optional[Dict]:
        """Busca serviço por ID"""
        for service in self.cache.get("services", []):
            if service.get("id") == service_id:
                return service
        return None
    
    def get_staff(self) -> List[Dict]:
        """Retorna lista de profissionais"""
        return self.cache.get("staff", [])
    
    def get_staff_by_service(self, service_id: str) -> List[Dict]:
        """Retorna profissionais qualificados para um serviço"""
        qualified_staff = []
        for staff in self.cache.get("staff", []):
            if service_id in staff.get("specialties", []):
                qualified_staff.append(staff)
        return qualified_staff
    
    def get_appointments(self, date: str = None, staff_id: str = None) -> List[Dict]:
        """Retorna agendamentos filtrados"""
        appointments = self.cache.get("appointments", [])
        
        if date:
            appointments = [apt for apt in appointments if apt.get("date") == date]
        
        if staff_id:
            appointments = [apt for apt in appointments if apt.get("staff_id") == staff_id]
        
        return appointments
    
    def add_appointment(self, appointment_data: Dict) -> str:
        """Adiciona novo agendamento aos dados mock"""
        appointment_id = f"apt_ai_{datetime.now().timestamp()}"
        appointment_data["id"] = appointment_id
        
        self.cache["appointments"].append(appointment_data)
        
        logger.info(f"✅ Agendamento adicionado aos dados mock: {appointment_id}")
        return appointment_id
    
    def update_appointment(self, appointment_id: str, updates: Dict) -> bool:
        """Atualiza agendamento nos dados mock"""
        for i, appointment in enumerate(self.cache.get("appointments", [])):
            if appointment.get("id") == appointment_id:
                self.cache["appointments"][i].update(updates)
                logger.info(f"✅ Agendamento atualizado: {appointment_id}")
                return True
        
        logger.warning(f"⚠️ Agendamento não encontrado: {appointment_id}")
        return False
    
    def get_availability_for_date(self, date: str, service_duration: int = 60) -> List[Dict]:
        """Simula disponibilidade para uma data"""
        # Buscar agendamentos existentes
        existing_appointments = self.get_appointments(date)
        
        # Gerar slots disponíveis
        available_slots = []
        
        for staff in self.cache.get("staff", []):
            # Verificar se trabalha neste dia
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            if date_obj.weekday() not in staff.get("working_days", []):
                continue
            
            # Gerar horários possíveis
            work_start = datetime.strptime(staff["working_hours"]["start"], "%H:%M").time()
            work_end = datetime.strptime(staff["working_hours"]["end"], "%H:%M").time()
            
            current_time = datetime.combine(date_obj, work_start)
            end_time = datetime.combine(date_obj, work_end)
            
            while current_time + timedelta(minutes=service_duration) <= end_time:
                time_str = current_time.strftime("%H:%M")
                
                # Verificar se não conflita com agendamentos existentes
                is_available = True
                for apt in existing_appointments:
                    if (apt.get("staff_id") == staff["id"] and 
                        apt.get("time") == time_str):
                        is_available = False
                        break
                
                if is_available:
                    available_slots.append({
                        "time": time_str,
                        "staff_id": staff["id"],
                        "staff_name": staff["name"],
                        "duration": service_duration
                    })
                
                current_time += timedelta(minutes=30)  # Slots de 30 min
        
        return available_slots
    
    async def sync_with_frontend(self) -> bool:
        """Sincroniza dados com o frontend"""
        try:
            # Tentar enviar dados atualizados para o frontend
            # Esta seria uma função para manter sincronização bidirecional
            logger.info("🔄 Sincronizando com frontend...")
            return True
        except Exception as e:
            logger.error(f"❌ Erro na sincronização: {e}")
            return False
    
    def get_client_history(self, phone: str) -> Dict:
        """Retorna histórico do cliente"""
        client = self.get_client_by_phone(phone)
        if not client:
            return {}
        
        # Buscar agendamentos do cliente
        appointments = []
        for apt in self.cache.get("appointments", []):
            if apt.get("client_phone") == phone:
                appointments.append(apt)
        
        # Calcular métricas
        completed_appointments = [apt for apt in appointments if apt.get("status") == "completed"]
        total_spent = sum(apt.get("price", 0) for apt in completed_appointments)
        
        return {
            "client": client,
            "total_appointments": len(appointments),
            "completed_appointments": len(completed_appointments),
            "total_spent": total_spent,
            "average_ticket": total_spent / len(completed_appointments) if completed_appointments else 0,
            "appointments": appointments,
            "favorite_services": self.get_favorite_services(appointments),
            "last_visit": max([apt.get("date") for apt in completed_appointments], default=None)
        }
    
    def get_favorite_services(self, appointments: List[Dict]) -> List[str]:
        """Analisa serviços mais utilizados pelo cliente"""
        service_count = {}
        for apt in appointments:
            service = apt.get("service_name")
            if service:
                service_count[service] = service_count.get(service, 0) + 1
        
        # Retornar top 3 serviços
        sorted_services = sorted(service_count.items(), key=lambda x: x[1], reverse=True)
        return [service for service, count in sorted_services[:3]]