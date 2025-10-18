'use client';

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  RotateCcw,
  User,
  CreditCard,
  PiggyBank,
  BarChart3,
  Target,
  Clock,
  Plus,
  Search,
  Download,
  Eye,
  Edit2
} from 'lucide-react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Professional, FinancialTransaction, Commission, Service, FinancialSummary, DateFilter } from '../types/financial';

// Mock data
const mockProfessionals: Professional[] = [
  // Lista vazia - sem dados pré-preenchidos
];

const mockServices: Service[] = [
  // Lista vazia - sem dados pré-preenchidos
];

const mockTransactions: FinancialTransaction[] = [
  // Lista vazia - sem dados pré-preenchidos
];

const paymentMethodLabels = {
  cash: 'Dinheiro',
  card: 'Cartão',
  pix: 'PIX',
  transfer: 'Transferência'
};

const statusLabels = {
  pending: 'Pendente',
  paid: 'Pago',
  cancelled: 'Cancelado'
};

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  paid: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' }
};

export default function CaixaPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [services, setServices] = useState<Service[]>(mockServices);
  
  // Filtros
  const [filters, setFilters] = useState<DateFilter>({
    startDate: "2025-10-01",
    endDate: "2025-10-06",
    professionalId: ""
  });

  // Estados dos modais
  const [showNewProfessional, setShowNewProfessional] = useState(false);
  const [showNewService, setShowNewService] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    price: 0,
    duration: 60,
    commission: 30
  });

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      const startDate = parseISO(filters.startDate);
      const endDate = parseISO(filters.endDate);
      
      const isInDateRange = isWithinInterval(transactionDate, { start: startDate, end: endDate });
      const matchesProfessional = !filters.professionalId || transaction.professionalId === filters.professionalId;
      
      return isInDateRange && matchesProfessional;
    });
  }, [transactions, filters]);

  // Calcular resumo financeiro
  const financialSummary = useMemo((): FinancialSummary => {
    const summary: FinancialSummary = {
      totalRevenue: 0,
      serviceRevenue: 0,
      averageTicket: 0,
      totalClients: 0,
      totalTransactions: filteredTransactions.length,
      pendingCommissions: 0,
      totalCommissions: 0,
      revenueByProfessional: {},
      revenueByService: {},
      commissionsByProfessional: {}
    };

    const uniqueClients = new Set<string>();

    filteredTransactions.forEach(transaction => {
      if (transaction.status === 'paid') {
        summary.totalRevenue += transaction.amount;
        if (transaction.type === 'service') {
          summary.serviceRevenue += transaction.amount;
        }
        
        // Receita por profissional
        if (!summary.revenueByProfessional[transaction.professionalName]) {
          summary.revenueByProfessional[transaction.professionalName] = 0;
        }
        summary.revenueByProfessional[transaction.professionalName] += transaction.amount;
        
        // Receita por serviço
        if (!summary.revenueByService[transaction.serviceName]) {
          summary.revenueByService[transaction.serviceName] = 0;
        }
        summary.revenueByService[transaction.serviceName] += transaction.amount;
        
        // Comissões por profissional
        if (!summary.commissionsByProfessional[transaction.professionalName]) {
          summary.commissionsByProfessional[transaction.professionalName] = 0;
        }
        summary.commissionsByProfessional[transaction.professionalName] += transaction.commissionAmount;
        summary.totalCommissions += transaction.commissionAmount;
      }
      
      if (transaction.status === 'pending') {
        summary.pendingCommissions += transaction.commissionAmount;
      }
      
      uniqueClients.add(transaction.clientId);
    });

    summary.totalClients = uniqueClients.size;
    summary.averageTicket = summary.totalClients > 0 ? summary.serviceRevenue / summary.totalClients : 0;

    return summary;
  }, [filteredTransactions]);

  const handleApplyFilters = () => {
    console.log('Filtros aplicados:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: "2025-10-01",
      endDate: "2025-10-06",
      professionalId: ""
    });
  };

  // Funções para editar transações
  const handleEditTransaction = (transaction: FinancialTransaction) => {
    setEditingTransaction(transaction);
    setShowEditTransaction(true);
  };

  const handleSaveTransaction = () => {
    if (editingTransaction) {
      setTransactions(prev => 
        prev.map(t => t.id === editingTransaction.id ? editingTransaction : t)
      );
      setShowEditTransaction(false);
      setEditingTransaction(null);
    }
  };

  const handleCreateService = () => {
    if (newService.name && newService.category && newService.price > 0) {
      const service: Service = {
        id: `service-${Date.now()}`,
        name: newService.name,
        category: newService.category,
        price: newService.price,
        duration: newService.duration,
        commission: newService.commission,
        isActive: true
      };
      
      setServices(prev => [...prev, service]);
      setNewService({
        name: '',
        category: '',
        price: 0,
        duration: 60,
        commission: 30
      });
      setShowNewService(false);
    }
  };

  const handleCreateProfessional = (newProfessional: Omit<Professional, 'id' | 'createdAt'>) => {
    const professional: Professional = {
      ...newProfessional,
      id: (professionals.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    setProfessionals(prev => [...prev, professional]);
    setShowNewProfessional(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Controle de Caixa</h2>
            <p className="text-gray-600">Relatórios financeiros e comissões</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewProfessional(true)}
              className="bg-gradient-to-r from-slate-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-slate-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Profissional</span>
            </button>
            <button
              onClick={() => setShowNewService(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Serviço</span>
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Pesquisa
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profissional
              </label>
              <select
                value={filters.professionalId}
                onChange={(e) => setFilters(prev => ({ ...prev, professionalId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Todos os profissionais</option>
                {professionals.filter(p => p.isActive).map(professional => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Aplicar</span>
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {financialSummary.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Receita bruta do período</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Atendimentos</p>
                <p className="text-2xl font-bold text-gray-900">{financialSummary.totalClients}</p>
                <p className="text-xs text-gray-500">Clientes atendidos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-slate-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-slate-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ {financialSummary.averageTicket.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Valor médio por atendimento</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <PiggyBank className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Comissões a Pagar</p>
                <p className="text-2xl font-bold text-gray-900">R$ {financialSummary.pendingCommissions.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Valores pendentes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Faturamento por Profissional e por Serviço */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Faturamento por Profissional */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Faturamento por Profissional
            </h3>
            <div className="space-y-4">
              {Object.entries(financialSummary.revenueByProfessional)
                .sort(([,a], [,b]) => b - a)
                .map(([professional, revenue]) => (
                <div key={professional} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{professional}</p>
                    <p className="text-sm text-gray-600">
                      Comissão: R$ {(financialSummary.commissionsByProfessional[professional] || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">R$ {revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {((revenue / financialSummary.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faturamento por Serviço */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Faturamento por Serviço
            </h3>
            <div className="space-y-4">
              {Object.entries(financialSummary.revenueByService)
                .sort(([,a], [,b]) => b - a)
                .map(([service, revenue]) => (
                <div key={service} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{service}</p>
                    <p className="text-sm text-gray-600">
                      {filteredTransactions.filter(t => t.serviceName === service && t.status === 'paid').length} atendimentos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">R$ {revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {((revenue / financialSummary.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Transações do Período
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Profissional</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Serviço</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Comissão</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Pagamento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {format(parseISO(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{transaction.clientName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{transaction.professionalName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{transaction.serviceName}</td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">
                      R$ {transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-600">
                      R$ {transaction.commissionAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {paymentMethodLabels[transaction.paymentMethod]}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[transaction.status].bg} ${statusColors[transaction.status].text}`}>
                        {statusLabels[transaction.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionDetails(true);
                          }}
                          className="text-slate-600 hover:text-purple-800 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar transação"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-gray-600">
                Ajuste os filtros para ver as transações do período desejado
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Profissional */}
      {showNewProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Novo Profissional</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                  <option value="">Selecione a função</option>
                  <option value="Cabeleireiro">Cabeleireiro</option>
                  <option value="Barbeiro">Barbeiro</option>
                  <option value="Manicure">Manicure</option>
                  <option value="Esteticista">Esteticista</option>
                  <option value="Massagista">Massagista</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Comissão (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="40"
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowNewProfessional(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="flex-1 bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes da Transação */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes da Transação</h3>
              <button
                onClick={() => setShowTransactionDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Data:</span>
                  <p className="text-gray-900">{format(parseISO(selectedTransaction.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Valor:</span>
                  <p className="text-green-600 font-bold">R$ {selectedTransaction.amount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Cliente:</span>
                <p className="text-gray-900">{selectedTransaction.clientName}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Profissional:</span>
                <p className="text-gray-900">{selectedTransaction.professionalName}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Serviço:</span>
                <p className="text-gray-900">{selectedTransaction.serviceName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Comissão:</span>
                  <p className="text-slate-600 font-bold">R$ {selectedTransaction.commissionAmount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Forma de Pagamento:</span>
                  <p className="text-gray-900">{paymentMethodLabels[selectedTransaction.paymentMethod]}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedTransaction.status].bg} ${statusColors[selectedTransaction.status].text}`}>
                  {statusLabels[selectedTransaction.status]}
                </span>
              </div>

              {selectedTransaction.notes && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Observações:</span>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTransaction.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowTransactionDetails(false)}
                className="w-full bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Transação */}
      {showEditTransaction && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Editar Transação
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor do Serviço (R$)
                </label>
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    amount: parseFloat(e.target.value) || 0
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comissão (R$)
                </label>
                <input
                  type="number"
                  value={editingTransaction.commissionAmount}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    commissionAmount: parseFloat(e.target.value) || 0
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pagamento
                </label>
                <select
                  value={editingTransaction.paymentMethod}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    paymentMethod: e.target.value as any
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingTransaction.status}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    status: e.target.value as any
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="concluido">Concluído</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditTransaction(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTransaction}
                className="flex-1 bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Serviço */}
      {showNewService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Criar Novo Serviço
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  placeholder="Ex: Corte Feminino"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="cabelo">Cabelo</option>
                  <option value="unha">Unha</option>
                  <option value="estetica">Estética</option>
                  <option value="maquiagem">Maquiagem</option>
                  <option value="sobrancelha">Sobrancelha</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Base (R$)
                </label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})}
                  placeholder="0,00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: parseInt(e.target.value) || 60})}
                  placeholder="60"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  min="15"
                  step="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxa de Comissão (%)
                </label>
                <input
                  type="number"
                  value={newService.commission}
                  onChange={(e) => setNewService({...newService, commission: parseFloat(e.target.value) || 0})}
                  placeholder="30"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewService(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateService}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Serviço
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
