'use client';

import { useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Senha simples para demo - em produção use sistema robusto
  const DEMO_PASSWORD = 'salao2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              🏪 Sistema Agenda Salão
            </h1>
            <p className="text-purple-200">
              Digite a senha para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Digite a senha..."
                required
              />
            </div>

            {error && (
              <div className="text-red-300 text-sm text-center bg-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-slate-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="mt-6 text-center text-purple-300 text-sm">
            <p>🔒 Acesso protegido por senha</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
