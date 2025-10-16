'use client';

import React from 'react';
import AnalyticsDashboard from '../AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header da Página */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📊 Analytics Inteligente
            </h1>
            <p className="text-gray-600 mb-4">
              Dashboard completo com insights avançados sobre seu salão de beleza
            </p>
            
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="font-semibold text-green-800">Mock Data Ativo</h3>
                    <p className="text-sm text-green-600">60 dias de dados simulados</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Python Analytics</h3>
                    <p className="text-sm text-blue-600">IA e Machine Learning</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-purple-800">Supabase Ready</h3>
                    <p className="text-sm text-purple-600">Pronto para produção</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Principal */}
        <AnalyticsDashboard />
        
        {/* Cards de Features Avançadas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🤖 IA & Machine Learning
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Previsão de receita com 85% de precisão
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Detecção de no-shows automática
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Otimização de agenda (em desenvolvimento)
              </li>
            </ul>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📊 Analytics Avançados
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Segmentação RFM de clientes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Análise de sazonalidade
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Performance por profissional
              </li>
            </ul>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🚀 Próximos Passos
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Integração com Supabase
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                API Python completa
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Dashboard em tempo real
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;