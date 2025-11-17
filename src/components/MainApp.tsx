"use client";

/*
 * SIMPLIFICAÇÃO DE AGENDAMENTOS - Opção 1 Implementada
 * =====================================================
 * 
 * ALTERAÇÃO: Removido menu "Agendamentos" duplicado
 * - "Dashboard Agendamentos" renomeado para "Agendamentos" (tela principal)
 * - "Agendamento Rápido" mantido (criação rápida)
 * - AgendamentosPage antiga COMENTADA (não removida)
 * 
 * PARA RESTAURAR A PÁGINA ANTIGA:
 * 1. Descomentar: import AgendamentosPage from './AgendamentosPage';
 * 2. Descomentar o menu item com id: "agendamentos-old"
 * 3. Descomentar: case 'agendamentos-old': return <AgendamentosPage />;
 * 
 * Data: 10/11/2025
 */

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
  FileText,
  CreditCard,
  Package,
  ChevronDown,
  UserCheck,
  UserPlus,
  Shield,
  Smartphone,
  Zap,
  Briefcase,
  MessageCircle,
  Trash2
} from "lucide-react";
import { cn } from '@/lib/utils';
import IntegrationsPage from './IntegrationsPage';
import ProfilePage from './ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
// COMENTADO - AgendamentosPage antiga (para restaurar se necessário, descomentar esta linha)
// import AgendamentosPage from './AgendamentosPage';
import ClientesPage from './ClientesPage';
import ServicosPage from './ServicosPage';
import CaixaPage from './CaixaPage';
import ConfiguracoesPage from './ConfiguracoesPage';
import HorariosPage from './HorariosPage';
import ProdutosPage from './ProdutosPage';
import RelatoriosPage from './RelatoriosPage';
import PagamentosPage from './PagamentosPage';
import RelatoriosFinanceirosPage from './RelatoriosFinanceirosPage';
import RelatoriosWidget from './RelatoriosWidget';
import SystemIntegrationPage from './SystemIntegrationPage';
import LicenseManagementApp from './LicenseManagementApp';
import DashboardAgendamentos from './DashboardAgendamentos';
import AgendamentoMulti from './AgendamentoMulti';
import WhatsAppIntegration from './WhatsAppIntegration';
import NotificationManager from './NotificationManager';
import ConfiguracaoFuncionamento from './ConfiguracaoFuncionamento';
import MigrationManager from './MigrationManager';
import ClienteAuthPage from './ClienteAuthPage';
import ProfissionalAuthPage from './ProfissionalAuthPage';
import WhatsAppAIAssistant from './WhatsAppAIAssistant';
import PublicLandingPage from './PublicLandingPage';
import SystemCleanup from './SystemCleanup';
import { isSessionActive, getSessionUser, startSession, endSession, type AuthUser } from '@/lib/sessionAuth';

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
      id: "dashboard-agendamentos" // Renomeado: era "Dashboard Agendamentos", agora é a tela principal
    },
    // COMENTADO - AgendamentosPage antiga (para restaurar se necessário)
    // { 
    //   icon: Calendar, 
    //   label: "Agendamentos (Antigo)", 
    //   id: "agendamentos-old"
    // },
    // REMOVIDO - Agendamento Rápido (14/11/2025)
    // { 
    //   icon: Zap, 
    //   label: "Agendamento Rápido", 
    //   id: "agendamento-rapido"
    // },
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
      icon: Settings, 
      label: "Config. Funcionamento", 
      id: "config-funcionamento"
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
    // REMOVIDO - Relatórios Financeiros (14/11/2025) - Já existe "Relatórios" completo
    // { 
    //   icon: DollarSign, 
    //   label: "Relatórios Financeiros", 
    //   id: "relatorios-financeiros"
    // },
    { 
      icon: Smartphone, 
      label: "WhatsApp", 
      id: "whatsapp"
    },
    { 
      icon: Bell, 
      label: "Notificações", 
      id: "notificacoes"
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
    // REMOVIDO - Cadastro Público (14/11/2025) - Funcionalidade administrativa interna
    // { 
    //   icon: Shield, 
    //   label: "Cadastro Público", 
    //   id: "cadastro-publico"
    // },
    { 
      icon: User, 
      label: "🌐 Portal Cliente", 
      id: "portal-cliente"
    },
    { 
      icon: Briefcase, 
      label: "💼 Portal Profissional", 
      id: "portal-profissional"
    },
    { 
      icon: MessageCircle, 
      label: "🤖 Assistente WhatsApp IA", 
      id: "whatsapp-ai"
    },
    { 
      icon: User, 
      label: "🏠 Página Inicial Pública", 
      id: "landing-page"
    },
    { 
      icon: Trash2, 
      label: "🧹 Limpar Dados Fictícios", 
      id: "system-cleanup"
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
          ? `w-72 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`
          : "w-56"
      )}>
        <div className="flex flex-col h-full">
          <div className={cn("p-3", isMobile ? "p-4" : "p-3")}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                <h1 className={cn("font-bold text-gray-800", isMobile ? "text-base" : "text-lg")}>
                  Gerenciamento Master
                </h1>
              </div>
              {isMobile && (
                <button 
                  onClick={onToggle}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <nav className="space-y-1 overflow-y-auto flex-1 pr-1 max-h-96">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
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
                    "w-full flex items-center space-x-2.5 rounded-lg text-left transition-colors",
                    isMobile ? "px-4 py-3 text-sm" : "px-3 py-2.5 text-sm",
                    currentPage === item.id 
                      ? "bg-primary text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className={cn("", isMobile ? "w-5 h-5" : "w-4 h-4")} />
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

function DashboardContent({ onPageChange }: { onPageChange: (page: string) => void }) {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600 text-sm">Visão geral do seu salão de beleza</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Agendamentos Hoje", value: "12", color: "bg-blue-100 text-blue-600" },
          { label: "Faturamento", value: "R$ 850", color: "bg-green-100 text-green-600" },
          { label: "Clientes Ativos", value: "347", color: "bg-slate-100 text-slate-600" },
          { label: "Taxa Ocupação", value: "85%", color: "bg-orange-100 text-orange-600" },
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Agendamento Rápido", icon: Zap, page: "agendamento-rapido", color: "text-green-600" },
              { label: "Dashboard Agendamentos", icon: Calendar, page: "dashboard-agendamentos", color: "text-blue-600" },
              { label: "Cadastrar Cliente", icon: Users, page: "clientes", color: "text-slate-600" },
              { label: "WhatsApp", icon: Smartphone, page: "whatsapp", color: "text-green-500" },
              { label: "Notificações", icon: Bell, page: "notificacoes", color: "text-yellow-600" },
              { label: "Ver Caixa", icon: DollarSign, page: "caixa", color: "text-emerald-600" },
              { label: "Config. Horários", icon: Clock, page: "config-funcionamento", color: "text-indigo-600" },
              { label: "Configurações", icon: Settings, page: "configuracoes", color: "text-gray-600" },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => onPageChange(action.page)}
                className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
              >
                <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Widget de Relatórios */}
        <RelatoriosWidget onOpenReports={() => onPageChange('relatorios')} />
      </div>

      {/* Novos Recursos */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">🚀 Novos Recursos Implementados</h3>
            <p className="text-sm text-gray-600">Sistema de agendamento inteligente com funcionalidades avançadas</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: "Sistema Inteligente", 
              description: "Detecção de conflitos automática", 
              icon: Zap, 
              page: "config-funcionamento",
              color: "bg-green-100 text-green-600"
            },
            { 
              title: "WhatsApp Business", 
              description: "Confirmações e lembretes automáticos", 
              icon: Smartphone, 
              page: "whatsapp",
              color: "bg-green-100 text-green-600"
            },
            { 
              title: "Dashboard Avançado", 
              description: "Gestão completa de agendamentos", 
              icon: Calendar, 
              page: "dashboard-agendamentos",
              color: "bg-blue-100 text-blue-600"
            },
            { 
              title: "Notificações Push", 
              description: "Email, SMS e notificações push", 
              icon: Bell, 
              page: "notificacoes",
              color: "bg-slate-100 text-slate-600"
            }
          ].map((feature, index) => (
            <button
              key={index}
              onClick={() => onPageChange(feature.page)}
              className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300"
            >
              <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                <feature.icon className="w-4 h-4" />
              </div>
              <h4 className="font-medium text-gray-800 mb-1">{feature.title}</h4>
              <p className="text-xs text-gray-600">{feature.description}</p>
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
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Verificar parâmetro da URL para abrir portal do cliente
    const urlParams = new URLSearchParams(window.location.search);
    const portalParam = urlParams.get('portal');
    
    if (portalParam === 'cliente') {
      console.log('🔗 Parâmetro portal=cliente detectado, redirecionando...');
      setCurrentPage('portal-cliente');
      // Limpar parâmetro da URL
      window.history.replaceState({}, '', '/');
      return;
    }
    
    // Verificar se há sessão ativa (sessionStorage - limpa ao fechar navegador)
    const sessionActive = isSessionActive();
    const sessionUser = getSessionUser();
    
    console.log('🔍 Verificando estado de autenticação:', { 
      sessionActive, 
      sessionUser: !!sessionUser 
    });
    
    if (sessionActive && sessionUser) {
      console.log('👤 Sessão ativa encontrada:', sessionUser);
      setIsAuthenticated(true);
      setCurrentUser(sessionUser);
      
      // Definir tipo de usuário
      if (sessionUser.type === 'superadmin') {
        setUserType('super_admin');
        console.log('🔧 Usuário identificado como Super Admin');
      } else {
        setUserType('salon_admin');
        console.log('🏪 Usuário identificado como Salão Admin');
      }
    } else {
      console.log('🔓 Nenhuma sessão ativa - Fechar navegador = Logout automático');
    }

    // Listener para detectar mudanças no localStorage (quando atualiza perfil/config)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'agenda_salao_user' && e.newValue) {
        console.log('🔄 Detectada atualização do usuário, recarregando dados...');
        const updatedUser = JSON.parse(e.newValue);
        
        // Atualizar também o authUser
        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        const mergedUser = { ...authUser, ...updatedUser };
        localStorage.setItem('authUser', JSON.stringify(mergedUser));
        setCurrentUser(mergedUser);
      }
    };
    
    // Listener para CustomEvent disparado por ProfilePage/ConfiguracoesPage
    const handleUserUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('🔄 Usuário atualizado via CustomEvent:', customEvent.detail);
      setCurrentUser(customEvent.detail);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdated);

    // Atalho de teclado: Ctrl+Shift+L para logout rápido
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        handleLogout();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdated);
    };
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
    isNewUser?: boolean;
  }) => {
    // Iniciar sessão (usa sessionStorage - limpa ao fechar navegador)
    startSession(userData);
    
    setIsAuthenticated(true);
    setUserType(userData.type === 'superadmin' ? 'super_admin' : 'salon_admin');
    setCurrentUser(userData);
    setCurrentPage('dashboard');
    
    console.log('✅ Login realizado - Sessão será encerrada ao fechar o navegador');
  };

  const handleLogout = () => {
    console.log('🚪 Fazendo logout e encerrando sessão');
    
    // Encerrar sessão (limpa sessionStorage e dados de autenticação)
    endSession();
    
    // Reset completo dos estados
    setIsAuthenticated(false);
    setUserType('salon_admin');
    setCurrentPage('dashboard');
    setUserDropdownOpen(false);
    setSidebarOpen(false);
    setCurrentUser(null);
    
    console.log('✅ Logout completo - Dados de sessão removidos');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Função para gerar iniciais do usuário
  const getUserInitials = () => {
    if (!currentUser?.name) return 'AS';
    return currentUser.name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Função para obter nome de exibição
  const getDisplayName = () => {
    if (!currentUser?.name) return 'Admin do Salão';
    return currentUser.name;
  };

  // Função para obter email de exibição
  const getDisplayEmail = () => {
    if (!currentUser?.email) return 'admin@salao.com';
    return currentUser.email;
  };

  // Função para obter nome do salão
  const getSalonName = () => {
    if (!currentUser?.salonName) return 'Salão de Beleza';
    return currentUser.salonName;
  };

  // Se não está autenticado, mostrar sistema de gerenciamento de licenças/login
  if (!isAuthenticated) {
    console.log('🔓 Usuário não autenticado, mostrando tela de login');
    return <LicenseManagementApp onLogin={handleLogin} />;
  }

  console.log('🎯 DECISÃO DE RENDERIZAÇÃO:', {
    isAuthenticated,
    userType,
    currentUser_email: currentUser?.email,
    condition_super_admin: userType === 'super_admin',
    localStorage_authUser: localStorage.getItem('authUser'),
    localStorage_userData: localStorage.getItem('userData')
  });

  // Se é super admin, mostrar painel administrativo completo
  if (userType === 'super_admin') {
    console.log('🔧 RENDERIZANDO: Painel Administrativo Completo');
    return <LicenseManagementApp onLogin={handleLogin} showAdminPanel={true} />;
  }

  console.log('🏪 RENDERIZANDO: Dashboard do Salão');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent onPageChange={setCurrentPage} />;
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
      
      // COMENTADO - AgendamentosPage antiga (para restaurar se necessário)
      // case 'agendamentos-old':
      //   return <AgendamentosPage />;
      
      case 'agendamento-rapido':
        return <AgendamentoMulti salaoId="salao-demo" onAgendamentoCriado={(agendamento) => {
          console.log('Agendamento criado:', agendamento);
          setCurrentPage('dashboard-agendamentos');
        }} />;
      case 'dashboard-agendamentos':
        return <DashboardAgendamentos onNavigateToNovoAgendamento={() => setCurrentPage('agendamento-rapido')} />;
      case 'clientes':
        return <ClientesPage />;
      case 'servicos':
        return <ServicosPage />;
      case 'configuracoes':
        return <ConfiguracoesPage />;
      case 'horarios':
        return <HorariosPage />;
      case 'config-funcionamento':
        return <ConfiguracaoFuncionamento salaoId="salao-demo" />;
      case 'produtos':
        return <ProdutosPage />;
      case 'relatorios':
        return <RelatoriosPage />;
      case 'pagamentos':
        return <PagamentosPage />;
      case 'relatorios-financeiros':
        return <RelatoriosFinanceirosPage />;
      case 'whatsapp':
        return <WhatsAppIntegration />;
      case 'notificacoes':
        return <NotificationManager />;
      case 'cadastro-publico':
        return <LicenseManagementApp onLogin={() => setCurrentPage('dashboard')} />;
      case 'portal-cliente':
        return <ClienteAuthPage />;
      case 'portal-profissional':
        return <ProfissionalAuthPage />;
      case 'whatsapp-ai':
        return <WhatsAppAIAssistant />;
      case 'landing-page':
        return <PublicLandingPage 
          onNavigateToCliente={() => setCurrentPage('portal-cliente')}
          onNavigateToProfissional={() => setCurrentPage('portal-profissional')}
          onNavigateToAdmin={() => setCurrentPage('dashboard')}
        />;
      case 'system-cleanup':
        return <SystemCleanup />;
      default:
        return <DashboardContent onPageChange={setCurrentPage} />;
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
      
      <div className="lg:ml-56">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={toggleSidebar}
                className="md:hidden text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Logo - Show only on mobile when sidebar is closed */}
              <div className="flex items-center space-x-2 md:hidden">
                <div className="w-7 h-7 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                <h1 className="text-base font-bold text-gray-800">Gerenciamento Master</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5 md:space-x-3">
              <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              {/* User Dropdown */}
              <div className="relative user-dropdown">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{getUserInitials()}</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-medium text-gray-700">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500">{getSalonName()}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{getUserInitials()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{getDisplayName()}</p>
                          <p className="text-sm text-gray-600">{getDisplayEmail()}</p>
                          {currentUser?.salonName && (
                            <p className="text-xs text-gray-500">{getSalonName()}</p>
                          )}
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
                        className="w-full flex items-center justify-between px-3 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mb-1"
                        title="Voltar ao Login (Ctrl+Shift+L)"
                      >
                        <div className="flex items-center space-x-3">
                          <LogOut className="w-4 h-4" />
                          <span>Voltar ao Login</span>
                        </div>
                        <span className="text-xs text-blue-400">Ctrl+Shift+L</span>
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
