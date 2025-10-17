'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus, 
  Search, 
  Filter,
  Send,
  Key,
  Calendar,
  DollarSign,
  Building
} from 'lucide-react';
import { 
  UserRegistration, 
  SystemLicense, 
  LicensePlan,
  USER_REGISTRATIONS_MOCK, 
  SYSTEM_LICENSES_MOCK, 
  LICENSE_PLANS 
} from '@/types/license';
import { EmailService } from '@/services/emailService';
import { LocalStorageService } from '@/services/LocalStorageService';
import PlanEditor from '@/components/PlanEditor';
import ManualLicenseCreator from '@/components/ManualLicenseCreator';
import PasswordChangeForm from '@/components/PasswordChangeForm';

export default function AdminLicensePanel() {
  const [activeTab, setActiveTab] = useState<'registrations' | 'licenses' | 'clients' | 'plans' | 'create' | 'security'>('registrations');
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [licenses, setLicenses] = useState<SystemLicense[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<UserRegistration | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<SystemLicense | null>(null);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'aprovado' | 'rejeitado' | 'ativa' | 'expirada' | 'suspensa' | 'cancelada'>('all');

  const emailService = EmailService.getInstance();
  const localStorageService = LocalStorageService.getInstance();

  // Carregar dados do localStorage ao montar o componente
  React.useEffect(() => {
    console.log('🔄 Carregando dados do localStorage...');
    
    // Carregar registros salvos
    const savedRegistrations = localStorageService.loadRegistrations();
    console.log('📋 Registros encontrados:', savedRegistrations.length);
    
    // SEMPRE usar os dados do localStorage, mesmo se estiver vazio
    setRegistrations(savedRegistrations);
    
    // Se não há registros, adicionar apenas dados mock como exemplo (não sobrescrever)
    if (savedRegistrations.length === 0) {
      console.log('📝 Nenhum registro encontrado, adicionando dados mock como exemplo');
      const mockData = USER_REGISTRATIONS_MOCK;
      localStorageService.saveRegistrations(mockData);
      setRegistrations(mockData);
    }

    // Carregar licenças salvas
    const savedLicenses = localStorageService.loadLicenses();
    console.log('🔑 Licenças encontradas:', savedLicenses.length);
    
    // SEMPRE usar os dados do localStorage, mesmo se estiver vazio
    setLicenses(savedLicenses);
    
    // Se não há licenças, adicionar apenas dados mock como exemplo (não sobrescrever)
    if (savedLicenses.length === 0) {
      console.log('🔐 Nenhuma licença encontrada, adicionando dados mock como exemplo');
      const mockLicenses = SYSTEM_LICENSES_MOCK;
      localStorageService.saveLicenses(mockLicenses);
      setLicenses(mockLicenses);
    }

    console.log('✅ Dados carregados:', {
      totalRegistrations: savedRegistrations.length,
      totalLicenses: savedLicenses.length
    });
  }, []);

  // Filtrar registros
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: registrations.length,
    pendentes: registrations.filter(r => r.status === 'pendente').length,
    aprovados: registrations.filter(r => r.status === 'aprovado').length,
    rejeitados: registrations.filter(r => r.status === 'rejeitado').length,
    licensesAtivas: licenses.filter(l => l.status === 'ativa').length
  };

  // Gerar chave de ativação
  const generateLicenseKey = (): string => {
    const prefix = 'AGS';
    const year = new Date().getFullYear();
    const segments = Array.from({ length: 3 }, () => 
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
    return `${prefix}-${year}-${segments.join('-')}`;
  };

  // Aprovar registro e gerar licença
  const handleApproveRegistration = async (registration: UserRegistration) => {
    if (!registration.planoSelecionado) {
      alert('Selecione um plano antes de aprovar');
      return;
    }

    const plan = LICENSE_PLANS.find(p => p.id === registration.planoSelecionado);
    if (!plan) {
      alert('Plano não encontrado');
      return;
    }

    // Atualizar status do registro
    const updatedRegistrations = registrations.map(r => 
      r.id === registration.id ? { ...r, status: 'aprovado' as const } : r
    );
    setRegistrations(updatedRegistrations);
    
    // Salvar no localStorage
    localStorageService.saveRegistrations(updatedRegistrations);

    // Criar licença
    const newLicense: SystemLicense = {
      id: `lic_${Date.now()}`,
      chaveAtivacao: generateLicenseKey(),
      userId: registration.id,
      planoId: plan.id,
      status: 'ativa',
      dataAtivacao: new Date(),
      dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      renovacaoAutomatica: true,
      recursosAtivos: plan.recursos,
      observacoesAdmin: `Licença gerada automaticamente para ${registration.nomeEmpresa}`,
      clientData: {
        name: registration.nome,
        email: registration.email,
        phone: registration.telefone,
        company: registration.nomeEmpresa,
        cnpj: registration.cnpj,
        address: registration.endereco,
        city: registration.cidade,
        state: registration.estado
      }
    };

    const updatedLicenses = [...licenses, newLicense];
    setLicenses(updatedLicenses);
    
    // Salvar licenças no localStorage
    localStorageService.saveLicenses(updatedLicenses);
    
    console.log('🔐 LICENÇA CRIADA POR APROVAÇÃO:', {
      chaveAtivacao: newLicense.chaveAtivacao,
      status: newLicense.status,
      clientEmail: newLicense.clientData?.email,
      totalLicensesAnteriores: licenses.length,
      totalLicensesDepois: updatedLicenses.length
    });

    // Verificar se foi salva corretamente
    const verifyLicenses = localStorageService.loadLicenses();
    console.log('✅ VERIFICAÇÃO APÓS SALVAR:', {
      totalNoLocalStorage: verifyLicenses.length,
      ultimaLicenca: verifyLicenses[verifyLicenses.length - 1]?.chaveAtivacao
    });

    // Enviar email de aprovação
    try {
      await emailService.notifyLicenseApproved(registration, newLicense, plan, plan.recursos);
      alert(`✅ Licença gerada e email enviado para ${registration.email}`);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert('Licença gerada, mas houve erro no envio do email');
    }

    setSelectedRegistration(null);

    console.log('✅ Registro aprovado e salvo:', {
      updatedRegistration: updatedRegistrations.find(r => r.id === registration.id),
      newLicense
    });
  };

  // Rejeitar registro
  const handleRejectRegistration = async (registration: UserRegistration) => {
    const reason = prompt('Motivo da rejeição:');
    if (!reason) return;

    const nextSteps = prompt('Próximos passos sugeridos:');
    if (!nextSteps) return;

    // Atualizar status
    const updatedRegistrations = registrations.map(r => 
      r.id === registration.id ? { ...r, status: 'rejeitado' as const } : r
    );
    setRegistrations(updatedRegistrations);
    
    // Salvar no localStorage
    localStorageService.saveRegistrations(updatedRegistrations);

    // Enviar email de rejeição
    try {
      await emailService.notifyLicenseRejected(registration, reason, nextSteps);
      alert(`Email de rejeição enviado para ${registration.email}`);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert('Status atualizado, mas houve erro no envio do email');
    }

    setSelectedRegistration(null);

    console.log('❌ Registro rejeitado e salvo:', {
      updatedRegistration: updatedRegistrations.find(r => r.id === registration.id),
      reason,
      nextSteps
    });
  };

  // Gerenciamento de Licenças
  const handleSuspendLicense = async (licenseId: string) => {
    const reason = prompt('Motivo da suspensão:');
    if (!reason) return;

    const updatedLicenses = licenses.map(license =>
      license.id === licenseId 
        ? { ...license, status: 'suspensa' as const }
        : license
    );
    setLicenses(updatedLicenses);
    localStorageService.saveLicenses(updatedLicenses);
    
    alert('Licença suspensa com sucesso!');
    console.log('🟡 Licença suspensa:', { licenseId, reason });
  };

  const handleReactivateLicense = async (licenseId: string) => {
    const updatedLicenses = licenses.map(license =>
      license.id === licenseId 
        ? { ...license, status: 'ativa' as const }
        : license
    );
    setLicenses(updatedLicenses);
    localStorageService.saveLicenses(updatedLicenses);
    
    alert('Licença reativada com sucesso!');
    console.log('🟢 Licença reativada:', { licenseId });
  };

  const handleCancelLicense = async (licenseId: string) => {
    const confirmation = prompt('Digite "CANCELAR" para confirmar o cancelamento da licença:');
    if (confirmation !== 'CANCELAR') return;

    const updatedLicenses = licenses.map(license =>
      license.id === licenseId 
        ? { ...license, status: 'cancelada' as const }
        : license
    );
    setLicenses(updatedLicenses);
    localStorageService.saveLicenses(updatedLicenses);
    
    alert('Licença cancelada com sucesso!');
    console.log('🔴 Licença cancelada:', { licenseId });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔐 Gerenciamento de Licenças</h1>
        <p className="text-gray-600">Administre registros de usuários e licenças do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Aprovados</p>
              <p className="text-2xl font-bold text-green-600">{stats.aprovados}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rejeitados</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejeitados}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Licenças Ativas</p>
              <p className="text-2xl font-bold text-slate-600">{stats.licensesAtivas}</p>
            </div>
            <Key className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b">
          {[
            { key: 'registrations', label: 'Solicitações de Registro', icon: '📝' },
            { key: 'licenses', label: 'Licenças Ativas', icon: '🔑' },
            { key: 'clients', label: 'Licenças por Cliente', icon: '👥' },
            { key: 'plans', label: 'Editor de Planos', icon: '⚙️' },
            { key: 'create', label: 'Criar Licença Manual', icon: '➕' },
            { key: 'security', label: 'Segurança', icon: '🔒' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-center transition-all ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="font-medium text-sm mt-1">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por empresa, nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="all">Todos os Status</option>
                <option value="pendente">Pendentes</option>
                <option value="aprovado">Aprovados</option>
                <option value="rejeitado">Rejeitados</option>
              </select>
            </div>
          </div>

          {/* Lista de Registros */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => {
                    const plan = LICENSE_PLANS.find(p => p.id === registration.planoSelecionado);
                    
                    return (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{registration.nomeEmpresa}</div>
                            <div className="text-sm text-gray-500">{registration.cidade}/{registration.estado}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{registration.nome}</div>
                            <div className="text-sm text-gray-500">{registration.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {plan ? (
                            <div>
                              <div className="font-medium text-gray-900">{plan.nome}</div>
                              <div className="text-sm text-gray-500">R$ {plan.preco.toFixed(2)}/{plan.periodo}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Não selecionado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {registration.dataCadastro.toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            registration.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                            registration.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {registration.status === 'pendente' ? '⏳ Pendente' :
                             registration.status === 'aprovado' ? '✅ Aprovado' :
                             '❌ Rejeitado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedRegistration(registration)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Ver detalhes"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {registration.status === 'pendente' && (
                              <>
                                <button
                                  onClick={() => handleApproveRegistration(registration)}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Aprovar"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectRegistration(registration)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Rejeitar"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'licenses' && (
        <div className="space-y-6">
          {/* Filtros para Licenças */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por empresa, email ou chave de licença..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="ativa">Ativas</option>
                <option value="expirada">Expiradas</option>
                <option value="suspensa">Suspensas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          </div>

          {/* Lista de Licenças */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Licenças do Sistema</h3>
                <span className="text-sm text-gray-500">
                  {(() => {
                    const filteredLicenses = licenses.filter(l => {
                      const registration = registrations.find(r => r.id === l.userId);
                      
                      const matchesSearch = !searchTerm || 
                        (registration?.nomeEmpresa || l.clientData?.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (registration?.email || l.clientData?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.chaveAtivacao.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    });
                    
                    console.log('📊 RENDERIZAÇÃO DA LISTA DE LICENÇAS:', {
                      totalLicensesNoEstado: licenses.length,
                      totalAposFiltros: filteredLicenses.length,
                      searchTerm,
                      statusFilter,
                      todasAsLicencas: licenses.map(l => ({
                        id: l.id,
                        chave: l.chaveAtivacao,
                        status: l.status,
                        cliente: l.clientData?.name || l.clientData?.company,
                        isManual: l.id.startsWith('manual-')
                      }))
                    });
                    
                    return filteredLicenses.length;
                  })()} licenças encontradas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chave de Ativação</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {licenses
                      .filter(license => {
                        const registration = registrations.find(r => r.id === license.userId);
                        
                        const matchesSearch = !searchTerm || 
                          (registration?.nomeEmpresa || license.clientData?.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (registration?.email || license.clientData?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          license.chaveAtivacao.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map(license => {
                        const registration = registrations.find(r => r.id === license.userId);
                        // Para licenças manuais, usar clientData em vez de registration
                        const clientInfo = registration || license.clientData;
                        const plan = LICENSE_PLANS.find(p => p.id === license.planoId);
                        const isExpired = new Date(license.dataVencimento) < new Date();
                        
                        return (
                          <tr key={license.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {registration?.nomeEmpresa || license.clientData?.company || 'Cliente não encontrado'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {registration?.email || license.clientData?.email || 'Email não disponível'}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {registration?.cidade && registration?.estado 
                                    ? `${registration.cidade}/${registration.estado}`
                                    : license.clientData?.city && license.clientData?.state
                                    ? `${license.clientData.city}/${license.clientData.state}`
                                    : 'Localização não disponível'
                                  }
                                </div>
                                {license.id.startsWith('manual-') && (
                                  <div className="text-xs text-blue-600 mt-1">📝 Licença Manual</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900">{plan?.nome || 'Plano não encontrado'}</div>
                                <div className="text-sm text-gray-500">R$ {plan?.preco?.toFixed(2) || '0,00'}/{plan?.periodo || 'mensal'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {license.chaveAtivacao}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                license.status === 'ativa' ? 'bg-green-100 text-green-800' :
                                license.status === 'expirada' || isExpired ? 'bg-red-100 text-red-800' :
                                license.status === 'suspensa' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {license.status === 'ativa' ? '✅ Ativa' :
                                 license.status === 'expirada' || isExpired ? '❌ Expirada' :
                                 license.status === 'suspensa' ? '⏸️ Suspensa' :
                                 '🚫 Cancelada'}
                              </span>
                              {isExpired && license.status === 'ativa' && (
                                <div className="text-xs text-red-600 mt-1">Vencida!</div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div>{license.dataVencimento.toLocaleDateString('pt-BR')}</div>
                              <div className="text-xs text-gray-500">
                                Ativada em {license.dataAtivacao.toLocaleDateString('pt-BR')}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setSelectedLicense(license)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Ver detalhes"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {license.status === 'ativa' && (
                                  <button
                                    onClick={() => handleSuspendLicense(license.id)}
                                    className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                    title="Suspender licença"
                                  >
                                    ⏸️
                                  </button>
                                )}
                                {license.status === 'suspensa' && (
                                  <button
                                    onClick={() => handleReactivateLicense(license.id)}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                    title="Reativar licença"
                                  >
                                    ▶️
                                  </button>
                                )}
                                <button
                                  onClick={() => handleCancelLicense(license.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Cancelar licença"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                
                {licenses.filter(license => {
                  const registration = registrations.find(r => r.id === license.userId);
                  const matchesSearch = !searchTerm || 
                    registration?.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    registration?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    license.chaveAtivacao.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
                  return matchesSearch && matchesStatus;
                }).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma licença encontrada com os filtros aplicados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PlanEditor onPlansUpdate={(newPlans) => {
            // Atualizar planos globalmente se necessário
            console.log('Planos atualizados:', newPlans);
          }} />
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Licença Manual</h3>
          <p className="text-gray-600 mb-6">
            Use esta função para criar licenças customizadas ou para clientes especiais
          </p>
          
          <ManualLicenseCreator 
            onLicenseCreated={(newLicense: SystemLicense) => {
              console.log('🆕 NOVA LICENÇA RECEBIDA DO COMPONENTE:', newLicense);
              console.log('🆔 ID da nova licença:', newLicense.id);
              console.log('🔑 Chave de ativação:', newLicense.chaveAtivacao);
              
              // Recarregar licenças do localStorage
              const updatedLicenses = localStorageService.loadLicenses();
              console.log('📊 TOTAL DE LICENÇAS APÓS RECARREGAR:', updatedLicenses.length);
              console.log('📋 TODAS AS LICENÇAS:', updatedLicenses.map(l => ({
                id: l.id,
                chave: l.chaveAtivacao,
                cliente: l.clientData?.name
              })));
              
              setLicenses(updatedLicenses);
              
              // Mudar para aba de licenças para ver o resultado
              setActiveTab('licenses');
              console.log('✅ ESTADO ATUALIZADO E MUDOU PARA ABA LICENSES');
            }}
          />
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Configurações de Segurança</h3>
          <p className="text-gray-600 mb-6">
            Gerencie as senhas dos administradores do sistema para manter a segurança
          </p>
          
          <PasswordChangeForm 
            currentUser="superadmin@agendusalao.com"
            onPasswordChange={async (currentPassword: string, newPassword: string) => {
              // Verificar se a senha atual está correta
              const savedCredentials = JSON.parse(localStorage.getItem('systemCredentials') || '{}');
              const superAdminPassword = savedCredentials.superadmin || 'SuperAdmin@2024';
              
              if (currentPassword !== superAdminPassword) {
                return false; // Senha atual incorreta
              }
              
              // Atualizar a senha no localStorage
              const updatedCredentials = {
                ...savedCredentials,
                superadmin: newPassword
              };
              
              localStorage.setItem('systemCredentials', JSON.stringify(updatedCredentials));
              
              console.log('🔒 Senha do Super Admin atualizada com sucesso');
              return true;
            }}
          />
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Detalhes do Registro
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <p className="text-gray-900">{selectedRegistration.nomeEmpresa}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <p className="text-gray-900">{selectedRegistration.nome}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedRegistration.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <p className="text-gray-900">{selectedRegistration.telefone || 'Não informado'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <p className="text-gray-900">{selectedRegistration.cnpj || 'Não informado'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade/Estado</label>
                  <p className="text-gray-900">{selectedRegistration.cidade}/{selectedRegistration.estado}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <p className="text-gray-900">{selectedRegistration.endereco}</p>
              </div>
              
              {selectedRegistration.observacoes && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <p className="text-gray-900">{selectedRegistration.observacoes}</p>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plano Selecionado</label>
                {selectedRegistration.planoSelecionado ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const plan = LICENSE_PLANS.find(p => p.id === selectedRegistration.planoSelecionado);
                      return plan ? (
                        <div>
                          <h4 className="font-semibold text-gray-900">{plan.nome}</h4>
                          <p className="text-gray-600 text-sm">{plan.descricao}</p>
                          <p className="text-gray-900 font-medium mt-2">R$ {plan.preco.toFixed(2)}/{plan.periodo}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">Plano não encontrado</p>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum plano selecionado</p>
                )}
              </div>
              
              {selectedRegistration.status === 'pendente' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApproveRegistration(selectedRegistration)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Aprovar e Gerar Licença</span>
                  </button>
                  <button
                    onClick={() => handleRejectRegistration(selectedRegistration)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Rejeitar</span>
                  </button>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Licença */}
      {selectedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Detalhes da Licença
              </h3>

              {(() => {
                const registration = registrations.find(r => r.id === selectedLicense.userId);
                const plan = LICENSE_PLANS.find(p => p.id === selectedLicense.planoId);
                const isExpired = new Date(selectedLicense.dataVencimento) < new Date();
                const daysRemaining = Math.ceil((new Date(selectedLicense.dataVencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div className="space-y-6">
                    {/* Status da Licença */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Status da Licença</h4>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
                            selectedLicense.status === 'ativa' ? 'bg-green-100 text-green-800' :
                            selectedLicense.status === 'expirada' || isExpired ? 'bg-red-100 text-red-800' :
                            selectedLicense.status === 'suspensa' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedLicense.status === 'ativa' ? '✅ Ativa' :
                             selectedLicense.status === 'expirada' || isExpired ? '❌ Expirada' :
                             selectedLicense.status === 'suspensa' ? '⏸️ Suspensa' :
                             '🚫 Cancelada'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-lg bg-blue-100 px-3 py-2 rounded">
                            {selectedLicense.chaveAtivacao}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">Chave de Ativação</div>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Cliente */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Informações do Cliente</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                          <p className="text-gray-900">{registration?.nomeEmpresa || 'Não encontrado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                          <p className="text-gray-900">{registration?.nome || 'Não encontrado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <p className="text-gray-900">{registration?.email || 'Não encontrado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                          <p className="text-gray-900">{registration?.cidade || 'N/A'}/{registration?.estado || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Plano */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Plano Contratado</h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
                            <p className="text-gray-900 font-semibold">{plan?.nome || 'Plano não encontrado'}</p>
                            <p className="text-sm text-gray-600">{plan?.descricao}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                            <p className="text-gray-900 font-semibold">R$ {plan?.preco?.toFixed(2) || '0,00'}</p>
                            <p className="text-sm text-gray-600">por {plan?.periodo || 'mês'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Limites</label>
                            <div className="text-sm text-gray-900">
                              <div>{plan?.maxUsuarios || 0} usuários</div>
                              <div>{plan?.maxClientes || 0} clientes</div>
                              <div>{plan?.maxAgendamentos || 0} agendamentos/mês</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recursos Ativos */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recursos Inclusos</h4>
                      <div className="grid md:grid-cols-4 gap-2">
                        {selectedLicense.recursosAtivos.map((recurso) => (
                          <span
                            key={recurso}
                            className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-md capitalize text-center"
                          >
                            ✓ {recurso}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Informações de Validade */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Informações de Validade</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Ativação</label>
                          <p className="text-gray-900">{selectedLicense.dataAtivacao.toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                          <p className={`font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                            {selectedLicense.dataVencimento.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dias Restantes</label>
                          <p className={`font-semibold ${daysRemaining < 7 ? 'text-red-600' : daysRemaining < 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {isExpired ? 'Expirada' : `${daysRemaining} dias`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Observações Admin */}
                    {selectedLicense.observacoesAdmin && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Observações do Administrador</h4>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-gray-900">{selectedLicense.observacoesAdmin}</p>
                        </div>
                      </div>
                    )}

                    {/* Ações da Licença */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Ações</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedLicense.status === 'ativa' && (
                          <button
                            onClick={() => {
                              handleSuspendLicense(selectedLicense.id);
                              setSelectedLicense(null);
                            }}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            ⏸️ Suspender Licença
                          </button>
                        )}
                        {selectedLicense.status === 'suspensa' && (
                          <button
                            onClick={() => {
                              handleReactivateLicense(selectedLicense.id);
                              setSelectedLicense(null);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            ▶️ Reativar Licença
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleCancelLicense(selectedLicense.id);
                            setSelectedLicense(null);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          🗑️ Cancelar Licença
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLicense(null)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
