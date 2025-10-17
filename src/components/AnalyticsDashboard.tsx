'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import MockDataService from '@/lib/mockDataService';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  avgTicket: number;
  totalClients: number;
  activeClients: number;
  growthRate: number;
  conversionRate: number;
}

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  appointments?: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [revenueChart, setRevenueChart] = useState<ChartData[]>([]);
  const [serviceChart, setServiceChart] = useState<ChartData[]>([]);
  const [paymentChart, setPaymentChart] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pythonData, setPythonData] = useState<any>(null);
  const [pythonError, setPythonError] = useState<string | null>(null);

  const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  useEffect(() => {
    calculateMetrics();
    fetchPythonAnalytics();
  }, []);

  const calculateMetrics = () => {
    try {
      const allData = MockDataService.getAllData();
      const transactions = allData.transactions;
      const clients = allData.clients;
      const appointments = allData.appointments;

      // Métricas gerais
      const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
      const avgTicket = totalRevenue / transactions.length;
      const totalClients = clients.length;
      const activeClients = new Set(transactions.map(t => t.clientId)).size;

      // Receita mensal atual
      const currentMonth = format(new Date(), 'yyyy-MM');
      const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
      const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

      // Crescimento (comparar com mês anterior)
      const lastMonth = format(subDays(new Date(), 30), 'yyyy-MM');
      const lastMonthTransactions = transactions.filter(t => t.date.startsWith(lastMonth));
      const lastMonthRevenue = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
      const growthRate = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Taxa de conversão
      const completedAppointments = appointments.filter(a => a.status === 'completed').length;
      const conversionRate = (completedAppointments / appointments.length) * 100;

      setMetrics({
        totalRevenue,
        monthlyRevenue,
        avgTicket,
        totalClients,
        activeClients,
        growthRate,
        conversionRate
      });

      // Dados para gráficos
      generateChartData(allData);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao calcular métricas:', error);
      setIsLoading(false);
    }
  };

  const generateChartData = (data: any) => {
    // Gráfico de receita (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTransactions = data.transactions.filter((t: any) => t.date === dateStr);
      const revenue = dayTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
      
      return {
        name: format(date, 'EEE', { locale: ptBR }),
        value: revenue,
        appointments: dayTransactions.length
      };
    });
    setRevenueChart(last7Days);

    // Gráfico de serviços (top 6)
    const servicePerformance = MockDataService.getServicePerformance().slice(0, 6);
    const serviceData = servicePerformance.map(service => ({
      name: service.name,
      value: service.totalRevenue,
      appointments: service.totalBookings
    }));
    setServiceChart(serviceData);

    // Gráfico de métodos de pagamento
    const paymentMethods = data.transactions.reduce((acc: any, t: any) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
      return acc;
    }, {});
    
    const paymentData = Object.entries(paymentMethods).map(([method, value]) => ({
      name: method.replace('_', ' ').toUpperCase(),
      value: value as number
    }));
    setPaymentChart(paymentData);
  };

  const fetchPythonAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/analytics/dashboard-summary');
      if (response.ok) {
        const data = await response.json();
        setPythonData(data);
        setPythonError(null);
      } else {
        setPythonError('Microserviço Python não está rodando');
      }
    } catch (error) {
      setPythonError('Erro ao conectar com API Python');
      console.log('Python API não disponível - usando apenas dados mock');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-purple-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📊 Analytics Dashboard</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🟢 Dados Mock Ativos
          </span>
          {pythonData && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🐍 Python API Online
            </span>
          )}
          {pythonError && (
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              ⚠️ Python API Offline
            </span>
          )}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-slate-600">
                {formatCurrency(metrics?.totalRevenue || 0)}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-full">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-pink-600">
                {formatCurrency(metrics?.avgTicket || 0)}
              </p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-cyan-600">
                {metrics?.activeClients || 0}
              </p>
            </div>
            <div className="p-3 bg-cyan-100 rounded-full">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
              <p className="text-2xl font-bold text-emerald-600">
                {(metrics?.conversionRate || 0).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita Últimos 7 Dias */}
        <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Receita - Últimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Receita']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Serviços */}
        <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Top Serviços</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Receita']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#fef7ff', border: '1px solid #f3e8ff' }}
              />
              <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Método de Pagamento */}
      <div className="bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 Métodos de Pagamento</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentChart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Footer com Info */}
      <div className="bg-gradient-to-r from-slate-100 to-pink-100 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">🚀 Sistema Híbrido Ativo</h4>
            <p className="text-sm text-gray-600">
              Dados mock realistas • Python Analytics {pythonData ? 'Online' : 'Offline'} • Pronto para Supabase
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600">
              {MockDataService.getTransactions().length} transações simuladas
            </p>
            <p className="text-xs text-gray-500">
              Últimos 60 dias de operação
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
