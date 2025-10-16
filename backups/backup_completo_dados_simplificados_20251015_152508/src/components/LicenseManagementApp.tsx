'use client';

import React, { useState } from 'react';
import MultiLevelLogin from './MultiLevelLogin';
import PublicRegistrationForm from './PublicRegistrationForm';
import AdminLicensePanel from './AdminLicensePanel';

type AppMode = 'login' | 'register' | 'admin';

interface UserData {
  type: 'superadmin' | 'salon';
  name: string;
  email: string;
  salonName?: string;
  licenseKey?: string;
}

interface LicenseManagementAppProps {
  onLogin?: (userData: UserData) => void;
  showAdminPanel?: boolean;
}

export default function LicenseManagementApp({ onLogin, showAdminPanel = false }: LicenseManagementAppProps) {
  const [currentMode, setCurrentMode] = useState<AppMode>('login');
  const [authenticatedUser, setAuthenticatedUser] = useState<UserData | null>(null);

  const handleLogin = (userData: UserData) => {
    setAuthenticatedUser(userData);
    
    console.log('🚀 REDIRECIONAMENTO APÓS LOGIN:', {
      userType: userData.type,
      userName: userData.name,
      hasLicense: !!userData.licenseKey,
      hasOnLoginCallback: !!onLogin
    });
    
    // Se tem callback do MainApp, usar ele
    if (onLogin) {
      onLogin(userData);
      return;
    }
    
    // Se for super admin, vai direto para o painel administrativo
    if (userData.type === 'superadmin') {
      setCurrentMode('admin');
    } else {
      // Para usuários comuns, redirecionar para o sistema principal
      console.log('✅ Login de salão realizado, redirecionando...');
      
      // LIMPAR TODOS OS DADOS ANTIGOS PRIMEIRO
      localStorage.removeItem('userData');
      localStorage.removeItem('authUser');
      localStorage.removeItem('isAuthenticated');
      
      // Criar dados limpos para usuário do salão
      const salonUserData = {
        ...userData,
        type: 'salon'  // FORÇAR tipo como 'salon'
      };
      
      console.log('💾 SALVANDO DADOS DO SALÃO:', salonUserData);
      
      // Salvar dados no localStorage para o MainApp
      localStorage.setItem('userData', JSON.stringify(salonUserData));
      localStorage.setItem('authUser', JSON.stringify(salonUserData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Aguardar um pouco antes de recarregar
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleRegistrationSuccess = () => {
    alert('✅ Cadastro realizado com sucesso! Você receberá um email com as próximas instruções.');
    setCurrentMode('login');
  };

  const handleBackToLogin = () => {
    setCurrentMode('login');
  };

  const handleShowRegistration = () => {
    setCurrentMode('register');
  };

  // Se foi solicitado mostrar painel admin diretamente
  if (showAdminPanel) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header do Admin */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  🔐 Painel Administrativo
                </h1>
                <p className="text-gray-600 text-sm">Bem-vindo(a), Super Admin</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('authUser');
                  localStorage.removeItem('userData');
                  localStorage.removeItem('isAuthenticated');
                  window.location.reload();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo do Painel */}
        <AdminLicensePanel />
      </div>
    );
  }

  // Renderizar painel administrativo
  if (currentMode === 'admin' && authenticatedUser?.type === 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header do Admin */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  🔐 Painel Administrativo
                </h1>
                <p className="text-gray-600 text-sm">Bem-vindo(a), {authenticatedUser.name}</p>
              </div>
              <button
                onClick={() => {
                  setAuthenticatedUser(null);
                  setCurrentMode('login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo do Painel */}
        <AdminLicensePanel />
      </div>
    );
  }

  // Renderizar formulário de registro
  if (currentMode === 'register') {
    return (
      <PublicRegistrationForm
        onCancel={handleBackToLogin}
        onSuccess={handleRegistrationSuccess}
      />
    );
  }

  // Renderizar tela de login (padrão)
  return (
    <MultiLevelLogin
      onLogin={handleLogin}
      onRegister={handleShowRegistration}
    />
  );
}