"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search,
  Filter,
  Clock,
  User,
  Phone,
  Scissors,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
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

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Maria Silva",
    clientPhone: "(11) 99999-1234",
    service: "Corte + Escova",
    professional: "Ana Costa",
    date: "2025-10-06",
    time: "09:00",
    duration: 90,
    price: 85.00,
    status: "confirmed",
    notes: "Cliente prefere corte moderno",
    createdAt: "2025-10-05T14:30:00"
  },
  {
    id: "2", 
    clientName: "João Santos",
    clientPhone: "(11) 98888-5678",
    service: "Corte Masculino",
    professional: "Carlos Barbeiro",
    date: "2025-10-06",
    time: "10:30",
    duration: 60,
    price: 45.00,
    status: "pending",
    createdAt: "2025-10-06T08:15:00"
  },
  {
    id: "3",
    clientName: "Fernanda Lima",
    clientPhone: "(11) 97777-9012",
    service: "Manicure + Pedicure",
    professional: "Lucia Nails",
    date: "2025-10-06",
    time: "14:00",
    duration: 120,
    price: 65.00,
    status: "confirmed",
    createdAt: "2025-10-05T16:45:00"
  },
  {
    id: "4",
    clientName: "Pedro Oliveira",
    clientPhone: "(11) 96666-3456",
    service: "Barba",
    professional: "Carlos Barbeiro",
    date: "2025-10-06",
    time: "16:00",
    duration: 45,
    price: 30.00,
    status: "completed",
    createdAt: "2025-10-05T12:20:00"
  }
];

const statusColors = {
  confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
  completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  no_show: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
};

const statusLabels = {
  confirmed: 'Confirmado',
  pending: 'Pendente', 
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não Compareceu'
};

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  // Filtrar agendamentos
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.clientPhone.includes(searchTerm) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    const matchesDate = viewMode === 'day' 
      ? appointment.date === format(selectedDate, 'yyyy-MM-dd')
      : true; // Para week/month implementar depois
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Navegação de datas
  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setSelectedDate(prev => direction === 'next' ? addDays(prev, 1) : subDays(prev, 1));
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Agendamentos</h2>
            <p className="text-gray-600">Gerencie todos os agendamentos do salão</p>
          </div>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Agendamento</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, telefone ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os Status</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
              <option value="no_show">Não Compareceu</option>
            </select>

            {/* View Mode */}
            <div className="flex rounded-lg border border-gray-300">
              {['day', 'week', 'month'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-4 py-2 text-sm font-medium capitalize ${
                    viewMode === mode
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${mode === 'day' ? 'rounded-l-lg' : mode === 'month' ? 'rounded-r-lg' : ''}`}
                >
                  {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {format(selectedDate, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
            </h3>
            {!isToday(selectedDate) && (
              <button
                onClick={goToToday}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Ir para hoje
              </button>
            )}
          </div>

          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há agendamentos para esta data'}
            </p>
            <button
              onClick={() => setShowNewAppointment(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Criar Primeiro Agendamento
            </button>
          </div>
        ) : (
          filteredAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((appointment) => {
              const StatusIcon = statusColors[appointment.status].icon;
              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* Time */}
                        <div className="flex flex-col items-center min-w-0">
                          <div className="text-2xl font-bold text-gray-900">
                            {appointment.time}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.duration}min
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {appointment.clientName}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status].bg} ${statusColors[appointment.status].text}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusLabels[appointment.status]}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.clientPhone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Scissors className="w-4 h-4" />
                              <span>{appointment.service}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{appointment.professional}</span>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{appointment.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-lg font-bold text-green-600">
                            <DollarSign className="w-5 h-5" />
                            <span>R$ {appointment.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Summary Footer */}
      {filteredAppointments.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredAppointments.length}
              </div>
              <div className="text-sm text-gray-600">Agendamentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                R$ {filteredAppointments.reduce((sum, apt) => sum + apt.price, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Receita Prevista</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredAppointments.filter(apt => apt.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Agendamento (placeholder) */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Novo Agendamento</h3>
            <p className="text-gray-600 mb-4">
              Funcionalidade em desenvolvimento. Será integrada com o AI Agent para agendamento automático via WhatsApp.
            </p>
            <button
              onClick={() => setShowNewAppointment(false)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}