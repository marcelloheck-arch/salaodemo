'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Download,
  RefreshCw,
  Settings,
  X
} from "lucide-react";
import { format, addMonths, isAfter, isBefore, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LicenseWithFeatures as License, SimpleClient as LicenseClient } from '@/lib/licenseDatabase';
import { LicenseGenerator, PLAN_CONFIGS } from '@/lib/licenseGenerator';

// Mock data para licenças
const mockLicenses: License[] = [
  {
    id: '1',
    licenseKey: 'SALAO-PREMIUM-2024-001',
    planType: 'premium',
    status: 'active',
    clientId: 'client-1',
    clientName: 'Salão Beleza Total',
    clientEmail: 'contato@belezatotal.com',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2025-01-15'),
    maxUsers: 5,
    features: [
      { id: '1', name: 'Agendamento Online', enabled: true, description: 'Sistema de agendamento via web' },
      { id: '2', name: 'Relatórios Avançados', enabled: true, description: 'Relatórios detalhados e analytics' },
      { id: '3', name: 'Múltiplos Usuários', enabled: true, description: 'Até 5 usuários simultâneos' },
      { id: '4', name: 'Backup Automático', enabled: true, description: 'Backup automático dos dados' }
    ],
    paymentStatus: 'paid',
    renewalDate: new Date('2025-01-15')
  },
  {
    id: '2',
    licenseKey: 'SALAO-BASIC-2024-002',
    planType: 'basic',
    status: 'active',
    clientId: 'client-2',
    clientName: 'Studio de Beleza',
    clientEmail: 'admin@studiobeleza.com',
    createdAt: new Date('2024-03-10'),
    expiresAt: new Date('2025-03-10'),
    maxUsers: 2,
    features: [
      { id: '1', name: 'Agendamento Básico', enabled: true, description: 'Sistema básico de agendamento' },
      { id: '2', name: 'Relatórios Simples', enabled: true, description: 'Relatórios básicos' }
    ],
    paymentStatus: 'paid',
    renewalDate: new Date('2025-03-10')
  },
  {
    id: '3',
    licenseKey: 'SALAO-ENTERPRISE-2024-003',
    planType: 'enterprise',
    status: 'expired',
    clientId: 'client-3',
    clientName: 'Rede de Salões Premium',
    clientEmail: 'corporativo@redepremium.com',
    createdAt: new Date('2023-06-01'),
    expiresAt: new Date('2024-06-01'),
    maxUsers: 20,
    features: [
      { id: '1', name: 'Gestão Multi-lojas', enabled: true, description: 'Gestão de múltiplas unidades' },
      { id: '2', name: 'API Personalizada', enabled: true, description: 'API para integrações customizadas' },
      { id: '3', name: 'Suporte Prioritário', enabled: true, description: 'Suporte 24/7 prioritário' }
    ],
    paymentStatus: 'failed',
    renewalDate: null
  }
];

interface NewLicenseFormProps {
  onSave: (license: License) => void;
  onCancel: () => void;
}

function NewLicenseForm({ onSave, onCancel }: NewLicenseFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    planType: 'basic' as 'basic' | 'premium' | 'enterprise',
    customDuration: 12
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Nome do cliente é obrigatório';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const planConfig = PLAN_CONFIGS.find(plan => plan.type === formData.planType);
    if (!planConfig) {
      alert('Plano não encontrado');
      return;
    }
    
    const clientId = crypto.randomUUID();
    
    // Criar uma configuração personalizada baseada no plano selecionado
    const customPlanConfig = {
      ...planConfig,
      duration: formData.customDuration
    };
    
    const newLicense = LicenseGenerator.generateLicense(
      clientId,
      formData.clientName,
      formData.clientEmail,
      customPlanConfig
    );

    onSave(newLicense);
  };

  const selectedPlan = PLAN_CONFIGS.find(plan => plan.type === formData.planType);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Nova Licença</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Cliente *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.clientName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nome completo do cliente"
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.clientEmail ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="email@exemplo.com"
            />
            {errors.clientEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>
            )}
          </div>
        </div>

        {/* Seleção do Plano */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Plano da Licença
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLAN_CONFIGS.map((plan) => (
              <div
                key={plan.type}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.planType === plan.type
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, planType: plan.type as any }))}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 capitalize">{plan.name}</h4>
                  <span className="text-lg font-bold text-purple-600">
                    R$ {plan.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <User className="w-3 h-3 mr-1" />
                    Até {plan.maxUsers} usuários
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {plan.features.length} recursos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duração personalizada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duração (meses)
          </label>
          <select
            value={formData.customDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, customDuration: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={1}>1 mês</option>
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
            <option value={24}>24 meses</option>
          </select>
        </div>

        {/* Resumo do Plano */}
        {selectedPlan && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Resumo da Licença</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Plano:</span>
                <span className="ml-2 font-medium">{selectedPlan.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Valor:</span>
                <span className="ml-2 font-medium">R$ {selectedPlan.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Duração:</span>
                <span className="ml-2 font-medium">{formData.customDuration} meses</span>
              </div>
              <div>
                <span className="text-gray-600">Usuários:</span>
                <span className="ml-2 font-medium">Até {selectedPlan.maxUsers}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Gerar Licença
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LicenseManagementPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [showNewLicense, setShowNewLicense] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [showLicenseDetails, setShowLicenseDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, expiringSoon: 0 });

  // Carregar licenças do banco de dados
  const loadLicenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/licenses');
      if (response.ok) {
        const data = await response.json();
        // Converter strings de data para objetos Date
        const licensesWithDates = data.map((license: any) => ({
          ...license,
          createdAt: new Date(license.createdAt),
          expiresAt: new Date(license.expiresAt),
          renewalDate: license.renewalDate ? new Date(license.renewalDate) : null
        }));
        setLicenses(licensesWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar licenças:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      const response = await fetch('/api/licenses?action=stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadLicenses();
    loadStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'expired': return 'Expirada';
      case 'suspended': return 'Suspensa';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enterprise': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilExpiry = (expiresAt: Date) => {
    return differenceInDays(expiresAt, new Date());
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.licenseKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    const matchesPlan = planFilter === 'all' || license.planType === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleNewLicense = async (newLicense: License) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: newLicense.licenseKey,
          planType: newLicense.planType,
          clientId: newLicense.clientId,
          clientName: newLicense.clientName,
          clientEmail: newLicense.clientEmail,
          expiresAt: newLicense.expiresAt,
          maxUsers: newLicense.maxUsers,
          features: newLicense.features
        })
      });

      if (response.ok) {
        const savedLicense = await response.json();
        // Converter datas
        const licenseWithDates = {
          ...savedLicense,
          createdAt: new Date(savedLicense.createdAt),
          expiresAt: new Date(savedLicense.expiresAt),
          renewalDate: savedLicense.renewalDate ? new Date(savedLicense.renewalDate) : null
        };
        
        setLicenses(prev => [licenseWithDates, ...prev]);
        setShowNewLicense(false);
        loadStats(); // Atualizar estatísticas
      } else {
        alert('Erro ao salvar licença');
      }
    } catch (error) {
      console.error('Erro ao criar licença:', error);
      alert('Erro ao salvar licença');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLicense = async (licenseId: string) => {
    if (confirm('Tem certeza que deseja excluir esta licença?')) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/licenses?id=${licenseId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setLicenses(prev => prev.filter(l => l.id !== licenseId));
          loadStats(); // Atualizar estatísticas
        } else {
          alert('Erro ao excluir licença');
        }
      } catch (error) {
        console.error('Erro ao excluir licença:', error);
        alert('Erro ao excluir licença');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRenewLicense = async (license: License) => {
    try {
      setIsLoading(true);
      const renewedData = {
        status: 'active',
        expiresAt: addMonths(new Date(), 12),
        renewalDate: addMonths(new Date(), 12)
      };

      const response = await fetch(`/api/licenses?id=${license.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renewedData)
      });

      if (response.ok) {
        const updatedLicense = await response.json();
        const licenseWithDates = {
          ...updatedLicense,
          createdAt: new Date(updatedLicense.createdAt),
          expiresAt: new Date(updatedLicense.expiresAt),
          renewalDate: updatedLicense.renewalDate ? new Date(updatedLicense.renewalDate) : null
        };
        
        setLicenses(prev => prev.map(l => l.id === license.id ? licenseWithDates : l));
        if (selectedLicense?.id === license.id) {
          setSelectedLicense(licenseWithDates);
        }
        loadStats(); // Atualizar estatísticas
      } else {
        alert('Erro ao renovar licença');
      }
    } catch (error) {
      console.error('Erro ao renovar licença:', error);
      alert('Erro ao renovar licença');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLicenseStatus = async (license: License, newStatus: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/licenses?id=${license.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedLicense = await response.json();
        const licenseWithDates = {
          ...updatedLicense,
          createdAt: new Date(updatedLicense.createdAt),
          expiresAt: new Date(updatedLicense.expiresAt),
          renewalDate: updatedLicense.renewalDate ? new Date(updatedLicense.renewalDate) : null
        };
        
        setLicenses(prev => prev.map(l => l.id === license.id ? licenseWithDates : l));
        setSelectedLicense(licenseWithDates);
        loadStats(); // Atualizar estatísticas
      } else {
        alert('Erro ao atualizar licença');
      }
    } catch (error) {
      console.error('Erro ao atualizar licença:', error);
      alert('Erro ao atualizar licença');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSettings = (license: License) => {
    setSelectedLicense(license);
    setShowSettings(true);
  };

  const handleViewLicense = (license: License) => {
    setSelectedLicense(license);
    setShowLicenseDetails(true);
  };

  const activeStats = stats;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Licenças</h2>
          <p className="text-gray-600">Gerencie todas as licenças do sistema</p>
        </div>
        <button
          onClick={() => setShowNewLicense(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Licença</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Licenças</p>
              <p className="text-3xl font-bold">{activeStats.total}</p>
            </div>
            <Key className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Licenças Ativas</p>
              <p className="text-3xl font-bold">{activeStats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Licenças Expiradas</p>
              <p className="text-3xl font-bold">{activeStats.expired}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Expirando em 30 dias</p>
              <p className="text-3xl font-bold">{activeStats.expiringSoon}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, licença ou email..."
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
              <option value="active">Ativas</option>
              <option value="expired">Expiradas</option>
              <option value="suspended">Suspensas</option>
              <option value="pending">Pendentes</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os Planos</option>
              <option value="basic">Básico</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Licenças */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Cliente</th>
                <th className="text-left p-4 font-medium text-gray-700">Licença</th>
                <th className="text-left p-4 font-medium text-gray-700">Plano</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Expira em</th>
                <th className="text-left p-4 font-medium text-gray-700">Usuários</th>
                <th className="text-center p-4 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLicenses.map((license) => {
                const daysUntilExpiry = getDaysUntilExpiry(license.expiresAt);
                
                return (
                  <tr key={license.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{license.clientName}</div>
                        <div className="text-sm text-gray-600">{license.clientEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {license.licenseKey}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full border capitalize ${getPlanColor(license.planType)}`}>
                        {license.planType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(license.status)}`}>
                        {getStatusText(license.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className={daysUntilExpiry <= 30 && daysUntilExpiry > 0 ? 'text-yellow-600' : daysUntilExpiry <= 0 ? 'text-red-600' : 'text-gray-900'}>
                          {format(license.expiresAt, 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {daysUntilExpiry > 0 ? `${daysUntilExpiry} dias` : daysUntilExpiry === 0 ? 'Hoje' : 'Expirada'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900">{license.maxUsers}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewLicense(license)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRenewLicense(license)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Renovar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenSettings(license)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Configurações"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLicense(license.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Licença */}
      {showNewLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <NewLicenseForm 
              onSave={handleNewLicense}
              onCancel={() => setShowNewLicense(false)}
            />
          </div>
        </div>
      )}

      {/* Modal Detalhes da Licença */}
      {showLicenseDetails && selectedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Detalhes da Licença</h3>
              <button
                onClick={() => setShowLicenseDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Info do Cliente */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações do Cliente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nome:</span>
                    <span className="ml-2 font-medium">{selectedLicense.clientName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{selectedLicense.clientEmail}</span>
                  </div>
                </div>
              </div>

              {/* Info da Licença */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações da Licença</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Chave:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                      {selectedLicense.licenseKey}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600">Plano:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded border capitalize ${getPlanColor(selectedLicense.planType)}`}>
                      {selectedLicense.planType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded border ${getStatusColor(selectedLicense.status)}`}>
                      {getStatusText(selectedLicense.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Máx. Usuários:</span>
                    <span className="ml-2 font-medium">{selectedLicense.maxUsers}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Criada em:</span>
                    <span className="ml-2 font-medium">
                      {format(selectedLicense.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expira em:</span>
                    <span className="ml-2 font-medium">
                      {format(selectedLicense.expiresAt, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recursos */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recursos Inclusos</h4>
                <div className="space-y-2">
                  {selectedLicense.features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configurações da Licença */}
      {showSettings && selectedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Configurações da Licença</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status da Licença */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Status da Licença</h4>
                <div className="space-y-2">
                  {['active', 'suspended', 'expired'].map((status) => (
                    <label key={status} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="licenseStatus"
                        value={status}
                        checked={selectedLicense.status === status}
                        onChange={async (e) => {
                          try {
                            setIsLoading(true);
                            const updatedLicense = { ...selectedLicense, status: e.target.value as any };
                            
                            const response = await fetch('/api/licenses', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(updatedLicense),
                            });

                            if (!response.ok) {
                              throw new Error('Falha ao atualizar status da licença');
                            }

                            const updatedData = await response.json();
                            setSelectedLicense(updatedData);
                            setLicenses(prev => prev.map(l => l.id === updatedData.id ? updatedData : l));
                          } catch (error) {
                            console.error('Erro ao atualizar status:', error);
                            alert('Erro ao atualizar status da licença');
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="text-purple-600"
                      />
                      <span className="text-sm capitalize">
                        {status === 'active' ? 'Ativa' : status === 'suspended' ? 'Suspensa' : 'Expirada'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ações Rápidas */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Ações Rápidas</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleRenewLicense(selectedLicense);
                      setShowSettings(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    🔄 Renovar por 12 meses
                  </button>
                  
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const suspendedLicense = { ...selectedLicense, status: 'suspended' as const };
                        
                        const response = await fetch('/api/licenses', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(suspendedLicense),
                        });

                        if (!response.ok) {
                          throw new Error('Falha ao suspender licença');
                        }

                        const updatedData = await response.json();
                        setSelectedLicense(updatedData);
                        setLicenses(prev => prev.map(l => l.id === updatedData.id ? updatedData : l));
                      } catch (error) {
                        console.error('Erro ao suspender licença:', error);
                        alert('Erro ao suspender licença');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    ⏸️ Suspender temporariamente
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta licença? Esta ação não pode ser desfeita.')) {
                        handleDeleteLicense(selectedLicense.id);
                        setShowSettings(false);
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    🗑️ Excluir licença
                  </button>
                </div>
              </div>

              {/* Informações da Licença */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <span className="ml-2 font-mono">{selectedLicense.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Criada em:</span>
                    <span className="ml-2">{format(selectedLicense.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Última atualização:</span>
                    <span className="ml-2">{format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}