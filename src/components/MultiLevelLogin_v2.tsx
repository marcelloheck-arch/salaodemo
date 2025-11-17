/**
 * MultiLevelLogin - Versão integrada com Backend API
 * Mantém Super Admin local, mas usa API para salões
 */

'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Users, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MultiLevelLoginProps {
  onLogin: (userData: { 
    type: 'superadmin' | 'salon';
    name: string;
    email: string;
    salonName?: string;
    licenseKey?: string;
    isNewUser?: boolean;
  }) => void;
  onRegister?: () => void;
}

export default function MultiLevelLogin({ onLogin, onRegister }: MultiLevelLoginProps) {
  const { login } = useAuth();
  const [loginType, setLoginType] = useState<'superadmin' | 'salon'>('salon');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    setError('');
    alert('🧹 Dados limpos! Tente fazer login novamente.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginType === 'superadmin') {
        // Super Admin local (não usa API)
        const savedCredentials = JSON.parse(localStorage.getItem('systemCredentials') || '{}');
        const superAdminPassword = savedCredentials.superadmin || 'SuperAdmin@2024';
        
        if (email.toLowerCase().trim() === 'superadmin@agendusalao.com' && password === superAdminPassword) {
          const userData = {
            type: 'superadmin' as const,
            name: 'Super Administrador',
            email: email.toLowerCase().trim(),
          };
          
          // Salvar no localStorage para compatibilidade
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'super_admin' }));
          localStorage.setItem('isAuthenticated', 'true');
          
          onLogin(userData);
        } else {
          const displayPassword = superAdminPassword === 'SuperAdmin@2024' ? 'SuperAdmin@2024' : '[Senha personalizada]';
          setError(`❌ Credenciais de super administrador inválidas. Use: superadmin@agendusalao.com / ${displayPassword}`);
        }
      } else {
        // Login de salão via API
        try {
          const response = await login(email, password);
          
          // Converter resposta da API para formato esperado
          const userData = {
            type: 'salon' as const,
            name: response.user.name,
            email: response.user.email,
            salonName: response.user.salon?.name || 'Salão',
            licenseKey: response.user.salon?.licenseKey,
          };
          
          // Salvar no localStorage para compatibilidade com componentes antigos
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'salon_admin' }));
          localStorage.setItem('isAuthenticated', 'true');
          
          onLogin(userData);
        } catch (apiError: any) {
          console.error('Erro no login:', apiError);
          setError(apiError.message || '❌ Email ou senha incorretos. Verifique suas credenciais.');
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('❌ Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para preencher credenciais de teste
  const fillTestCredentials = () => {
    setLoginType('salon');
    setEmail('admin@salao.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">AgendaSalão</h2>
          <p className="mt-2 text-sm text-gray-600">Sistema de Gerenciamento de Salão</p>
        </div>

        {/* Seletor de Tipo de Login */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 border border-white/20">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setLoginType('salon');
                setEmail('');
                setPassword('');
                setError('');
              }}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                loginType === 'salon'
                  ? 'bg-gradient-to-r from-slate-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Salão
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('superadmin');
                setEmail('');
                setPassword('');
                setError('');
              }}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                loginType === 'superadmin'
                  ? 'bg-gradient-to-r from-slate-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Crown className="h-4 w-4 mr-2" />
              Super Admin
            </button>
          </div>
        </div>

        {/* Utilitários */}
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={clearLocalStorage}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-xs hover:bg-red-200 transition-colors"
          >
            🗑️ Limpar Cache
          </button>
          {loginType === 'salon' && (
            <button
              type="button"
              onClick={fillTestCredentials}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-xs hover:bg-blue-200 transition-colors"
            >
              🧪 Credenciais Teste
            </button>
          )}
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Info Box para Salões */}
          {loginType === 'salon' && !error && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-1">🔐 Login via API Backend</p>
              <p className="text-xs">Use as credenciais criadas no registro ou teste com: admin@salao.com / admin123</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              placeholder={loginType === 'superadmin' ? 'superadmin@agendusalao.com' : 'seu@email.com'}
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm pr-10"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Botão de Login */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-slate-600 to-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {/* Área de Cadastro */}
          {onRegister && loginType === 'salon' && (
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 text-gray-500">
                    Não tem uma conta?
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={onRegister}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Criar Nova Conta</span>
              </button>
              
              <p className="text-gray-500 text-xs mt-2">
                Crie sua conta e comece a usar o sistema gratuitamente
              </p>
            </div>
          )}
        </form>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500">
          <p>✨ Sistema Multi-Tenant com isolamento completo de dados</p>
          <p className="mt-1">🔒 Autenticação via JWT · 🗄️ PostgreSQL + Prisma</p>
        </div>
      </div>
    </div>
  );
}
