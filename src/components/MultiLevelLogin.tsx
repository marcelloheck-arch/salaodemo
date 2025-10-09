"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Key, User, Building, AlertCircle } from 'lucide-react';
import { useAuth, UserType } from '@/lib/auth';

interface MultiLevelLoginProps {
  onLogin?: (userType: UserType) => void;
}

export default function MultiLevelLogin({ onLogin }: MultiLevelLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'salon' | 'super_admin'>('salon');
  const [requiresLicense, setRequiresLicense] = useState(false);
  
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = await login(
      email, 
      password, 
      loginType === 'salon' && requiresLicense ? licenseKey : undefined
    );
    
    if (user && onLogin) {
      onLogin(user.type);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Auto-detectar tipo de login baseado no email
    if (value.includes('superadmin@agendusalao.com')) {
      setLoginType('super_admin');
      setRequiresLicense(false);
    } else {
      setLoginType('salon');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Agenda Salão
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gerenciamento de Salão de Beleza
          </p>
        </div>

        {/* Seletor de Tipo de Login */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setLoginType('salon');
              setEmail('');
              setPassword('');
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              loginType === 'salon'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Salão de Beleza
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('super_admin');
              setEmail('');
              setPassword('');
              setRequiresLicense(false);
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              loginType === 'super_admin'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Administrador
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder={
                  loginType === 'super_admin' 
                    ? "superadmin@agendusalao.com" 
                    : "admin@salao.com"
                }
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary pr-10"
                  placeholder={
                    loginType === 'super_admin' 
                      ? "SuperAdmin@2024" 
                      : "admin123"
                  }
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

            {/* Opção de Licença para Salões */}
            {loginType === 'salon' && (
              <div>
                <div className="flex items-center">
                  <input
                    id="require-license"
                    type="checkbox"
                    checked={requiresLicense}
                    onChange={(e) => setRequiresLicense(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="require-license" className="ml-2 block text-sm text-gray-700">
                    Tenho uma chave de licença
                  </label>
                </div>
                
                {requiresLicense && (
                  <div className="mt-3">
                    <label htmlFor="license" className="block text-sm font-medium text-gray-700">
                      Chave de Licença
                    </label>
                    <input
                      id="license"
                      name="license"
                      type="text"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary font-mono"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      maxLength={19}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Use TEST-1234-ABCD-5678 para teste
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {/* Credenciais de Teste */}
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
            <h4 className="font-medium mb-2">💡 Credenciais de Teste:</h4>
            <div className="space-y-1">
              <p><strong>Super Admin:</strong> superadmin@agendusalao.com / SuperAdmin@2024</p>
              <p><strong>Salão (Demo):</strong> admin@salao.com / admin123</p>
              <p><strong>Salão (Licença):</strong> admin@salao.com / admin123 + TEST-1234-ABCD-5678</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}