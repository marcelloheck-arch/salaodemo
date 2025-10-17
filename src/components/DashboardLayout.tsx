"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  Menu, 
  X,
  Filter,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { 
      icon: BarChart3, 
      label: "Dashboard", 
      href: "/", 
      active: true 
    },
    { 
      icon: Calendar, 
      label: "Ativos", 
      href: "/ativos" 
    },
    { 
      icon: Users, 
      label: "Atendidos", 
      href: "/atendidos" 
    },
    { 
      icon: DollarSign, 
      label: "Caixa", 
      href: "/caixa" 
    },
    { 
      icon: Users, 
      label: "Clientes", 
      href: "/clientes" 
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📅</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Agenda Salão</h1>
            </div>
            <button 
              onClick={onToggle}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Menu Principal
            </p>
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                  item.active 
                    ? "bg-primary text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

interface HeaderProps {
  onMenuToggle: () => void;
}

function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📅</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Agenda Salão</h1>
              <p className="text-sm text-gray-600">
                Sistema de gerenciamento completo
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function FilterSection() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Filter className="w-5 h-5 mr-2" />
        Filtros de Pesquisa
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profissional
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Todos os Profissionais</option>
            <option>Ana Silva</option>
            <option>Carlos Santos</option>
            <option>Lucia Oliveira</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Inicial
          </label>
          <input 
            type="date" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Final
          </label>
          <input 
            type="date" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-end space-x-2">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            Aplicar Filtros
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = "primary" 
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className={cn(
          "p-2 rounded-lg",
          color === "primary" && "bg-primary/10",
          color === "success" && "bg-green-100",
          color === "warning" && "bg-yellow-100"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            color === "primary" && "text-primary",
            color === "success" && "text-green-600",
            color === "warning" && "text-yellow-600"
          )} />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} />
        
        <main className="p-6">
          <FilterSection />
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              icon={DollarSign}
              title="Faturamento Total"
              value="R$ 3.450,00"
              subtitle="Receita bruta do período"
              color="success"
            />
            <MetricCard
              icon={Users}
              title="Total de Atendimentos"
              value="24"
              subtitle="Clientes atendidos"
              color="primary"
            />
            <MetricCard
              icon={TrendingUp}
              title="Ticket Médio"
              value="R$ 143,75"
              subtitle="Valor médio por atendimento"
              color="warning"
            />
          </div>

          {/* Professional Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Faturamento por Profissional
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Ana Silva", amount: "R$ 1.200,00", sessions: 8, percentage: 34.8 },
                  { name: "Carlos Santos", amount: "R$ 1.150,00", sessions: 7, percentage: 33.3 },
                  { name: "Lucia Oliveira", amount: "R$ 1.100,00", sessions: 9, percentage: 31.9 },
                ].map((professional, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {professional.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{professional.name}</p>
                        <p className="text-sm text-gray-600">{professional.sessions} atendimentos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{professional.amount}</p>
                      <p className="text-sm text-gray-600">{professional.percentage}% do total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Valores a Receber (Comissões)
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Ana Silva", percentage: "50%", base: "R$ 1.200,00", commission: "R$ 600,00" },
                  { name: "Carlos Santos", percentage: "45%", base: "R$ 1.150,00", commission: "R$ 517,50" },
                  { name: "Lucia Oliveira", percentage: "40%", base: "R$ 1.100,00", commission: "R$ 440,00" },
                ].map((commission, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{commission.name}</p>
                      <p className="text-sm text-gray-600">{commission.percentage} de {commission.base}</p>
                    </div>
                    <p className="font-bold text-green-600">{commission.commission}</p>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total a Pagar:</span>
                    <span className="font-bold text-xl text-primary">R$ 1.557,50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Faturamento por Serviço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Corte Feminino", amount: "R$ 1.200,00", percentage: 34.8, color: "bg-slate-100 text-purple-800" },
                { name: "Escova", amount: "R$ 750,00", percentage: 21.7, color: "bg-pink-100 text-pink-800" },
                { name: "Manicure", amount: "R$ 600,00", percentage: 17.4, color: "bg-blue-100 text-blue-800" },
                { name: "Pedicure", amount: "R$ 480,00", percentage: 13.9, color: "bg-green-100 text-green-800" },
                { name: "Corte Masculino", amount: "R$ 420,00", percentage: 12.2, color: "bg-yellow-100 text-yellow-800" },
              ].map((service, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">{service.name}</h4>
                  <p className="text-xl font-bold text-gray-900 mb-1">{service.amount}</p>
                  <span className={cn("inline-block px-2 py-1 text-xs font-medium rounded-full", service.color)}>
                    {service.percentage}% do total
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
