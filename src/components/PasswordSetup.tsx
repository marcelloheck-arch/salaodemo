'use client';

import React, { useState } from 'react';
import { LocalStorageService } from '@/services/LocalStorageService';

interface PasswordSetupProps {
  userEmail: string;
  userName: string;
  onPasswordSet: (success: boolean) => void;
  onSkip?: () => void;
}

export default function PasswordSetup({ userEmail, userName, onPasswordSet, onSkip }: PasswordSetupProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return 'A senha deve conter pelo menos um número';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validações
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const localStorageService = LocalStorageService.getInstance();
      const success = localStorageService.setUserPassword(userEmail, password);
      
      if (success) {
        onPasswordSet(true);
      } else {
        setError('Erro ao definir senha. Tente novamente.');
        onPasswordSet(false);
      }
    } catch (error) {
      console.error('Erro ao definir senha:', error);
      setError('Erro interno. Tente novamente.');
      onPasswordSet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let result = '';
    
    // Garantir pelo menos um de cada tipo
    result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Maiúscula
    result += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Minúscula
    result += '0123456789'[Math.floor(Math.random() * 10)]; // Número
    result += '!@#$%&*'[Math.floor(Math.random() * 7)]; // Especial
    
    // Completar com caracteres aleatórios
    for (let i = 4; i < 12; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Embaralhar
    return result.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setPassword(newPassword);
    setConfirmPassword(newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Definir Senha de Acesso
          </h2>
          <p className="text-white/80 text-sm">
            Olá, <strong>{userName}</strong>! Para facilitar próximos acessos, defina uma senha personalizada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite sua nova senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirmar Senha
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirme sua nova senha"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="flex-1 py-2 px-4 bg-indigo-600/20 border border-indigo-400/30 rounded-xl text-indigo-300 hover:bg-indigo-600/30 transition-all text-sm"
            >
              🎲 Gerar Senha
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="text-xs text-white/60 space-y-1">
            <p>A senha deve conter:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Pelo menos 6 caracteres</li>
              <li>Uma letra maiúscula</li>
              <li>Uma letra minúscula</li>
              <li>Um número</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="flex-1 py-3 px-6 bg-gray-600/20 border border-gray-400/30 rounded-xl text-gray-300 hover:bg-gray-600/30 transition-all"
                disabled={isLoading}
              >
                Pular por Agora
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Definindo...
                </div>
              ) : (
                'Definir Senha'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}