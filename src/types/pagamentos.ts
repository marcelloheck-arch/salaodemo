/**
 * Tipos e Interfaces - Sistema de Pagamentos
 */

export type MetodoPagamento = 'cartao_credito' | 'cartao_debito' | 'pix' | 'dinheiro' | 'boleto' | 'transferencia';
export type StatusPagamento = 'pendente' | 'processando' | 'aprovado' | 'recusado' | 'cancelado' | 'estornado';
export type StatusRecebimento = 'a_receber' | 'recebido' | 'atrasado' | 'cancelado';

export interface Pagamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteContato?: string;
  agendamentoId?: string;
  valor: number;
  valorPago?: number;
  valorPendente: number;
  metodoPagamento: MetodoPagamento;
  statusPagamento: StatusPagamento;
  statusRecebimento: StatusRecebimento;
  dataVencimento: string;
  dataPagamento?: string;
  dataRecebimento?: string;
  descricao: string;
  servicos: string[];
  observacoes?: string;
  transactionId?: string; // ID do gateway de pagamento
  pixCopiaECola?: string; // Para PIX
  linkPagamento?: string; // Link de pagamento gerado
  taxaGateway?: number; // Taxa cobrada pelo gateway
  valorLiquido?: number; // Valor após taxas
  parcelamento?: {
    numeroParcelas: number;
    parcelaAtual: number;
    valorParcela: number;
  };
  criadoEm: string;
  atualizadoEm?: string;
}

export interface RelatorioFinanceiro {
  periodo: {
    inicio: string;
    fim: string;
  };
  totalAReceber: number;
  totalRecebido: number;
  totalAtrasado: number;
  totalPendente?: number;
  taxasGateway: number;
  valorLiquido: number;
  qtdClientesInadimplentes?: number;
  qtdPagamentosRecebidos?: number;
  qtdPagamentosPendentes?: number;
  ticketMedio: number;
  quantidadePagamentos: number;
  pagamentos: Pagamento[];
}

export interface ClienteInadimplente {
  clienteId: string;
  clienteNome: string;
  clienteTelefone?: string;
  clienteEmail?: string;
  clienteContato?: string;
  valorTotal: number;
  valorComMultasJuros: number;
  qtdPendencias: number;
  diasAtraso: number;
  ultimoVencimento: string;
  ultimoPagamento?: string;
  pagamentosPendentes: Pagamento[];
}

export interface ConfiguracaoPagamento {
  mercadoPagoAccessToken?: string;
  mercadoPagoPublicKey?: string;
  stripeSecretKey?: string;
  stripePublicKey?: string;
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  taxaCartaoCredito: number; // Em porcentagem
  taxaCartaoDebito: number;
  taxaPix: number;
  taxaBoleto: number;
  diasVencimentoBoleto: number;
  enviarLembretesAutomaticos: boolean;
  diasAntesLembrete: number;
  multaAtraso: number; // Em porcentagem
  jurosAtraso: number; // % por dia
}

export interface DashboardFinanceiro {
  receitaTotal: number;
  receitaMes: number;
  receitaHoje?: number;
  aReceber: number;
  emAtraso: number;
  pendenciaTotal?: number;
  inadimplenciaTotal?: number;
  ticketMedio: number;
  taxaInadimplencia: number;
  graficoReceitas: {
    mes: string;
    valor: number;
  }[];
  metodosPopulares: {
    metodo: string;
    quantidade: number;
    valor: number;
  }[];
  topClientes: {
    clienteId: string;
    clienteNome: string;
    totalGasto: number;
    quantidadePagamentos: number;
  }[];
}

export interface TransacaoGateway {
  id: string;
  gateway: 'mercadopago' | 'stripe';
  status: string;
  valor: number;
  taxa: number;
  valorLiquido: number;
  metodoPagamento: string;
  dataTransacao: string;
  detalhes: any;
}
