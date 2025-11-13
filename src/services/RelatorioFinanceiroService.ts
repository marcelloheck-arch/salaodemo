/**
 * Serviço de Relatórios Financeiros
 * Análise de receitas, recebimentos e inadimplência
 */

import { 
  RelatorioFinanceiro, 
  ClienteInadimplente, 
  DashboardFinanceiro,
  Pagamento 
} from '@/types/pagamentos';
import PagamentoService from './PagamentoService';

class RelatorioFinanceiroService {
  /**
   * Gerar relatório por período
   */
  gerarRelatorioPeriodo(dataInicio: string, dataFim: string): RelatorioFinanceiro {
    const pagamentos = PagamentoService.listarPagamentos();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const pagamentosPeriodo = pagamentos.filter(p => {
      const dataPagamento = p.dataPagamento ? new Date(p.dataPagamento) : new Date(p.dataVencimento);
      return dataPagamento >= inicio && dataPagamento <= fim;
    });

    const totalAReceber = pagamentosPeriodo
      .filter(p => p.statusRecebimento === 'a_receber')
      .reduce((sum, p) => sum + (p.valorPendente || 0), 0);

    const totalRecebido = pagamentosPeriodo
      .filter(p => p.statusRecebimento === 'recebido')
      .reduce((sum, p) => sum + (p.valorPago || 0), 0);

    const totalAtrasado = pagamentosPeriodo
      .filter(p => p.statusRecebimento === 'atrasado')
      .reduce((sum, p) => sum + (p.valorPendente || 0), 0);

    const taxasGateway = pagamentosPeriodo
      .reduce((sum, p) => sum + (p.taxaGateway || 0), 0);

    const valorLiquido = totalRecebido - taxasGateway;

    const ticketMedio = pagamentosPeriodo.length > 0 
      ? totalRecebido / pagamentosPeriodo.length 
      : 0;

    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      totalAReceber,
      totalRecebido,
      totalAtrasado,
      taxasGateway,
      valorLiquido,
      ticketMedio,
      quantidadePagamentos: pagamentosPeriodo.length,
      pagamentos: pagamentosPeriodo
    };
  }

  /**
   * Gerar relatório de inadimplência
   */
  gerarRelatorioInadimplencia(): ClienteInadimplente[] {
    const pagamentos = PagamentoService.listarPagamentos();
    const hoje = new Date();

    // Agrupar por cliente
    const clientesMap = new Map<string, Pagamento[]>();
    
    pagamentos.forEach(p => {
      if (p.statusRecebimento === 'a_receber') {
        const vencimento = new Date(p.dataVencimento);
        if (vencimento < hoje) {
          const lista = clientesMap.get(p.clienteId) || [];
          lista.push(p);
          clientesMap.set(p.clienteId, lista);
        }
      }
    });

    // Criar lista de inadimplentes
    const inadimplentes: ClienteInadimplente[] = [];

    clientesMap.forEach((pagamentosCliente, clienteId) => {
      const valorTotal = pagamentosCliente.reduce((sum, p) => sum + (p.valorPendente || 0), 0);
      const pagamentoMaisAntigo = pagamentosCliente.reduce((mais, p) => {
        const venc = new Date(p.dataVencimento);
        const maisvenc = new Date(mais.dataVencimento);
        return venc < maisvenc ? p : mais;
      });

      const diasAtraso = Math.floor(
        (hoje.getTime() - new Date(pagamentoMaisAntigo.dataVencimento).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calcular multas e juros
      const multasJuros = pagamentosCliente.map(p => 
        PagamentoService.calcularMultaJuros(p)
      );
      const valorTotalComMultas = multasJuros.reduce((sum, mj) => sum + mj.total, 0);

      inadimplentes.push({
        clienteId,
        clienteNome: pagamentoMaisAntigo.clienteNome,
        valorTotal,
        valorComMultasJuros: valorTotalComMultas,
        qtdPendencias: pagamentosCliente.length,
        diasAtraso,
        ultimoVencimento: pagamentoMaisAntigo.dataVencimento,
        pagamentosPendentes: pagamentosCliente
      });
    });

    // Ordenar por dias de atraso (maior primeiro)
    return inadimplentes.sort((a, b) => b.diasAtraso - a.diasAtraso);
  }

  /**
   * Gerar dashboard financeiro
   */
  gerarDashboard(): DashboardFinanceiro {
    const pagamentos = PagamentoService.listarPagamentos();
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // Receita total
    const receitaTotal = pagamentos
      .filter(p => p.statusRecebimento === 'recebido')
      .reduce((sum, p) => sum + (p.valorPago || 0), 0);

    // Receita do mês
    const receitaMes = pagamentos
      .filter(p => {
        if (p.statusRecebimento !== 'recebido' || !p.dataPagamento) return false;
        const data = new Date(p.dataPagamento);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      })
      .reduce((sum, p) => sum + (p.valorPago || 0), 0);

    // Valores a receber
    const aReceber = pagamentos
      .filter(p => p.statusRecebimento === 'a_receber')
      .reduce((sum, p) => sum + (p.valorPendente || 0), 0);

    // Em atraso
    const emAtraso = pagamentos
      .filter(p => {
        if (p.statusRecebimento !== 'a_receber') return false;
        const vencimento = new Date(p.dataVencimento);
        return vencimento < hoje;
      })
      .reduce((sum, p) => sum + (p.valorPendente || 0), 0);

    // Ticket médio
    const pagamentosRecebidos = pagamentos.filter(p => p.statusRecebimento === 'recebido');
    const ticketMedio = pagamentosRecebidos.length > 0 
      ? receitaTotal / pagamentosRecebidos.length 
      : 0;

    // Taxa de inadimplência
    const totalPendente = aReceber + emAtraso;
    const taxaInadimplencia = totalPendente > 0 
      ? (emAtraso / totalPendente) * 100 
      : 0;

    // Gráfico de receitas (últimos 6 meses)
    const graficoReceitas = this.gerarGraficoReceitas(6);

    // Métodos de pagamento mais populares
    const metodosPopulares = this.obterMetodosPopulares();

    // Top clientes
    const topClientes = this.obterTopClientes(10);

    return {
      receitaTotal,
      receitaMes,
      aReceber,
      emAtraso,
      ticketMedio,
      taxaInadimplencia,
      graficoReceitas,
      metodosPopulares,
      topClientes
    };
  }

  /**
   * Gerar dados para gráfico de receitas
   */
  private gerarGraficoReceitas(meses: number): Array<{ mes: string; valor: number }> {
    const pagamentos = PagamentoService.listarPagamentos();
    const hoje = new Date();
    const resultado: Array<{ mes: string; valor: number }> = [];

    for (let i = meses - 1; i >= 0; i--) {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesNome = mes.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      const valor = pagamentos
        .filter(p => {
          if (p.statusRecebimento !== 'recebido' || !p.dataPagamento) return false;
          const data = new Date(p.dataPagamento);
          return data.getMonth() === mes.getMonth() && data.getFullYear() === mes.getFullYear();
        })
        .reduce((sum, p) => sum + (p.valorPago || 0), 0);

      resultado.push({ mes: mesNome, valor });
    }

    return resultado;
  }

  /**
   * Obter métodos de pagamento mais populares
   */
  private obterMetodosPopulares(): Array<{ metodo: string; quantidade: number; valor: number }> {
    const pagamentos = PagamentoService.listarPagamentos()
      .filter(p => p.statusRecebimento === 'recebido');

    const metodos = new Map<string, { quantidade: number; valor: number }>();

    pagamentos.forEach(p => {
      const atual = metodos.get(p.metodoPagamento) || { quantidade: 0, valor: 0 };
      metodos.set(p.metodoPagamento, {
        quantidade: atual.quantidade + 1,
        valor: atual.valor + (p.valorPago || 0)
      });
    });

    const resultado = Array.from(metodos.entries()).map(([metodo, dados]) => ({
      metodo,
      ...dados
    }));

    return resultado.sort((a, b) => b.quantidade - a.quantidade);
  }

  /**
   * Obter top clientes
   */
  private obterTopClientes(limit: number): Array<{ 
    clienteId: string; 
    clienteNome: string; 
    totalGasto: number; 
    quantidadePagamentos: number 
  }> {
    const pagamentos = PagamentoService.listarPagamentos()
      .filter(p => p.statusRecebimento === 'recebido');

    const clientes = new Map<string, { 
      nome: string; 
      total: number; 
      quantidade: number 
    }>();

    pagamentos.forEach(p => {
      const atual = clientes.get(p.clienteId) || { 
        nome: p.clienteNome, 
        total: 0, 
        quantidade: 0 
      };
      clientes.set(p.clienteId, {
        nome: p.clienteNome,
        total: atual.total + (p.valorPago || 0),
        quantidade: atual.quantidade + 1
      });
    });

    const resultado = Array.from(clientes.entries()).map(([clienteId, dados]) => ({
      clienteId,
      clienteNome: dados.nome,
      totalGasto: dados.total,
      quantidadePagamentos: dados.quantidade
    }));

    return resultado
      .sort((a, b) => b.totalGasto - a.totalGasto)
      .slice(0, limit);
  }

  /**
   * Exportar relatório para CSV
   */
  exportarParaCSV(relatorio: RelatorioFinanceiro): string {
    const linhas = [
      ['Data', 'Cliente', 'Valor', 'Status', 'Método', 'Taxa', 'Líquido'].join(',')
    ];

    relatorio.pagamentos.forEach(p => {
      const linha = [
        p.dataPagamento || p.dataVencimento,
        p.clienteNome,
        p.valor.toFixed(2),
        p.statusRecebimento,
        p.metodoPagamento,
        (p.taxaGateway || 0).toFixed(2),
        (p.valorLiquido || 0).toFixed(2)
      ].join(',');
      linhas.push(linha);
    });

    return linhas.join('\n');
  }
}

export default new RelatorioFinanceiroService();
