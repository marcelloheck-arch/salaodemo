/**
 * Serviço de Pagamentos
 * Integração com gateways de pagamento e gestão de recebíveis
 */

import { Pagamento, MetodoPagamento, StatusPagamento, ConfiguracaoPagamento } from '@/types/pagamentos';

class PagamentoService {
  private config: ConfiguracaoPagamento;

  constructor() {
    // Carregar configurações do localStorage ou variáveis de ambiente
    this.config = this.carregarConfiguracoes();
  }

  /**
   * Carregar configurações
   */
  private carregarConfiguracoes(): ConfiguracaoPagamento {
    // Verificar se está no browser antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const configSalva = localStorage.getItem('config-pagamento');
      if (configSalva) {
        return JSON.parse(configSalva);
      }
    }

    return {
      taxaCartaoCredito: 3.99,
      taxaCartaoDebito: 1.99,
      taxaPix: 0.99,
      taxaBoleto: 3.49,
      diasVencimentoBoleto: 3,
      enviarLembretesAutomaticos: true,
      diasAntesLembrete: 1,
      multaAtraso: 2,
      jurosAtraso: 0.033 // 1% ao mês = 0.033% ao dia
    };
  }

  /**
   * Salvar configurações
   */
  salvarConfiguracoes(config: ConfiguracaoPagamento): void {
    this.config = config;
    localStorage.setItem('config-pagamento', JSON.stringify(config));
  }

  /**
   * Criar pagamento
   */
  async criarPagamento(dados: Partial<Pagamento>): Promise<Pagamento> {
    const pagamento: Pagamento = {
      id: Date.now().toString(),
      clienteId: dados.clienteId!,
      clienteNome: dados.clienteNome!,
      agendamentoId: dados.agendamentoId,
      valor: dados.valor!,
      valorPendente: dados.valor!,
      metodoPagamento: dados.metodoPagamento!,
      statusPagamento: 'pendente',
      statusRecebimento: 'a_receber',
      dataVencimento: dados.dataVencimento || new Date().toISOString(),
      descricao: dados.descricao || 'Pagamento de serviços',
      servicos: dados.servicos || [],
      observacoes: dados.observacoes,
      criadoEm: new Date().toISOString()
    };

    // Calcular taxa do gateway
    const taxa = this.calcularTaxa(pagamento.metodoPagamento, pagamento.valor);
    pagamento.taxaGateway = taxa;
    pagamento.valorLiquido = pagamento.valor - taxa;

    // Salvar no localStorage
    this.salvarPagamento(pagamento);

    // Processar pagamento conforme método
    await this.processarPagamento(pagamento);

    return pagamento;
  }

  /**
   * Processar pagamento conforme método
   */
  private async processarPagamento(pagamento: Pagamento): Promise<void> {
    switch (pagamento.metodoPagamento) {
      case 'pix':
        await this.processarPIX(pagamento);
        break;
      case 'cartao_credito':
      case 'cartao_debito':
        await this.processarCartao(pagamento);
        break;
      case 'boleto':
        await this.processarBoleto(pagamento);
        break;
      case 'dinheiro':
        await this.processarDinheiro(pagamento);
        break;
      default:
        console.log('Método de pagamento não requer processamento adicional');
    }
  }

  /**
   * Processar PIX
   */
  private async processarPIX(pagamento: Pagamento): Promise<void> {
    // Aqui você integraria com API do Mercado Pago ou outro provedor
    // Por enquanto, simulação
    const pixCopiaECola = this.gerarPixSimulado(pagamento);
    pagamento.pixCopiaECola = pixCopiaECola;
    pagamento.linkPagamento = `https://pagamento.exemplo.com/pix/${pagamento.id}`;
    
    this.atualizarPagamento(pagamento);
  }

  /**
   * Processar Cartão
   */
  private async processarCartao(pagamento: Pagamento): Promise<void> {
    // Integração com gateway de pagamento (Mercado Pago/Stripe)
    // Simulação para desenvolvimento
    pagamento.statusPagamento = 'processando';
    pagamento.linkPagamento = `https://pagamento.exemplo.com/cartao/${pagamento.id}`;
    
    this.atualizarPagamento(pagamento);
  }

  /**
   * Processar Boleto
   */
  private async processarBoleto(pagamento: Pagamento): Promise<void> {
    // Gerar boleto via API bancária ou gateway
    // Simulação
    pagamento.linkPagamento = `https://pagamento.exemplo.com/boleto/${pagamento.id}`;
    
    const dataVencimento = new Date();
    dataVencimento.setDate(dataVencimento.getDate() + this.config.diasVencimentoBoleto);
    pagamento.dataVencimento = dataVencimento.toISOString();
    
    this.atualizarPagamento(pagamento);
  }

  /**
   * Processar Dinheiro (registro manual)
   */
  private async processarDinheiro(pagamento: Pagamento): Promise<void> {
    // Pagamento em dinheiro é confirmado imediatamente
    pagamento.statusPagamento = 'aprovado';
    pagamento.statusRecebimento = 'recebido';
    pagamento.dataPagamento = new Date().toISOString();
    pagamento.dataRecebimento = new Date().toISOString();
    pagamento.valorPago = pagamento.valor;
    pagamento.valorPendente = 0;
    
    this.atualizarPagamento(pagamento);
  }

  /**
   * Confirmar recebimento
   */
  async confirmarRecebimento(pagamentoId: string, valorRecebido?: number): Promise<Pagamento> {
    const pagamento = this.obterPagamento(pagamentoId);
    if (!pagamento) {
      throw new Error('Pagamento não encontrado');
    }

    pagamento.statusPagamento = 'aprovado';
    pagamento.statusRecebimento = 'recebido';
    pagamento.dataPagamento = new Date().toISOString();
    pagamento.dataRecebimento = new Date().toISOString();
    pagamento.valorPago = valorRecebido || pagamento.valor;
    pagamento.valorPendente = 0;
    pagamento.atualizadoEm = new Date().toISOString();

    this.atualizarPagamento(pagamento);
    return pagamento;
  }

  /**
   * Cancelar pagamento
   */
  async cancelarPagamento(pagamentoId: string, motivo?: string): Promise<Pagamento> {
    const pagamento = this.obterPagamento(pagamentoId);
    if (!pagamento) {
      throw new Error('Pagamento não encontrado');
    }

    pagamento.statusPagamento = 'cancelado';
    pagamento.statusRecebimento = 'cancelado';
    pagamento.observacoes = `${pagamento.observacoes || ''}\nCancelado: ${motivo || 'Sem motivo especificado'}`;
    pagamento.atualizadoEm = new Date().toISOString();

    this.atualizarPagamento(pagamento);
    return pagamento;
  }

  /**
   * Calcular taxa do gateway
   */
  private calcularTaxa(metodo: MetodoPagamento, valor: number): number {
    let percentual = 0;

    switch (metodo) {
      case 'cartao_credito':
        percentual = this.config.taxaCartaoCredito;
        break;
      case 'cartao_debito':
        percentual = this.config.taxaCartaoDebito;
        break;
      case 'pix':
        percentual = this.config.taxaPix;
        break;
      case 'boleto':
        percentual = this.config.taxaBoleto;
        break;
      default:
        percentual = 0;
    }

    return (valor * percentual) / 100;
  }

  /**
   * Calcular multa e juros por atraso
   */
  calcularMultaJuros(pagamento: Pagamento): { multa: number; juros: number; total: number } {
    if (pagamento.statusRecebimento === 'recebido') {
      return { multa: 0, juros: 0, total: pagamento.valor };
    }

    const dataVencimento = new Date(pagamento.dataVencimento);
    const hoje = new Date();
    const diasAtraso = Math.floor((hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24));

    if (diasAtraso <= 0) {
      return { multa: 0, juros: 0, total: pagamento.valor };
    }

    const multa = (pagamento.valor * this.config.multaAtraso) / 100;
    const juros = (pagamento.valor * this.config.jurosAtraso * diasAtraso) / 100;
    const total = pagamento.valor + multa + juros;

    return { multa, juros, total };
  }

  /**
   * Gerar PIX simulado (para desenvolvimento)
   */
  private gerarPixSimulado(pagamento: Pagamento): string {
    // Em produção, usar API do Mercado Pago ou outro provedor
    const pixKey = this.config.pixKey || '00000000000';
    return `00020126580014BR.GOV.BCB.PIX0136${pixKey}52040000530398654${pagamento.valor.toFixed(2)}5802BR5925NOME ESTABELECIMENTO6009SAO PAULO62410503***`;
  }

  /**
   * Obter pagamento por ID
   */
  obterPagamento(id: string): Pagamento | null {
    const pagamentos = this.listarPagamentos();
    return pagamentos.find(p => p.id === id) || null;
  }

  /**
   * Listar todos os pagamentos
   */
  listarPagamentos(): Pagamento[] {
    const pagamentosSalvos = localStorage.getItem('pagamentos');
    return pagamentosSalvos ? JSON.parse(pagamentosSalvos) : [];
  }

  /**
   * Listar pagamentos por cliente
   */
  listarPagamentosPorCliente(clienteId: string): Pagamento[] {
    return this.listarPagamentos().filter(p => p.clienteId === clienteId);
  }

  /**
   * Listar pagamentos pendentes
   */
  listarPagamentosPendentes(): Pagamento[] {
    return this.listarPagamentos().filter(
      p => p.statusRecebimento === 'a_receber' || p.statusRecebimento === 'atrasado'
    );
  }

  /**
   * Listar pagamentos atrasados
   */
  listarPagamentosAtrasados(): Pagamento[] {
    const hoje = new Date();
    return this.listarPagamentos().filter(p => {
      if (p.statusRecebimento !== 'a_receber') return false;
      const vencimento = new Date(p.dataVencimento);
      return vencimento < hoje;
    });
  }

  /**
   * Salvar pagamento no localStorage
   */
  private salvarPagamento(pagamento: Pagamento): void {
    const pagamentos = this.listarPagamentos();
    const index = pagamentos.findIndex(p => p.id === pagamento.id);
    
    if (index >= 0) {
      pagamentos[index] = pagamento;
    } else {
      pagamentos.push(pagamento);
    }

    localStorage.setItem('pagamentos', JSON.stringify(pagamentos));
  }

  /**
   * Atualizar pagamento
   */
  private atualizarPagamento(pagamento: Pagamento): void {
    this.salvarPagamento(pagamento);
  }

  /**
   * Obter configurações
   */
  obterConfiguracoes(): ConfiguracaoPagamento {
    return this.config;
  }
}

export default new PagamentoService();
