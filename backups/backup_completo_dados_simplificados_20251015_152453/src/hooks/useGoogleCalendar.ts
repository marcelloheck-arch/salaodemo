import { useState, useEffect, useCallback } from 'react';
import { GoogleCalendarEvent, AppointmentSlot } from '../types/schedule';

interface UseGoogleCalendarProps {
  calendarId?: string;
  autoSync?: boolean;
  syncInterval?: number; // em minutos
}

interface GoogleCalendarHook {
  isConnected: boolean;
  isLoading: boolean;
  lastSync: Date | null;
  events: GoogleCalendarEvent[];
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  syncEvents: () => Promise<void>;
  createEvent: (appointment: AppointmentSlot) => Promise<string>;
  updateEvent: (eventId: string, appointment: AppointmentSlot) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

export const useGoogleCalendar = ({
  calendarId = 'primary',
  autoSync = true,
  syncInterval = 5
}: UseGoogleCalendarProps = {}): GoogleCalendarHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simular verificação de conexão ao carregar
  useEffect(() => {
    const checkConnection = async () => {
      // Simulação - em produção, verificaria se há token válido
      const hasValidToken = localStorage.getItem('google_calendar_token');
      setIsConnected(!!hasValidToken);
      
      if (hasValidToken) {
        setLastSync(new Date(localStorage.getItem('last_sync') || Date.now()));
      }
    };

    checkConnection();
  }, []);

  // Auto-sync se habilitado
  useEffect(() => {
    if (!isConnected || !autoSync) return;

    const interval = setInterval(() => {
      syncEvents();
    }, syncInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [isConnected, autoSync, syncInterval]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulação do fluxo OAuth do Google
      // Em produção, seria algo como:
      // const auth = await gapi.auth2.getAuthInstance().signIn();
      
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso da autenticação
      localStorage.setItem('google_calendar_token', 'mock-token-' + Date.now());
      localStorage.setItem('google_calendar_id', calendarId);
      
      setIsConnected(true);
      setLastSync(new Date());
      
      // Fazer sync inicial
      await syncEvents();
      
    } catch (err) {
      setError('Falha ao conectar com Google Calendar. Tente novamente.');
      console.error('Google Calendar connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [calendarId]);

  const disconnect = useCallback(() => {
    localStorage.removeItem('google_calendar_token');
    localStorage.removeItem('google_calendar_id');
    localStorage.removeItem('last_sync');
    
    setIsConnected(false);
    setEvents([]);
    setLastSync(null);
    setError(null);
  }, []);

  const syncEvents = useCallback(async () => {
    if (!isConnected) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulação da busca de eventos do Google Calendar
      // Em produção seria:
      // const response = await gapi.client.calendar.events.list({
      //   calendarId: calendarId,
      //   timeMin: new Date().toISOString(),
      //   timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      //   singleEvents: true,
      //   orderBy: 'startTime'
      // });

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Eventos simulados do Google Calendar
      const mockEvents: GoogleCalendarEvent[] = [
        {
          id: 'google-event-1',
          summary: 'Reunião de Equipe',
          start: {
            dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Sao_Paulo'
          },
          end: {
            dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Sao_Paulo'
          },
          description: 'Reunião semanal da equipe do salão',
          status: 'confirmed'
        },
        {
          id: 'google-event-2',
          summary: 'Curso de Atualização',
          start: {
            dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Sao_Paulo'
          },
          end: {
            dateTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Sao_Paulo'
          },
          description: 'Curso de novas técnicas de corte',
          status: 'confirmed'
        }
      ];

      setEvents(mockEvents);
      const now = new Date();
      setLastSync(now);
      localStorage.setItem('last_sync', now.toISOString());

    } catch (err) {
      setError('Falha ao sincronizar eventos. Verifique sua conexão.');
      console.error('Sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, calendarId]);

  const createEvent = useCallback(async (appointment: AppointmentSlot): Promise<string> => {
    if (!isConnected) {
      throw new Error('Google Calendar não está conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulação da criação de evento
      // Em produção seria:
      // const event = {
      //   summary: `${appointment.serviceName} - ${appointment.clientName}`,
      //   description: `Cliente: ${appointment.clientName}\nServiço: ${appointment.serviceName}\nProfissional: ${appointment.professionalName}`,
      //   start: {
      //     dateTime: appointment.startTime,
      //     timeZone: 'America/Sao_Paulo'
      //   },
      //   end: {
      //     dateTime: appointment.endTime,
      //     timeZone: 'America/Sao_Paulo'
      //   }
      // };
      // const response = await gapi.client.calendar.events.insert({
      //   calendarId: calendarId,
      //   resource: event
      // });

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const eventId = `google-event-${Date.now()}`;
      
      // Adicionar evento local
      const newEvent: GoogleCalendarEvent = {
        id: eventId,
        summary: `${appointment.serviceName} - ${appointment.clientName}`,
        start: {
          dateTime: appointment.startTime,
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: appointment.endTime,
          timeZone: 'America/Sao_Paulo'
        },
        description: `Cliente: ${appointment.clientName}\nServiço: ${appointment.serviceName}\nProfissional: ${appointment.professionalName}`,
        status: 'confirmed'
      };

      setEvents(prev => [...prev, newEvent]);
      
      return eventId;
      
    } catch (err) {
      setError('Falha ao criar evento no Google Calendar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, calendarId]);

  const updateEvent = useCallback(async (eventId: string, appointment: AppointmentSlot): Promise<void> => {
    if (!isConnected) {
      throw new Error('Google Calendar não está conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulação da atualização
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEvents(prev => prev.map(event => 
        event.id === eventId ? {
          ...event,
          summary: `${appointment.serviceName} - ${appointment.clientName}`,
          description: `Cliente: ${appointment.clientName}\nServiço: ${appointment.serviceName}\nProfissional: ${appointment.professionalName}`,
          start: {
            dateTime: appointment.startTime,
            timeZone: 'America/Sao_Paulo'
          },
          end: {
            dateTime: appointment.endTime,
            timeZone: 'America/Sao_Paulo'
          }
        } : event
      ));
      
    } catch (err) {
      setError('Falha ao atualizar evento no Google Calendar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const deleteEvent = useCallback(async (eventId: string): Promise<void> => {
    if (!isConnected) {
      throw new Error('Google Calendar não está conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulação da exclusão
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEvents(prev => prev.filter(event => event.id !== eventId));
      
    } catch (err) {
      setError('Falha ao excluir evento no Google Calendar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  return {
    isConnected,
    isLoading,
    lastSync,
    events,
    error,
    connect,
    disconnect,
    syncEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};