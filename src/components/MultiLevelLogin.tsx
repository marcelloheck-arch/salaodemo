'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Users, Crown, Sparkles } from 'lucide-react';
import { LocalStorageService } from '@/services/LocalStorageService';
import PasswordSetup from './PasswordSetup';

interface MultiLevelLoginProps {
  onLogin: (userData: { 
    type: 'superadmin' | 'salon';
    name: string;
    email: string;
    salonName?: string;
    licenseKey?: string;
    isNewUser?: boolean;
  }) => void;
  onRegister?: () => void; // Nova função para navegar para cadastro
}

export default function MultiLevelLogin({ onLogin, onRegister }: MultiLevelLoginProps) {
  const [loginType, setLoginType] = useState<'superadmin' | 'salon'>('salon');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [requiresLicense, setRequiresLicense] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  const clearLocalStorage = () => {
    localStorage.clear();
    setError('');
    alert('✅ Dados limpos! Tente fazer login novamente.');
  };

  const handlePasswordSet = (success: boolean) => {
    if (success && pendingUserData) {
      // Senha definida com sucesso - fazer login com flag de usuário novo
      const userDataWithFlag = { ...pendingUserData, isNewUser: true };
      localStorage.setItem('userData', JSON.stringify(userDataWithFlag));
      localStorage.setItem('authUser', JSON.stringify({ ...userDataWithFlag, type: 'salon_admin' }));
      localStorage.setItem('isAuthenticated', 'true');
      
      setShowPasswordSetup(false);
      setPendingUserData(null);
      onLogin(userDataWithFlag);
    } else {
      setError('Erro ao definir senha. Tente novamente.');
      setShowPasswordSetup(false);
      setPendingUserData(null);
    }
  };

  const handleSkipPasswordSetup = () => {
    if (pendingUserData) {
      // Fazer login sem definir senha
      localStorage.setItem('userData', JSON.stringify(pendingUserData));
      localStorage.setItem('authUser', JSON.stringify({ ...pendingUserData, type: 'salon_admin' }));
      localStorage.setItem('isAuthenticated', 'true');
      
      setShowPasswordSetup(false);
      setPendingUserData(null);
      onLogin(pendingUserData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Limpar dados anteriores do localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('authUser');
      localStorage.removeItem('isAuthenticated');
      
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validação de credenciais
      if (loginType === 'superadmin') {
        // Buscar senha do Super Admin no localStorage
        const savedCredentials = JSON.parse(localStorage.getItem('systemCredentials') || '{}');
        const superAdminPassword = savedCredentials.superadmin || 'SuperAdmin@2024';
        
        // Credenciais Super Admin
        if (email.toLowerCase().trim() === 'superadmin@agendusalao.com' && password === superAdminPassword) {
          // Salvar dados do usuário no localStorage
          const userData = {
            type: 'superadmin' as const,
            name: 'Super Administrador',
            email: email.toLowerCase().trim(),
          };
          
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'super_admin' }));
          localStorage.setItem('isAuthenticated', 'true');
          
          onLogin(userData);
        } else {
          const displayPassword = superAdminPassword === 'SuperAdmin@2024' ? 'SuperAdmin@2024' : '[Senha personalizada]';
          setError(`❌ Credenciais de super administrador inválidas. Use: superadmin@agendusalao.com / ${displayPassword}`);
        }
      } else {
        // Login de salão
        // Verificar se é um usuário registrado com licença ativa
        const localStorageService = LocalStorageService.getInstance();
        const registrations = localStorageService.loadRegistrations();
        const licenses = localStorageService.loadLicenses();
        
        // Buscar usuário registrado pelo email
        const registeredUser = registrations.find(reg => 
          reg.email.toLowerCase().trim() === email.toLowerCase().trim() && 
          reg.status === 'aprovado'
        );
        
        if (registeredUser) {
          // Verificar se tem licença ativa
          const userLicense = licenses.find(license => 
            license.clientData?.email?.toLowerCase().trim() === email.toLowerCase().trim() &&
            license.status === 'ativa'
          );
          
          if (userLicense) {
            // Verificar se usuário já tem senha definida
            if (localStorageService.hasUserPassword(email)) {
              // Validar senha
              if (!password) {
                setError('❌ Digite sua senha para acessar o sistema.');
                setLoading(false);
                return;
              }
              
              if (!localStorageService.validateUserPassword(email, password)) {
                setError('❌ Senha incorreta.');
                setLoading(false);
                return;
              }
              
              // Login bem-sucedido com senha
              const userData = {
                type: 'salon' as const,
                name: registeredUser.nome,
                email: registeredUser.email,
                salonName: registeredUser.nomeEmpresa,
                licenseKey: userLicense.chaveAtivacao,
                registrationId: registeredUser.id,
                licenseId: userLicense.id
              };
              
              localStorage.setItem('userData', JSON.stringify(userData));
              localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'salon_admin' }));
              localStorage.setItem('isAuthenticated', 'true');
              
              onLogin(userData);
            } else {
              // Usuário não tem senha definida - primeiro acesso com licença
              if (requiresLicense && licenseKey) {
                // Validar licença para primeiro acesso
                if (licenseKey.toUpperCase().trim() === userLicense.chaveAtivacao) {
                  // Licença válida - mostrar modal para definir senha
                  const userData = {
                    type: 'salon' as const,
                    name: registeredUser.nome,
                    email: registeredUser.email,
                    salonName: registeredUser.nomeEmpresa,
                    licenseKey: userLicense.chaveAtivacao,
                    registrationId: registeredUser.id,
                    licenseId: userLicense.id
                  };
                  
                  setPendingUserData(userData);
                  setShowPasswordSetup(true);
                } else {
                  setError('❌ Chave de licença incorreta. Verifique a chave enviada por email.');
                }
              } else {
                setError('❌ Para primeiro acesso, informe a chave de licença enviada por email.');
                setRequiresLicense(true);
              }
            }
          } else {
            setError('❌ Licença não encontrada ou inativa. Entre em contato com o suporte.');
          }
        } else if (email.toLowerCase().trim() === 'admin@salao.com' && password === 'admin123') {
          if (requiresLicense) {
            // Verificar licença
            if (licenseKey.toUpperCase().trim() === 'TEST-1234-ABCD-5678') {
              const userData = {
                type: 'salon' as const,
                name: 'Admin do Salão',
                email: email.toLowerCase().trim(),
                salonName: 'Salão Premium',
                licenseKey: licenseKey.toUpperCase().trim(),
              };
              
              localStorage.setItem('userData', JSON.stringify(userData));
              localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'salon_admin' }));
              localStorage.setItem('isAuthenticated', 'true');
              
              onLogin(userData);
            } else {
              // Verificar se é uma chave gerada pelo sistema manual
              const localStorageService = LocalStorageService.getInstance();
              const systemLicenses = localStorageService.loadLicenses();
              const validLicense = systemLicenses.find(license => 
                license.chaveAtivacao === licenseKey.toUpperCase().trim() && 
                license.status === 'ativa'
              );
              
              if (validLicense) {
                const userData = {
                  type: 'salon' as const,
                  name: `Admin - ${validLicense.clientData?.company || 'Cliente'}`,
                  email: email.toLowerCase().trim(),
                  salonName: validLicense.clientData?.company || 'Salão Cliente',
                  licenseKey: licenseKey.toUpperCase().trim(),
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'salon_admin' }));
                localStorage.setItem('isAuthenticated', 'true');
                
                onLogin(userData);
              } else {
                setError(`❌ Chave de licença inválida. Use: TEST-1234-ABCD-5678 ou uma chave válida gerada pelo sistema`);
              }
            }
          } else {
            // Login demo sem licença
            const userData = {
              type: 'salon' as const,
              name: 'Admin do Salão',
              email: email.toLowerCase().trim(),
              salonName: 'Salão Demo',
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'salon_admin' }));
            localStorage.setItem('isAuthenticated', 'true');
            
            onLogin(userData);
          }
        } else if (requiresLicense && licenseKey.trim() !== '') {
          // Novo: Login flexível com qualquer email + licença válida
          const localStorageService = LocalStorageService.getInstance();
          const systemLicenses = localStorageService.loadLicenses();
          
          console.log('🔍 BUSCANDO LICENÇA:', {
            chaveInformada: licenseKey.toUpperCase().trim(),
            totalLicencasDisponiveis: systemLicenses.length,
            emailTentativa: email.toLowerCase().trim()
          });
          
          const validLicense = systemLicenses.find(license => 
            license.chaveAtivacao === licenseKey.toUpperCase().trim() && 
            license.status === 'ativa'
          );
          
          console.log('🎯 RESULTADO DA BUSCA:', {
            licencaEncontrada: !!validLicense,
            detalhesLicenca: validLicense ? {
              chave: validLicense.chaveAtivacao,
              status: validLicense.status,
              clientEmail: validLicense.clientData?.email
            } : 'Nenhuma licença encontrada'
          });
          
          if (validLicense) {
            // Verificar se o email corresponde ao email da licença ou permitir qualquer email
            const isEmailMatch = !validLicense.clientData?.email || 
                                validLicense.clientData.email.toLowerCase() === email.toLowerCase().trim();
            
            if (isEmailMatch || !validLicense.clientData?.email) {
              const userData = {
                type: 'salon' as const,
                name: `${validLicense.clientData?.name || 'Cliente'} - ${validLicense.clientData?.company || 'Empresa'}`,
                email: email.toLowerCase().trim(),
                salonName: validLicense.clientData?.company || 'Salão Cliente',
                licenseKey: licenseKey.toUpperCase().trim(),
              };
              
              localStorage.setItem('userData', JSON.stringify(userData));
              localStorage.setItem('authUser', JSON.stringify({ ...userData, type: 'salon_admin' }));
              localStorage.setItem('isAuthenticated', 'true');
              
              onLogin(userData);
            } else {
              setError(`❌ Email não corresponde ao registrado na licença: ${validLicense.clientData.email}`);
            }
          } else {
            setError('❌ Chave de licença inválida ou inativa');
          }
        } else {
          setError('❌ Email não encontrado ou não aprovado. Para usuários registrados: apenas email é necessário. Para conta demo: admin@salao.com / admin123');
        }
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
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
                setLicenseKey('');
                setRequiresLicense(false);
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
        <div className="flex justify-center">
          <button
            type="button"
            onClick={clearLocalStorage}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-xs hover:bg-red-200 transition-colors"
          >
            🗑️ Limpar Dados do Navegador
          </button>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              placeholder="Digite seu email"
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha <span className="text-gray-400 text-xs">(opcional para usuários registrados)</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm pr-10"
                placeholder="Digite sua senha (opcional para usuários registrados)"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="Ex: SLN-2025-X8F2-K9M3-L5P7 ou TEST-1234-ABCD-5678"
                  />
                </div>
              )}
            </div>
          )}

          {/* Nota Informativa */}
          {loginType === 'salon' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Usuários Registrados:</strong> Use apenas seu email (senha opcional).<br/>
                    <strong>Conta Demo:</strong> admin@salao.com / admin123
                  </p>
                </div>
              </div>
            </div>
          )}

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
          {onRegister && (
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-slate-700 via-slate-600 to-blue-600 text-white/70">
                    Não tem uma conta?
                  </span>
                </div>
              </div>
              
              <button
                onClick={onRegister}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Cadastrar Novo Salão</span>
              </button>
              
              <p className="text-white/60 text-xs mt-2">
                Crie sua conta e escolha o plano ideal para seu salão
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Modal de Definição de Senha */}
      {showPasswordSetup && pendingUserData && (
        <PasswordSetup
          userEmail={pendingUserData.email}
          userName={pendingUserData.name}
          onPasswordSet={handlePasswordSet}
          onSkip={handleSkipPasswordSetup}
        />
      )}
    </div>
  );
}