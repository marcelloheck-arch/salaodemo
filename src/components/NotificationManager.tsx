'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageCircle, Smartphone, Settings, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Plus, Eye, Trash2 } from 'lucide-react';
import NotificationService, { NotificationConfig, NotificationData } from '@/services/NotificationService';

const NotificationManager: React.FC = () => {
  const [config, setConfig] = useState<NotificationConfig>(NotificationService.getConfig());
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [stats, setStats] = useState(NotificationService.getStats());
  const [activeTab, setActiveTab] = useState<'config' | 'history' | 'stats'>('config');
  const [filter, setFilter] = useState<{
    status?: string;
    type?: string;
    channel?: string;
  }>({});
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    loadData();
    checkPushPermission();
  }, []);

  useEffect(() => {
    const filtered = NotificationService.getNotifications(filter as any);
    setNotifications(filtered);
  }, [filter]);

  const loadData = () => {
    setNotifications(NotificationService.getNotifications());
    setStats(NotificationService.getStats());
  };

  const checkPushPermission = () => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  };

  const requestPushPermission = async () => {
    const granted = await NotificationService.requestPushPermission();
    if (granted) {
      setPushPermission('granted');
    }
  };

  const updateConfig = (newConfig: Partial<NotificationConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    NotificationService.updateConfig(newConfig);
  };

  const toggleChannel = (channel: 'push' | 'email' | 'sms' | 'whatsapp') => {
    const channels = config.channels.includes(channel)
      ? config.channels.filter(c => c !== channel)
      : [...config.channels, channel];
    updateConfig({ channels });
  };

  const updateTemplate = (type: keyof NotificationConfig['templates'], value: string) => {
    const templates = { ...config.templates, [type]: value };
    updateConfig({ templates });
  };

  const getStatusIcon = (status: NotificationData['status']) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChannelIcon = (channel: NotificationData['channel']) => {
    switch (channel) {
      case 'push': return <Bell className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR');
  };

  const cancelNotification = async (notificationId: string) => {
    await NotificationService.cancelNotification(notificationId);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciador de Notificações</h2>
          <p className="text-gray-600">Configure lembretes automáticos e acompanhe envios</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.sent}</p>
              <p className="text-sm text-gray-600">Enviadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.failed}</p>
              <p className="text-sm text-gray-600">Falharam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'config'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configurações
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Estatísticas
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'config' && (
            <div className="space-y-6">
              {/* Status Geral */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Status do Sistema</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updateConfig({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {config.enabled ? '✅ Sistema de notificações ativo' : '❌ Sistema de notificações desabilitado'}
                </p>
              </div>

              {/* Canais de Comunicação */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Canais de Comunicação</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.channels.includes('push') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => toggleChannel('push')}>
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="w-5 h-5" />
                      <h4 className="font-medium">Push</h4>
                    </div>
                    <p className="text-sm text-gray-600">Notificações no navegador</p>
                    {pushPermission !== 'granted' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestPushPermission();
                        }}
                        className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        Permitir
                      </button>
                    )}
                  </div>

                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.channels.includes('email') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => toggleChannel('email')}>
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5" />
                      <h4 className="font-medium">Email</h4>
                    </div>
                    <p className="text-sm text-gray-600">Notificações por email</p>
                  </div>

                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.channels.includes('whatsapp') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => toggleChannel('whatsapp')}>
                    <div className="flex items-center gap-3 mb-2">
                      <MessageCircle className="w-5 h-5" />
                      <h4 className="font-medium">WhatsApp</h4>
                    </div>
                    <p className="text-sm text-gray-600">Mensagens WhatsApp</p>
                  </div>

                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.channels.includes('sms') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => toggleChannel('sms')}>
                    <div className="flex items-center gap-3 mb-2">
                      <Smartphone className="w-5 h-5" />
                      <h4 className="font-medium">SMS</h4>
                    </div>
                    <p className="text-sm text-gray-600">Mensagens de texto</p>
                  </div>
                </div>
              </div>

              {/* Configuração de Timing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuração de Lembretes</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Confirmação Imediata</h4>
                      <p className="text-sm text-gray-600">Enviar confirmação logo após agendamento</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.timing.confirmation}
                        onChange={(e) => updateConfig({
                          timing: { ...config.timing, confirmation: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Lembrete 24h</h4>
                      <p className="text-sm text-gray-600">Enviar lembrete 24 horas antes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.timing.reminder24h}
                        onChange={(e) => updateConfig({
                          timing: { ...config.timing, reminder24h: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Lembrete 2h</h4>
                      <p className="text-sm text-gray-600">Enviar lembrete 2 horas antes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.timing.reminder2h}
                        onChange={(e) => updateConfig({
                          timing: { ...config.timing, reminder2h: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Templates de Mensagem */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Templates de Mensagem</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template de Confirmação
                    </label>
                    <textarea
                      value={config.templates.confirmation}
                      onChange={(e) => updateTemplate('confirmation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Mensagem de confirmação..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use: {'{data}'}, {'{hora}'}, {'{servico}'}, {'{profissional}'}, {'{salao}'}, {'{nome}'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template de Lembrete
                    </label>
                    <textarea
                      value={config.templates.reminder}
                      onChange={(e) => updateTemplate('reminder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Mensagem de lembrete..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template de Cancelamento
                    </label>
                    <textarea
                      value={config.templates.cancellation}
                      onChange={(e) => updateTemplate('cancellation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Mensagem de cancelamento..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select
                  value={filter.status || ''}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os status</option>
                  <option value="sent">Enviadas</option>
                  <option value="pending">Pendentes</option>
                  <option value="failed">Falharam</option>
                  <option value="cancelled">Canceladas</option>
                </select>

                <select
                  value={filter.type || ''}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  <option value="confirmation">Confirmação</option>
                  <option value="reminder">Lembrete</option>
                  <option value="cancellation">Cancelamento</option>
                  <option value="rescheduling">Reagendamento</option>
                </select>

                <select
                  value={filter.channel || ''}
                  onChange={(e) => setFilter({ ...filter, channel: e.target.value || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os canais</option>
                  <option value="push">Push</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
              </div>

              {/* Lista de Notificações */}
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(notification.status)}
                            {getChannelIcon(notification.channel)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-800">
                                {notification.recipient.name}
                              </h4>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {notification.type}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {notification.channel}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.agendamento.servico} - {notification.agendamento.data} às {notification.agendamento.hora}
                            </p>
                            <div className="text-xs text-gray-500">
                              <p>Criado: {formatDate(notification.createdAt)}</p>
                              {notification.scheduledFor && (
                                <p>Agendado para: {formatDate(notification.scheduledFor)}</p>
                              )}
                              {notification.sentAt && (
                                <p>Enviado: {formatDate(notification.sentAt)}</p>
                              )}
                              {notification.error && (
                                <p className="text-red-500">Erro: {notification.error}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {notification.status === 'pending' && (
                          <button
                            onClick={() => cancelNotification(notification.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Cancelar notificação"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Estatísticas por Canal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas por Canal</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(stats.byChannel).map(([channel, count]) => (
                    <div key={channel} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getChannelIcon(channel as any)}
                        <h4 className="font-medium capitalize">{channel}</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatísticas por Tipo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas por Tipo</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium capitalize mb-2">{type}</h4>
                      <p className="text-2xl font-bold text-gray-800">{count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Taxa de Sucesso */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxa de Sucesso</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Enviadas com sucesso</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.sent / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;