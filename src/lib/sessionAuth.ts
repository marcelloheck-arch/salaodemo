/**
 * Sistema de Autenticação com SessionStorage
 * =========================================
 * 
 * Este módulo usa sessionStorage para a sessão do usuário,
 * garantindo logout automático ao fechar o navegador.
 * 
 * - sessionStorage: Limpa ao fechar o navegador (SESSÃO)
 * - localStorage: Permanece para dados persistentes (DADOS)
 */

export interface AuthUser {
  type: 'superadmin' | 'salon';
  name: string;
  email: string;
  salonName?: string;
  licenseKey?: string;
  isNewUser?: boolean;
}

/**
 * Verifica se há uma sessão ativa
 */
export const isSessionActive = (): boolean => {
  const session = sessionStorage.getItem('authSession');
  return session === 'active';
};

/**
 * Obtém dados do usuário da sessão
 */
export const getSessionUser = (): AuthUser | null => {
  try {
    const userData = sessionStorage.getItem('authUser');
    if (!userData) return null;
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

/**
 * Inicia uma nova sessão (login)
 */
export const startSession = (userData: AuthUser): void => {
  sessionStorage.setItem('authSession', 'active');
  sessionStorage.setItem('authUser', JSON.stringify(userData));
  
  // Salvar dados do usuário no localStorage (para uso em outras páginas)
  // mas a SESSÃO fica no sessionStorage
  localStorage.setItem('userData', JSON.stringify(userData));
  
  console.log('✅ Sessão iniciada - Será encerrada ao fechar o navegador');
};

/**
 * Encerra a sessão (logout)
 */
export const endSession = (): void => {
  // Limpar sessionStorage (sessão)
  sessionStorage.removeItem('authSession');
  sessionStorage.removeItem('authUser');
  
  // Limpar localStorage (dados de autenticação - mantém dados do salão)
  localStorage.removeItem('authUser');
  localStorage.removeItem('userData');
  localStorage.removeItem('isAuthenticated');
  
  console.log('🚪 Sessão encerrada');
};

/**
 * Atualiza dados do usuário na sessão
 */
export const updateSessionUser = (userData: Partial<AuthUser>): void => {
  const currentUser = getSessionUser();
  if (!currentUser) return;
  
  const updatedUser = { ...currentUser, ...userData };
  sessionStorage.setItem('authUser', JSON.stringify(updatedUser));
  localStorage.setItem('userData', JSON.stringify(updatedUser));
  
  // Disparar evento para atualizar UI
  window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
};
