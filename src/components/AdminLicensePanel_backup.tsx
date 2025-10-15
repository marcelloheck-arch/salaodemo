'use client';

import React, { useState } from 'react';
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

export default function AdminLicensePanel() {
  const [activeTab, setActiveTab] = useState<'registrations' | 'licenses' | 'create'>('registrations');
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [licenses, setLicenses] = useState<SystemLicense[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<UserRegistration | null>(null);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'aprovado' | 'rejeitado'>('all');

  const emailService = EmailService.getInstance();
  const localStorageService = LocalStorageService.getInstance();

  // Carregar dados do localStorage ao montar o componente
  React.useEffect(() => {
    // Carregar registros salvos
    const savedRegistrations = localStorageService.loadRegistrations();
    
    // Se não há registros salvos, usar dados mock como fallback
    if (savedRegistrations.length === 0) {
      localStorageService.saveRegistrations(USER_REGISTRATIONS_MOCK);
      setRegistrations(USER_REGISTRATIONS_MOCK);
    } else {
      setRegistrations(savedRegistrations);
    }

    // Carregar licenças salvas
    const savedLicenses = localStorageService.loadLicenses();
    
    // Se não há licenças salvas, usar dados mock como fallback
    if (savedLicenses.length === 0) {
      localStorageService.saveLicenses(SYSTEM_LICENSES_MOCK);
      setLicenses(SYSTEM_LICENSES_MOCK);
    } else {
      setLicenses(savedLicenses);
    }

    console.log('🔄 Dados carregados do localStorage:', {
      registrations: savedRegistrations.length > 0 ? savedRegistrations : USER_REGISTRATIONS_MOCK,
      licenses: savedLicenses.length > 0 ? savedLicenses : SYSTEM_LICENSES_MOCK
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
      observacoesAdmin: `Licença gerada automaticamente para ${registration.nomeEmpresa}`
    };

    const updatedLicenses = [...licenses, newLicense];
    setLicenses(updatedLicenses);
    
    // Salvar licenças no localStorage
    localStorageService.saveLicenses(updatedLicenses);

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
              <p className="text-2xl font-bold text-purple-600">{stats.licensesAtivas}</p>
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
            { key: 'create', label: 'Criar Licença Manual', icon: '➕' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-center transition-all ${
                activeTab === tab.key
                  ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
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
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Licenças Ativas</h3>
            <div className="space-y-4">
              {licenses.map(license => {
                const registration = registrations.find(r => r.id === license.userId);
                const plan = LICENSE_PLANS.find(p => p.id === license.planoId);
                
                return (
                  <div key={license.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{registration?.nomeEmpresa}</h4>
                        <p className="text-sm text-gray-500">{registration?.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        license.status === 'ativa' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {license.status === 'ativa' ? '🟢 Ativa' : '🔴 Inativa'}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Chave:</span>
                        <p className="font-mono bg-gray-100 p-1 rounded">{license.chaveAtivacao}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Plano:</span>
                        <p className="font-medium">{plan?.nome}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Vencimento:</span>
                        <p className="font-medium">{license.dataVencimento.toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Licença Manual</h3>
          <p className="text-gray-600 mb-6">
            Use esta função para criar licenças customizadas ou para clientes especiais
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              🔧 <strong>Em desenvolvimento:</strong> Formulário de criação manual de licenças
            </p>
          </div>
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
    </div>
  );
}