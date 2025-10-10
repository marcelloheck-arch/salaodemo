'use client';

import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Scissors,
  DollarSign,
  Eye
} from 'lucide-react';
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday, 
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  getDay,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
}

interface CalendarViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

export default function CalendarViewModal({ isOpen, onClose, appointments }: CalendarViewModalProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  console.log('CalendarViewModal renderizando:', { isOpen, viewMode, appointmentsCount: appointments.length });

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'no_show': return 'Não compareceu';
      default: return status;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
  };

  const getDaysToShow = () => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { locale: ptBR });
      const end = endOfWeek(currentDate, { locale: ptBR });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const getAppointmentsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dayStr);
  };

  const renderWeekView = () => {
    const days = getDaysToShow();
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 min-w-full">
          {/* Header de horários */}
          <div className="border-r border-gray-200 bg-gray-50 p-2">
            <div className="h-16 flex items-center justify-center font-medium text-gray-700">
              Horário
            </div>
          </div>

          {/* Headers dos dias */}
          {days.map((day) => (
            <div key={day.toString()} className="border-r border-gray-200 bg-gray-50 p-2">
              <div className="h-16 flex flex-col items-center justify-center">
                <div className="text-sm font-medium text-gray-700">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className={`text-lg font-bold ${isToday(day) ? 'text-purple-600' : 'text-gray-900'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            </div>
          ))}

          {/* Grade de horários */}
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              {/* Coluna de horário */}
              <div className="border-r border-b border-gray-200 p-2 bg-gray-50">
                <div className="h-16 flex items-center justify-center text-sm font-medium text-gray-700">
                  {time}
                </div>
              </div>

              {/* Colunas dos dias */}
              {days.map((day) => {
                const dayAppointments = getAppointmentsForDay(day).filter(apt => apt.time === time);
                
                return (
                  <div key={`${day.toString()}-${time}`} className="border-r border-b border-gray-200 p-1 min-h-[64px]">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`p-2 rounded text-xs mb-1 border ${getStatusColor(appointment.status)}`}
                      >
                        <div className="font-medium truncate">{appointment.clientName}</div>
                        <div className="truncate">{appointment.service}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.duration}min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { locale: ptBR });
    const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Organizar em semanas
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 gap-0 border border-gray-200">
          {/* Headers dos dias da semana */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="bg-gray-50 border-b border-gray-200 p-2 text-center font-medium text-gray-700">
              {day}
            </div>
          ))}

          {/* Dias do mês */}
          {weeks.map((week, weekIndex) => (
            week.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isCurrentMonth = format(day, 'M') === format(currentDate, 'M');

              return (
                <div
                  key={day.toString()}
                  className={`border-b border-r border-gray-200 p-2 min-h-[120px] ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-purple-600' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`p-1 rounded text-xs border ${getStatusColor(appointment.status)}`}
                      >
                        <div className="font-medium truncate">{appointment.time}</div>
                        <div className="truncate">{appointment.clientName}</div>
                      </div>
                    ))}
                    
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayAppointments.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  };

  const getPeriodText = () => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { locale: ptBR });
      const end = endOfWeek(currentDate, { locale: ptBR });
      return `${format(start, 'd/M')} - ${format(end, 'd/M/yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col relative">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
            </div>
            
            {/* Toggle de visualização */}
            <div className="flex rounded-lg border border-gray-300 bg-white">
              <button
                onClick={() => {
                  console.log('Clicou em Semana');
                  setViewMode('week');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all ${
                  viewMode === 'week'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{ position: 'relative', zIndex: 10 }}
              >
                Semana
              </button>
              <button
                onClick={() => {
                  console.log('Clicou em Mês');
                  setViewMode('month');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-all ${
                  viewMode === 'month'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{ position: 'relative', zIndex: 10 }}
              >
                Mês
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              console.log('Clicou em fechar modal');
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => {
              console.log('Navegando para período anterior');
              navigateDate('prev');
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h3 className="text-xl font-semibold text-gray-900 capitalize">
            {getPeriodText()}
          </h3>

          <button
            onClick={() => {
              console.log('Navegando para próximo período');
              navigateDate('next');
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Conteúdo da agenda */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2">
              Visualização: {viewMode === 'week' ? 'Semana' : 'Mês'}
            </h4>
            <p className="text-gray-600 mb-4">
              Período: {getPeriodText()}
            </p>
            <p className="text-sm text-gray-500">
              Total de agendamentos: {appointments.length}
            </p>
          </div>
          
          {viewMode === 'week' ? (
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-medium mb-2">Vista Semanal</h5>
              {renderWeekView()}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-medium mb-2">Vista Mensal</h5>
              {renderMonthView()}
            </div>
          )}
        </div>

        {/* Legenda de status */}
        <div className="flex items-center justify-center space-x-4 p-4 border-t border-gray-200 bg-gray-50">
          {[
            { status: 'confirmed', label: 'Confirmado' },
            { status: 'pending', label: 'Pendente' },
            { status: 'completed', label: 'Concluído' },
            { status: 'cancelled', label: 'Cancelado' },
            { status: 'no_show', label: 'Não compareceu' }
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded border ${getStatusColor(status)}`}></div>
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}