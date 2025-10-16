'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw,
  FileText,
  Target,
  Clock,
  Star,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  RelatorioBase, 
  RelatorioFinanceiro, 
  RelatorioOperacional, 
  RelatorioClientes,
  FiltroRelatorio,
  RELATORIOS_DISPONIVEIS,
  DADOS_FINANCEIRO_MOCK,
  DADOS_OPERACIONAL_MOCK,
  DADOS_CLIENTES_MOCK
} from '@/types/relatorios';

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'financeiro' | 'operacional' | 'clientes' | 'marketing' | 'personalizado'>('dashboard');
  const [filtros, setFiltros] = useState<FiltroRelatorio>({
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dataFim: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Relatórios e Analytics</h2>
            <p className="text-gray-600">Análises detalhadas para tomada de decisões estratégicas</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              className={`px-4 py-2 bg-blue-500 text-gray-900 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2 ${
                loading ? 'opacity-50' : ''
              }`}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
            <button className="px-4 py-2 bg-green-500 text-gray-900 rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Filtros Globais */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={filtros.dataInicio.toISOString().split('T')[0]}
                onChange={(e) => setFiltros({...filtros, dataInicio: new Date(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={filtros.dataFim.toISOString().split('T')[0]}
                onChange={(e) => setFiltros({...filtros, dataFim: new Date(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Comparar com
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="">Sem comparação</option>
                <option value="anterior">Período anterior</option>
                <option value="ano">Ano anterior</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-purple-500 text-gray-900 py-2 rounded-lg hover:bg-purple-600 transition-all flex items-center justify-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Aplicar Filtros</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex overflow-x-auto border-b">
          {[
            { key: 'dashboard', label: 'Dashboard Geral', icon: '📊' },
            { key: 'financeiro', label: 'Financeiro', icon: '💰' },
            { key: 'operacional', label: 'Operacional', icon: '⚙️' },
            { key: 'clientes', label: 'Clientes', icon: '👥' },
            { key: 'marketing', label: 'Marketing', icon: '📢' },
            { key: 'personalizado', label: 'Personalizado', icon: '🔧' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[140px] px-6 py-4 text-center transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="font-medium text-sm mt-1">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'dashboard' && <DashboardGeralTab />}
      {activeTab === 'financeiro' && <RelatorioFinanceiroTab />}
      {activeTab === 'operacional' && <RelatorioOperacionalTab />}
      {activeTab === 'clientes' && <RelatorioClientesTab />}
      {activeTab === 'marketing' && <RelatorioMarketingTab />}
      {activeTab === 'personalizado' && <RelatorioPersonalizadoTab />}
    </div>
  );
}

// Dashboard Geral
function DashboardGeralTab() {
  const kpis = [
    {
      titulo: 'Receita Mensal',
      valor: 'R$ 48.500',
      variacao: '+15.8%',
      tipo: 'positivo',
      icon: DollarSign,
      meta: 'Meta: R$ 45.000'
    },
    {
      titulo: 'Agendamentos',
      valor: '287',
      variacao: '+8.2%',
      tipo: 'positivo',
      icon: Calendar,
      meta: 'Meta: 280'
    },
    {
      titulo: 'Novos Clientes',
      valor: '156',
      variacao: '+22.5%',
      tipo: 'positivo',
      icon: Users,
      meta: 'Meta: 120'
    },
    {
      titulo: 'Satisfação',
      valor: '4.6/5',
      variacao: '+0.3',
      tipo: 'positivo',
      icon: Star,
      meta: 'Meta: 4.5'
    },
    {
      titulo: 'Taxa Ocupação',
      valor: '78.5%',
      variacao: '-2.1%',
      tipo: 'negativo',
      icon: Clock,
      meta: 'Meta: 80%'
    },
    {
      titulo: 'Ticket Médio',
      valor: 'R$ 125',
      variacao: '+5.4%',
      tipo: 'positivo',
      icon: Target,
      meta: 'Meta: R$ 120'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <kpi.icon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">{kpi.titulo}</h3>
                  <p className="text-gray-500 text-sm">{kpi.meta}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                kpi.tipo === 'positivo' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.tipo === 'positivo' ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span className="text-sm font-medium">{kpi.variacao}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.valor}</div>
          </div>
        ))}
      </div>

      {/* Gráficos Resumo */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Receita vs Meta (30 dias)</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Gráfico de barras - Receita diária</p>
              <p className="text-gray-400 text-sm">Implementação com Chart.js ou Recharts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Distribuição de Serviços</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Gráfico de pizza - Serviços populares</p>
              <p className="text-gray-400 text-sm">Implementação com Chart.js ou Recharts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas e Recomendações */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Alertas Importantes
          </h3>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-red-700 text-sm">Taxa de ocupação abaixo da meta (78.5% vs 80%)</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-yellow-700 text-sm">23 avaliações ainda não respondidas</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-blue-700 text-sm">Estoque baixo em 3 produtos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Recomendações IA
          </h3>
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-green-700 text-sm">
                <strong>💡 Otimização:</strong> Promova agendamentos entre 11h-14h com desconto de 15%
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-purple-700 text-sm">
                <strong>📈 Crescimento:</strong> Ana Costa está 20% acima da média - considere bônus
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-blue-700 text-sm">
                <strong>🎯 Marketing:</strong> Clientes de 26-35 anos têm maior LTV - foque campanhas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Relatório Financeiro
function RelatorioFinanceiroTab() {
  const dados = DADOS_FINANCEIRO_MOCK;

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {dados.receitas.total.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm">+{dados.crescimento}% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Despesas Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {dados.despesas.total.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Lucro Líquido</p>
              <p className="text-2xl font-bold text-gray-900">R$ {dados.lucroLiquido.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Margem: {dados.margemLucro}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Meta Alcançada</p>
              <p className="text-2xl font-bold text-gray-900">{dados.metas.percentualAlcancado}%</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm">Meta superada!</span>
          </div>
        </div>
      </div>

      {/* Distribuição de Receitas e Despesas */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Distribuição de Receitas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-900">Serviços</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                    style={{ width: `${(dados.receitas.servicos / dados.receitas.total) * 100}%` }}
                  />
                </div>
                <span className="text-gray-900 w-20 text-right">R$ {dados.receitas.servicos.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-900">Produtos</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                    style={{ width: `${(dados.receitas.produtos / dados.receitas.total) * 100}%` }}
                  />
                </div>
                <span className="text-gray-900 w-20 text-right">R$ {dados.receitas.produtos.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-900">Outros</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                    style={{ width: `${(dados.receitas.outros / dados.receitas.total) * 100}%` }}
                  />
                </div>
                <span className="text-gray-900 w-20 text-right">R$ {dados.receitas.outros.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Distribuição de Despesas</h3>
          <div className="space-y-4">
            {dados.despesas.detalhePorCategoria.map(item => (
              <div key={item.categoria} className="flex justify-between items-center">
                <span className="text-gray-900">{item.categoria}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full"
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                  <span className="text-gray-900 w-20 text-right">R$ {item.valor.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fluxo de Caixa */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Fluxo de Caixa Diário</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Gráfico de linha - Receitas vs Despesas por dia</p>
            <p className="text-gray-400 text-sm">Implementação com Chart.js ou Recharts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Relatório Operacional
function RelatorioOperacionalTab() {
  const dados = DADOS_OPERACIONAL_MOCK;

  return (
    <div className="space-y-6">
      {/* Métricas de Agendamentos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900">{dados.agendamentos.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Taxa Conclusão</p>
              <p className="text-2xl font-bold text-gray-900">{dados.agendamentos.taxaConclusao}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Taxa Ocupação</p>
              <p className="text-2xl font-bold text-gray-900">{dados.ocupacao.taxaOcupacao}%</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Satisfação Média</p>
              <p className="text-2xl font-bold text-gray-900">{dados.servicos.satisfacaoMedia}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Performance da Equipe */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance da Equipe</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-500 py-3">Funcionário</th>
                <th className="text-right text-gray-500 py-3">Agendamentos</th>
                <th className="text-right text-gray-500 py-3">Receita</th>
                <th className="text-right text-gray-500 py-3">Avaliação</th>
                <th className="text-right text-gray-500 py-3">Pontualidade</th>
              </tr>
            </thead>
            <tbody>
              {dados.funcionarios.performance.map(func => (
                <tr key={func.id} className="border-b border-gray-100">
                  <td className="text-gray-900 py-3">{func.nome}</td>
                  <td className="text-gray-900 text-right py-3">{func.agendamentos}</td>
                  <td className="text-gray-900 text-right py-3">R$ {func.receita.toLocaleString()}</td>
                  <td className="text-gray-900 text-right py-3 flex items-center justify-end space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{func.avaliacaoMedia}</span>
                  </td>
                  <td className="text-gray-900 text-right py-3">{func.pontualidade}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Serviços Mais Populares */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Serviços Mais Populares</h3>
          <div className="space-y-4">
            {dados.servicos.maisPopulares.map((servico, index) => (
              <div key={servico.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-900">{servico.nome}</span>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">{servico.quantidade}x</div>
                  <div className="text-gray-500 text-sm">R$ {servico.receita.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Horários de Pico</h3>
          <div className="space-y-3">
            {dados.agendamentos.horariosPico.map(horario => (
              <div key={horario.hora} className="flex items-center justify-between">
                <span className="text-gray-900">{horario.hora}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                      style={{ width: `${(horario.quantidade / Math.max(...dados.agendamentos.horariosPico.map(h => h.quantidade))) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-900 w-12 text-right">{horario.quantidade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Relatório de Clientes
function RelatorioClientesTab() {
  const dados = DADOS_CLIENTES_MOCK;

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{dados.demograficos.totalClientes}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Novos Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{dados.demograficos.clientesNovos}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">R$ {dados.comportamento.ticketMedio.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">NPS Score</p>
              <p className="text-2xl font-bold text-gray-900">{dados.satisfacao.nps}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Demografia */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Distribuição por Faixa Etária</h3>
          <div className="space-y-3">
            {dados.demograficos.faixaEtaria.map(faixa => (
              <div key={faixa.faixa} className="flex items-center justify-between">
                <span className="text-gray-900">{faixa.faixa} anos</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                      style={{ width: `${faixa.percentual}%` }}
                    />
                  </div>
                  <span className="text-gray-900 w-16 text-right">{faixa.quantidade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Programa de Fidelidade</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Participantes</span>
              <span className="text-gray-900 font-semibold">{dados.fidelidade.programaFidelidade.participantes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pontos Médios</span>
              <span className="text-gray-900 font-semibold">{dados.fidelidade.programaFidelidade.pontosMedios}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Resgates</span>
              <span className="text-gray-900 font-semibold">{dados.fidelidade.programaFidelidade.resgates}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Taxa Retenção</span>
              <span className="text-green-400 font-semibold">{dados.fidelidade.taxaRetencao}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">LTV Médio</span>
              <span className="text-gray-900 font-semibold">R$ {dados.fidelidade.valorVidaUtil.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comportamento */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferências de Serviços</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {dados.comportamento.preferenciasServicos.map(pref => (
            <div key={pref.servico} className="text-center">
              <div className="text-gray-900 font-semibold">{pref.servico}</div>
              <div className="text-2xl font-bold text-gray-900">{pref.popularidade}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${pref.popularidade}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Relatório de Marketing
function RelatorioMarketingTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Relatório de Marketing</h3>
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Em desenvolvimento...</p>
        <p className="text-gray-400 text-sm">ROI de campanhas, conversões, redes sociais</p>
      </div>
    </div>
  );
}

// Relatório Personalizado
function RelatorioPersonalizadoTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Relatórios Personalizados</h3>
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Crie seus próprios relatórios</p>
        <p className="text-gray-400 text-sm">Drag & drop, filtros customizados, dashboards</p>
      </div>
    </div>
  );
}
