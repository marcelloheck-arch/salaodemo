'use client';

import React, { useState, useEffect } from 'react';
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

  // Debug logs
  useEffect(() => {
    console.log('CalendarViewModal montado:', { isOpen, viewMode, appointmentsCount: appointments.length });
  }, [isOpen, viewMode, appointments.length]);

  if (!isOpen) {
    console.log('Modal não está aberto, retornando null');
    return null;
  }

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

  const handleViewModeChange = (mode: 'week' | 'month') => {
    console.log(`Mudando para modo: ${mode}`);
    setViewMode(mode);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    console.log(`Navegando: ${direction} no modo ${viewMode}`);
    if (viewMode === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
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

  const getAppointmentsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dayStr);
  };

  const renderSimpleContent = () => {
    return (
      <div className="flex-1 p-3 md:p-6 bg-gray-50 overflow-y-auto min-h-0">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm h-full">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Visualização de Agenda - {viewMode === 'week' ? 'Semana' : 'Mês'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                <span className="text-sm md:text-base text-gray-700">Período atual:</span>
                <span className="font-medium text-sm md:text-base text-gray-900">{getPeriodText()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                <span className="text-sm md:text-base text-gray-700">Total de agendamentos:</span>
                <span className="font-medium text-sm md:text-base text-gray-900">{appointments.length}</span>
              </div>
            </div>
            
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-h-96 overflow-y-auto">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 md:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm md:text-base text-gray-900 truncate">{appointment.clientName}</span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{appointment.date} às {appointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Scissors className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{appointment.service}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                          <span>{appointment.duration} min</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                          <span className="font-medium">R$ {appointment.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-base md:text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h4>
                <p className="text-sm md:text-base text-gray-500">
                  Não há agendamentos para o período selecionado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleCloseModal = () => {
    console.log('Fechando modal');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('Clique no backdrop, fechando modal');
      onClose();
    }
  };

  console.log('Renderizando modal com isOpen:', isOpen);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white rounded-t-xl shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">Visualização de Agenda</h2>
            </div>
            
            {/* Toggle Views */}
            <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => handleViewModeChange('week')}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all ${
                  viewMode === 'week'
                    ? 'bg-slate-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('month')}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all ${
                  viewMode === 'month'
                    ? 'bg-slate-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Mês
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-white shrink-0">
          <button
            type="button"
            onClick={() => handleNavigation('prev')}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>

          <h3 className="text-base md:text-xl font-semibold text-gray-900 capitalize">
            {getPeriodText()}
          </h3>

          <button
            type="button"
            onClick={() => handleNavigation('next')}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {renderSimpleContent()}

        {/* Footer com legenda */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-3 md:p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0">
          {[
            { status: 'confirmed', label: 'Confirmado' },
            { status: 'pending', label: 'Pendente' },
            { status: 'completed', label: 'Concluído' },
            { status: 'cancelled', label: 'Cancelado' },
            { status: 'no_show', label: 'Não compareceu' }
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center space-x-1 md:space-x-2">
              <div className={`w-2 h-2 md:w-3 md:h-3 rounded border ${getStatusColor(status)}`}></div>
              <span className="text-xs md:text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
