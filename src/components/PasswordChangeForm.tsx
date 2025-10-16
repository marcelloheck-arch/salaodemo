'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PasswordChangeFormProps {
  currentUser: string;
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ 
  currentUser, 
  onPasswordChange 
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Validação de força da senha
  const validatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Comprimento mínimo
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Mínimo de 8 caracteres');
    }

    // Letra maiúscula
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Uma letra maiúscula');
    }

    // Letra minúscula
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Uma letra minúscula');
    }

    // Número
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Um número');
    }

    // Caractere especial
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Um caractere especial (!@#$%^&*)');
    }

    return {
      score,
      feedback,
      isValid: score >= 4
    };
  };

  const passwordStrength = validatePasswordStrength(newPassword);

  const getStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (score: number) => {
    if (score < 2) return 'Fraca';
    if (score < 4) return 'Média';
    return 'Forte';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validações
    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Digite a senha atual' });
      return;
    }

    if (!passwordStrength.isValid) {
      setMessage({ type: 'error', text: 'A nova senha não atende aos critérios de segurança' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({ type: 'error', text: 'A nova senha deve ser diferente da atual' });
      return;
    }

    setIsLoading(true);

    try {
      const success = await onPasswordChange(currentPassword, newPassword);
      
      if (success) {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: 'Senha atual incorreta' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Alterar Senha</h3>
      </div>

      <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
        <p className="text-sm text-blue-200">
          <strong>Usuário:</strong> {currentUser}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Senha Atual */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Senha Atual
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Nova Senha */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite a nova senha"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Indicador de Força da Senha */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-6 rounded-full ${
                        i < passwordStrength.score 
                          ? getStrengthColor(passwordStrength.score)
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-300">
                  {getStrengthLabel(passwordStrength.score)}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-xs text-yellow-300">
                  Faltam: {passwordStrength.feedback.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmar Nova Senha */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirme a nova senha"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-400 mt-1">
              As senhas não coincidem
            </p>
          )}
        </div>

        {/* Mensagem de Feedback */}
        {message && (
          <div className={`p-3 rounded-lg border flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-200'
              : 'bg-red-500/20 border-red-500/30 text-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={isLoading || !passwordStrength.isValid || newPassword !== confirmPassword}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Alterando...' : 'Alterar Senha'}
        </button>
      </form>

      {/* Critérios de Segurança */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Critérios de Segurança:</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Mínimo de 8 caracteres</li>
          <li>• Pelo menos uma letra maiúscula</li>
          <li>• Pelo menos uma letra minúscula</li>
          <li>• Pelo menos um número</li>
          <li>• Pelo menos um caractere especial</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordChangeForm;