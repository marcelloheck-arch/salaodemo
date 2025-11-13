/**
 * Dashboard do Profissional
 * Visualiza apenas seus próprios agendamentos
 */

'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidades: string[];
  bio?: string;
}

interface Agendamento {
  id: string;
  clienteId?: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail?: string;
  servicoId?: string;
  servicoNome: string;
  profissionalId: string;
  profissionalNome: string;
  data: string;
  horario: string;
  duracao: number;
  valor: number;
  status: string;
  criadoEm: string;
}

interface ProfissionalDashboardPageProps {
  profissional: Profissional;
}

export default function ProfissionalDashboardPage({
  profissional
}: ProfissionalDashboardPageProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'hoje' | 'proximos' | 'concluidos'>('hoje');
  const [dataFiltro, setDataFiltro] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    carregarAgendamentos();
  }, [filtro, dataFiltro]);

  const carregarAgendamentos = () => {
    // Buscar agendamentos do localStorage
    const todosAgendamentos: Agendamento[] = JSON.parse(
      localStorage.getItem('agendamentos') || '[]'
    );

    // Filtrar apenas agendamentos deste profissional
    let meusAgendamentos = todosAgendamentos.filter(
      a => a.profissionalId === profissional.id
    );

    // Aplicar filtros adicionais
    const hoje = new Date().toISOString().split('T')[0];

    switch (filtro) {
      case 'hoje':
        meusAgendamentos = meusAgendamentos.filter(a => a.data === hoje);
        break;
      case 'proximos':
        meusAgendamentos = meusAgendamentos.filter(a => a.data >= hoje && a.status !== 'concluido');
        break;
      case 'concluidos':
        meusAgendamentos = meusAgendamentos.filter(a => a.status === 'concluido');
        break;
    }

    // Ordenar por data e horário
    meusAgendamentos.sort((a, b) => {
      const dataA = new Date(a.data + 'T' + a.horario);
      const dataB = new Date(b.data + 'T' + b.horario);
      return dataA.getTime() - dataB.getTime();
    });

    setAgendamentos(meusAgendamentos);
  };

  const atualizarStatus = (agendamentoId: string, novoStatus: string) => {
    const todosAgendamentos: Agendamento[] = JSON.parse(
      localStorage.getItem('agendamentos') || '[]'
    );

    const index = todosAgendamentos.findIndex(a => a.id === agendamentoId);
    if (index >= 0) {
      todosAgendamentos[index].status = novoStatus;
      localStorage.setItem('agendamentos', JSON.stringify(todosAgendamentos));
      carregarAgendamentos();
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'text-green-600 bg-green-100';
      case 'concluido':
        return 'text-blue-600 bg-blue-100';
      case 'cancelado':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  // Estatísticas
  const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]').filter(
    (a: Agendamento) => a.profissionalId === profissional.id
  );
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = todosAgendamentos.filter((a: Agendamento) => a.data === hoje);
  const agendamentosConcluidos = todosAgendamentos.filter(
    (a: Agendamento) => a.status === 'concluido'
  );
  const receitaTotal = agendamentosConcluidos.reduce(
    (sum: number, a: Agendamento) => sum + (a.valor || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com Perfil */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {profissional.nome.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{profissional.nome}</h1>
              <p className="text-white/70 mb-2">{profissional.especialidades.join(', ')}</p>
              {profissional.bio && (
                <p className="text-white/60 text-sm">{profissional.bio}</p>
              )}
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2 text-white/70">
                  <Phone className="w-4 h-4" />
                  <span>{profissional.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <User className="w-4 h-4" />
                  <span>{profissional.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70">Hoje</p>
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{agendamentosHoje.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70">Concluídos</p>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{agendamentosConcluidos.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70">Total</p>
              <AlertCircle className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">{todosAgendamentos.length}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70">Receita</p>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatarMoeda(receitaTotal)}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'hoje', label: 'Hoje' },
              { key: 'proximos', label: 'Próximos' },
              { key: 'todos', label: 'Todos' },
              { key: 'concluidos', label: 'Concluídos' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filtro === f.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Agendamentos */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            📅 Meus Agendamentos
          </h2>

          {agendamentos.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-lg">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {agendamento.clienteNome}
                      </h3>
                      <p className="text-white/60">{agendamento.servicoNome}</p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${obterCorStatus(
                        agendamento.status
                      )}`}
                    >
                      {agendamento.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Data</p>
                      <p className="text-white font-semibold">
                        {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Horário</p>
                      <p className="text-white font-semibold">{agendamento.horario}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Duração</p>
                      <p className="text-white font-semibold">{agendamento.duracao} min</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Valor</p>
                      <p className="text-white font-semibold">
                        {formatarMoeda(agendamento.valor)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <Phone className="w-4 h-4" />
                      <span>{agendamento.clienteTelefone}</span>
                    </div>
                    {agendamento.clienteEmail && (
                      <div className="flex items-center gap-2 text-white/70">
                        <User className="w-4 h-4" />
                        <span>{agendamento.clienteEmail}</span>
                      </div>
                    )}
                  </div>

                  {agendamento.status === 'confirmado' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => atualizarStatus(agendamento.id, 'concluido')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Marcar como Concluído
                      </button>
                      <button
                        onClick={() => atualizarStatus(agendamento.id, 'cancelado')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
