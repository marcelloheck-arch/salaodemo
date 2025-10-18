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
  ChevronRight,
  Eye
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CalendarViewModal from './CalendarViewModalSimple';

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

interface NewAppointmentFormProps {
  onSave: (appointment: Appointment) => void;
  onCancel: () => void;
}

function NewAppointmentForm({ onSave, onCancel }: NewAppointmentFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    service: '',
    professional: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    notes: ''
  });

  const services = [
    { name: 'Corte Feminino', duration: 60, price: 80 },
    { name: 'Corte Masculino', duration: 45, price: 50 },
    { name: 'Corte + Escova', duration: 90, price: 120 },
    { name: 'Coloração', duration: 180, price: 200 },
    { name: 'Manicure', duration: 60, price: 40 },
    { name: 'Pedicure', duration: 60, price: 50 },
    { name: 'Manicure + Pedicure', duration: 90, price: 80 },
    { name: 'Sobrancelha', duration: 30, price: 35 },
    { name: 'Escova', duration: 60, price: 70 },
    { name: 'Hidratação', duration: 90, price: 120 }
  ];

  const professionals = [
    'Ana Costa',
    'Carlos Lima',
    'Sofia Mendes', 
    'Lucas Oliveira',
    'Beatriz Santos'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedService = services.find(s => s.name === formData.service);
    if (!selectedService) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      service: formData.service,
      professional: formData.professional,
      date: formData.date,
      time: formData.time,
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'pending',
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    onSave(newAppointment);
  };

  const isFormValid = formData.clientName && formData.clientPhone && formData.service && 
                     formData.professional && formData.date && formData.time;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Cliente *
          </label>
          <input
            type="text"
            required
            value={formData.clientName}
            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            placeholder="Digite o nome completo"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            required
            value={formData.clientPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Serviço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serviço *
          </label>
          <select
            required
            value={formData.service}
            onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name} - R$ {service.price} ({service.duration}min)
              </option>
            ))}
          </select>
        </div>

        {/* Profissional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profissional *
          </label>
          <select
            required
            value={formData.professional}
            onChange={(e) => setFormData(prev => ({ ...prev, professional: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            <option value="">Selecione um profissional</option>
            {professionals.map((professional) => (
              <option key={professional} value={professional}>
                {professional}
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          />
        </div>

        {/* Horário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário *
          </label>
          <select
            required
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            <option value="">Selecione um horário</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          placeholder="Observações especiais para o atendimento..."
        />
      </div>

      {/* Resumo do Agendamento */}
      {formData.service && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-2">📋 Resumo do Agendamento</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div><strong>Cliente:</strong> {formData.clientName}</div>
            <div><strong>Serviço:</strong> {formData.service}</div>
            <div><strong>Profissional:</strong> {formData.professional}</div>
            <div><strong>Data/Hora:</strong> {formData.date && format(new Date(formData.date), "dd/MM/yyyy", { locale: ptBR })} às {formData.time}</div>
            {(() => {
              const service = services.find(s => s.name === formData.service);
              return service && (
                <>
                  <div><strong>Duração:</strong> {service.duration} minutos</div>
                  <div><strong>Valor:</strong> R$ {service.price.toFixed(2)}</div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          🎯 Agendar
        </button>
      </div>
    </form>
  );
}

const mockAppointments: Appointment[] = [
  // Lista vazia - sem dados pré-preenchidos
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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Ações de agendamentos
  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    setShowActionMenu(null);
  };

  const deleteAppointment = (appointmentId: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      setShowActionMenu(null);
    }
  };

  const getStatusActions = (appointment: Appointment) => {
    const actions = [];
    
    switch (appointment.status) {
      case 'pending':
        actions.push(
          { label: '✅ Confirmar', action: () => updateAppointmentStatus(appointment.id, 'confirmed'), color: 'text-green-600' },
          { label: '❌ Cancelar', action: () => updateAppointmentStatus(appointment.id, 'cancelled'), color: 'text-red-600' }
        );
        break;
      case 'confirmed':
        actions.push(
          { label: '🚀 Iniciar Atendimento', action: () => updateAppointmentStatus(appointment.id, 'completed'), color: 'text-blue-600' },
          { label: '❌ Cancelar', action: () => updateAppointmentStatus(appointment.id, 'cancelled'), color: 'text-red-600' }
        );
        break;
      case 'completed':
        actions.push(
          { label: '🔄 Reagendar', action: () => setSelectedAppointment(appointment), color: 'text-blue-600' }
        );
        break;
      case 'cancelled':
        actions.push(
          { label: '🔄 Reativar', action: () => updateAppointmentStatus(appointment.id, 'pending'), color: 'text-blue-600' }
        );
        break;
    }
    
    actions.push(
      { label: '✏️ Editar', action: () => setSelectedAppointment(appointment), color: 'text-gray-600' },
      { label: '🗑️ Excluir', action: () => deleteAppointment(appointment.id), color: 'text-red-600' }
    );
    
    return actions;
  };

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
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Agendamentos</h2>
            <p className="text-gray-600 text-sm">Gerencie todos os agendamentos do salão</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Botão Visualizar Agenda */}
            <button
              onClick={() => {
                console.log('Clicou em Visualizar Agenda');
                setShowCalendarModal(true);
              }}
              className="bg-white text-blue-600 border-2 border-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2 shadow-lg text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Visualizar Agenda</span>
            </button>
            
            {/* Botão Novo Agendamento */}
            <button
              onClick={() => setShowNewAppointment(true)}
              className="bg-gradient-to-r from-slate-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-slate-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Agendamento</span>
            </button>
          </div>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
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
                      ? 'bg-blue-600 text-white'
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
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                    <div className="ml-4 relative">
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === appointment.id ? null : appointment.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      
                      {/* Menu de Ações */}
                      {showActionMenu === appointment.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-2">
                            {getStatusActions(appointment).map((action, index) => (
                              <button
                                key={index}
                                onClick={action.action}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${action.color}`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Summary Footer */}
      {filteredAppointments.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
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

      {/* Modal de Novo Agendamento */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">✨ Novo Agendamento</h3>
                <button
                  onClick={() => setShowNewAppointment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <NewAppointmentForm 
                onSave={(appointment) => {
                  setAppointments(prev => [...prev, appointment]);
                  setShowNewAppointment(false);
                }}
                onCancel={() => setShowNewAppointment(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização da Agenda */}
      <CalendarViewModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        appointments={appointments}
      />
    </div>
  );
}
