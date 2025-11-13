/**
 * Página de Gerenciamento de Pagamentos
 */

'use client';
import React, { useState, useEffect } from 'react';
import PagamentoService from '@/services/PagamentoService';
import { Pagamento, MetodoPagamento } from '@/types/pagamentos';

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | 'pendentes' | 'recebidos' | 'atrasados'>('todos');
  const [novoPagamento, setNovoPagamento] = useState({
    clienteNome: '',
    clienteId: '',
    valor: '',
    metodoPagamento: 'pix' as MetodoPagamento,
    descricao: '',
    dataVencimento: ''
  });

  useEffect(() => {
    carregarPagamentos();
  }, [filtro]);

  const carregarPagamentos = () => {
    let lista = PagamentoService.listarPagamentos();

    switch (filtro) {
      case 'pendentes':
        lista = PagamentoService.listarPagamentosPendentes();
        break;
      case 'atrasados':
        lista = PagamentoService.listarPagamentosAtrasados();
        break;
      case 'recebidos':
        lista = lista.filter(p => p.statusRecebimento === 'recebido');
        break;
    }

    setPagamentos(lista);
  };

  const criarPagamento = async () => {
    if (!novoPagamento.clienteNome || !novoPagamento.valor) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const pagamento = await PagamentoService.criarPagamento({
      clienteId: novoPagamento.clienteId || Date.now().toString(),
      clienteNome: novoPagamento.clienteNome,
      valor: parseFloat(novoPagamento.valor),
      metodoPagamento: novoPagamento.metodoPagamento,
      descricao: novoPagamento.descricao || 'Pagamento de serviços',
      servicos: [],
      dataVencimento: novoPagamento.dataVencimento || new Date().toISOString()
    });

    console.log('Pagamento criado:', pagamento);
    setMostrarModal(false);
    carregarPagamentos();
    limparFormulario();
  };

  const confirmarRecebimento = async (pagamentoId: string) => {
    if (confirm('Confirmar recebimento deste pagamento?')) {
      await PagamentoService.confirmarRecebimento(pagamentoId);
      carregarPagamentos();
    }
  };

  const cancelarPagamento = async (pagamentoId: string) => {
    const motivo = prompt('Motivo do cancelamento:');
    if (motivo) {
      await PagamentoService.cancelarPagamento(pagamentoId, motivo);
      carregarPagamentos();
    }
  };

  const limparFormulario = () => {
    setNovoPagamento({
      clienteNome: '',
      clienteId: '',
      valor: '',
      metodoPagamento: 'pix',
      descricao: '',
      dataVencimento: ''
    });
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

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'recebido':
        return 'text-green-600 bg-green-100';
      case 'a_receber':
        return 'text-blue-600 bg-blue-100';
      case 'atrasado':
        return 'text-red-600 bg-red-100';
      case 'cancelado':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const obterLabelMetodo = (metodo: MetodoPagamento) => {
    const labels: Record<MetodoPagamento, string> = {
      cartao_credito: 'Cartão de Crédito',
      cartao_debito: 'Cartão de Débito',
      pix: 'PIX',
      dinheiro: 'Dinheiro',
      boleto: 'Boleto',
      transferencia: 'Transferência'
    };
    return labels[metodo];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                💰 Pagamentos
              </h1>
              <p className="text-white/70">Gestão completa de recebimentos</p>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              + Novo Pagamento
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'pendentes', label: 'Pendentes' },
              { key: 'atrasados', label: 'Atrasados' },
              { key: 'recebidos', label: 'Recebidos' }
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

        {/* Lista de Pagamentos */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          {pagamentos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">Nenhum pagamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pagamentos.map((pag) => (
                <div
                  key={pag.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {pag.clienteNome}
                      </h3>
                      <p className="text-white/60 text-sm">{pag.descricao}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {formatarMoeda(pag.valor)}
                      </p>
                      {pag.taxaGateway && pag.taxaGateway > 0 && (
                        <p className="text-white/60 text-sm">
                          Líquido: {formatarMoeda(pag.valorLiquido || 0)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Método</p>
                      <p className="text-white font-semibold">
                        {obterLabelMetodo(pag.metodoPagamento)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Vencimento</p>
                      <p className="text-white font-semibold">
                        {formatarData(pag.dataVencimento)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${obterCorStatus(
                          pag.statusRecebimento
                        )}`}
                      >
                        {pag.statusRecebimento.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    {pag.dataPagamento && (
                      <div>
                        <p className="text-white/60 text-sm">Pago em</p>
                        <p className="text-white font-semibold">
                          {formatarData(pag.dataPagamento)}
                        </p>
                      </div>
                    )}
                  </div>

                  {pag.statusRecebimento === 'a_receber' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmarRecebimento(pag.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        ✓ Confirmar Recebimento
                      </button>
                      <button
                        onClick={() => cancelarPagamento(pag.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  )}

                  {pag.pixCopiaECola && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-white/60 text-sm mb-2">PIX Copia e Cola:</p>
                      <input
                        type="text"
                        value={pag.pixCopiaECola}
                        readOnly
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Novo Pagamento */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-4">Novo Pagamento</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Cliente *</label>
                  <input
                    type="text"
                    value={novoPagamento.clienteNome}
                    onChange={(e) =>
                      setNovoPagamento({ ...novoPagamento, clienteNome: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Valor *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoPagamento.valor}
                    onChange={(e) =>
                      setNovoPagamento({ ...novoPagamento, valor: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Método de Pagamento</label>
                  <select
                    value={novoPagamento.metodoPagamento}
                    onChange={(e) =>
                      setNovoPagamento({
                        ...novoPagamento,
                        metodoPagamento: e.target.value as MetodoPagamento
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transferência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Descrição</label>
                  <textarea
                    value={novoPagamento.descricao}
                    onChange={(e) =>
                      setNovoPagamento({ ...novoPagamento, descricao: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    rows={3}
                    placeholder="Descrição do pagamento"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Data de Vencimento</label>
                  <input
                    type="date"
                    value={novoPagamento.dataVencimento}
                    onChange={(e) =>
                      setNovoPagamento({ ...novoPagamento, dataVencimento: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={criarPagamento}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  Criar Pagamento
                </button>
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    limparFormulario();
                  }}
                  className="flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
