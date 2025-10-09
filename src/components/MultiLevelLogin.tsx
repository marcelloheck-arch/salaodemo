'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Users, Crown, Sparkles } from 'lucide-react';

interface MultiLevelLoginProps {
  onLogin: (userData: { 
    type: 'superadmin' | 'salon';
    name: string;
    email: string;
    salonName?: string;
    licenseKey?: string;
  }) => void;
}

export default function MultiLevelLogin({ onLogin }: MultiLevelLoginProps) {
  const [loginType, setLoginType] = useState<'superadmin' | 'salon'>('salon');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [requiresLicense, setRequiresLicense] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validação de credenciais
      if (loginType === 'superadmin') {
        if (email === 'superadmin@agendusalao.com' && password === 'SuperAdmin@2024') {
          // Salvar dados do usuário no localStorage
          const userData = {
            type: 'superadmin' as const,
            name: 'Super Administrador',
            email: email,
          };
          
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('isAuthenticated', 'true');
          
          onLogin(userData);
        } else {
          setError('Credenciais de super administrador inválidas');
        }
      } else {
        // Login de salão
        if (email === 'admin@salao.com' && password === 'admin123') {
          if (requiresLicense) {
            // Verificar licença
            if (licenseKey === 'TEST-1234-ABCD-5678') {
              const userData = {
                type: 'salon' as const,
                name: 'Admin do Salão',
                email: email,
                salonName: 'Salão Premium',
                licenseKey: licenseKey,
              };
              
              localStorage.setItem('userData', JSON.stringify(userData));
              localStorage.setItem('isAuthenticated', 'true');
              
              onLogin(userData);
            } else {
              setError('Chave de licença inválida');
            }
          } else {
            // Login demo sem licença
            const userData = {
              type: 'salon' as const,
              name: 'Admin do Salão',
              email: email,
              salonName: 'Salão Demo',
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
            
            onLogin(userData);
          }
        } else {
          setError('Credenciais de salão inválidas');
        }
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Agenda Salão</h2>
          <p className="mt-2 text-sm text-gray-600">Sistema de Gerenciamento de Salão de Beleza</p>
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
                setLicenseKey('');
                setError('');
              }}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                loginType === 'salon'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
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
                setLicenseKey('');
                setRequiresLicense(false);
                setError('');
              }}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                loginType === 'superadmin'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Crown className="h-4 w-4 mr-2" />
              Super Admin
            </button>
          </div>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              placeholder="Digite seu email"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm pr-10"
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

          {/* Opção de Licença para Salões */}
          {loginType === 'salon' && (
            <div>
              <div className="flex items-center">
                <input
                  id="require-license"
                  type="checkbox"
                  checked={requiresLicense}
                  onChange={(e) => setRequiresLicense(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="require-license" className="ml-2 block text-sm text-gray-700">
                  Tenho uma licença premium
                </label>
              </div>
              
              {requiresLicense && (
                <div className="mt-3">
                  <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                    Chave de Licença
                  </label>
                  <input
                    id="license"
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                    required={requiresLicense}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    pattern="[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}"
                  />
                </div>
              )}
            </div>
          )}

          {/* Botão de Login */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
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