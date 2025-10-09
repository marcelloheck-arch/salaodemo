"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  PiggyBank,
  Calculator,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Filter
} from 'lucide-react';

interface SaldoCaixa {
  saldo_atual: number;
  total_entradas: number;
  total_saidas: number;
  margem_liquida: number;
}

interface FluxoDiario {
  data: string;
  entradas: number;
  saidas: number;
  saldo_dia: number;
}

interface MetodoPagamento {
  metodo: string;
  total: number;
  quantidade: number;
  percentual: number;
}

interface CategoriaAnalise {
  categoria: string;
  total: number;
  ticket_medio: number;
  quantidade: number;
  participacao: number;
}

export default function CaixaPage() {
  const [saldoCaixa, setSaldoCaixa] = useState<SaldoCaixa | null>(null);
  const [fluxoDiario, setFluxoDiario] = useState<FluxoDiario[]>([]);
  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>([]);
  const [categorias, setCategorias] = useState<CategoriaAnalise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'fluxo' | 'pagamentos' | 'categorias'>('overview');

  const baseUrl = 'http://localhost:8002';

  const carregarDados = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Carregar dados em paralelo do serviço Python
      const [saldoRes, fluxoRes, pagamentosRes, categoriasRes] = await Promise.all([
        fetch(`${baseUrl}/caixa/saldo`),
        fetch(`${baseUrl}/caixa/fluxo-diario?dias=7`),
        fetch(`${baseUrl}/caixa/metodos-pagamento`),
        fetch(`${baseUrl}/caixa/categorias`)
      ]);

      if (!saldoRes.ok || !fluxoRes.ok || !pagamentosRes.ok || !categoriasRes.ok) {
        throw new Error('Erro ao conectar com o serviço de Caixa Python');
      }

      const [saldo, fluxo, pagamentos, cats] = await Promise.all([
        saldoRes.json(),
        fluxoRes.json(),
        pagamentosRes.json(),
        categoriasRes.json()
      ]);

      setSaldoCaixa(saldo);
      setFluxoDiario(fluxo);
      setMetodosPagamento(pagamentos);
      setCategorias(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar dados do caixa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-lg text-gray-600">Carregando dados do Caixa Python...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Erro na Conexão</h3>
              <p className="text-red-600">{error}</p>
              <p className="text-sm text-red-500 mt-2">
                Para iniciar o serviço Python: cd python-caixa && python start_caixa.py
              </p>
              <button
                onClick={carregarDados}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Controle de Caixa</h2>
          <p className="text-gray-600">🐍 Powered by Python - Cálculos financeiros avançados</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <Calculator className="w-4 h-4" />
            <span>Microserviço Python Ativo</span>
          </div>
          <button
            onClick={carregarDados}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      {saldoCaixa && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                <p className={`text-2xl font-bold ${saldoCaixa.saldo_atual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(saldoCaixa.saldo_atual)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                saldoCaixa.saldo_atual >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <PiggyBank className={`w-6 h-6 ${saldoCaixa.saldo_atual >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entradas</p>
                <p className="text-2xl font-bold text-green-600">{formatarMoeda(saldoCaixa.total_entradas)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saídas</p>
                <p className="text-2xl font-bold text-red-600">{formatarMoeda(saldoCaixa.total_saidas)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Margem Líquida</p>
                <p className={`text-2xl font-bold ${saldoCaixa.margem_liquida >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saldoCaixa.margem_liquida.toFixed(1)}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                saldoCaixa.margem_liquida >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <BarChart3 className={`w-6 h-6 ${saldoCaixa.margem_liquida >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegação de Abas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'fluxo', label: 'Fluxo Diário', icon: Calendar },
              { id: 'pagamentos', label: 'Métodos de Pagamento', icon: CreditCard },
              { id: 'categorias', label: 'Análise por Categoria', icon: Filter }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Visão Geral */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistema de Caixa Python</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">🐍 Recursos Python Ativos</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ Cálculos financeiros em tempo real</li>
                  <li>✅ Análise avançada com Pandas</li>
                  <li>✅ Processamento numérico com NumPy</li>
                  <li>✅ API FastAPI de alta performance</li>
                  <li>✅ Cálculo automático de comissões</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">📊 Endpoints Disponíveis</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• /caixa/saldo - Saldo atual</li>
                  <li>• /caixa/fluxo-diario - Fluxo diário</li>
                  <li>• /caixa/metodos-pagamento - Análise pagamentos</li>
                  <li>• /caixa/categorias - Performance categorias</li>
                  <li>• /caixa/comissoes - Cálculo comissões</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Sistema Integrado</span>
              </div>
              <p className="text-blue-700 mt-2 text-sm">
                Frontend React conectado ao microserviço Python especializado em cálculos financeiros.
                Todos os dados são processados em tempo real com precisão matemática.
              </p>
            </div>
          </div>
        )}

        {/* Fluxo Diário */}
        {activeTab === 'fluxo' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Caixa - Últimos 7 Dias</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entradas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saídas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo do Dia</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fluxoDiario.map((dia, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatarData(dia.data)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {formatarMoeda(dia.entradas)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {formatarMoeda(dia.saidas)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        dia.saldo_dia >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatarMoeda(dia.saldo_dia)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Métodos de Pagamento */}
        {activeTab === 'pagamentos' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Método de Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metodosPagamento.map((metodo) => (
                <div key={metodo.metodo} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 capitalize">{metodo.metodo.replace('_', ' ')}</h4>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{formatarMoeda(metodo.total)}</p>
                    <p className="text-sm text-gray-600 mt-1">{metodo.quantidade} transações</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{metodo.percentual.toFixed(1)}% do total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Análise por Categorias */}
        {activeTab === 'categorias' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Categoria</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Médio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participação</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categorias.map((categoria) => (
                    <tr key={categoria.categoria} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {categoria.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatarMoeda(categoria.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatarMoeda(categoria.ticket_medio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categoria.quantidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                        {categoria.participacao.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}