'use client';

import React, { useState } from 'react';
import { UserRegistration, AdminNotification, SYSTEM_FEATURES, LICENSE_PLANS, UserLicense, AvailableFeature } from '@/types/license';

export default function AdminLicenseManager() {
  const [activeTab, setActiveTab] = useState<'pendentes' | 'licencas' | 'recursos'>('pendentes');
  const [selectedRegistration, setSelectedRegistration] = useState<UserRegistration | null>(null);
  const [showLicenseGenerator, setShowLicenseGenerator] = useState(false);

  // Estados simulados - em produção viriam de uma API
  const [pendingRegistrations] = useState<UserRegistration[]>([
    {
      id: '1',
      nome: 'Maria Silva',
      email: 'maria@salaobella.com',
      telefone: '(11) 99999-1234',
      nomeEmpresa: 'Salão Bella Vista',
      cnpj: '12.345.678/0001-90',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      dataCadastro: new Date('2025-10-12'),
      status: 'pendente',
      observacoes: 'Salão com 3 funcionários, foco em cabelos'
    },
    {
      id: '2',
      nome: 'João Santos',
      email: 'joao@espacomoderno.com',
      telefone: '(21) 88888-5678',
      nomeEmpresa: 'Espaço Moderno',
      cnpj: '98.765.432/0001-10',
      endereco: 'Av. Principal, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      dataCadastro: new Date('2025-10-13'),
      status: 'pendente',
      observacoes: 'Salão grande, quer expandir para produtos'
    }
  ]);

  const [notifications] = useState<AdminNotification[]>([
    {
      id: '1',
      tipo: 'novo_cadastro',
      usuarioId: '1',
      titulo: 'Novo cadastro: Salão Bella Vista',
      mensagem: 'Maria Silva solicitou acesso ao sistema',
      dataEnvio: new Date('2025-10-12'),
      lido: false,
      dadosUsuario: pendingRegistrations[0],
      prioridade: 'media'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-700 to-blue-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🔧 Painel Administrativo
              </h1>
              <p className="text-white/80">
                Gerenciamento de licenças e cadastros
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-sm">
                {notifications.filter(n => !n.lido).length} notificações
              </div>
              <div className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm">
                {pendingRegistrations.length} pendentes
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl mb-6 border border-white/20">
          <div className="flex">
            {[
              { key: 'pendentes', label: 'Cadastros Pendentes', icon: '📋' },
              { key: 'licencas', label: 'Licenças Ativas', icon: '🔑' },
              { key: 'recursos', label: 'Gerenciar Recursos', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 p-4 text-center transition-all ${
                  activeTab === tab.key
                    ? 'bg-slate-500/30 text-white border-b-2 border-purple-300'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <div className="font-semibold">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'pendentes' && (
          <PendingRegistrationsTab 
            registrations={pendingRegistrations}
            onSelectRegistration={setSelectedRegistration}
            onGenerateLicense={() => setShowLicenseGenerator(true)}
          />
        )}

        {activeTab === 'licencas' && (
          <ActiveLicensesTab />
        )}

        {activeTab === 'recursos' && (
          <ManageFeaturesTab />
        )}

        {/* Modal Gerador de Licença */}
        {showLicenseGenerator && selectedRegistration && (
          <LicenseGeneratorModal
            registration={selectedRegistration}
            onClose={() => {
              setShowLicenseGenerator(false);
              setSelectedRegistration(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Componente da Tab de Cadastros Pendentes
function PendingRegistrationsTab({ 
  registrations, 
  onSelectRegistration, 
  onGenerateLicense 
}: {
  registrations: UserRegistration[];
  onSelectRegistration: (reg: UserRegistration) => void;
  onGenerateLicense: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {registrations.map((registration) => (
        <div key={registration.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{registration.nomeEmpresa}</h3>
              <p className="text-white/80">{registration.nome}</p>
            </div>
            <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm">
              Pendente
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-white/70">Email:</span>
              <span className="text-white">{registration.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Telefone:</span>
              <span className="text-white">{registration.telefone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Localização:</span>
              <span className="text-white">{registration.cidade}/{registration.estado}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">CNPJ:</span>
              <span className="text-white">{registration.cnpj}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Cadastro:</span>
              <span className="text-white">{registration.dataCadastro.toLocaleDateString()}</span>
            </div>
          </div>

          {registration.observacoes && (
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-white/90 text-sm">{registration.observacoes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onSelectRegistration(registration);
                onGenerateLicense();
              }}
              className="bg-green-500/20 text-green-200 py-2 rounded-lg hover:bg-green-500/30 transition-all"
            >
              ✅ Gerar Licença
            </button>
            <button className="bg-red-500/20 text-red-200 py-2 rounded-lg hover:bg-red-500/30 transition-all">
              ❌ Rejeitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente da Tab de Licenças Ativas
function ActiveLicensesTab() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4">Licenças Ativas</h2>
      <p className="text-white/70">Em desenvolvimento...</p>
    </div>
  );
}

// Componente da Tab de Gerenciar Recursos
function ManageFeaturesTab() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Recursos do Sistema</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SYSTEM_FEATURES.map((feature) => (
          <div key={feature.id} className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{feature.icone}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                feature.ativo 
                  ? 'bg-green-500/20 text-green-200' 
                  : 'bg-red-500/20 text-red-200'
              }`}>
                {feature.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <h3 className="text-white font-semibold">{feature.nome}</h3>
            <p className="text-white/70 text-sm mb-2">{feature.descricao}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              feature.categoria === 'basico' ? 'bg-blue-500/20 text-blue-200' :
              feature.categoria === 'intermediario' ? 'bg-slate-500/20 text-purple-200' :
              'bg-orange-500/20 text-orange-200'
            }`}>
              {feature.categoria}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modal Gerador de Licença
function LicenseGeneratorModal({ 
  registration, 
  onClose 
}: {
  registration: UserRegistration;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState(LICENSE_PLANS[0]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(LICENSE_PLANS[0].recursos);
  const [customLimits, setCustomLimits] = useState({
    maxUsuarios: LICENSE_PLANS[0].recursos.length,
    maxClientes: 1000,
    duracao: 365
  });

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const generateLicense = () => {
    const license: Omit<UserLicense, 'id'> = {
      userId: registration.id,
      registrationId: registration.id,
      planoId: selectedPlan.id,
      recursos: selectedFeatures,
      dataInicio: new Date(),
      dataVencimento: new Date(Date.now() + customLimits.duracao * 24 * 60 * 60 * 1000),
      status: 'ativa',
      chaveAtivacao: `AGS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      limitesPersonalizados: customLimits,
      observacoes: `Licença gerada para ${registration.nomeEmpresa}`,
      geradaPor: 'admin',
      dataGeracao: new Date()
    };

    console.log('🔑 Licença gerada:', license);
    
    // Simular envio de email
    console.log('📧 Email enviado para:', registration.email, {
      subject: 'Sua licença do Agenda Salão foi aprovada!',
      body: `
        Olá ${registration.nome},
        
        Sua solicitação foi aprovada! Segue seus dados de acesso:
        
        🔑 Chave de Ativação: ${license.chaveAtivacao}
        📅 Válida até: ${license.dataVencimento.toLocaleDateString()}
        🎯 Plano: ${selectedPlan.nome}
        
        Acesse: https://agendasalao.com/login
        
        Recursos inclusos:
        ${selectedFeatures.map(f => `• ${SYSTEM_FEATURES.find(sf => sf.id === f)?.nome}`).join('\n')}
      `
    });

    alert('Licença gerada e enviada por email!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            🔑 Gerar Licença - {registration.nomeEmpresa}
          </h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Seleção de Plano */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">📋 Selecionar Plano Base</h3>
            <div className="space-y-3">
              {LICENSE_PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setSelectedFeatures(plan.recursos);
                    setCustomLimits({
                      maxUsuarios: plan.maxUsuarios,
                      maxClientes: plan.maxClientes,
                      duracao: 365 // Duração padrão de 1 ano
                    });
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedPlan.id === plan.id 
                      ? 'bg-slate-500/30 border-2 border-purple-300' 
                      : 'bg-white/20 border border-white/30 hover:bg-white/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">{plan.nome}</h4>
                      <p className="text-white/70 text-sm">{plan.descricao}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">R$ {plan.preco.toFixed(2)}</div>
                      <div className="text-white/70 text-sm">365 dias</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalizar Recursos */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">⚙️ Personalizar Recursos</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {SYSTEM_FEATURES.map((feature) => (
                <div 
                  key={feature.id}
                  className="flex items-center justify-between p-3 bg-white/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{feature.icone}</span>
                    <div>
                      <div className="text-white font-medium">{feature.nome}</div>
                      <div className="text-white/60 text-sm">{feature.descricao}</div>
                    </div>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => toggleFeature(feature.id)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedFeatures.includes(feature.id)
                        ? 'bg-slate-500 border-slate-500 text-white'
                        : 'border-white/30'
                    }`}>
                      {selectedFeatures.includes(feature.id) && '✓'}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Limites Personalizados */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">📊 Limites Personalizados</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Máx. Usuários
              </label>
              <input
                type="number"
                value={customLimits.maxUsuarios}
                onChange={(e) => setCustomLimits({...customLimits, maxUsuarios: parseInt(e.target.value)})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                min="1"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Máx. Clientes
              </label>
              <input
                type="number"
                value={customLimits.maxClientes}
                onChange={(e) => setCustomLimits({...customLimits, maxClientes: parseInt(e.target.value)})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                min="1"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Duração (dias)
              </label>
              <input
                type="number"
                value={customLimits.duracao}
                onChange={(e) => setCustomLimits({...customLimits, duracao: parseInt(e.target.value)})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-6 bg-white/20 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">📋 Resumo da Licença</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/70">Cliente: <span className="text-white">{registration.nome}</span></p>
              <p className="text-white/70">Empresa: <span className="text-white">{registration.nomeEmpresa}</span></p>
              <p className="text-white/70">Email: <span className="text-white">{registration.email}</span></p>
            </div>
            <div>
              <p className="text-white/70">Plano: <span className="text-white">{selectedPlan.nome}</span></p>
              <p className="text-white/70">Recursos: <span className="text-white">{selectedFeatures.length} selecionados</span></p>
              <p className="text-white/70">Duração: <span className="text-white">{customLimits.duracao} dias</span></p>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500/20 text-white rounded-lg hover:bg-gray-500/30 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={generateLicense}
            className="px-6 py-3 bg-gradient-to-r from-slate-600 to-pink-600 text-white rounded-lg hover:from-slate-700 hover:to-pink-700 transition-all"
          >
            🔑 Gerar Licença e Enviar Email
          </button>
        </div>
      </div>
    </div>
  );
}
