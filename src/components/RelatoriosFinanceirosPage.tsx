/**
 * Página de Relatórios Financeiros
 */

'use client';
import React, { useState, useEffect } from 'react';
import RelatorioFinanceiroService from '@/services/RelatorioFinanceiroService';
import {
  RelatorioFinanceiro,
  ClienteInadimplente,
  DashboardFinanceiro
} from '@/types/pagamentos';

export default function RelatoriosFinanceirosPage() {
  const [dashboard, setDashboard] = useState<DashboardFinanceiro | null>(null);
  const [inadimplentes, setInadimplentes] = useState<ClienteInadimplente[]>([]);
  const [relatorio, setRelatorio] = useState<RelatorioFinanceiro | null>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'relatorio' | 'inadimplencia'>(
    'dashboard'
  );

  useEffect(() => {
    carregarDashboard();
    carregarInadimplentes();
  }, []);

  const carregarDashboard = () => {
    const dash = RelatorioFinanceiroService.gerarDashboard();
    setDashboard(dash);
  };

  const carregarInadimplentes = () => {
    const lista = RelatorioFinanceiroService.gerarRelatorioInadimplencia();
    setInadimplentes(lista);
  };

  const gerarRelatorio = () => {
    if (!dataInicio || !dataFim) {
      alert('Selecione o período');
      return;
    }
    const rel = RelatorioFinanceiroService.gerarRelatorioPeriodo(dataInicio, dataFim);
    setRelatorio(rel);
  };

  const exportarCSV = () => {
    if (!relatorio) return;
    const csv = RelatorioFinanceiroService.exportarParaCSV(relatorio);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${dataInicio}-${dataFim}.csv`;
    a.click();
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">📊 Relatórios Financeiros</h1>
          <p className="text-white/70">Análise completa de receitas e recebimentos</p>
        </div>

        {/* Abas */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            {[
              { key: 'dashboard', label: '📈 Dashboard', icon: '📈' },
              { key: 'relatorio', label: '📄 Relatório por Período', icon: '📄' },
              { key: 'inadimplencia', label: '⚠️ Inadimplência', icon: '⚠️' }
            ].map((aba) => (
              <button
                key={aba.key}
                onClick={() => setAbaAtiva(aba.key as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  abaAtiva === aba.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard */}
        {abaAtiva === 'dashboard' && dashboard && (
          <div>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/70">Receita Total</p>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatarMoeda(dashboard.receitaTotal)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/70">Receita do Mês</p>
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatarMoeda(dashboard.receitaMes)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/70">Ticket Médio</p>
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatarMoeda(dashboard.ticketMedio)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/70">A Receber</p>
                  <span className="text-2xl">⏳</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatarMoeda(dashboard.aReceber)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/70">Em Atraso</p>
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatarMoeda(dashboard.emAtraso)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/70">Taxa de Inadimplência</p>
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {dashboard.taxaInadimplencia.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Gráfico de Receitas */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">📈 Receitas (Últimos 6 Meses)</h2>
              <div className="space-y-3">
                {dashboard.graficoReceitas.map((item, index) => {
                  const maxValor = Math.max(
                    ...dashboard.graficoReceitas.map((i) => i.valor),
                    1
                  );
                  const largura = (item.valor / maxValor) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/70">{item.mes}</span>
                        <span className="text-white font-semibold">
                          {formatarMoeda(item.valor)}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                          style={{ width: `${largura}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Métodos Populares e Top Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Métodos de Pagamento */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  💳 Métodos Mais Usados
                </h2>
                <div className="space-y-3">
                  {dashboard.metodosPopulares.map((metodo, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold capitalize">
                            {metodo.metodo.replace('_', ' ')}
                          </p>
                          <p className="text-white/60 text-sm">
                            {metodo.quantidade} transações
                          </p>
                        </div>
                        <p className="text-white font-bold">
                          {formatarMoeda(metodo.valor)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Clientes */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">👑 Top 10 Clientes</h2>
                <div className="space-y-3">
                  {dashboard.topClientes.map((cliente, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">{cliente.clienteNome}</p>
                          <p className="text-white/60 text-sm">
                            {cliente.quantidadePagamentos} pagamentos
                          </p>
                        </div>
                        <p className="text-white font-bold">
                          {formatarMoeda(cliente.totalGasto)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Relatório por Período */}
        {abaAtiva === 'relatorio' && (
          <div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Selecionar Período</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Data Início</label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={gerarRelatorio}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                  >
                    Gerar
                  </button>
                  {relatorio && (
                    <button
                      onClick={exportarCSV}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      📥 CSV
                    </button>
                  )}
                </div>
              </div>
            </div>

            {relatorio && (
              <div>
                {/* Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <p className="text-white/70 mb-2">A Receber</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatarMoeda(relatorio.totalAReceber)}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <p className="text-white/70 mb-2">Recebido</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatarMoeda(relatorio.totalRecebido)}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <p className="text-white/70 mb-2">Atrasado</p>
                    <p className="text-2xl font-bold text-red-400">
                      {formatarMoeda(relatorio.totalAtrasado)}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <p className="text-white/70 mb-2">Líquido</p>
                    <p className="text-2xl font-bold text-white">
                      {formatarMoeda(relatorio.valorLiquido)}
                    </p>
                  </div>
                </div>

                {/* Tabela de Pagamentos */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Detalhes</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left text-white/70 py-3 px-4">Data</th>
                          <th className="text-left text-white/70 py-3 px-4">Cliente</th>
                          <th className="text-left text-white/70 py-3 px-4">Método</th>
                          <th className="text-right text-white/70 py-3 px-4">Valor</th>
                          <th className="text-right text-white/70 py-3 px-4">Taxa</th>
                          <th className="text-right text-white/70 py-3 px-4">Líquido</th>
                          <th className="text-center text-white/70 py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatorio.pagamentos.map((pag) => (
                          <tr key={pag.id} className="border-b border-white/10">
                            <td className="text-white py-3 px-4">
                              {formatarData(pag.dataPagamento || pag.dataVencimento)}
                            </td>
                            <td className="text-white py-3 px-4">{pag.clienteNome}</td>
                            <td className="text-white py-3 px-4 capitalize">
                              {pag.metodoPagamento.replace('_', ' ')}
                            </td>
                            <td className="text-white py-3 px-4 text-right">
                              {formatarMoeda(pag.valor)}
                            </td>
                            <td className="text-white/60 py-3 px-4 text-right">
                              {formatarMoeda(pag.taxaGateway || 0)}
                            </td>
                            <td className="text-white py-3 px-4 text-right font-semibold">
                              {formatarMoeda(pag.valorLiquido || 0)}
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className="inline-block px-2 py-1 rounded-full text-xs">
                                {pag.statusRecebimento}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inadimplência */}
        {abaAtiva === 'inadimplencia' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              ⚠️ Clientes Inadimplentes
            </h2>
            {inadimplentes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/70 text-lg">
                  🎉 Nenhum cliente inadimplente!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inadimplentes.map((cliente) => (
                  <div
                    key={cliente.clienteId}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {cliente.clienteNome}
                        </h3>
                        <p className="text-red-400 font-semibold">
                          {cliente.diasAtraso} dias de atraso
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-sm">Total Pendente</p>
                        <p className="text-2xl font-bold text-red-400">
                          {formatarMoeda(cliente.valorTotal)}
                        </p>
                        <p className="text-white/60 text-sm">
                          Com multas: {formatarMoeda(cliente.valorComMultasJuros)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-sm">Pendências</p>
                        <p className="text-white font-semibold">{cliente.qtdPendencias}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Último Vencimento</p>
                        <p className="text-white font-semibold">
                          {formatarData(cliente.ultimoVencimento)}
                        </p>
                      </div>
                    </div>

                    <details className="mt-4">
                      <summary className="text-white/70 cursor-pointer hover:text-white">
                        Ver pendências ({cliente.pagamentosPendentes.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {cliente.pagamentosPendentes.map((pag) => (
                          <div
                            key={pag.id}
                            className="bg-white/5 rounded-lg p-3 flex justify-between"
                          >
                            <div>
                              <p className="text-white">{pag.descricao}</p>
                              <p className="text-white/60 text-sm">
                                Vencimento: {formatarData(pag.dataVencimento)}
                              </p>
                            </div>
                            <p className="text-white font-semibold">
                              {formatarMoeda(pag.valor)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
