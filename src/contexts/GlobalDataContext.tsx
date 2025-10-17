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

// Dados iniciais mock mais realistas
const clientesIniciais: Cliente[] = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '11999887766',
    email: 'maria.silva@email.com',
    birthday: '1990-03-15',
    preferences: ['Corte', 'Escova'],
    notes: 'Prefere horários pela manhã',
    totalSpent: 850.00,
    totalVisits: 12,
    lastVisit: '2025-10-15',
    averageTicket: 70.83,
    status: 'active',
    createdAt: '2025-01-15',
    address: {
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo'
    }
  },
  {
    id: '2',
    name: 'Ana Costa',
    phone: '11888776655',
    email: 'ana.costa@email.com',
    birthday: '1985-07-22',
    preferences: ['Manicure', 'Pedicure'],
    notes: 'Cliente VIP, desconto especial',
    totalSpent: 1250.00,
    totalVisits: 18,
    lastVisit: '2025-10-14',
    averageTicket: 69.44,
    status: 'vip',
    createdAt: '2024-11-20',
    address: {
      street: 'Av. Principal, 456',
      neighborhood: 'Vila Nova',
      city: 'São Paulo'
    }
  },
  {
    id: '3',
    name: 'Carla Santos',
    phone: '11777665544',
    email: 'carla.santos@email.com',
    birthday: '1992-12-05',
    preferences: ['Coloração', 'Tratamento'],
    notes: 'Alérgica a alguns produtos',
    totalSpent: 680.00,
    totalVisits: 8,
    lastVisit: '2025-10-10',
    averageTicket: 85.00,
    status: 'active',
    createdAt: '2025-02-10'
  }
];

const servicosIniciais: Servico[] = [
  {
    id: '1',
    nome: 'Corte Feminino',
    descricao: 'Corte de cabelo feminino com acabamento',
    preco: 80.00,
    duracao: 60,
    categoria: 'Cabelo',
    ativo: true,
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    nome: 'Escova Progressiva',
    descricao: 'Alisamento com escova progressiva',
    preco: 150.00,
    duracao: 120,
    categoria: 'Cabelo',
    ativo: true,
    createdAt: '2025-01-01'
  },
  {
    id: '3',
    nome: 'Manicure',
    descricao: 'Manicure completa com esmaltação',
    preco: 35.00,
    duracao: 45,
    categoria: 'Unhas',
    ativo: true,
    createdAt: '2025-01-01'
  },
  {
    id: '4',
    nome: 'Pedicure',
    descricao: 'Pedicure completa com esmaltação',
    preco: 40.00,
    duracao: 50,
    categoria: 'Unhas',
    ativo: true,
    createdAt: '2025-01-01'
  },
  {
    id: '5',
    nome: 'Coloração',
    descricao: 'Coloração completa do cabelo',
    preco: 120.00,
    duracao: 90,
    categoria: 'Cabelo',
    ativo: true,
    createdAt: '2025-01-01'
  }
];

const agendamentosIniciais: Agendamento[] = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'Maria Silva',
    servico: 'Corte Feminino',
    profissional: 'Ana Beatriz',
    data: '2025-10-16',
    hora: '09:00',
    status: 'agendado',
    valor: 80.00,
    observacoes: 'Primeira vez no salão',
    createdAt: '2025-10-15'
  },
  {
    id: '2',
    clienteId: '2',
    clienteNome: 'Ana Costa',
    servico: 'Manicure',
    profissional: 'Carla Mendes',
    data: '2025-10-16',
    hora: '14:00',
    status: 'confirmado',
    valor: 35.00,
    createdAt: '2025-10-15'
  },
  {
    id: '3',
    clienteId: '1',
    clienteNome: 'Maria Silva',
    servico: 'Escova Progressiva',
    profissional: 'Ana Beatriz',
    data: '2025-10-14',
    hora: '10:00',
    status: 'concluido',
    valor: 150.00,
    createdAt: '2025-10-14'
  },
  {
    id: '4',
    clienteId: '3',
    clienteNome: 'Carla Santos',
    servico: 'Coloração',
    profissional: 'Patricia Lima',
    data: '2025-10-15',
    hora: '15:00',
    status: 'concluido',
    valor: 120.00,
    createdAt: '2025-10-15'
  }
];

const movimentacoesIniciais: MovimentacaoFinanceira[] = [
  {
    id: '1',
    tipo: 'entrada',
    categoria: 'Serviços',
    descricao: 'Escova Progressiva - Maria Silva',
    valor: 150.00,
    data: '2025-10-14',
    agendamentoId: '3',
    createdAt: '2025-10-14'
  },
  {
    id: '2',
    tipo: 'entrada',
    categoria: 'Serviços',
    descricao: 'Coloração - Carla Santos',
    valor: 120.00,
    data: '2025-10-15',
    agendamentoId: '4',
    createdAt: '2025-10-15'
  },
  {
    id: '3',
    tipo: 'saida',
    categoria: 'Produtos',
    descricao: 'Shampoo e condicionador',
    valor: 85.00,
    data: '2025-10-15',
    createdAt: '2025-10-15'
  }
];

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