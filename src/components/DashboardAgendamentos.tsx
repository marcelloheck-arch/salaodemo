'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User, Search, Filter, Eye, Edit, Trash2, MessageCircle, ChevronDown, RefreshCw, Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Agendamento {
  id: string;
  data: string;
  hora: string;
  cliente: {
    nome: string;
    telefone: string;
    email?: string;
  };
  servico: {
    nome: string;
    duracao: number;
    preco: number;
  };
  profissional: {
    nome: string;
    id: string;
  };
  status: 'agendado' | 'confirmado' | 'em-andamento' | 'concluido' | 'cancelado' | 'nao-compareceu';
  observacoes?: string;
  criadoEm: string;
  atualizadoEm?: string;
}

interface FiltrosAgendamento {
  data: string;
  status: string;
  profissional: string;
  busca: string;
}

const DashboardAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtros, setFiltros] = useState<FiltrosAgendamento>({
    data: '',
    status: '',
    profissional: '',
    busca: ''
  });
  const [loading, setLoading] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [viewMode, setViewMode] = useState<'lista' | 'calendario' | 'timeline'>('lista');

  // Mock data - em produção, buscar do banco de dados
  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      // Simulação de dados - substituir por API real
      const agendamentosExemplo: Agendamento[] = [
        {
          id: '1',
          data: '2024-01-15',
          hora: '09:00',
          cliente: { nome: 'Maria Silva', telefone: '11999999999', email: 'maria@email.com' },
          servico: { nome: 'Corte Feminino', duracao: 45, preco: 35 },
          profissional: { nome: 'Ana Costa', id: 'prof1' },
          status: 'agendado',
          observacoes: 'Cliente nova, primeira vez no salão',
          criadoEm: '2024-01-10T10:00:00Z'
        },
        {
          id: '2',
          data: '2024-01-15',
          hora: '10:30',
          cliente: { nome: 'João Santos', telefone: '11888888888' },
          servico: { nome: 'Corte Masculino', duracao: 30, preco: 25 },
          profissional: { nome: 'Carlos Mendes', id: 'prof2' },
          status: 'confirmado',
          criadoEm: '2024-01-12T14:30:00Z'
        },
        {
          id: '3',
          data: '2024-01-15',
          hora: '14:00',
          cliente: { nome: 'Laura Oliveira', telefone: '11777777777' },
          servico: { nome: 'Coloração', duracao: 120, preco: 80 },
          profissional: { nome: 'Ana Costa', id: 'prof1' },
          status: 'em-andamento',
          criadoEm: '2024-01-13T09:15:00Z'
        },
        {
          id: '4',
          data: '2024-01-14',
          hora: '16:00',
          cliente: { nome: 'Pedro Lima', telefone: '11666666666' },
          servico: { nome: 'Barba', duracao: 20, preco: 15 },
          profissional: { nome: 'Carlos Mendes', id: 'prof2' },
          status: 'concluido',
          criadoEm: '2024-01-14T12:00:00Z'
        }
      ];
      
      setAgendamentos(agendamentosExemplo);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar agendamentos
  const agendamentosFiltrados = useMemo(() => {
    return agendamentos.filter(agendamento => {
      const matchData = !filtros.data || agendamento.data === filtros.data;
      const matchStatus = !filtros.status || agendamento.status === filtros.status;
      const matchProfissional = !filtros.profissional || agendamento.profissional.id === filtros.profissional;
      const matchBusca = !filtros.busca || 
        agendamento.cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        agendamento.cliente.telefone.includes(filtros.busca) ||
        agendamento.servico.nome.toLowerCase().includes(filtros.busca.toLowerCase());

      return matchData && matchStatus && matchProfissional && matchBusca;
    });
  }, [agendamentos, filtros]);

  // Estatísticas rápidas
  const estatisticas = useMemo(() => {
    const hoje = agendamentos.filter(a => isToday(parseISO(a.data)));
    const amanha = agendamentos.filter(a => isTomorrow(parseISO(a.data)));
    
    return {
      hoje: hoje.length,
      amanha: amanha.length,
      confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
      pendentes: agendamentos.filter(a => a.status === 'agendado').length
    };
  }, [agendamentos]);

  const getStatusColor = (status: string) => {
    const colors = {
      'agendado': 'bg-blue-100 text-blue-800',
      'confirmado': 'bg-green-100 text-green-800',
      'em-andamento': 'bg-yellow-100 text-yellow-800',
      'concluido': 'bg-gray-100 text-gray-800',
      'cancelado': 'bg-red-100 text-red-800',
      'nao-compareceu': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'agendado': <Clock className="w-4 h-4" />,
      'confirmado': <CheckCircle className="w-4 h-4" />,
      'em-andamento': <RefreshCw className="w-4 h-4" />,
      'concluido': <CheckCircle className="w-4 h-4" />,
      'cancelado': <XCircle className="w-4 h-4" />,
      'nao-compareceu': <AlertTriangle className="w-4 h-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  const formatarData = (data: string) => {
    const dataObj = parseISO(data);
    if (isToday(dataObj)) return 'Hoje';
    if (isTomorrow(dataObj)) return 'Amanhã';
    return format(dataObj, "dd 'de' MMM", { locale: ptBR });
  };

  const atualizarStatus = async (agendamentoId: string, novoStatus: string) => {
    try {
      setAgendamentos(prev => 
        prev.map(agendamento => 
          agendamento.id === agendamentoId 
            ? { ...agendamento, status: novoStatus as any, atualizadoEm: new Date().toISOString() }
            : agendamento
        )
      );
      
      // Em produção, fazer chamada para API
      console.log(`Status do agendamento ${agendamentoId} alterado para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const excluirAgendamento = async (agendamentoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
    
    try {
      setAgendamentos(prev => prev.filter(a => a.id !== agendamentoId));
      console.log(`Agendamento ${agendamentoId} excluído`);
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  };

  const enviarWhatsApp = async (agendamento: Agendamento) => {
    // Integrar com WhatsAppService
    console.log('Enviando WhatsApp para:', agendamento.cliente.telefone);
  };

  return (
    <div className="space-y-6">
      {/* Header e Estatísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard de Agendamentos</h2>
          <p className="text-gray-600">Gerencie todos os agendamentos em tempo real</p>
        </div>
        
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.hoje}</p>
              <p className="text-sm text-gray-600">Hoje</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.amanha}</p>
              <p className="text-sm text-gray-600">Amanhã</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.confirmados}</p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{estatisticas.pendentes}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nome, telefone ou serviço..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={filtros.data}
              onChange={(e) => setFiltros({...filtros, data: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Todos os status</option>
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="em-andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
              <option value="nao-compareceu">Não Compareceu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profissional
            </label>
            <select
              value={filtros.profissional}
              onChange={(e) => setFiltros({...filtros, profissional: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Todos os profissionais</option>
              <option value="prof1">Ana Costa</option>
              <option value="prof2">Carlos Mendes</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {agendamentosFiltrados.length} agendamento(s) encontrado(s)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('lista')}
              className={`p-2 rounded-lg ${viewMode === 'lista' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('calendario')}
              className={`p-2 rounded-lg ${viewMode === 'calendario' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Calendário
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Carregando agendamentos...</span>
          </div>
        ) : agendamentosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou criar um novo agendamento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profissional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agendamentosFiltrados.map((agendamento) => (
                  <tr key={agendamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {agendamento.cliente.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agendamento.cliente.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatarData(agendamento.data)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {agendamento.hora}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {agendamento.servico.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {agendamento.servico.duracao}min • R$ {agendamento.servico.preco}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {agendamento.profissional.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={agendamento.status}
                          onChange={(e) => atualizarStatus(agendamento.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 appearance-none pr-6 ${getStatusColor(agendamento.status)}`}
                        >
                          <option value="agendado">Agendado</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="em-andamento">Em Andamento</option>
                          <option value="concluido">Concluído</option>
                          <option value="cancelado">Cancelado</option>
                          <option value="nao-compareceu">Não Compareceu</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setAgendamentoSelecionado(agendamento);
                            setShowDetalhes(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => enviarWhatsApp(agendamento)}
                          className="text-green-600 hover:text-green-900"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => excluirAgendamento(agendamento.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showDetalhes && agendamentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Detalhes do Agendamento</h3>
                <button
                  onClick={() => setShowDetalhes(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Cliente</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium">{agendamentoSelecionado.cliente.nome}</p>
                    <p className="text-sm text-gray-600">{agendamentoSelecionado.cliente.telefone}</p>
                    {agendamentoSelecionado.cliente.email && (
                      <p className="text-sm text-gray-600">{agendamentoSelecionado.cliente.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Agendamento</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span>{formatarData(agendamentoSelecionado.data)} às {agendamentoSelecionado.hora}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span>{agendamentoSelecionado.profissional.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span>{agendamentoSelecionado.servico.nome} ({agendamentoSelecionado.servico.duracao}min)</span>
                    </div>
                  </div>
                </div>

                {agendamentoSelecionado.observacoes && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Observações</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">{agendamentoSelecionado.observacoes}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamentoSelecionado.status)}`}>
                    {getStatusIcon(agendamentoSelecionado.status)}
                    {agendamentoSelecionado.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => enviarWhatsApp(agendamentoSelecionado)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={() => setShowDetalhes(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
};

export default DashboardAgendamentos;