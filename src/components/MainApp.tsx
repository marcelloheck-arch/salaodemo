"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  Menu, 
  X,
  Settings,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Clock,
  Scissors,
  Star,
  FileText,
  CreditCard,
  Package,
  ChevronDown,
  UserCheck
} from "lucide-react";
import { cn } from '@/lib/utils';
import IntegrationsPage from './IntegrationsPage';
import ProfilePage from './ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AgendamentosPage from './AgendamentosPage';
import ClientesPage from './ClientesPage';
import ServicosPage from './ServicosPage';
import CaixaPage from './CaixaPage';
import ConfiguracoesPage from './ConfiguracoesPage';
import SystemIntegrationPage from './SystemIntegrationPage';
import MultiLevelLogin from './MultiLevelLogin';
import SuperAdminDashboard from './SuperAdminDashboard';
import { useAuth, UserType } from '@/lib/auth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

function Sidebar({ isOpen, onToggle, currentPage, onPageChange }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { 
      icon: BarChart3, 
      label: "Dashboard", 
      id: "dashboard"
    },
    { 
      icon: Calendar, 
      label: "Agendamentos", 
      id: "agendamentos"
    },
    { 
      icon: Users, 
      label: "Clientes", 
      id: "clientes"
    },
    { 
      icon: DollarSign, 
      label: "Caixa", 
      id: "caixa"
    },
    { 
      icon: Scissors, 
      label: "Serviços", 
      id: "servicos"
    },
    { 
      icon: Package, 
      label: "Produtos", 
      id: "produtos"
    },
    { 
      icon: Clock, 
      label: "Horários", 
      id: "horarios"
    },
    { 
      icon: Star, 
      label: "Avaliações", 
      id: "avaliacoes"
    },
    { 
      icon: FileText, 
      label: "Relatórios", 
      id: "relatorios"
    },
    { 
      icon: CreditCard, 
      label: "Pagamentos", 
      id: "pagamentos"
    },
    { 
      icon: MessageSquare, 
      label: "Integrações", 
      id: "integracoes"
    },
    { 
      icon: User, 
      label: "Perfil", 
      id: "perfil"
    },
    { 
      icon: Settings, 
      label: "Configurações", 
      id: "configuracoes"
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-50 bg-white border-r border-gray-200",
        // Mobile: slide in/out, Desktop: always visible
        isMobile 
          ? `w-80 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`
          : "w-64"
      )}>
        <div className="flex flex-col h-full">
          <div className={cn("p-4", isMobile ? "p-6" : "p-4")}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h1 className={cn("font-bold text-gray-800", isMobile ? "text-lg" : "text-xl")}>
                  Agenda Salão
                </h1>
              </div>
              {isMobile && (
                <button 
                  onClick={onToggle}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <nav className="space-y-2 overflow-y-auto flex-1 pr-2 max-h-96">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Menu Principal
              </p>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    // Auto-close on mobile after selection
                    if (isMobile) onToggle();
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 rounded-lg text-left transition-colors",
                    isMobile ? "px-6 py-4 text-base" : "px-4 py-3 text-sm",
                    currentPage === item.id 
                      ? "bg-primary text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className={cn("", isMobile ? "w-6 h-6" : "w-5 h-5")} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardContent() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu salão de beleza</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Agendamentos Hoje", value: "12", color: "bg-blue-100 text-blue-600" },
          { label: "Faturamento", value: "R$ 850", color: "bg-green-100 text-green-600" },
          { label: "Clientes Ativos", value: "347", color: "bg-purple-100 text-purple-600" },
          { label: "Taxa Ocupação", value: "85%", color: "bg-orange-100 text-orange-600" },
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Novo Agendamento", icon: Calendar },
            { label: "Cadastrar Cliente", icon: Users },
            { label: "Ver Caixa", icon: DollarSign },
            { label: "Configurações", icon: Settings },
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <action.icon className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'super_admin' | 'salon_admin'>('salon_admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const user = localStorage.getItem('authUser');
    if (user) {
      try {
        const authUser = JSON.parse(user);
        setIsAuthenticated(true);
        setUserType(authUser.type || 'salon_admin');
      } catch {
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-dropdown')) {
          setUserDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLogin = (userData: { 
    type: 'superadmin' | 'salon';
    name: string;
    email: string;
    salonName?: string;
    licenseKey?: string;
  }) => {
    setIsAuthenticated(true);
    setUserType(userData.type === 'superadmin' ? 'super_admin' : 'salon_admin');
    setCurrentPage('dashboard');
    
    // Salvar dados do usuário no localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUserType('salon_admin');
    setCurrentPage('dashboard');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Se não está autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <MultiLevelLogin onLogin={handleLogin} />;
  }

  // Se é super admin, mostrar dashboard específico
  if (userType === 'super_admin') {
    return <SuperAdminDashboard onLogout={handleLogout} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'caixa':
        return <CaixaPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'integracoes':
        return <IntegrationsPage />;
      case 'python-integration':
        return <SystemIntegrationPage />;
      case 'perfil':
        return <ProfilePage />;
      case 'agendamentos':
        return <AgendamentosPage />;
      case 'clientes':
        return <ClientesPage />;
      case 'servicos':
        return <ServicosPage />;
      case 'configuracoes':
        return <ConfiguracoesPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={toggleSidebar}
                className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Logo - Show only on mobile when sidebar is closed */}
              <div className="flex items-center space-x-3 md:hidden">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-800">Agenda Salão</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              {/* User Dropdown */}
              <div className="relative user-dropdown">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AS</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">Admin do Salão</p>
                    <p className="text-xs text-gray-500">Proprietário</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">AS</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Admin do Salão</p>
                          <p className="text-sm text-gray-600">admin@salao.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setUserDropdownOpen(false);
                          // Aqui você pode adicionar lógica para trocar usuário
                          alert('Funcionalidade de trocar usuário em desenvolvimento');
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Trocar Usuário</span>
                      </button>
                      <button 
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right hidden lg:block">
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
        
        <main>
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}