"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Smartphone,
  Calendar as CalendarIcon,
  Save,
  Eye,
  EyeOff,
  Check
} from "lucide-react";

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'integrations' | 'security'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [config, setConfig] = useState({
    general: {
      salonName: "Salão Beleza Total",
      ownerName: "Admin do Salão",
      phone: "(11) 99999-9999",
      email: "admin@salao.com",
      address: "Rua das Flores, 123 - Centro",
      timezone: "America/Sao_Paulo",
      currency: "BRL"
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      reminderTime: 24,
      autoConfirmation: true,
      birthdayMessages: true
    },
    integrations: {
      whatsappEnabled: false,
      googleCalendarEnabled: false,
      analyticsEnabled: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      requirePasswordChange: false
    }
  });

  // Carregar dados do usuário autenticado
  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);
        console.log('⚙️ Carregando dados do usuário nas configurações:', userData);
        
        setConfig(prevConfig => ({
          ...prevConfig,
          general: {
            ...prevConfig.general,
            salonName: userData.salonName || prevConfig.general.salonName,
            ownerName: userData.name || prevConfig.general.ownerName,
            email: userData.email || prevConfig.general.email,
          }
        }));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const handleSave = () => {
    // Atualizar localStorage para refletir mudanças no header
    const currentUser = JSON.parse(localStorage.getItem('agenda_salao_user') || '{}');
    const updatedUser = {
      ...currentUser,
      salonName: config.general.salonName,
      name: config.general.ownerName,
      email: config.general.email,
      phone: config.general.phone
    };
    localStorage.setItem('agenda_salao_user', JSON.stringify(updatedUser));
    
    // Atualizar também authUser
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const mergedAuthUser = { ...authUser, ...updatedUser };
    localStorage.setItem('authUser', JSON.stringify(mergedAuthUser));
    
    // Disparar evento customizado para atualizar MainApp
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: mergedAuthUser }));
    
    // Salvar configurações
    localStorage.setItem('agenda_salao_config', JSON.stringify(config));
    
    console.log('Saving config:', config);
    console.log('Updated user in localStorage:', updatedUser);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'integrations', label: 'Integrações', icon: Smartphone },
    { id: 'security', label: 'Segurança', icon: Shield }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h2>
        <p className="text-gray-600">Gerencie as configurações do sistema e do salão</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-100 text-slate-700 border-l-4 border-slate-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Gerais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Salão
                      </label>
                      <input
                        type="text"
                        value={config.general.salonName}
                        onChange={(e) => setConfig({
                          ...config,
                          general: { ...config.general, salonName: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Proprietário
                      </label>
                      <input
                        type="text"
                        value={config.general.ownerName}
                        onChange={(e) => setConfig({
                          ...config,
                          general: { ...config.general, ownerName: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={config.general.phone}
                        onChange={(e) => setConfig({
                          ...config,
                          general: { ...config.general, phone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={config.general.email}
                        onChange={(e) => setConfig({
                          ...config,
                          general: { ...config.general, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={config.general.address}
                        onChange={(e) => setConfig({
                          ...config,
                          general: { ...config.general, address: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuso Horário
                      </label>
                      <select
                        value={config.general.timezone}
                        onChange={(e) => setConfig({
                          ...config,
                          general: { ...config.general, timezone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                        <option value="America/Manaus">Manaus (GMT-4)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moeda
                      </label>
                      <select
                        value={config.general.currency}
                        onChange={(e) => setConfig({
                          ...config,
                          general: { ...config.general, currency: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="BRL">Real Brasileiro (R$)</option>
                        <option value="USD">Dólar Americano ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Notificações por Email</h4>
                        <p className="text-sm text-gray-600">Receber notificações importantes por email</p>
                      </div>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          notifications: { ...config.notifications, emailNotifications: !config.notifications.emailNotifications }
                        })}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          config.notifications.emailNotifications ? 'bg-slate-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        } translate-y-1`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Notificações por SMS</h4>
                        <p className="text-sm text-gray-600">Receber confirmações e lembretes por SMS</p>
                      </div>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          notifications: { ...config.notifications, smsNotifications: !config.notifications.smsNotifications }
                        })}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          config.notifications.smsNotifications ? 'bg-slate-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        } translate-y-1`} />
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Tempo de Lembrete</h4>
                      <p className="text-sm text-gray-600 mb-3">Quantas horas antes enviar lembretes</p>
                      <select
                        value={config.notifications.reminderTime}
                        onChange={(e) => setConfig({
                          ...config,
                          notifications: { ...config.notifications, reminderTime: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value={1}>1 hora antes</option>
                        <option value={2}>2 horas antes</option>
                        <option value={24}>24 horas antes</option>
                        <option value={48}>48 horas antes</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Confirmação Automática</h4>
                        <p className="text-sm text-gray-600">Confirmar agendamentos automaticamente via WhatsApp</p>
                      </div>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          notifications: { ...config.notifications, autoConfirmation: !config.notifications.autoConfirmation }
                        })}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          config.notifications.autoConfirmation ? 'bg-slate-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.notifications.autoConfirmation ? 'translate-x-6' : 'translate-x-1'
                        } translate-y-1`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Mensagens de Aniversário</h4>
                        <p className="text-sm text-gray-600">Enviar parabenizações automáticas</p>
                      </div>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          notifications: { ...config.notifications, birthdayMessages: !config.notifications.birthdayMessages }
                        })}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          config.notifications.birthdayMessages ? 'bg-slate-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.notifications.birthdayMessages ? 'translate-x-6' : 'translate-x-1'
                        } translate-y-1`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrações</h3>
                  
                  <div className="space-y-4">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Smartphone className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">WhatsApp Business</h4>
                            <p className="text-sm text-gray-600">Agendamentos automáticos via WhatsApp</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          config.integrations.whatsappEnabled 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {config.integrations.whatsappEnabled ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Configure sua API do WhatsApp Business para permitir agendamentos automáticos através do AI Agent.
                      </p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        {config.integrations.whatsappEnabled ? 'Reconfigurar' : 'Conectar WhatsApp'}
                      </button>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CalendarIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Google Calendar</h4>
                            <p className="text-sm text-gray-600">Sincronização automática de agendamentos</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          config.integrations.googleCalendarEnabled
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {config.integrations.googleCalendarEnabled ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Sincronize automaticamente todos os agendamentos com o Google Calendar.
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        {config.integrations.googleCalendarEnabled ? 'Reconfigurar' : 'Conectar Google'}
                      </button>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Database className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Analytics Avançado</h4>
                            <p className="text-sm text-gray-600">Relatórios e insights detalhados</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          config.integrations.analyticsEnabled
                            ? 'bg-slate-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {config.integrations.analyticsEnabled ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Sistema de analytics Python com insights avançados sobre performance do salão.
                      </p>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          integrations: { ...config.integrations, analyticsEnabled: !config.integrations.analyticsEnabled }
                        })}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          config.integrations.analyticsEnabled
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-slate-600 text-white hover:bg-slate-700'
                        }`}
                      >
                        {config.integrations.analyticsEnabled ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Autenticação de Dois Fatores</h4>
                        <p className="text-sm text-gray-600">Adicionar camada extra de segurança</p>
                      </div>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          security: { ...config.security, twoFactorEnabled: !config.security.twoFactorEnabled }
                        })}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          config.security.twoFactorEnabled ? 'bg-slate-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        } translate-y-1`} />
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Timeout de Sessão</h4>
                      <p className="text-sm text-gray-600 mb-3">Tempo limite para logout automático</p>
                      <select
                        value={config.security.sessionTimeout}
                        onChange={(e) => setConfig({
                          ...config,
                          security: { ...config.security, sessionTimeout: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value={15}>15 minutos</option>
                        <option value={30}>30 minutos</option>
                        <option value={60}>1 hora</option>
                        <option value={240}>4 horas</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Mudança Obrigatória de Senha</h4>
                        <p className="text-sm text-gray-600">Forçar troca de senha periodicamente</p>
                      </div>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          security: { ...config.security, requirePasswordChange: !config.security.requirePasswordChange }
                        })}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          config.security.requirePasswordChange ? 'bg-slate-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.security.requirePasswordChange ? 'translate-x-6' : 'translate-x-1'
                        } translate-y-1`} />
                      </button>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Alterar Senha</h4>
                      <p className="text-sm text-yellow-700 mb-4">
                        Recomendamos alterar sua senha regularmente para manter a segurança.
                      </p>
                      <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                        Alterar Senha
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  As configurações são salvas automaticamente
                </div>
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    saved 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-600 text-white hover:bg-slate-700'
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Salvo!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar Configurações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
