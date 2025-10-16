'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import HorarioService from '@/services/HorarioService';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HorarioDisponivel {
  hora: string;
  disponivel: boolean;
  agendamento?: any;
  profissional?: string;
}

interface SeletorHorarioProps {
  salaoId: string;
  servicoId: string;
  clienteId?: string;
  profissionalId?: string;
  onHorarioSelecionado: (data: string, hora: string) => void;
  onValidationError?: (error: string) => void;
}

const SeletorHorario: React.FC<SeletorHorarioProps> = ({
  salaoId,
  servicoId,
  clienteId,
  profissionalId,
  onHorarioSelecionado,
  onValidationError
}) => {
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string>('');
  const [sugestoes, setSugestoes] = useState<{ data: string; horarios: string[] }[]>([]);

  useEffect(() => {
    carregarDiasDisponiveis();
    carregarSugestoes();
  }, [salaoId, servicoId, profissionalId]);

  useEffect(() => {
    if (dataSelecionada) {
      carregarHorariosDisponiveis();
    } else {
      setHorariosDisponiveis([]);
      setHorarioSelecionado('');
    }
  }, [dataSelecionada, salaoId, servicoId, profissionalId]);

  const carregarDiasDisponiveis = async () => {
    const dias: string[] = [];
    const hoje = new Date();
    
    // Carregar próximos 30 dias
    for (let i = 0; i < 30; i++) {
      const data = addDays(hoje, i);
      const dataString = format(data, 'yyyy-MM-dd');
      
      // Verificar se há horários disponíveis neste dia
      const horarios = await HorarioService.getHorariosDisponiveis(
        salaoId, 
        dataString, 
        servicoId, 
        profissionalId
      );
      
      if (horarios.some(h => h.disponivel)) {
        dias.push(dataString);
      }
    }
    
    setDiasDisponiveis(dias);
  };

  const carregarHorariosDisponiveis = async () => {
    if (!dataSelecionada) return;
    
    setLoading(true);
    setErro('');
    
    try {
      const horarios = await HorarioService.getHorariosDisponiveis(
        salaoId,
        dataSelecionada,
        servicoId,
        profissionalId
      );
      
      setHorariosDisponiveis(horarios);
    } catch (error) {
      setErro('Erro ao carregar horários disponíveis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const carregarSugestoes = async () => {
    try {
      const sugestoesHorarios = await HorarioService.sugerirHorarios(
        salaoId,
        servicoId,
        undefined,
        profissionalId
      );
      
      setSugestoes(sugestoesHorarios.slice(0, 3)); // Primeiras 3 sugestões
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    }
  };

  const handleDataChange = (data: string) => {
    setDataSelecionada(data);
    setHorarioSelecionado('');
    setErro('');
  };

  const handleHorarioClick = async (hora: string) => {
    // Validar agendamento
    const validacao = HorarioService.validarAgendamento(
      salaoId,
      dataSelecionada,
      hora,
      servicoId,
      profissionalId
    );
    
    if (!validacao.valido) {
      setErro(validacao.erro || 'Horário inválido');
      onValidationError?.(validacao.erro || 'Horário inválido');
      return;
    }
    
    setHorarioSelecionado(hora);
    setErro('');
    onHorarioSelecionado(dataSelecionada, hora);
  };

  const formatarDataExibicao = (data: string): string => {
    const dataObj = new Date(data + 'T00:00:00');
    const hoje = new Date();
    const amanha = addDays(hoje, 1);
    
    if (format(dataObj, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd')) {
      return 'Hoje';
    } else if (format(dataObj, 'yyyy-MM-dd') === format(amanha, 'yyyy-MM-dd')) {
      return 'Amanhã';
    } else {
      return format(dataObj, "dd 'de' MMM", { locale: ptBR });
    }
  };

  const getDiaDaSemana = (data: string): string => {
    const dataObj = new Date(data + 'T00:00:00');
    return format(dataObj, 'EEEE', { locale: ptBR });
  };

  return (
    <div className="space-y-6">
      {/* Sugestões Rápidas */}
      {sugestoes.length > 0 && !dataSelecionada && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            ⚡ Sugestões Rápidas
          </h4>
          <div className="space-y-2">
            {sugestoes.map((sugestao, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 min-w-[100px]">
                  {formatarDataExibicao(sugestao.data)}
                </span>
                <div className="flex flex-wrap gap-1">
                  {sugestao.horarios.slice(0, 4).map(hora => (
                    <button
                      key={hora}
                      onClick={() => {
                        setDataSelecionada(sugestao.data);
                        setTimeout(() => handleHorarioClick(hora), 100);
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      {hora}
                    </button>
                  ))}
                  {sugestao.horarios.length > 4 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{sugestao.horarios.length - 4} mais
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seleção de Data */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Escolha o Dia
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {diasDisponiveis.slice(0, 12).map(data => (
            <button
              key={data}
              onClick={() => handleDataChange(data)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                dataSelecionada === data
                  ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="text-sm font-medium">
                {formatarDataExibicao(data)}
              </div>
              <div className="text-xs opacity-75">
                {getDiaDaSemana(data)}
              </div>
            </button>
          ))}
        </div>
        
        {diasDisponiveis.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum dia disponível encontrado</p>
          </div>
        )}
      </div>

      {/* Seleção de Horário */}
      {dataSelecionada && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Escolha o Horário - {formatarDataExibicao(dataSelecionada)}
          </label>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Carregando horários...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {horariosDisponiveis.map(horario => (
                <button
                  key={horario.hora}
                  onClick={() => handleHorarioClick(horario.hora)}
                  disabled={!horario.disponivel}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    horarioSelecionado === horario.hora
                      ? 'bg-green-600 text-white border-green-600 shadow-lg'
                      : horario.disponivel
                      ? 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {horario.hora}
                  {!horario.disponivel && (
                    <div className="text-xs mt-1 opacity-75">Ocupado</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {horariosDisponiveis.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum horário disponível neste dia</p>
            </div>
          )}
        </div>
      )}

      {/* Mensagens de Erro */}
      {erro && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{erro}</span>
        </div>
      )}

      {/* Confirmação de Seleção */}
      {dataSelecionada && horarioSelecionado && !erro && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Horário Selecionado</p>
            <p className="text-xs">
              {formatarDataExibicao(dataSelecionada)} às {horarioSelecionado}
            </p>
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">ℹ️ Informações Importantes</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Antecedência mínima: 2 horas</li>
          <li>• Agendamentos podem ser feitos até 30 dias no futuro</li>
          <li>• Horários em cinza já estão ocupados</li>
          <li>• Confirme os dados antes de finalizar</li>
        </ul>
      </div>
    </div>
  );
};

export default SeletorHorario;