'use client';

import React from 'react';
import { BarChart3, PieChart, TrendingUp, LineChart } from 'lucide-react';

// Placeholder para componentes de gráficos
// Em uma implementação real, utilizaríamos bibliotecas como Chart.js, Recharts ou D3.js

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: any[];
  title: string;
  height?: number;
}

export function Chart({ type, data, title, height = 300 }: ChartProps) {
  const getIcon = () => {
    switch (type) {
      case 'bar': return BarChart3;
      case 'line': return TrendingUp;
      case 'pie': return PieChart;
      case 'area': return LineChart;
      default: return BarChart3;
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div 
        className="flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <Icon className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">Gráfico {type}</p>
          <p className="text-white/50 text-sm">Implementação com biblioteca de gráficos</p>
          <div className="mt-4 text-xs text-white/40">
            <p>Sugestões de bibliotecas:</p>
            <p>• Chart.js - Versátil e fácil</p>
            <p>• Recharts - React nativo</p>
            <p>• D3.js - Máxima customização</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente específico para KPIs com comparação
interface KPICardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  trend?: 'up' | 'down' | 'stable';
  color?: 'green' | 'red' | 'blue' | 'purple' | 'orange';
  icon?: React.ComponentType<any>;
}

export function KPICard({ 
  title, 
  value, 
  previousValue, 
  trend = 'stable', 
  color = 'blue',
  icon: Icon = BarChart3
}: KPICardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'from-green-500 to-green-400 text-green-400';
      case 'red': return 'from-red-500 to-red-400 text-red-400';
      case 'purple': return 'from-purple-500 to-purple-400 text-purple-400';
      case 'orange': return 'from-orange-500 to-orange-400 text-orange-400';
      default: return 'from-blue-500 to-blue-400 text-blue-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return null;
    }
  };

  const calculatePercentage = () => {
    if (!previousValue || typeof value !== 'number' || typeof previousValue !== 'number') {
      return null;
    }
    const change = ((value - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  };

  const percentage = calculatePercentage();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses().split(' ')[0]} ${getColorClasses().split(' ')[1]} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {getTrendIcon()}
      </div>
      
      <h3 className="text-white/90 text-sm font-medium mb-2">{title}</h3>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      
      {percentage && (
        <div className="flex items-center space-x-2 text-xs">
          <span className={trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/70'}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{Math.abs(Number(percentage))}%
          </span>
          <span className="text-white/70">vs período anterior</span>
        </div>
      )}
    </div>
  );
}

// Componente para tabela de dados
interface DataTableProps {
  title: string;
  headers: string[];
  data: any[][];
  variant?: 'default' | 'compact';
}

export function DataTable({ title, headers, data, variant = 'default' }: DataTableProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              {headers.map((header, index) => (
                <th key={index} className={`text-left text-white/70 ${variant === 'compact' ? 'py-2' : 'py-3'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/10 last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={`text-white ${variant === 'compact' ? 'py-2' : 'py-3'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente para progressos e barras
interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  showPercentage?: boolean;
}

export function ProgressBar({ 
  label, 
  value, 
  max, 
  color = 'blue',
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  const getColorClass = () => {
    switch (color) {
      case 'green': return 'from-green-500 to-green-400';
      case 'purple': return 'from-purple-500 to-purple-400';
      case 'orange': return 'from-orange-500 to-orange-400';
      case 'red': return 'from-red-500 to-red-400';
      default: return 'from-blue-500 to-blue-400';
    }
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-white text-sm">{label}</span>
      <div className="flex items-center space-x-3 flex-1 ml-4">
        <div className="flex-1 bg-white/20 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${getColorClass()} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {showPercentage && (
          <span className="text-white text-sm w-16 text-right">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default {
  Chart,
  KPICard,
  DataTable,
  ProgressBar
};