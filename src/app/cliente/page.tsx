/**/**

 * Área Pública do Cliente - Redirect para Portal * Área Pública do Cliente

 * Redireciona para a página principal onde o cliente pode fazer login/cadastro * Página acessível via link direto para clientes finais consultarem seus agendamentos

 */ */



'use client';'use client';



import { useEffect } from 'react';import React, { useState } from 'react';

import { useRouter } from 'next/navigation';import { Calendar, Clock, User, Phone, Mail, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';



export default function ClientePage() {export default function ClientePage() {

  const router = useRouter();  const [phone, setPhone] = useState('');

  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {  const [loading, setLoading] = useState(false);

    // Redirecionar para a página principal com flag para abrir portal do cliente  const [error, setError] = useState('');

    router.push('/?portal=cliente');

  }, [router]);  // Formatar telefone

  const formatPhone = (value: string) => {

  return (    const numbers = value.replace(/\D/g, '');

    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">    if (numbers.length <= 11) {

      <div className="text-center">      return numbers

        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>        .replace(/(\d{2})(\d)/, '($1) $2')

        <p className="text-gray-600">Redirecionando para o Portal do Cliente...</p>        .replace(/(\d{5})(\d)/, '$1-$2');

      </div>    }

    </div>    return value;

  );  };

}

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
      const response = await fetch(`/api/public/cliente/appointments?phone=${phoneNumbers}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar dados');
      }

      const data = await response.json();
      setClientData(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados. Tente novamente.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Área do Cliente</h1>
                <p className="text-sm text-gray-600">Consulte seus agendamentos</p>
              </div>
            </div>
            
            <a
              href="/"
              className="px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Portal do Cliente</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Buscar Meus Agendamentos
          </h2>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Digite seu telefone"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={15}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
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
            💡 Digite o telefone cadastrado para ver seus agendamentos
          </p>
        </div>

        {/* Client Data */}
        {clientData && (
          <>
            {/* Client Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {clientData.cliente.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {clientData.cliente.phone}
                      </span>
                      {clientData.cliente.email && (
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {clientData.cliente.email}
                        </span>
                      )}
                    </div>
                    {clientData.cliente.salon && (
                      <div className="mt-2 text-sm text-gray-500">
                        📍 {clientData.cliente.salon.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {clientData.cliente.totalVisits}
                  </div>
                  <div className="text-sm text-gray-600">Visitas</div>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {formatCurrency(clientData.cliente.totalSpent)}
                  </div>
                  <div className="text-sm text-gray-600">Total Gasto</div>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Meus Agendamentos
              </h3>

              <div className="space-y-4">
                {clientData.agendamentos.map((agendamento: any) => (
                  <div
                    key={agendamento.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-5 h-5 text-purple-600" />
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
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            👤 {agendamento.professional.name}
                          </span>
                          <span>
                            💰 {formatCurrency(agendamento.service.price)}
                          </span>
                        </div>
                      </div>

                      <div>
                        {getStatusBadge(agendamento.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {clientData.agendamentos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum agendamento encontrado</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Info Box */}
        {!clientData && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bem-vindo!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Digite seu telefone acima para consultar seus agendamentos e histórico de serviços.
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
