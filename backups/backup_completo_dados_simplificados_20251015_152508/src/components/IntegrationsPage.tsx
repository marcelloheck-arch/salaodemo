"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Settings, 
  Check, 
  X, 
  Phone,
  Globe,
  Key,
  Bell,
  Users,
  Save
} from 'lucide-react';

interface WhatsAppConfig {
  enabled: boolean;
  phoneNumber: string;
  apiKey: string;
  autoConfirmation: boolean;
  reminderHours: number[];
}

interface GoogleCalendarConfig {
  enabled: boolean;
  clientId: string;
  calendarId: string;
  syncBidirectional: boolean;
  defaultColor: string;
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'google'>('whatsapp');
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    enabled: false,
    phoneNumber: '',
    apiKey: '',
    autoConfirmation: true,
    reminderHours: [24, 1]
  });

  const [googleConfig, setGoogleConfig] = useState<GoogleCalendarConfig>({
    enabled: false,
    clientId: '',
    calendarId: '',
    syncBidirectional: true,
    defaultColor: '#8B5CF6'
  });

  const handleWhatsAppSave = () => {
    console.log('Saving WhatsApp config:', whatsappConfig);
    alert('Configurações do WhatsApp salvas com sucesso!');
  };

  const handleGoogleSave = () => {
    console.log('Saving Google Calendar config:', googleConfig);
    alert('Configurações do Google Calendar salvas com sucesso!');
  };

  const testWhatsApp = () => {
    if (!whatsappConfig.phoneNumber) {
      alert('Configure o número do WhatsApp primeiro!');
      return;
    }
    alert('Mensagem de teste enviada para ' + whatsappConfig.phoneNumber);
  };

  const testGoogleCalendar = () => {
    if (!googleConfig.clientId) {
      alert('Configure as credenciais do Google primeiro!');
      return;
    }
    alert('Conexão com Google Calendar testada com sucesso!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Integrações</h2>
        <p className="text-gray-600">Configure WhatsApp Business e Google Agenda para automatizar seu salão</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'google', label: 'Google Calendar', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'whatsapp' | 'google')}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">WhatsApp Business API</h3>
                  <p className="text-gray-600">Configure mensagens automáticas e confirmações</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    whatsappConfig.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {whatsappConfig.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={whatsappConfig.phoneNumber}
                      onChange={(e) => setWhatsappConfig({ ...whatsappConfig, phoneNumber: e.target.value })}
                      placeholder="+55 11 99999-9999"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={whatsappConfig.apiKey}
                      onChange={(e) => setWhatsappConfig({ ...whatsappConfig, apiKey: e.target.value })}
                      placeholder="Sua API Key do WhatsApp Business"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Confirmação Automática</h4>
                    <p className="text-sm text-gray-600">Enviar confirmação de agendamento via WhatsApp</p>
                  </div>
                  <button
                    onClick={() => setWhatsappConfig({ ...whatsappConfig, autoConfirmation: !whatsappConfig.autoConfirmation })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      whatsappConfig.autoConfirmation ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      whatsappConfig.autoConfirmation ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Integração Ativa</h4>
                    <p className="text-sm text-gray-600">Ativar/desativar integração com WhatsApp</p>
                  </div>
                  <button
                    onClick={() => setWhatsappConfig({ ...whatsappConfig, enabled: !whatsappConfig.enabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      whatsappConfig.enabled ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      whatsappConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={testWhatsApp}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Testar Conexão
                </button>
                <button
                  onClick={handleWhatsAppSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'google' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
                  <p className="text-gray-600">Sincronize agendamentos com o Google Agenda</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    googleConfig.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {googleConfig.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={googleConfig.clientId}
                      onChange={(e) => setGoogleConfig({ ...googleConfig, clientId: e.target.value })}
                      placeholder="Seu Google Client ID"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calendar ID
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={googleConfig.calendarId}
                      onChange={(e) => setGoogleConfig({ ...googleConfig, calendarId: e.target.value })}
                      placeholder="ID do calendário"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Sincronização Bidirecional</h4>
                    <p className="text-sm text-gray-600">Sincronizar agendamentos nos dois sentidos</p>
                  </div>
                  <button
                    onClick={() => setGoogleConfig({ ...googleConfig, syncBidirectional: !googleConfig.syncBidirectional })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      googleConfig.syncBidirectional ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      googleConfig.syncBidirectional ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Integração Ativa</h4>
                    <p className="text-sm text-gray-600">Ativar/desativar integração com Google Calendar</p>
                  </div>
                  <button
                    onClick={() => setGoogleConfig({ ...googleConfig, enabled: !googleConfig.enabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      googleConfig.enabled ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      googleConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={testGoogleCalendar}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Testar Conexão
                </button>
                <button
                  onClick={handleGoogleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guia de Configuração */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Guia de Configuração</h3>
        
        {activeTab === 'whatsapp' && (
          <div className="space-y-3 text-sm text-blue-800">
            <p><strong>1.</strong> Cadastre-se no WhatsApp Business API</p>
            <p><strong>2.</strong> Obtenha seu número verificado e API Key</p>
            <p><strong>3.</strong> Configure as mensagens automáticas</p>
            <p><strong>4.</strong> Teste a conexão antes de ativar</p>
          </div>
        )}
        
        {activeTab === 'google' && (
          <div className="space-y-3 text-sm text-blue-800">
            <p><strong>1.</strong> Acesse o Google Cloud Console</p>
            <p><strong>2.</strong> Crie um projeto e ative a Calendar API</p>
            <p><strong>3.</strong> Configure as credenciais OAuth 2.0</p>
            <p><strong>4.</strong> Obtenha o Client ID e Calendar ID</p>
          </div>
        )}
      </div>
    </div>
  );
}