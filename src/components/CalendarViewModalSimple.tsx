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
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Visualização de Agenda - {viewMode === 'week' ? 'Semana' : 'Mês'}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Período atual:</span>
              <span className="font-medium text-gray-900">{getPeriodText()}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total de agendamentos:</span>
              <span className="font-medium text-gray-900">{appointments.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.slice(0, 6).map((appointment) => (
                <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{appointment.clientName}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {appointment.date} às {appointment.time}
                    </div>
                    <div className="flex items-center">
                      <Scissors className="w-4 h-4 mr-2" />
                      {appointment.service}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {appointment.duration} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {appointments.length > 6 && (
              <div className="text-center text-gray-500 text-sm">
                E mais {appointments.length - 6} agendamentos...
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Visualização de Agenda</h2>
            </div>
            
            {/* Toggle Views */}
            <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => handleViewModeChange('week')}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === 'week'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('month')}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === 'month'
                    ? 'bg-purple-600 text-white'
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
          <button
            type="button"
            onClick={() => handleNavigation('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h3 className="text-xl font-semibold text-gray-900 capitalize">
            {getPeriodText()}
          </h3>

          <button
            type="button"
            onClick={() => handleNavigation('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {renderSimpleContent()}

        {/* Footer com legenda */}
        <div className="flex items-center justify-center space-x-4 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0">
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