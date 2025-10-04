"use client";

import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  PiggyBank,
  Plus,
  Download,
  Filter
} from 'lucide-react';

export default function CaixaPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Controle de Caixa</h2>
        <p className="text-gray-600">Gerencie as finanças do seu salão</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
              <p className="text-2xl font-bold text-green-600">R$ 1.250,00</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas Hoje</p>
              <p className="text-2xl font-bold text-red-600">R$ 320,00</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
              <p className="text-2xl font-bold text-blue-600">R$ 930,00</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Meta Mensal</p>
              <p className="text-2xl font-bold text-purple-600">R$ 25.000</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Movimentações Recentes</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filtrar</span>
                </button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { tipo: 'Receita', descricao: 'Corte + Barba - João Silva', valor: 'R$ 85,00', data: '10:30', metodo: 'Dinheiro' },
                { tipo: 'Receita', descricao: 'Coloração - Maria Santos', valor: 'R$ 150,00', data: '11:45', metodo: 'Cartão' },
                { tipo: 'Despesa', descricao: 'Produtos - Loja ABC', valor: 'R$ 120,00', data: '09:15', metodo: 'PIX' },
                { tipo: 'Receita', descricao: 'Escova + Hidratação - Ana Costa', valor: 'R$ 75,00', data: '14:20', metodo: 'Dinheiro' },
              ].map((movimento, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${movimento.tipo === 'Receita' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{movimento.descricao}</p>
                      <p className="text-sm text-gray-600">{movimento.data} • {movimento.metodo}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${movimento.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {movimento.tipo === 'Receita' ? '+' : '-'}{movimento.valor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-primary text-white rounded-lg py-3 px-4 hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nova Receita</span>
              </button>
              <button className="w-full bg-red-500 text-white rounded-lg py-3 px-4 hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nova Despesa</span>
              </button>
              <button className="w-full border border-gray-300 text-gray-700 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Ver Relatório</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formas de Pagamento</h3>
            <div className="space-y-3">
              {[
                { metodo: 'Dinheiro', valor: 'R$ 450,00', porcentagem: '36%' },
                { metodo: 'Cartão', valor: 'R$ 500,00', porcentagem: '40%' },
                { metodo: 'PIX', valor: 'R$ 300,00', porcentagem: '24%' },
              ].map((pagamento, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{pagamento.metodo}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{pagamento.valor}</p>
                    <p className="text-xs text-gray-600">{pagamento.porcentagem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}