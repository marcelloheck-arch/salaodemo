'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Calendar,
  Settings,
  Plus,
  Edit,
  Save,
  X,
  RefreshCw,
  ExternalLink,
  Users,
  AlertCircle,
  CheckCircle,
  MapPin,
  Coffee,
  Expand
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, parseISO, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WorkingHours, TimeSlot, AppointmentSlot, CalendarSettings } from '../types/schedule';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import GoogleCalendarEvents from './GoogleCalendarEvents';
import { AgendaModal } from './AgendaModal';

const mockWorkingHours: WorkingHours[] = [
  {
    id: '1',
    dayOfWeek: 1,
    dayName: 'Segunda-feira',
    isOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
    breakStart: '12:00',
    breakEnd: '14:00',
    maxConcurrentAppointments: 3
  },
  {
    id: '2',
    dayOfWeek: 2,
    dayName: 'Terça-feira',
    isOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
    breakStart: '12:00',
    breakEnd: '14:00',
    maxConcurrentAppointments: 3
  },
  {
    id: '3',
    dayOfWeek: 3,
    dayName: 'Quarta-feira',
    isOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
    breakStart: '12:00',
    breakEnd: '14:00',
    maxConcurrentAppointments: 3
  },
  {
    id: '4',
    dayOfWeek: 4,
    dayName: 'Quinta-feira',
    isOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
    breakStart: '12:00',
    breakEnd: '14:00',
    maxConcurrentAppointments: 3
  },
  {
    id: '5',
    dayOfWeek: 5,
    dayName: 'Sexta-feira',
    isOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
    breakStart: '12:00',
    breakEnd: '14:00',
    maxConcurrentAppointments: 3
  },
  {
    id: '6',
    dayOfWeek: 6,
    dayName: 'Sábado',
    isOpen: true,
    openTime: '08:00',
    closeTime: '17:00',
    maxConcurrentAppointments: 4
  },
  {
    id: '7',
    dayOfWeek: 0,
    dayName: 'Domingo',
    isOpen: false,
    openTime: '09:00',
    closeTime: '17:00',
    maxConcurrentAppointments: 2
  }
];

const mockAppointments: AppointmentSlot[] = [
  {
    id: '1',
    clientName: 'Maria Silva',
    serviceName: 'Corte + Escova',
    professionalName: 'Ana Costa',
    duration: 90,
    startTime: '09:00',
    endTime: '10:30',
    status: 'confirmed',
    googleEventId: 'google-event-1'
  },
  {
    id: '2',
    clientName: 'João Santos',
    serviceName: 'Corte Masculino',
    professionalName: 'Carlos Lima',
    duration: 45,
    startTime: '10:00',
    endTime: '10:45',
    status: 'confirmed'
  },
  {
    id: '3',
    clientName: 'Patricia Oliveira',
    serviceName: 'Manicure',
    professionalName: 'Lucia Fernandes',
    duration: 60,
    startTime: '14:30',
    endTime: '15:30',
    status: 'pending'
  }
];

const mockCalendarSettings: CalendarSettings = {
  googleCalendarIntegration: true,
  googleCalendarId: 'primary',
  autoSyncEnabled: true,
  defaultTimeSlotDuration: 30,
  advanceBookingDays: 30,
  bufferTimeBetweenAppointments: 15
};

export default function HorariosPage() {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(mockWorkingHours);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentSlot[]>(mockAppointments);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>(mockCalendarSettings);
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);

  // Hook do Google Calendar
  const {
    isConnected: isGoogleConnected,
    isLoading: isGoogleLoading,
    lastSync,
    events: googleEvents,
    error: googleError,
    connect: connectGoogle,
    disconnect: disconnectGoogle,
    syncEvents: syncGoogleEvents,
    createEvent,
    updateEvent,
    deleteEvent
  } = useGoogleCalendar({
    calendarId: calendarSettings.googleCalendarId,
    autoSync: calendarSettings.autoSyncEnabled,
    syncInterval: 5
  });

  // Gerar time slots para o dia selecionado
  const timeSlots = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const dayHours = workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
    
    if (!dayHours || !dayHours.isOpen) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const startHour = parseInt(dayHours.openTime.split(':')[0]);
    const startMinute = parseInt(dayHours.openTime.split(':')[1]);
    const endHour = parseInt(dayHours.closeTime.split(':')[0]);
    const endMinute = parseInt(dayHours.closeTime.split(':')[1]);

    const breakStartHour = dayHours.breakStart ? parseInt(dayHours.breakStart.split(':')[0]) : null;
    const breakStartMinute = dayHours.breakStart ? parseInt(dayHours.breakStart.split(':')[1]) : null;
    const breakEndHour = dayHours.breakEnd ? parseInt(dayHours.breakEnd.split(':')[0]) : null;
    const breakEndMinute = dayHours.breakEnd ? parseInt(dayHours.breakEnd.split(':')[1]) : null;

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      const isBreak = breakStartHour !== null && breakEndHour !== null &&
        ((currentHour > breakStartHour) || (currentHour === breakStartHour && currentMinute >= breakStartMinute!)) &&
        ((currentHour < breakEndHour) || (currentHour === breakEndHour && currentMinute < breakEndMinute!));

      const slotAppointments = appointments.filter(apt => 
        apt.startTime <= timeString && apt.endTime > timeString
      );

      slots.push({
        id: `slot-${timeString}`,
        time: timeString,
        isAvailable: !isBreak && slotAppointments.length < dayHours.maxConcurrentAppointments,
        isBreak,
        appointments: slotAppointments
      });

      currentMinute += calendarSettings.defaultTimeSlotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  }, [selectedDate, workingHours, appointments, calendarSettings]);

  // Obter dias da semana atual
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentWeek]);

  const handleSaveWorkingHours = () => {
    setIsEditingHours(false);
    // Aqui você salvaria no backend
    console.log('Horários salvos:', workingHours);
  };

  const handleUpdateWorkingHours = (dayId: string, field: keyof WorkingHours, value: any) => {
    setWorkingHours(prev => 
      prev.map(day => 
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
  };

  const handleGoogleSync = async () => {
    try {
      await syncGoogleEvents();
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      await connectGoogle();
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  const handleDisconnectGoogle = () => {
    disconnectGoogle();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestão de Horários
            </h1>
            <p className="text-gray-600">
              Configure horários de funcionamento e visualize a agenda integrada com Google Calendar
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGoogleSync}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sincronizar</span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </div>
        </div>

        {/* Status da integração */}
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center space-x-2">
            {isGoogleLoading ? (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            ) : isGoogleConnected ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )}
            <span className={`font-medium ${
              isGoogleLoading ? 'text-blue-700' :
              isGoogleConnected ? 'text-green-700' : 'text-yellow-700'
            }`}>
              Google Calendar {
                isGoogleLoading ? 'Conectando...' :
                isGoogleConnected ? 'Conectado' : 'Desconectado'
              }
            </span>
          </div>
          
          {googleError && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{googleError}</span>
            </div>
          )}
          
          {isGoogleConnected && lastSync && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Última sincronização: {format(lastSync, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
            </div>
          )}
          
          {isGoogleConnected && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {googleEvents.length} eventos sincronizados
              </span>
              <button
                onClick={handleDisconnectGoogle}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Desconectar
              </button>
            </div>
          )}
          
          {!isGoogleConnected && !isGoogleLoading && (
            <button
              onClick={handleConnectGoogle}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Conectar agora</span>
            </button>
          )}
        </div>
      </div>

      {/* Horários de Funcionamento - Movido para cima */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Horários de Funcionamento
            </h2>
            {isEditingHours ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveWorkingHours}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm">Salvar</span>
                </button>
                <button
                  onClick={() => setIsEditingHours(false)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">Cancelar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingHours(true)}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Editar</span>
              </button>
            )}
          </div>

          {/* Grid responsivo para os horários */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {workingHours.map((day) => (
              <div key={day.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">{day.dayName}</span>
                  {isEditingHours ? (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={day.isOpen}
                        onChange={(e) => handleUpdateWorkingHours(day.id, 'isOpen', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Aberto</span>
                    </label>
                  ) : (
                    <span className={`text-sm font-medium ${
                      day.isOpen ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {day.isOpen ? 'Aberto' : 'Fechado'}
                    </span>
                  )}
                </div>
                
                {day.isOpen && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Abertura</label>
                        {isEditingHours ? (
                          <input
                            type="time"
                            value={day.openTime}
                            onChange={(e) => handleUpdateWorkingHours(day.id, 'openTime', e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                          />
                        ) : (
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded block text-center">
                            {day.openTime}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fechamento</label>
                        {isEditingHours ? (
                          <input
                            type="time"
                            value={day.closeTime}
                            onChange={(e) => handleUpdateWorkingHours(day.id, 'closeTime', e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                          />
                        ) : (
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded block text-center">
                            {day.closeTime}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {day.breakStart && day.breakEnd && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Pausa início</label>
                          {isEditingHours ? (
                            <input
                              type="time"
                              value={day.breakStart}
                              onChange={(e) => handleUpdateWorkingHours(day.id, 'breakStart', e.target.value)}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <span className="text-sm font-mono bg-orange-100 px-2 py-1 rounded block text-center">
                              {day.breakStart}
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Pausa fim</label>
                          {isEditingHours ? (
                            <input
                              type="time"
                              value={day.breakEnd}
                              onChange={(e) => handleUpdateWorkingHours(day.id, 'breakEnd', e.target.value)}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <span className="text-sm font-mono bg-orange-100 px-2 py-1 rounded block text-center">
                              {day.breakEnd}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Máx. atendimentos simultâneos</label>
                      {isEditingHours ? (
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={day.maxConcurrentAppointments}
                          onChange={(e) => handleUpdateWorkingHours(day.id, 'maxConcurrentAppointments', parseInt(e.target.value))}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded block text-center">
                          {day.maxConcurrentAppointments} atendimentos
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agenda Visual e Google Calendar - Grid melhorado */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Agenda Visual - Agora ocupa mais espaço */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            {/* Seletor de semana */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Agenda da Semana
              </h2>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsAgendaModalOpen(true)}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600"
                  title="Expandir agenda"
                >
                  <Expand className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ←
                </button>
                
                <span className="font-medium text-gray-900">
                  {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd/MM', { locale: ptBR })} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                
                <button
                  onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  →
                </button>
                
                <button
                  onClick={() => setCurrentWeek(new Date())}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Hoje
                </button>
              </div>
            </div>

            {/* Cabeçalhos dos dias */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="text-sm font-medium text-gray-600 text-center py-2">
                Horário
              </div>
              {weekDays.map((day, index) => {
                const dayHours = workingHours.find(wh => wh.dayOfWeek === day.getDay());
                return (
                  <div
                    key={index}
                    className={`text-sm font-medium text-center py-2 rounded-lg cursor-pointer transition-colors ${
                      isSameDay(day, selectedDate)
                        ? 'bg-purple-100 text-purple-700'
                        : isToday(day)
                        ? 'bg-blue-100 text-blue-700'
                        : dayHours?.isOpen
                        ? 'text-gray-900 hover:bg-gray-100'
                        : 'text-gray-400 bg-gray-50'
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div>{format(day, 'EEE', { locale: ptBR })}</div>
                    <div className="text-xs">{format(day, 'dd/MM')}</div>
                    {!dayHours?.isOpen && (
                      <div className="text-xs text-red-500">Fechado</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grade de horários */}
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`grid grid-cols-8 gap-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                        slot.isBreak ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="p-2 text-sm font-mono text-gray-600 border-r">
                        {slot.time}
                      </div>
                      
                      {weekDays.map((day, dayIndex) => {
                        const dayHours = workingHours.find(wh => wh.dayOfWeek === day.getDay());
                        const isSelectedDay = isSameDay(day, selectedDate);
                        
                        return (
                          <div
                            key={dayIndex}
                            className={`p-1 min-h-[40px] text-xs border-r last:border-r-0 ${
                              !dayHours?.isOpen
                                ? 'bg-gray-100'
                                : isSelectedDay && slot.isBreak
                                ? 'bg-orange-100'
                                : isSelectedDay && slot.isAvailable
                                ? 'bg-green-50 hover:bg-green-100'
                                : isSelectedDay
                                ? 'bg-red-50'
                                : ''
                            }`}
                          >
                            {isSelectedDay && slot.appointments.map((apt) => (
                              <div
                                key={apt.id}
                                className={`mb-1 p-1 rounded text-xs border ${getStatusColor(apt.status)}`}
                              >
                                <div className="font-medium truncate">{apt.clientName}</div>
                                <div className="text-xs opacity-75 truncate">{apt.serviceName}</div>
                                <div className="text-xs opacity-75">{apt.professionalName}</div>
                              </div>
                            ))}
                            
                            {isSelectedDay && slot.isBreak && (
                              <div className="flex items-center justify-center h-full text-orange-600">
                                <Coffee className="w-3 h-3" />
                              </div>
                            )}
                            
                            {isSelectedDay && slot.isAvailable && !slot.isBreak && slot.appointments.length === 0 && (
                              <div className="flex items-center justify-center h-full text-green-600 opacity-50">
                                <Plus className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Estabelecimento fechado neste dia</p>
                    <p className="text-sm">Configure os horários de funcionamento</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legenda */}
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span>Ocupado</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                <span>Pausa</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span>Pendente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Eventos do Google Calendar */}
        <div className="xl:col-span-1">
          <GoogleCalendarEvents
            events={googleEvents}
            selectedDate={selectedDate}
            onEventClick={(event) => {
              console.log('Evento clicado:', event);
              // Aqui você pode abrir um modal com detalhes do evento
            }}
          />
        </div>
      </div>

      {/* Modal de Configurações */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configurações do Calendar
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={calendarSettings.googleCalendarIntegration}
                    onChange={(e) => setCalendarSettings({
                      ...calendarSettings,
                      googleCalendarIntegration: e.target.checked
                    })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Integração com Google Calendar</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={calendarSettings.autoSyncEnabled}
                    onChange={(e) => setCalendarSettings({
                      ...calendarSettings,
                      autoSyncEnabled: e.target.checked
                    })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sincronização automática</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração padrão do slot (minutos)
                </label>
                <select
                  value={calendarSettings.defaultTimeSlotDuration}
                  onChange={(e) => setCalendarSettings({
                    ...calendarSettings,
                    defaultTimeSlotDuration: parseInt(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={60}>60 minutos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de intervalo entre atendimentos (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={calendarSettings.bufferTimeBetweenAppointments}
                  onChange={(e) => setCalendarSettings({
                    ...calendarSettings,
                    bufferTimeBetweenAppointments: parseInt(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antecedência máxima para agendamento (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={calendarSettings.advanceBookingDays}
                  onChange={(e) => setCalendarSettings({
                    ...calendarSettings,
                    advanceBookingDays: parseInt(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal da Agenda Expandida */}
      <AgendaModal
        isOpen={isAgendaModalOpen}
        onClose={() => setIsAgendaModalOpen(false)}
        selectedDate={selectedDate}
        workingHours={workingHours}
        appointments={appointments}
        onTimeSlotClick={(date, time) => {
          console.log('Slot clicado:', { date, time });
          // Aqui você pode implementar a lógica para criar um novo agendamento
        }}
      />
    </div>
  );
}