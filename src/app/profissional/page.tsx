/**
 * Área Pública do Profissional
 * Página acessível via link direto para profissionais consultarem seus agendamentos e ganhos
 */

'use client';

import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Phone, Mail, Search, CheckCircle, 
  XCircle, AlertCircle, DollarSign, TrendingUp, Award, Users 
} from 'lucide-react';

interface ProfessionalData {
  profissional: {
    id: string;
    name: string;
    phone: string;
    email: string;
    specialties: string[];
    commissionRate: number;
    salon: {
      name: string;
      address?: string;
      phone?: string;
    };
    totalAppointments: number;
    completedAppointments: number;
    appointmentsThisMonth: number;
    totalEarnings: number;
    earningsThisMonth: number;
  };
  agendamentos: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    service: {
      name: string;
      price: number;
      duration: number;
    };
    client: {
      name: string;
      phone: string;
    };
    notes?: string;
  }>;
  transacoes: Array<{
    id: string;
    date: string;
    amount: number;
    commissionAmount: number;
    paymentMethod: string;
    description?: string;
  }>;
}

export default function ProfissionalPage() {
  const [phone, setPhone] = useState('');
  const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'agendamentos' | 'ganhos'>('agendamentos');

  // Formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSearch = async () => {
    const phoneNumbers = phone.replace(/\D/g, '');
    
    if (phoneNumbers.length < 10) {
      setError('Digite um telefone válido com DDD');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/public/profissional?phone=${encodeURIComponent(phoneNumbers)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar dados');
      }

      const data = await response.json();
      setProfessionalData(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados. Tente novamente.');
      setProfessionalData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      CONFIRMED: { label: 'Confirmado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      COMPLETED: { label: 'Concluído', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: any = {
      DINHEIRO: '💵 Dinheiro',
      CARTAO_CREDITO: '💳 Cartão Crédito',
      CARTAO_DEBITO: '💳 Cartão Débito',
      PIX: '📱 PIX',
      TRANSFERENCIA: '🏦 Transferência',
    };
    return methods[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Área do Profissional</h1>
              <p className="text-sm text-gray-600">Consulte seus agendamentos e ganhos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Buscar Meus Dados
          </h2>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Digite seu telefone"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={15}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>

          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="mt-3 text-xs text-gray-500">
            💡 Digite o telefone cadastrado para ver seus dados
          </p>
        </div>

        {/* Professional Data */}
        {professionalData && (
          <>
            {/* Professional Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {professionalData.profissional.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {professionalData.profissional.phone}
                      </span>
                      {professionalData.profissional.email && (
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {professionalData.profissional.email}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700">
                        📍 {professionalData.profissional.salon.name}
                      </div>
                      {professionalData.profissional.specialties.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {professionalData.profissional.specialties.map((spec, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {professionalData.profissional.totalAppointments}
                  </div>
                  <div className="text-xs text-gray-600">Total Atendimentos</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {professionalData.profissional.appointmentsThisMonth}
                  </div>
                  <div className="text-xs text-gray-600">Este Mês</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(professionalData.profissional.totalEarnings)}
                  </div>
                  <div className="text-xs text-gray-600">Total Ganho</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(professionalData.profissional.earningsThisMonth)}
                  </div>
                  <div className="text-xs text-gray-600">Ganho Mês</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>
                    Taxa de comissão: <strong>{professionalData.profissional.commissionRate}%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('agendamentos')}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                      activeTab === 'agendamentos'
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Agendamentos</span>
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {professionalData.agendamentos.length}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('ganhos')}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                      activeTab === 'ganhos'
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Ganhos</span>
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        {professionalData.transacoes.length}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Agendamentos Tab */}
                {activeTab === 'agendamentos' && (
                  <div className="space-y-4">
                    {professionalData.agendamentos.map((agendamento) => (
                      <div
                        key={agendamento.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold text-gray-900">
                                {formatDate(agendamento.date)}
                              </span>
                              <Clock className="w-4 h-4 text-gray-400 ml-2" />
                              <span className="text-gray-600">
                                {agendamento.startTime} - {agendamento.endTime}
                              </span>
                            </div>
                            
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {agendamento.service.name}
                            </h4>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {agendamento.client.name}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {agendamento.client.phone}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                💰 {formatCurrency(agendamento.service.price)}
                              </span>
                              <span>
                                ⏱️ {agendamento.service.duration} min
                              </span>
                            </div>

                            {agendamento.notes && (
                              <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                📝 {agendamento.notes}
                              </div>
                            )}
                          </div>

                          <div>
                            {getStatusBadge(agendamento.status)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {professionalData.agendamentos.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Nenhum agendamento encontrado</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Ganhos Tab */}
                {activeTab === 'ganhos' && (
                  <div className="space-y-4">
                    {professionalData.transacoes.map((transacao) => (
                      <div
                        key={transacao.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-5 h-5 text-green-600" />
                              <span className="font-semibold text-gray-900">
                                {formatDate(transacao.date)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 mb-2">
                              <div>
                                <div className="text-xs text-gray-600">Valor Total</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {formatCurrency(transacao.amount)}
                                </div>
                              </div>
                              <div className="text-2xl text-gray-300">→</div>
                              <div>
                                <div className="text-xs text-gray-600">Sua Comissão</div>
                                <div className="text-lg font-bold text-green-600">
                                  {formatCurrency(transacao.commissionAmount)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-600">
                                {getPaymentMethodLabel(transacao.paymentMethod)}
                              </span>
                            </div>

                            {transacao.description && (
                              <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                {transacao.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {professionalData.transacoes.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Nenhuma transação encontrada</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Info Box */}
        {!professionalData && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center py-8">
              <Award className="w-16 h-16 mx-auto mb-4 text-blue-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bem-vindo, Profissional!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Digite seu telefone acima para consultar seus agendamentos, ganhos e estatísticas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-gray-500">
        <p>Sistema de Gerenciamento de Salão</p>
        <p className="mt-1">© 2025 - Todos os direitos reservados</p>
      </div>
    </div>
  );
}
