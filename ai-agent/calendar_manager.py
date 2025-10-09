#!/usr/bin/env python3
"""
📅 GOOGLE CALENDAR MANAGER
Integração com Google Calendar API
"""

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from datetime import datetime, timedelta
from typing import Dict, List, Optional
from loguru import logger
import os
import json
import pickle

class GoogleCalendarManager:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/calendar']
        self.service = None
        self.calendar_id = os.getenv('GOOGLE_CALENDAR_ID', 'primary')
        
    async def initialize(self):
        """Inicializa conexão com Google Calendar"""
        try:
            creds = None
            
            # Verificar se já existe token salvo
            if os.path.exists('token.pickle'):
                with open('token.pickle', 'rb') as token:
                    creds = pickle.load(token)
            
            # Se não existem credenciais válidas, solicitar autenticação
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    if os.path.exists('credentials.json'):
                        flow = InstalledAppFlow.from_client_secrets_file(
                            'credentials.json', self.SCOPES)
                        creds = flow.run_local_server(port=0)
                    else:
                        logger.warning("⚠️ Google Calendar credentials não encontradas - modo simulação")
                        return
                
                # Salvar credenciais para próxima execução
                with open('token.pickle', 'wb') as token:
                    pickle.dump(creds, token)
            
            # Construir serviço
            if creds:
                self.service = build('calendar', 'v3', credentials=creds)
                logger.info("✅ Google Calendar conectado")
            else:
                logger.warning("⚠️ Google Calendar em modo simulação")
                
        except Exception as e:
            logger.error(f"❌ Erro ao inicializar Google Calendar: {e}")
    
    async def create_event(self, title: str, start_datetime: str, duration_minutes: int = 60, 
                          description: str = "", attendee_email: str = None) -> Dict:
        """Cria evento no Google Calendar"""
        try:
            if not self.service:
                # Modo simulação
                logger.info(f"📅 [SIMULAÇÃO] Evento criado: {title} em {start_datetime}")
                return {
                    "success": True,
                    "id": f"sim_event_{datetime.now().timestamp()}",
                    "status": "simulation",
                    "htmlLink": "https://calendar.google.com/simulation"
                }
            
            # Parse da data/hora
            start_dt = datetime.fromisoformat(start_datetime.replace('T', ' '))
            end_dt = start_dt + timedelta(minutes=duration_minutes)
            
            # Configurar evento
            event = {
                'summary': title,
                'description': description,
                'start': {
                    'dateTime': start_dt.isoformat(),
                    'timeZone': 'America/Sao_Paulo',
                },
                'end': {
                    'dateTime': end_dt.isoformat(),
                    'timeZone': 'America/Sao_Paulo',
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'popup', 'minutes': 120},  # 2h antes
                        {'method': 'popup', 'minutes': 30},   # 30min antes
                    ],
                },
            }
            
            # Adicionar participante se fornecido
            if attendee_email:
                event['attendees'] = [
                    {'email': attendee_email}
                ]
            
            # Criar evento
            event_result = self.service.events().insert(
                calendarId=self.calendar_id, 
                body=event
            ).execute()
            
            logger.info(f"✅ Evento criado no Google Calendar: {event_result.get('id')}")
            
            return {
                "success": True,
                "id": event_result.get('id'),
                "status": "created",
                "htmlLink": event_result.get('htmlLink')
            }
            
        except HttpError as error:
            logger.error(f"❌ Erro HTTP no Google Calendar: {error}")
            return {
                "success": False,
                "error": str(error)
            }
        except Exception as e:
            logger.error(f"❌ Erro ao criar evento: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def update_event(self, event_id: str, updates: Dict) -> Dict:
        """Atualiza evento existente"""
        try:
            if not self.service:
                logger.info(f"📅 [SIMULAÇÃO] Evento atualizado: {event_id}")
                return {"success": True, "status": "simulation"}
            
            # Buscar evento existente
            event = self.service.events().get(
                calendarId=self.calendar_id, 
                eventId=event_id
            ).execute()
            
            # Aplicar atualizações
            for key, value in updates.items():
                event[key] = value
            
            # Salvar atualização
            updated_event = self.service.events().update(
                calendarId=self.calendar_id,
                eventId=event_id,
                body=event
            ).execute()
            
            logger.info(f"✅ Evento atualizado: {event_id}")
            
            return {
                "success": True,
                "id": updated_event.get('id'),
                "status": "updated"
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao atualizar evento: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def delete_event(self, event_id: str) -> Dict:
        """Deleta evento do calendar"""
        try:
            if not self.service:
                logger.info(f"📅 [SIMULAÇÃO] Evento deletado: {event_id}")
                return {"success": True, "status": "simulation"}
            
            self.service.events().delete(
                calendarId=self.calendar_id,
                eventId=event_id
            ).execute()
            
            logger.info(f"✅ Evento deletado: {event_id}")
            
            return {
                "success": True,
                "status": "deleted"
            }
            
        except Exception as e:
            logger.error(f"❌ Erro ao deletar evento: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_events(self, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Busca eventos em um período"""
        try:
            if not self.service:
                # Simular eventos
                return [
                    {
                        "id": "sim_1",
                        "summary": "Corte - Maria Silva",
                        "start": {"dateTime": "2025-10-05T14:00:00"},
                        "end": {"dateTime": "2025-10-05T15:00:00"}
                    },
                    {
                        "id": "sim_2", 
                        "summary": "Tintura - Ana Santos",
                        "start": {"dateTime": "2025-10-05T16:00:00"},
                        "end": {"dateTime": "2025-10-05T18:00:00"}
                    }
                ]
            
            # Buscar eventos reais
            events_result = self.service.events().list(
                calendarId=self.calendar_id,
                timeMin=start_date.isoformat() + 'Z',
                timeMax=end_date.isoformat() + 'Z',
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            logger.info(f"📅 {len(events)} eventos encontrados")
            
            return events
            
        except Exception as e:
            logger.error(f"❌ Erro ao buscar eventos: {e}")
            return []
    
    async def check_availability(self, start_datetime: str, end_datetime: str) -> bool:
        """Verifica se horário está livre"""
        try:
            start_dt = datetime.fromisoformat(start_datetime.replace('T', ' '))
            end_dt = datetime.fromisoformat(end_datetime.replace('T', ' '))
            
            events = await self.get_events(start_dt, end_dt)
            
            # Verificar conflitos
            for event in events:
                event_start = datetime.fromisoformat(
                    event['start']['dateTime'].replace('Z', '').replace('T', ' ')
                )
                event_end = datetime.fromisoformat(
                    event['end']['dateTime'].replace('Z', '').replace('T', ' ')
                )
                
                # Verificar sobreposição
                if not (end_dt <= event_start or start_dt >= event_end):
                    return False  # Conflito encontrado
            
            return True  # Livre
            
        except Exception as e:
            logger.error(f"❌ Erro ao verificar disponibilidade: {e}")
            return False
    
    async def health_check(self) -> str:
        """Verifica saúde do componente"""
        try:
            if self.service:
                # Testar com busca rápida
                now = datetime.now()
                await self.get_events(now, now + timedelta(hours=1))
                return "connected"
            else:
                return "simulation_mode"
        except:
            return "offline"