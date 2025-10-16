import React from 'react';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GoogleCalendarEvent } from '../types/schedule';

interface GoogleCalendarEventsProps {
  events: GoogleCalendarEvent[];
  selectedDate: Date;
  onEventClick?: (event: GoogleCalendarEvent) => void;
}

export default function GoogleCalendarEvents({ 
  events, 
  selectedDate, 
  onEventClick 
}: GoogleCalendarEventsProps) {
  // Filtrar eventos do dia selecionado
  const dayEvents = events.filter(event => {
    const eventDate = parseISO(event.start.dateTime);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  const getEventTypeColor = (summary: string) => {
    const lowerSummary = summary.toLowerCase();
    
    if (lowerSummary.includes('reunião') || lowerSummary.includes('meeting')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (lowerSummary.includes('curso') || lowerSummary.includes('treinamento')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lowerSummary.includes('cliente') || lowerSummary.includes('agendamento')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    if (lowerSummary.includes('pausa') || lowerSummary.includes('almoço')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  const getEventDuration = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes}min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h${minutes}min` : `${hours}h`;
    }
  };

  if (dayEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Eventos do Google Calendar
          </h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-2">Nenhum evento para este dia</p>
          <p className="text-sm text-gray-400">
            {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Eventos do Google Calendar
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{dayEvents.length} eventos</span>
        </div>
      </div>

      <div className="space-y-3">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getEventTypeColor(event.summary)}`}
            onClick={() => onEventClick?.(event)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 flex-1">
                {event.summary}
              </h4>
              <ExternalLink className="w-4 h-4 text-gray-500 ml-2 flex-shrink-0" />
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatEventTime(event.start.dateTime, event.end.dateTime)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{getEventDuration(event.start.dateTime, event.end.dateTime)}</span>
              </div>
            </div>

            {event.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                event.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                event.status === 'tentative' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {event.status === 'confirmed' ? 'Confirmado' :
                 event.status === 'tentative' ? 'Tentativo' : 'Desconhecido'}
              </span>
              
              <span className="text-xs text-gray-500">
                Google Calendar
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo dos eventos */}
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total de eventos:</span>
            <span className="ml-2 font-medium text-gray-900">{dayEvents.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Tempo total:</span>
            <span className="ml-2 font-medium text-gray-900">
              {dayEvents.reduce((total, event) => {
                const start = parseISO(event.start.dateTime);
                const end = parseISO(event.end.dateTime);
                return total + Math.round((end.getTime() - start.getTime()) / (1000 * 60));
              }, 0)}min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}