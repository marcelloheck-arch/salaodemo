'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Interfaces centralizadas
export interface Cliente {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday?: string;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
  };
  preferences: string[];
  notes?: string;
  totalSpent: number;
  totalVisits: number;
  lastVisit?: string;
  averageTicket: number;
  status: 'active' | 'inactive' | 'vip';
  createdAt: string;
  licenseKey?: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  servico: string;
  profissional: string;
  data: string;
  hora: string;
  status: 'agendado' | 'confirmado' | 'em-andamento' | 'concluido' | 'cancelado';
  valor: number;
  observacoes?: string;
  createdAt: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  categoria: string;
  ativo: boolean;
  createdAt: string;
}

export interface MovimentacaoFinanceira {
  id: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  agendamentoId?: string;
  createdAt: string;
}

// Context para dados globais
interface GlobalDataContextType {
  clientes: Cliente[];
  agendamentos: Agendamento[];
  servicos: Servico[];
  movimentacoes: MovimentacaoFinanceira[];
  setClientes: (clientes: Cliente[]) => void;
  setAgendamentos: (agendamentos: Agendamento[]) => void;
  setServicos: (servicos: Servico[]) => void;
  setMovimentacoes: (movimentacoes: MovimentacaoFinanceira[]) => void;
  addCliente: (cliente: Cliente) => void;
  addAgendamento: (agendamento: Agendamento) => void;
  addServico: (servico: Servico) => void;
  addMovimentacao: (movimentacao: MovimentacaoFinanceira) => void;
  getMetricas: () => Metricas;
}

interface Metricas {
  totalClientes: number;
  clientesAtivos: number;
  clientesVip: number;
  receitaTotal: number;
  receitaMes: number;
  ticketMedio: number;
  agendamentosHoje: number;
  agendamentosMes: number;
  servicosMaisPopulares: { nome: string; quantidade: number; receita: number }[];
  crescimentoMensal: number;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

// Sistema inicia completamente limpo - sem dados fictícios
// Novos usuários começam com arrays vazios
const clientesIniciais: Cliente[] = [];
const servicosIniciais: Servico[] = [];
const agendamentosIniciais: Agendamento[] = [];
const movimentacoesIniciais: MovimentacaoFinanceira[] = [];

export function GlobalDataProvider({ children }: { children: React.ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoFinanceira[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedClientes = localStorage.getItem('agenda_salao_clientes_sync');
      const savedAgendamentos = localStorage.getItem('agenda_salao_agendamentos_sync');
      const savedServicos = localStorage.getItem('agenda_salao_servicos_sync');
      const savedMovimentacoes = localStorage.getItem('agenda_salao_movimentacoes_sync');

      setClientes(savedClientes ? JSON.parse(savedClientes) : clientesIniciais);
      setAgendamentos(savedAgendamentos ? JSON.parse(savedAgendamentos) : agendamentosIniciais);
      setServicos(savedServicos ? JSON.parse(savedServicos) : servicosIniciais);
      setMovimentacoes(savedMovimentacoes ? JSON.parse(savedMovimentacoes) : movimentacoesIniciais);
    }
  }, []);

  // Salvar no localStorage quando os dados mudarem
  useEffect(() => {
    if (typeof window !== 'undefined' && clientes.length > 0) {
      localStorage.setItem('agenda_salao_clientes_sync', JSON.stringify(clientes));
    }
  }, [clientes]);

  useEffect(() => {
    if (typeof window !== 'undefined' && agendamentos.length > 0) {
      localStorage.setItem('agenda_salao_agendamentos_sync', JSON.stringify(agendamentos));
    }
  }, [agendamentos]);

  useEffect(() => {
    if (typeof window !== 'undefined' && servicos.length > 0) {
      localStorage.setItem('agenda_salao_servicos_sync', JSON.stringify(servicos));
    }
  }, [servicos]);

  useEffect(() => {
    if (typeof window !== 'undefined' && movimentacoes.length > 0) {
      localStorage.setItem('agenda_salao_movimentacoes_sync', JSON.stringify(movimentacoes));
    }
  }, [movimentacoes]);

  const addCliente = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  const addAgendamento = (agendamento: Agendamento) => {
    setAgendamentos(prev => [...prev, agendamento]);
    
    // Adicionar movimentação financeira automaticamente se concluído
    if (agendamento.status === 'concluido') {
      const movimentacao: MovimentacaoFinanceira = {
        id: Date.now().toString(),
        tipo: 'entrada',
        categoria: 'Serviços',
        descricao: `${agendamento.servico} - ${agendamento.clienteNome}`,
        valor: agendamento.valor,
        data: agendamento.data,
        agendamentoId: agendamento.id,
        createdAt: new Date().toISOString()
      };
      addMovimentacao(movimentacao);
    }
  };

  const addServico = (servico: Servico) => {
    setServicos(prev => [...prev, servico]);
  };

  const addMovimentacao = (movimentacao: MovimentacaoFinanceira) => {
    setMovimentacoes(prev => [...prev, movimentacao]);
  };

  const getMetricas = (): Metricas => {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const hoje = agora.toISOString().split('T')[0];

    // Métricas de clientes
    const totalClientes = clientes.length;
    const clientesAtivos = clientes.filter(c => c.status === 'active').length;
    const clientesVip = clientes.filter(c => c.status === 'vip').length;

    // Métricas financeiras
    const entradasMes = movimentacoes.filter(m => 
      m.tipo === 'entrada' && 
      new Date(m.data) >= inicioMes
    );
    const receitaMes = entradasMes.reduce((sum, m) => sum + m.valor, 0);
    
    const todasEntradas = movimentacoes.filter(m => m.tipo === 'entrada');
    const receitaTotal = todasEntradas.reduce((sum, m) => sum + m.valor, 0);

    // Ticket médio
    const agendamentosConcluidos = agendamentos.filter(a => a.status === 'concluido');
    const ticketMedio = agendamentosConcluidos.length > 0 
      ? agendamentosConcluidos.reduce((sum, a) => sum + a.valor, 0) / agendamentosConcluidos.length 
      : 0;

    // Agendamentos
    const agendamentosHoje = agendamentos.filter(a => a.data === hoje).length;
    const agendamentosMes = agendamentos.filter(a => 
      new Date(a.data) >= inicioMes
    ).length;

    // Serviços mais populares
    const servicosCount: { [key: string]: { quantidade: number; receita: number } } = {};
    agendamentosConcluidos.forEach(a => {
      if (!servicosCount[a.servico]) {
        servicosCount[a.servico] = { quantidade: 0, receita: 0 };
      }
      servicosCount[a.servico].quantidade++;
      servicosCount[a.servico].receita += a.valor;
    });

    const servicosMaisPopulares = Object.entries(servicosCount)
      .map(([nome, data]) => ({ nome, ...data }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    // Crescimento mensal (simulado)
    const crescimentoMensal = 12.5; // %

    return {
      totalClientes,
      clientesAtivos,
      clientesVip,
      receitaTotal,
      receitaMes,
      ticketMedio,
      agendamentosHoje,
      agendamentosMes,
      servicosMaisPopulares,
      crescimentoMensal
    };
  };

  const value = {
    clientes,
    agendamentos,
    servicos,
    movimentacoes,
    setClientes,
    setAgendamentos,
    setServicos,
    setMovimentacoes,
    addCliente,
    addAgendamento,
    addServico,
    addMovimentacao,
    getMetricas
  };

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
}