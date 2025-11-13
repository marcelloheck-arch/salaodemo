'use client';

import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import SeletorHorario from './SeletorHorario';
import HorarioService from '@/services/HorarioService';

interface Profissional {
  id: string;
  nome: string;
  especialidades: string[];
  avaliacao: number;
  foto?: string;
  disponivel: boolean;
  proximoHorario?: string;
}

interface Servico {
  id: string;
  nome: string;
  duracao: number;
  preco: number;
  categoria: string;
}

interface AgendamentoMultiProps {
  salaoId: string;
  onAgendamentoCriado: (agendamento: any) => void;
}

const AgendamentoMulti: React.FC<AgendamentoMultiProps> = ({
  salaoId,
  onAgendamentoCriado
}) => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState<{data: string, hora: string} | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);

  const etapas = [
    { numero: 1, titulo: 'Serviço', descricao: 'Escolha o serviço' },
    { numero: 2, titulo: 'Profissional', descricao: 'Selecione o profissional' },
    { numero: 3, titulo: 'Horário', descricao: 'Defina data e hora' },
    { numero: 4, titulo: 'Dados', descricao: 'Informações do cliente' },
    { numero: 5, titulo: 'Confirmação', descricao: 'Revisar e confirmar' }
  ];

  useEffect(() => {
    carregarServicos();
  }, [salaoId]);

  useEffect(() => {
    if (servicoSelecionado) {
      carregarProfissionais();
    }
  }, [servicoSelecionado]);

  const carregarServicos = async () => {
    try {
      // Simulação - em produção, buscar do banco de dados
      const servicosExemplo: Servico[] = [
        { id: '1', nome: 'Corte Masculino', duracao: 30, preco: 25, categoria: 'Cabelo' },
        { id: '2', nome: 'Corte Feminino', duracao: 45, preco: 35, categoria: 'Cabelo' },
        { id: '3', nome: 'Coloração', duracao: 120, preco: 80, categoria: 'Cabelo' },
        { id: '4', nome: 'Manicure', duracao: 45, preco: 20, categoria: 'Unhas' },
        { id: '5', nome: 'Pedicure', duracao: 60, preco: 25, categoria: 'Unhas' },
        { id: '6', nome: 'Limpeza de Pele', duracao: 90, preco: 60, categoria: 'Estética' }
      ];
      setServicos(servicosExemplo);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const carregarProfissionais = async () => {
    try {
      // Simulação - em produção, buscar profissionais que fazem o serviço selecionado
      const profissionaisExemplo: Profissional[] = [
        {
          id: '1',
          nome: 'Maria Silva',
          especialidades: ['Corte Feminino', 'Coloração', 'Cabelo'],
          avaliacao: 4.8,
          disponivel: true,
          proximoHorario: '14:00'
        },
        {
          id: '2',
          nome: 'João Santos',
          especialidades: ['Corte Masculino', 'Barba', 'Cabelo'],
          avaliacao: 4.9,
          disponivel: true,
          proximoHorario: '15:30'
        },
        {
          id: '3',
          nome: 'Ana Costa',
          especialidades: ['Manicure', 'Pedicure', 'Unhas'],
          avaliacao: 4.7,
          disponivel: true,
          proximoHorario: '16:00'
        },
        {
          id: '4',
          nome: 'Carlos Oliveira',
          especialidades: ['Corte Masculino', 'Corte Feminino', 'Cabelo'],
          avaliacao: 4.6,
          disponivel: true,
          proximoHorario: '13:30'
        },
        {
          id: '5',
          nome: 'Patricia Lima',
          especialidades: ['Estética', 'Limpeza de Pele', 'Coloração'],
          avaliacao: 4.9,
          disponivel: true,
          proximoHorario: '10:00'
        },
        {
          id: '6',
          nome: 'Roberto Ferreira',
          especialidades: ['Cabelo', 'Unhas', 'Estética'],
          avaliacao: 4.5,
          disponivel: true,
          proximoHorario: '11:30'
        }
      ];

      // Filtrar profissionais que fazem o serviço selecionado (filtro mais flexível)
      const profissionaisFiltrados = profissionaisExemplo.filter(prof => {
        // Se não há serviço selecionado, mostra todos
        if (!servicoSelecionado) return true;
        
        // Verifica se o profissional tem a especialidade ou categoria do serviço
        return prof.especialidades.some(esp => 
          esp.toLowerCase().includes(servicoSelecionado.nome.toLowerCase()) ||
          servicoSelecionado.nome.toLowerCase().includes(esp.toLowerCase()) ||
          esp.toLowerCase().includes(servicoSelecionado.categoria.toLowerCase()) ||
          servicoSelecionado.categoria.toLowerCase().includes(esp.toLowerCase())
        );
      });

      // Se não encontrar profissionais específicos, mostrar todos (para evitar lista vazia)
      if (profissionaisFiltrados.length === 0) {
        setProfissionais(profissionaisExemplo);
      } else {
        setProfissionais(profissionaisFiltrados);
      }
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    }
  };

  const proximaEtapa = () => {
    if (etapaAtual < 5) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const finalizarAgendamento = async () => {
    if (!servicoSelecionado || !profissionalSelecionado || !dataHoraSelecionada || !dadosCliente.nome) {
      return;
    }

    setLoading(true);
    try {
      const novoAgendamento = {
        id: Date.now().toString(),
        salaoId,
        servicoId: servicoSelecionado.id,
        profissionalId: profissionalSelecionado.id,
        data: dataHoraSelecionada.data,
        hora: dataHoraSelecionada.hora,
        cliente: dadosCliente,
        servico: servicoSelecionado,
        profissional: profissionalSelecionado,
        status: 'agendado',
        criadoEm: new Date().toISOString()
      };

      // Salvar no localStorage para persistência
      const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      agendamentosExistentes.push(novoAgendamento);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosExistentes));

      // Validar agendamento final
      const validacao = HorarioService.validarAgendamento(
        salaoId,
        dataHoraSelecionada.data,
        dataHoraSelecionada.hora,
        servicoSelecionado.id,
        profissionalSelecionado.id
      );

      if (!validacao.valido) {
        throw new Error(validacao.erro);
      }

      onAgendamentoCriado(novoAgendamento);
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Escolha o Serviço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicos.map(servico => (
                <div
                  key={servico.id}
                  onClick={() => {
                    setServicoSelecionado(servico);
                    proximaEtapa();
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    servicoSelecionado?.id === servico.id
                      ? 'border-slate-500 bg-slate-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{servico.nome}</h4>
                    <span className="text-slate-600 font-semibold">R$ {servico.preco}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {servico.duracao}min
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {servico.categoria}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Escolha o Profissional</h3>
            <div className="space-y-3">
              {profissionais.map(profissional => (
                <div
                  key={profissional.id}
                  onClick={() => {
                    setProfissionalSelecionado(profissional);
                    proximaEtapa();
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    profissionalSelecionado?.id === profissional.id
                      ? 'border-slate-500 bg-slate-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {profissional.nome.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">{profissional.nome}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">{profissional.avaliacao}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {profissional.especialidades.join(', ')}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          profissional.disponivel 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {profissional.disponivel ? 'Disponível' : 'Ocupado'}
                        </span>
                        <span className="text-gray-500">
                          Próximo: {profissional.proximoHorario}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Escolha Data e Horário</h3>
            <SeletorHorario
              salaoId={salaoId}
              servicoId={servicoSelecionado?.id || ''}
              profissionalId={profissionalSelecionado?.id}
              onHorarioSelecionado={(data, hora) => {
                setDataHoraSelecionada({data, hora});
                proximaEtapa();
              }}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={dadosCliente.nome}
                  onChange={(e) => setDadosCliente({...dadosCliente, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Digite o nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={dadosCliente.telefone}
                  onChange={(e) => setDadosCliente({...dadosCliente, telefone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={dadosCliente.email}
                  onChange={(e) => setDadosCliente({...dadosCliente, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={dadosCliente.observacoes}
                  onChange={(e) => setDadosCliente({...dadosCliente, observacoes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Alguma observação especial..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={proximaEtapa}
                disabled={!dadosCliente.nome || !dadosCliente.telefone}
                className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Confirmar Agendamento</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Serviço</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">{servicoSelecionado?.nome}</p>
                      <p className="text-sm text-gray-600">
                        {servicoSelecionado?.duracao}min • R$ {servicoSelecionado?.preco}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Profissional</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {profissionalSelecionado?.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{profissionalSelecionado?.nome}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{profissionalSelecionado?.avaliacao}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Data e Horário</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{dataHoraSelecionada?.data}</p>
                      <p className="text-sm text-gray-600">{dataHoraSelecionada?.hora}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Cliente</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{dadosCliente.nome}</p>
                      <p className="text-sm text-gray-600">{dadosCliente.telefone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {dadosCliente.observacoes && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-800 mb-2">Observações</h4>
                  <p className="text-sm text-gray-600">{dadosCliente.observacoes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={etapaAnterior}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={finalizarAgendamento}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-purple-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Confirmar Agendamento
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Indicador de Progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {etapas.map((etapa, index) => (
            <React.Fragment key={etapa.numero}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  etapaAtual >= etapa.numero
                    ? 'bg-slate-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {etapa.numero}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-gray-800">{etapa.titulo}</p>
                  <p className="text-xs text-gray-500">{etapa.descricao}</p>
                </div>
              </div>
              {index < etapas.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                  etapaAtual > etapa.numero ? 'bg-slate-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Conteúdo da Etapa */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {renderEtapa()}
      </div>

      {/* Navegação */}
      {etapaAtual > 1 && etapaAtual < 5 && (
        <div className="flex justify-between mt-6">
          <button
            onClick={etapaAnterior}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};

export default AgendamentoMulti;
