// Tipos para o sistema de relatórios

export interface RelatorioBase {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'financeiro' | 'operacional' | 'marketing' | 'clientes' | 'funcionarios';
  tipo: 'tabela' | 'grafico' | 'dashboard' | 'exportavel';
  periodicidade: 'diario' | 'semanal' | 'mensal' | 'anual' | 'personalizado';
  ultimaAtualizacao: Date;
  dadosDisponiveis: boolean;
}

export interface RelatorioFinanceiro {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  receitas: {
    total: number;
    servicos: number;
    produtos: number;
    outros: number;
    detalhePorDia: Array<{
      data: Date;
      valor: number;
      servicos: number;
      produtos: number;
    }>;
  };
  despesas: {
    total: number;
    salarios: number;
    aluguel: number;
    fornecedores: number;
    outros: number;
    detalhePorCategoria: Array<{
      categoria: string;
      valor: number;
      percentual: number;
    }>;
  };
  lucroLiquido: number;
  margemLucro: number;
  crescimento: number; // % comparado ao período anterior
  metas: {
    receitaMeta: number;
    receitaAtual: number;
    percentualAlcancado: number;
  };
}

export interface RelatorioOperacional {
  agendamentos: {
    total: number;
    concluidos: number;
    cancelados: number;
    noShows: number;
    taxaConclusao: number;
    taxaCancelamento: number;
    mediaPorDia: number;
    horariosPico: Array<{
      hora: string;
      quantidade: number;
    }>;
  };
  servicos: {
    maisPopulares: Array<{
      id: string;
      nome: string;
      quantidade: number;
      receita: number;
    }>;
    tempoMedio: number;
    satisfacaoMedia: number;
  };
  ocupacao: {
    taxaOcupacao: number;
    horasOciosas: number;
    horasPico: string[];
    sugestaoOtimizacao: string[];
  };
  funcionarios: {
    performance: Array<{
      id: string;
      nome: string;
      agendamentos: number;
      receita: number;
      avaliacaoMedia: number;
      pontualidade: number;
    }>;
    produtividade: {
      horasTrabalho: number;
      horasOciosas: number;
      eficiencia: number;
    };
  };
}

export interface RelatorioClientes {
  demograficos: {
    totalClientes: number;
    clientesAtivos: number;
    clientesNovos: number;
    clientesInativos: number;
    faixaEtaria: Array<{
      faixa: string;
      quantidade: number;
      percentual: number;
    }>;
    genero: {
      masculino: number;
      feminino: number;
      outros: number;
    };
    localizacao: Array<{
      cidade: string;
      quantidade: number;
    }>;
  };
  comportamento: {
    frequenciaMedia: number;
    ticketMedio: number;
    tempoMedioEntreVisitas: number;
    sazonalidade: Array<{
      mes: string;
      visitas: number;
    }>;
    preferenciasServicos: Array<{
      servico: string;
      popularidade: number;
    }>;
    horarioPreferido: Array<{
      hora: string;
      preferencia: number;
    }>;
  };
  fidelidade: {
    clientesFieis: number; // mais de 5 visitas
    taxaRetencao: number;
    churn: number; // taxa de abandono
    valorVidaUtil: number; // LTV - Lifetime Value
    programaFidelidade: {
      participantes: number;
      pontosMedios: number;
      resgates: number;
    };
  };
  satisfacao: {
    nps: number; // Net Promoter Score
    avaliacaoMedia: number;
    percentualRecomendacao: number;
    reclamacoes: number;
    elogios: number;
  };
}

export interface RelatorioMarketing {
  campanhas: Array<{
    id: string;
    nome: string;
    tipo: 'email' | 'sms' | 'whatsapp' | 'social' | 'google_ads';
    inicio: Date;
    fim: Date;
    investimento: number;
    impressoes: number;
    cliques: number;
    conversoes: number;
    roi: number; // Return on Investment
    ctr: number; // Click Through Rate
    cpc: number; // Cost Per Click
    cpa: number; // Cost Per Acquisition
  }>;
  canaisAquisicao: Array<{
    canal: string;
    clientesNovos: number;
    custoAquisicao: number;
    qualidadeLeads: number;
  }>;
  redeSociais: {
    seguidores: number;
    engajamento: number;
    alcance: number;
    mencoes: number;
    sentimento: 'positivo' | 'neutro' | 'negativo';
  };
  promocoes: Array<{
    nome: string;
    desconto: number;
    utilizacoes: number;
    receitaGerada: number;
    efetividade: number;
  }>;
}

export interface FiltroRelatorio {
  dataInicio: Date;
  dataFim: Date;
  funcionarios?: string[];
  servicos?: string[];
  clientes?: string[];
  formasPagamento?: string[];
  status?: string[];
  comparativo?: {
    ativo: boolean;
    periodoAnterior: boolean;
    anoAnterior: boolean;
  };
}

export interface ConfiguracaoRelatorio {
  formatoExportacao: 'pdf' | 'excel' | 'csv' | 'json';
  incluirGraficos: boolean;
  incluirTabelas: boolean;
  incluirComparativo: boolean;
  envioAutomatico: {
    ativo: boolean;
    frequencia: 'diario' | 'semanal' | 'mensal';
    destinatarios: string[];
    horario: string;
  };
  personalizacao: {
    cores: string[];
    logo: string;
    marca: string;
  };
}

// Dados mock para desenvolvimento
export const RELATORIOS_DISPONIVEIS: RelatorioBase[] = [
  {
    id: 'financeiro-mensal',
    nome: 'Relatório Financeiro',
    descricao: 'Receitas, despesas e lucro líquido',
    categoria: 'financeiro',
    tipo: 'dashboard',
    periodicidade: 'mensal',
    ultimaAtualizacao: new Date(),
    dadosDisponiveis: true
  },
  {
    id: 'operacional-diario',
    nome: 'Performance Operacional',
    descricao: 'Agendamentos, ocupação e produtividade',
    categoria: 'operacional',
    tipo: 'grafico',
    periodicidade: 'diario',
    ultimaAtualizacao: new Date(),
    dadosDisponiveis: true
  },
  {
    id: 'clientes-analise',
    nome: 'Análise de Clientes',
    descricao: 'Demografia, comportamento e satisfação',
    categoria: 'clientes',
    tipo: 'dashboard',
    periodicidade: 'mensal',
    ultimaAtualizacao: new Date(),
    dadosDisponiveis: true
  },
  {
    id: 'marketing-roi',
    nome: 'ROI de Marketing',
    descricao: 'Campanhas, conversões e retorno',
    categoria: 'marketing',
    tipo: 'grafico',
    periodicidade: 'semanal',
    ultimaAtualizacao: new Date(),
    dadosDisponiveis: true
  },
  {
    id: 'funcionarios-performance',
    nome: 'Performance da Equipe',
    descricao: 'Produtividade e avaliações por funcionário',
    categoria: 'funcionarios',
    tipo: 'tabela',
    periodicidade: 'mensal',
    ultimaAtualizacao: new Date(),
    dadosDisponiveis: true
  }
];

export const DADOS_FINANCEIRO_MOCK: RelatorioFinanceiro = {
  periodo: {
    inicio: new Date('2025-10-01'),
    fim: new Date('2025-10-31')
  },
  receitas: {
    total: 48500,
    servicos: 32000,
    produtos: 14500,
    outros: 2000,
    detalhePorDia: [
      { data: new Date('2025-10-01'), valor: 1850, servicos: 1200, produtos: 650 },
      { data: new Date('2025-10-02'), valor: 2100, servicos: 1400, produtos: 700 },
      { data: new Date('2025-10-03'), valor: 1650, servicos: 1100, produtos: 550 },
      // ... mais dados
    ]
  },
  despesas: {
    total: 28000,
    salarios: 15000,
    aluguel: 5000,
    fornecedores: 4500,
    outros: 3500,
    detalhePorCategoria: [
      { categoria: 'Salários', valor: 15000, percentual: 53.6 },
      { categoria: 'Aluguel', valor: 5000, percentual: 17.9 },
      { categoria: 'Fornecedores', valor: 4500, percentual: 16.1 },
      { categoria: 'Outros', valor: 3500, percentual: 12.5 }
    ]
  },
  lucroLiquido: 20500,
  margemLucro: 42.3,
  crescimento: 15.8,
  metas: {
    receitaMeta: 45000,
    receitaAtual: 48500,
    percentualAlcancado: 107.8
  }
};

export const DADOS_OPERACIONAL_MOCK: RelatorioOperacional = {
  agendamentos: {
    total: 287,
    concluidos: 251,
    cancelados: 28,
    noShows: 8,
    taxaConclusao: 87.5,
    taxaCancelamento: 9.8,
    mediaPorDia: 9.3,
    horariosPico: [
      { hora: '09:00', quantidade: 45 },
      { hora: '14:00', quantidade: 52 },
      { hora: '16:00', quantidade: 48 },
      { hora: '18:00', quantidade: 41 }
    ]
  },
  servicos: {
    maisPopulares: [
      { id: 's1', nome: 'Corte Feminino', quantidade: 89, receita: 12450 },
      { id: 's2', nome: 'Coloração', quantidade: 45, receita: 9000 },
      { id: 's3', nome: 'Escova', quantidade: 67, receita: 4690 },
      { id: 's4', nome: 'Manicure', quantidade: 52, receita: 2600 }
    ],
    tempoMedio: 75, // minutos
    satisfacaoMedia: 4.6
  },
  ocupacao: {
    taxaOcupacao: 78.5,
    horasOciosas: 12.5,
    horasPico: ['09:00-11:00', '14:00-17:00'],
    sugestaoOtimizacao: [
      'Promover agendamentos entre 11:00-14:00',
      'Oferecer desconto para horários ociosos',
      'Criar pacotes para aumentar tempo médio'
    ]
  },
  funcionarios: {
    performance: [
      { id: 'f1', nome: 'Ana Costa', agendamentos: 85, receita: 11900, avaliacaoMedia: 4.8, pontualidade: 95 },
      { id: 'f2', nome: 'Carlos Silva', agendamentos: 72, receita: 8640, avaliacaoMedia: 4.5, pontualidade: 88 },
      { id: 'f3', nome: 'Maria Santos', agendamentos: 94, receita: 10850, avaliacaoMedia: 4.7, pontualidade: 92 }
    ],
    produtividade: {
      horasTrabalho: 184,
      horasOciosas: 24,
      eficiencia: 88.5
    }
  }
};

export const DADOS_CLIENTES_MOCK: RelatorioClientes = {
  demograficos: {
    totalClientes: 1247,
    clientesAtivos: 892,
    clientesNovos: 156,
    clientesInativos: 199,
    faixaEtaria: [
      { faixa: '18-25', quantidade: 187, percentual: 15.0 },
      { faixa: '26-35', quantidade: 423, percentual: 33.9 },
      { faixa: '36-45', quantidade: 298, percentual: 23.9 },
      { faixa: '46-55', quantidade: 224, percentual: 18.0 },
      { faixa: '56+', quantidade: 115, percentual: 9.2 }
    ],
    genero: {
      masculino: 312,
      feminino: 891,
      outros: 44
    },
    localizacao: [
      { cidade: 'São Paulo', quantidade: 456 },
      { cidade: 'Santos', quantidade: 234 },
      { cidade: 'Guarulhos', quantidade: 189 },
      { cidade: 'Osasco', quantidade: 145 }
    ]
  },
  comportamento: {
    frequenciaMedia: 2.3, // visitas por mês
    ticketMedio: 125.50,
    tempoMedioEntreVisitas: 18, // dias
    sazonalidade: [
      { mes: 'Jan', visitas: 892 },
      { mes: 'Fev', visitas: 945 },
      { mes: 'Mar', visitas: 1023 },
      { mes: 'Abr', visitas: 978 }
    ],
    preferenciasServicos: [
      { servico: 'Corte', popularidade: 45.2 },
      { servico: 'Coloração', popularidade: 28.7 },
      { servico: 'Escova', popularidade: 35.1 }
    ],
    horarioPreferido: [
      { hora: '09:00', preferencia: 15.2 },
      { hora: '14:00', preferencia: 22.1 },
      { hora: '16:00', preferencia: 18.9 }
    ]
  },
  fidelidade: {
    clientesFieis: 342,
    taxaRetencao: 76.5,
    churn: 12.8,
    valorVidaUtil: 890.50,
    programaFidelidade: {
      participantes: 567,
      pontosMedios: 284,
      resgates: 123
    }
  },
  satisfacao: {
    nps: 67,
    avaliacaoMedia: 4.6,
    percentualRecomendacao: 89.2,
    reclamacoes: 23,
    elogios: 145
  }
};