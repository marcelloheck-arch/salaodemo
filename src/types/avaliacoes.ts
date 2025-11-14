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

// Sistema limpo - sem dados simulados para vendas/testes
export const AVALIACOES_MOCK: Avaliacao[] = [];

export const SERVICOS_MOCK = [];

export const FUNCIONARIOS_MOCK = [];