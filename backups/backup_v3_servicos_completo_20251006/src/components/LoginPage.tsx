"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui';

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular login
    setTimeout(() => {
      onLogin({ email, password });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Agenda Salão</h1>
          <p className="text-gray-600">Faça login para acessar seu painel</p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Lembrar de mim */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
              </label>
              <button type="button" className="text-sm text-primary hover:text-primary-dark">
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Credenciais de demonstração:</p>
            <p className="text-xs text-gray-500">Email: admin@salao.com</p>
            <p className="text-xs text-gray-500">Senha: admin123</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <button className="text-primary hover:text-primary-dark font-medium">
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const handleLogin = (credentials: { email: string; password: string }) => {
    // Validar credenciais
    if (credentials.email === 'admin@salao.com' && credentials.password === 'admin123') {
      // Salvar dados do usuário
      const userData = {
        email: credentials.email,
        name: 'Admin do Salão',
        role: 'owner'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Forçar atualização da página para recarregar o estado
      window.location.reload();
    } else {
      alert('Credenciais inválidas! Use: admin@salao.com / admin123');
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}