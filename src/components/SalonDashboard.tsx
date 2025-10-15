'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  Bell,
  Clock,
  Scissors,
  Star,
  Package,
  UserCheck,
  Plus,
  TrendingUp,
  CheckCircle
} from "lucide-react";

interface SalonDashboardProps {
  userData: {
    type: string;
    name: string;
    email: string;
    salonName?: string;
    licenseKey?: string;
  };
  onLogout: () => void;
}

export default function SalonDashboard({ userData, onLogout }: SalonDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      icon: Calendar,
      title: "Configurar Agendamentos",
      description: "Definir horários e disponibilidade",
      color: "from-blue-500 to-blue-600",
      action: () => alert("🎓 No curso você aprenderá a configurar os horários de funcionamento e disponibilidade para agendamentos!")
    },
    {
      icon: UserCheck,
      title: "Adicionar Primeiro Cliente",
      description: "Cadastrar base de clientes",
      color: "from-green-500 to-green-600",
      action: () => alert("🎓 No curso você aprenderá a cadastrar clientes e manter um relacionamento organizado!")
    },
    {
      icon: Scissors,
      title: "Cadastrar Serviços",
      description: "Definir preços e duração",
      color: "from-purple-500 to-purple-600",
      action: () => alert("🎓 No curso você aprenderá a criar um catálogo completo de serviços com preços e tempos!")
    },
    {
      icon: Package,
      title: "Configurar Produtos",
      description: "Gerenciar estoque e vendas",
      color: "from-orange-500 to-orange-600",
      action: () => alert("🎓 No curso você aprenderá a controlar estoque de produtos e registrar vendas!")
    }
  ];

  const todayStats = [
    {
      icon: Calendar,
      label: "Agendamentos Hoje",
      value: "0",
      change: "Começar",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      label: "Faturamento Hoje",
      value: "R$ 0,00",
      change: "Registrar",
      color: "text-green-600"
    },
    {
      icon: Users,
      label: "Clientes Cadastrados",
      value: "0",
      change: "Adicionar",
      color: "text-purple-600"
    },
    {
      icon: Star,
      label: "Serviços Cadastrados",
      value: "0",
      change: "Configurar",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {userData.salonName || 'Meu Salão'}
                </h1>
                <p className="text-sm text-gray-500">
                  Bem-vindo, {userData.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatTime(currentTime)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(currentTime)}
                </p>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                � Bem-vindo ao seu Sistema de Gestão!
              </h2>
              <p className="text-white/90 mb-4">
                Sua conta foi criada com sucesso. Agora vamos aprender juntos como configurar e usar cada funcionalidade do sistema.
              </p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Sistema pronto para configuração inicial</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Áreas do Sistema (Será explicado no curso)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Indicadores do Sistema (Começam zerados)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {todayStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-sm font-medium text-blue-600">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            � Roteiro de Aprendizado - Primeiros Passos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                1️⃣ Configuração Básica
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Vamos aprender a configurar horários, serviços e informações do salão
              </p>
              <button 
                onClick={() => alert("🎓 Durante o curso você aprenderá:\n• Como definir horários de funcionamento\n• Configurar dados do salão\n• Personalizar o sistema")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ver Conteúdo
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                2️⃣ Gestão de Clientes
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Como cadastrar, organizar e manter relacionamento com clientes
              </p>
              <button 
                onClick={() => alert("🎓 Durante o curso você aprenderá:\n• Como cadastrar clientes completos\n• Histórico de atendimentos\n• Comunicação automatizada")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Ver Conteúdo
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                3️⃣ Sistema de Agendamentos
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Dominar o sistema de agendamentos e otimizar sua agenda
              </p>
              <button 
                onClick={() => alert("🎓 Durante o curso você aprenderá:\n• Como criar agendamentos eficientes\n• Controlar disponibilidade\n• Evitar conflitos de horários")}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Ver Conteúdo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}