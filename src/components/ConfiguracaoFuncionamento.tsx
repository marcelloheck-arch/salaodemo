'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';
import HorarioService from '@/services/HorarioService';

interface ConfiguracaoFuncionamento {
  salao_id: string;
  dias_funcionamento: number[];
  horario_abertura: string;
  horario_fechamento: string;
  intervalo_almoco_inicio?: string;
  intervalo_almoco_fim?: string;
  intervalo_atendimento: number;
  antecedencia_minima: number;
  limite_agendamento: number;
  ultimo_horario_agendamento: string;
}

interface ConfiguracaoFuncionamentoProps {
  salaoId: string;
  onConfigSaved?: (config: ConfiguracaoFuncionamento) => void;
}

const ConfiguracaoFuncionamento: React.FC<ConfiguracaoFuncionamentoProps> = ({ 
  salaoId, 
  onConfigSaved 
}) => {
  const [config, setConfig] = useState<ConfiguracaoFuncionamento>({
    salao_id: salaoId,
    dias_funcionamento: [1, 2, 3, 4, 5, 6],
    horario_abertura: '08:00',
    horario_fechamento: '18:00',
    intervalo_almoco_inicio: '12:00',
    intervalo_almoco_fim: '13:00',
    intervalo_atendimento: 30,
    antecedencia_minima: 2,
    limite_agendamento: 30,
    ultimo_horario_agendamento: '17:00'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const diasSemana = [
    { valor: 0, nome: 'Domingo' },
    { valor: 1, nome: 'Segunda' },
    { valor: 2, nome: 'Terça' },
    { valor: 3, nome: 'Quarta' },
    { valor: 4, nome: 'Quinta' },
    { valor: 5, nome: 'Sexta' },
    { valor: 6, nome: 'Sábado' }
  ];

  const intervalosAtendimento = [
    { valor: 15, nome: '15 minutos' },
    { valor: 30, nome: '30 minutos' },
    { valor: 45, nome: '45 minutos' },
    { valor: 60, nome: '1 hora' }
  ];

  useEffect(() => {
    carregarConfiguracoes();
  }, [salaoId]);

  const carregarConfiguracoes = async () => {
    try {
      const configuracao = await HorarioService.getConfiguracaoSalao(salaoId);
      setConfig(configuracao);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleDiaToggle = (dia: number) => {
    const novosDias = config.dias_funcionamento.includes(dia)
      ? config.dias_funcionamento.filter(d => d !== dia)
      : [...config.dias_funcionamento, dia].sort();
    
    setConfig({ ...config, dias_funcionamento: novosDias });
  };

  const handleInputChange = (field: keyof ConfiguracaoFuncionamento, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  const validarConfiguracoes = (): { valido: boolean; erro?: string } => {
    // Validar horários
    if (config.horario_abertura >= config.horario_fechamento) {
      return { valido: false, erro: 'Horário de abertura deve ser anterior ao fechamento' };
    }

    if (config.ultimo_horario_agendamento > config.horario_fechamento) {
      return { valido: false, erro: 'Último horário de agendamento não pode ser após o fechamento' };
    }

    // Validar almoço
    if (config.intervalo_almoco_inicio && config.intervalo_almoco_fim) {
      if (config.intervalo_almoco_inicio >= config.intervalo_almoco_fim) {
        return { valido: false, erro: 'Horário de início do almoço deve ser anterior ao fim' };
      }
    }

    // Validar dias
    if (config.dias_funcionamento.length === 0) {
      return { valido: false, erro: 'Selecione pelo menos um dia de funcionamento' };
    }

    return { valido: true };
  };

  const salvarConfiguracoes = async () => {
    const validacao = validarConfiguracoes();
    if (!validacao.valido) {
      setMessage({ type: 'error', text: validacao.erro || 'Erro na validação' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const sucesso = await HorarioService.salvarConfiguracaoSalao(salaoId, config);
      
      if (sucesso) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        onConfigSaved?.(config);
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-slate-600" />
        <h3 className="text-xl font-semibold text-gray-900">Configurações de Funcionamento</h3>
      </div>

      <div className="space-y-6">
        {/* Dias de Funcionamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Dias de Funcionamento
          </label>
          <div className="grid grid-cols-7 gap-2">
            {diasSemana.map(dia => (
              <button
                key={dia.valor}
                onClick={() => handleDiaToggle(dia.valor)}
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  config.dias_funcionamento.includes(dia.valor)
                    ? 'bg-slate-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dia.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Horários de Funcionamento */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Horário de Abertura
            </label>
            <input
              type="time"
              value={config.horario_abertura}
              onChange={(e) => handleInputChange('horario_abertura', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário de Fechamento
            </label>
            <input
              type="time"
              value={config.horario_fechamento}
              onChange={(e) => handleInputChange('horario_fechamento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Intervalo de Almoço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🍽️ Intervalo de Almoço (Opcional)
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Início</label>
              <input
                type="time"
                value={config.intervalo_almoco_inicio || ''}
                onChange={(e) => handleInputChange('intervalo_almoco_inicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fim</label>
              <input
                type="time"
                value={config.intervalo_almoco_fim || ''}
                onChange={(e) => handleInputChange('intervalo_almoco_fim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Configurações de Agendamento */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⏱️ Intervalo entre Atendimentos
            </label>
            <select
              value={config.intervalo_atendimento}
              onChange={(e) => handleInputChange('intervalo_atendimento', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              {intervalosAtendimento.map(intervalo => (
                <option key={intervalo.valor} value={intervalo.valor}>
                  {intervalo.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🕐 Último Horário para Agendamento
            </label>
            <input
              type="time"
              value={config.ultimo_horario_agendamento}
              onChange={(e) => handleInputChange('ultimo_horario_agendamento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Regras de Agendamento */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⏰ Antecedência Mínima (horas)
            </label>
            <input
              type="number"
              min="0"
              max="48"
              value={config.antecedencia_minima}
              onChange={(e) => handleInputChange('antecedencia_minima', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tempo mínimo entre agendamento e atendimento
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Limite de Agendamento (dias)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={config.limite_agendamento}
              onChange={(e) => handleInputChange('limite_agendamento', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo de dias no futuro para agendar
            </p>
          </div>
        </div>

        {/* Mensagem de Feedback */}
        {message && (
          <div className={`p-4 rounded-lg border flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={salvarConfiguracoes}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-pink-600 text-white rounded-lg font-medium hover:from-slate-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>

        {/* Preview dos Horários */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">📋 Preview dos Horários</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Funcionamento:</strong> {config.dias_funcionamento.map(d => diasSemana[d].nome).join(', ')}</p>
            <p><strong>Horário:</strong> {config.horario_abertura} às {config.horario_fechamento}</p>
            {config.intervalo_almoco_inicio && (
              <p><strong>Almoço:</strong> {config.intervalo_almoco_inicio} às {config.intervalo_almoco_fim}</p>
            )}
            <p><strong>Intervalos:</strong> {config.intervalo_atendimento} minutos</p>
            <p><strong>Antecedência:</strong> {config.antecedencia_minima}h | <strong>Limite:</strong> {config.limite_agendamento} dias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracaoFuncionamento;
