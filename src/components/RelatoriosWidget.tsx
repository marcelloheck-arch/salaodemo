'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Calendar,
  Target,
  ArrowRight
} from 'lucide-react';
import { DADOS_FINANCEIRO_MOCK, DADOS_OPERACIONAL_MOCK } from '@/types/relatorios';

interface RelatoriosWidgetProps {
  onOpenReports?: () => void;
}

export default function RelatoriosWidget({ onOpenReports }: RelatoriosWidgetProps) {
  const dadosFinanceiros = DADOS_FINANCEIRO_MOCK;
  const dadosOperacionais = DADOS_OPERACIONAL_MOCK;

  const kpis = [
    {
      titulo: 'Receita Mensal',
      valor: `R$ ${dadosFinanceiros.receitas.total.toLocaleString()}`,
      variacao: `+${dadosFinanceiros.crescimento}%`,
      tipo: 'positivo',
      icon: DollarSign,
      cor: 'green'
    },
    {
      titulo: 'Agendamentos',
      valor: dadosOperacionais.agendamentos.total.toString(),
      variacao: '+8.2%',
      tipo: 'positivo',
      icon: Calendar,
      cor: 'blue'
    },
    {
      titulo: 'Taxa Ocupação',
      valor: `${dadosOperacionais.ocupacao.taxaOcupacao}%`,
      variacao: '-2.1%',
      tipo: 'negativo',
      icon: Target,
      cor: 'orange'
    },
    {
      titulo: 'Novos Clientes',
      valor: '156',
      variacao: '+22.5%',
      tipo: 'positivo',
      icon: Users,
      cor: 'purple'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Relatórios & Analytics</h3>
            <p className="text-white/70 text-sm">Performance geral do negócio</p>
          </div>
        </div>
        <button 
          onClick={onOpenReports}
          className="text-white/70 hover:text-white transition-colors flex items-center space-x-1 text-sm"
        >
          <span>Ver todos</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                kpi.cor === 'green' ? 'bg-green-500/20' :
                kpi.cor === 'blue' ? 'bg-blue-500/20' :
                kpi.cor === 'orange' ? 'bg-orange-500/20' :
                'bg-slate-500/20'
              }`}>
                <kpi.icon className={`w-4 h-4 ${
                  kpi.cor === 'green' ? 'text-green-400' :
                  kpi.cor === 'blue' ? 'text-blue-400' :
                  kpi.cor === 'orange' ? 'text-orange-400' :
                  'text-purple-400'
                }`} />
              </div>
              <div className={`flex items-center space-x-1 text-xs ${
                kpi.tipo === 'positivo' ? 'text-green-400' : 'text-red-400'
              }`}>
                {kpi.tipo === 'positivo' ? 
                  <TrendingUp className="w-3 h-3" /> : 
                  <TrendingDown className="w-3 h-3" />
                }
                <span>{kpi.variacao}</span>
              </div>
            </div>
            <div className="text-white/90 text-xs mb-1">{kpi.titulo}</div>
            <div className="text-white font-bold text-lg">{kpi.valor}</div>
          </div>
        ))}
      </div>

      {/* Gráfico Simplificado */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white text-sm font-medium">Receita vs Meta (7 dias)</h4>
          <div className="text-xs text-white/70">
            Meta: R$ {(dadosFinanceiros.metas.receitaMeta / 30 * 7).toLocaleString()}
          </div>
        </div>
        
        {/* Mini gráfico de barras simulado */}
        <div className="flex items-end justify-between space-x-1 h-16">
          {[65, 78, 82, 71, 88, 94, 85].map((altura, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-slate-600 to-blue-600 rounded-sm"
                style={{ height: `${altura}%` }}
              />
              <div className="text-xs text-white/70 mt-1">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][index]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo de Alertas */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-white/70">3 metas superadas</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-white/70">1 alerta</span>
          </div>
        </div>
        <button 
          onClick={onOpenReports}
          className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
        >
          Relatório completo →
        </button>
      </div>
    </div>
  );
}
