// Tipos para o sistema de avaliações

export interface Avaliacao {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteFoto?: string;
  servicoId: string;
  servicoNome: string;
  funcionarioId: string;
  funcionarioNome: string;
  agendamentoId: string;
  nota: number; // 1-5 estrelas
  comentario: string;
  dataAvaliacao: Date;
  dataServico: Date;
  status: 'ativa' | 'oculta' | 'denunciada' | 'respondida';
  resposta?: RespostaAvaliacao;
  fotos?: string[]; // URLs das fotos anexadas
  aspectos: AspectoAvaliacao[];
  recomenda: boolean;
  verificada: boolean; // Se foi verificado que o cliente realmente usou o serviço
  likes: number;
  dislikes: number;
  visualizacoes: number;
}

export interface RespostaAvaliacao {
  id: string;
  autorId: string; // ID do funcionário ou proprietário
  autorNome: string;
  autorCargo: 'proprietario' | 'funcionario' | 'gerente';
  texto: string;
  dataResposta: Date;
}

export interface AspectoAvaliacao {
  aspecto: 'qualidade' | 'atendimento' | 'limpeza' | 'pontualidade' | 'preco' | 'ambiente';
  nota: number; // 1-5
}

export interface EstatisticasAvaliacoes {
  mediaGeral: number;
  totalAvaliacoes: number;
  distribuicaoNotas: {
    [key: number]: number; // quantas avaliações para cada nota
  };
  aspectos: {
    [key in AspectoAvaliacao['aspecto']]: {
      media: number;
      total: number;
    };
  };
  tendencia: 'subindo' | 'descendo' | 'estavel';
  avaliacoesRecentes: number; // últimos 30 dias
  recomendacao: number; // percentual que recomenda
}

export interface FiltroAvaliacoes {
  nota?: number[];
  periodo?: {
    inicio: Date;
    fim: Date;
  };
  servico?: string[];
  funcionario?: string[];
  status?: Avaliacao['status'][];
  cliente?: string;
  temResposta?: boolean;
  recomenda?: boolean;
  temFotos?: boolean;
}

export interface ConfiguracaoAvaliacoes {
  habilitarAvaliacoes: boolean;
  avaliacaoObrigatoria: boolean;
  permitirFotos: boolean;
  moderacaoAtiva: boolean;
  emailNotificacao: boolean;
  exibirNoSite: boolean;
  respostaAutomatica: {
    habilitada: boolean;
    template: string;
  };
  lembreteAvaliacao: {
    habilitado: boolean;
    tempoAposServico: number; // horas
    template: string;
  };
}

// Dados simulados para desenvolvimento
export const AVALIACOES_MOCK: Avaliacao[] = [
  {
    id: 'av1',
    clienteId: 'c1',
    clienteNome: 'Maria Silva',
    clienteEmail: 'maria@email.com',
    clienteFoto: '/placeholder-avatar.jpg',
    servicoId: 's1',
    servicoNome: 'Corte e Escova',
    funcionarioId: 'f1',
    funcionarioNome: 'Ana Costa',
    agendamentoId: 'ag1',
    nota: 5,
    comentario: 'Atendimento excepcional! A Ana é muito profissional e o resultado ficou perfeito. Super recomendo!',
    dataAvaliacao: new Date('2025-10-12'),
    dataServico: new Date('2025-10-10'),
    status: 'ativa',
    resposta: {
      id: 'r1',
      autorId: 'prop1',
      autorNome: 'Salão Bella Vista',
      autorCargo: 'proprietario',
      texto: 'Muito obrigada Maria! Ficamos felizes que tenha gostado. Esperamos você sempre!',
      dataResposta: new Date('2025-10-12')
    },
    fotos: ['/servico1.jpg', '/servico2.jpg'],
    aspectos: [
      { aspecto: 'qualidade', nota: 5 },
      { aspecto: 'atendimento', nota: 5 },
      { aspecto: 'limpeza', nota: 5 },
      { aspecto: 'pontualidade', nota: 4 }
    ],
    recomenda: true,
    verificada: true,
    likes: 12,
    dislikes: 0,
    visualizacoes: 45
  },
  {
    id: 'av2',
    clienteId: 'c2',
    clienteNome: 'João Santos',
    clienteEmail: 'joao@email.com',
    servicoId: 's2',
    servicoNome: 'Barba e Bigode',
    funcionarioId: 'f2',
    funcionarioNome: 'Carlos Oliveira',
    agendamentoId: 'ag2',
    nota: 4,
    comentario: 'Bom atendimento, mas demorou um pouco mais que o esperado. No geral, fiquei satisfeito.',
    dataAvaliacao: new Date('2025-10-11'),
    dataServico: new Date('2025-10-09'),
    status: 'ativa',
    aspectos: [
      { aspecto: 'qualidade', nota: 4 },
      { aspecto: 'atendimento', nota: 4 },
      { aspecto: 'pontualidade', nota: 3 },
      { aspecto: 'preco', nota: 4 }
    ],
    recomenda: true,
    verificada: true,
    likes: 5,
    dislikes: 1,
    visualizacoes: 23
  },
  {
    id: 'av3',
    clienteId: 'c3',
    clienteNome: 'Fernanda Lima',
    clienteEmail: 'fernanda@email.com',
    servicoId: 's3',
    servicoNome: 'Coloração + Corte',
    funcionarioId: 'f1',
    funcionarioNome: 'Ana Costa',
    agendamentoId: 'ag3',
    nota: 3,
    comentario: 'O corte ficou bom, mas a cor não ficou exatamente como eu esperava. Talvez na próxima.',
    dataAvaliacao: new Date('2025-10-08'),
    dataServico: new Date('2025-10-05'),
    status: 'respondida',
    resposta: {
      id: 'r2',
      autorId: 'f1',
      autorNome: 'Ana Costa',
      autorCargo: 'funcionario',
      texto: 'Oi Fernanda! Obrigada pelo feedback. Vamos ajustar a cor na próxima visita sem custo adicional!',
      dataResposta: new Date('2025-10-09')
    },
    aspectos: [
      { aspecto: 'qualidade', nota: 3 },
      { aspecto: 'atendimento', nota: 4 },
      { aspecto: 'preco', nota: 3 }
    ],
    recomenda: false,
    verificada: true,
    likes: 2,
    dislikes: 0,
    visualizacoes: 18
  }
];

export const SERVICOS_MOCK = [
  { id: 's1', nome: 'Corte e Escova' },
  { id: 's2', nome: 'Barba e Bigode' },
  { id: 's3', nome: 'Coloração + Corte' },
  { id: 's4', nome: 'Manicure e Pedicure' },
  { id: 's5', nome: 'Massagem Relaxante' }
];

export const FUNCIONARIOS_MOCK = [
  { id: 'f1', nome: 'Ana Costa' },
  { id: 'f2', nome: 'Carlos Oliveira' },
  { id: 'f3', nome: 'Mariana Santos' },
  { id: 'f4', nome: 'Pedro Silva' }
];