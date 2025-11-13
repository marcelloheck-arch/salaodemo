'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, QrCode, CheckCircle, AlertCircle, Settings, Send, Clock, Users } from 'lucide-react';
import EvolutionAPIService from '@/services/EvolutionAPIService';

interface WhatsAppStatus {
  connected: boolean;
  qrCode?: string;
  lastActivity?: string;
  messagesCount?: number;
}

const WhatsAppIntegration: React.FC = () => {
  const [status, setStatus] = useState<WhatsAppStatus>({ connected: false });
  const [loading, setLoading] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({
    autoConfirmacao: true,
    lembrete24h: true,
    lembretePersonalizado: false,
    horarioLembrete: '10:00',
    mensagemPersonalizada: '',
    botAtivo: true,
    respostasAutomaticas: true
  });
  const [testeNumero, setTesteNumero] = useState('');
  const [testeMensagem, setTesteMensagem] = useState('Olá! Esta é uma mensagem de teste do sistema de agendamentos. 📱✨');
  const [enviandoTeste, setEnviandoTeste] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    mensagensEnviadas: 0,
    confirmacoes: 0,
    lembretes: 0,
    reagendamentos: 0
  });

  useEffect(() => {
    verificarStatusInicial();
    carregarEstatisticas();
  }, []);

  const verificarStatusInicial = async () => {
    setLoading(true);
    try {
      const statusAtual = await EvolutionAPIService.verificarStatus();
      setStatus(statusAtual);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = () => {
    // Carregar estatísticas do localStorage ou banco de dados
    const stats = localStorage.getItem('whatsapp-stats');
    if (stats) {
      setEstatisticas(JSON.parse(stats));
    }
  };

  const conectarWhatsApp = async () => {
    setLoading(true);
    try {
      // Criar instância e obter QR Code
      const resultado = await EvolutionAPIService.criarInstancia();
      
      if (resultado.error) {
        alert(`Erro: ${resultado.error}`);
        setLoading(false);
        return;
      }

      if (resultado.qrCode) {
        setStatus({ connected: false, qrCode: resultado.qrCode });
        
        // Verificar status periodicamente até conectar
        const interval = setInterval(async () => {
          const statusAtualizado = await EvolutionAPIService.verificarStatus();
          setStatus(statusAtualizado);
          
          if (statusAtualizado.connected) {
            clearInterval(interval);
            alert('WhatsApp conectado com sucesso! ✅');
          }
        }, 3000);

        // Parar de verificar após 5 minutos
        setTimeout(() => clearInterval(interval), 300000);
      } else {
        // Já está conectado
        const statusAtual = await EvolutionAPIService.verificarStatus();
        setStatus(statusAtual);
      }
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      alert('Erro ao conectar WhatsApp. Verifique se a Evolution API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const enviarMensagemTeste = async () => {
    if (!testeNumero || !testeMensagem) return;
    
    setEnviandoTeste(true);
    try {
      const resultado = await EvolutionAPIService.enviarMensagem(testeNumero, testeMensagem);
      
      if (resultado.success) {
        alert('Mensagem de teste enviada com sucesso! ✅');
        // Atualizar estatísticas
        setEstatisticas(prev => ({ 
          ...prev, 
          mensagensEnviadas: prev.mensagensEnviadas + 1 
        }));
      } else {
        alert(`Erro ao enviar mensagem: ${resultado.error || 'Erro desconhecido'} ❌`);
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      alert('Erro ao enviar mensagem de teste. ❌');
    } finally {
      setEnviandoTeste(false);
    }
  };

  const salvarConfiguracoes = () => {
    localStorage.setItem('whatsapp-config', JSON.stringify(configuracoes));
    alert('Configurações salvas com sucesso! ✅');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Integração WhatsApp</h2>
          <p className="text-gray-600">Configure mensagens automáticas e bot de atendimento</p>
        </div>
      </div>

      {/* Status da Conexão */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Status da Conexão
          </h3>
          <button
            onClick={conectarWhatsApp}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <QrCode className="w-4 h-4" />
            )}
            {status.connected ? 'Reconectar' : 'Conectar'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className={`flex items-center gap-2 mb-3 ${
              status.connected ? 'text-green-600' : 'text-red-600'
            }`}>
              {status.connected ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {status.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            {status.connected ? (
              <div className="space-y-2 text-sm text-gray-600">
                <p>✅ WhatsApp Business conectado com sucesso</p>
                <p>📱 Mensagens automáticas ativas</p>
                <p>🤖 Bot de atendimento funcionando</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-600">
                <p>❌ WhatsApp não conectado</p>
                <p>⚠️ Mensagens automáticas desabilitadas</p>
                <p>📱 Clique em "Conectar" para escanear QR Code</p>
              </div>
            )}
          </div>

          {!status.connected && status.qrCode && (
            <div className="flex flex-col items-center">
              <h4 className="font-medium text-gray-800 mb-3">Escaneie o QR Code</h4>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <img 
                  src={status.qrCode} 
                  alt="QR Code WhatsApp" 
                  className="w-48 h-48"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Abra o WhatsApp no seu celular e escaneie este código
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.mensagensEnviadas}</p>
              <p className="text-sm text-gray-600">Mensagens Enviadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.confirmacoes}</p>
              <p className="text-sm text-gray-600">Confirmações</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.lembretes}</p>
              <p className="text-sm text-gray-600">Lembretes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.reagendamentos}</p>
              <p className="text-sm text-gray-600">Reagendamentos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações Automáticas
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Confirmação Automática</h4>
                <p className="text-sm text-gray-600">Enviar confirmação após agendamento</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.autoConfirmacao}
                  onChange={(e) => setConfiguracoes({...configuracoes, autoConfirmacao: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Lembrete 24h</h4>
                <p className="text-sm text-gray-600">Enviar lembrete 24h antes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.lembrete24h}
                  onChange={(e) => setConfiguracoes({...configuracoes, lembrete24h: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Bot de Atendimento</h4>
                <p className="text-sm text-gray-600">Responder consultas automaticamente</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracoes.botAtivo}
                  onChange={(e) => setConfiguracoes({...configuracoes, botAtivo: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário dos Lembretes
              </label>
              <input
                type="time"
                value={configuracoes.horarioLembrete}
                onChange={(e) => setConfiguracoes({...configuracoes, horarioLembrete: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem Personalizada (Opcional)
            </label>
            <textarea
              value={configuracoes.mensagemPersonalizada}
              onChange={(e) => setConfiguracoes({...configuracoes, mensagemPersonalizada: e.target.value})}
              placeholder="Digite uma mensagem personalizada para seus clientes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco para usar a mensagem padrão
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={salvarConfiguracoes}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Teste de Mensagem */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Teste de Mensagem
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Teste (com DDD)
            </label>
            <input
              type="tel"
              value={testeNumero}
              onChange={(e) => setTesteNumero(e.target.value)}
              placeholder="11999999999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem de Teste
            </label>
            <textarea
              value={testeMensagem}
              onChange={(e) => setTesteMensagem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={enviarMensagemTeste}
            disabled={!testeNumero || !testeMensagem || enviandoTeste || !status.connected}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {enviandoTeste ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Enviar Teste
          </button>
        </div>
      </div>

      {/* Informações da Evolution API */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Informações da Evolution API</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Recursos Inclusos:</h4>
            <ul className="space-y-1 text-blue-600">
              <li>• Mensagens automáticas</li>
              <li>• Bot de atendimento</li>
              <li>• QR Code dinâmico</li>
              <li>• Webhook para recebimento</li>
              <li>• API completa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Plano Recomendado:</h4>
            <ul className="space-y-1 text-blue-600">
              <li>• <strong>Plano Pro:</strong> R$ 50/mês</li>
              <li>• 10.000 mensagens incluídas</li>
              <li>• Suporte 24/7</li>
              <li>• Múltiplas instâncias</li>
              <li>• Webhooks ilimitados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppIntegration;
