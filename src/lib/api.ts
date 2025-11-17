/**
 * API Helper - Wrapper para fetch com autenticação JWT
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Buscar token JWT do sessionStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('auth_token');
}

/**
 * Salvar token no sessionStorage
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('auth_token', token);
}

/**
 * Remover token do sessionStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('user_data');
}

/**
 * Fetch wrapper com autenticação automática
 */
async function fetchWithAuth<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Adicionar headers do options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Adicionar Authorization header se houver token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se 401 (não autorizado), limpar token e redirecionar
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  // Parse da resposta
  const data = await response.json();

  // Se não for 2xx, lançar erro
  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
}

/**
 * API de Autenticação
 */
export const authApi = {
  /**
   * Login
   */
  async login(email: string, password: string) {
    const data = await fetchWithAuth<{
      success: boolean;
      token: string;
      user: any;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      setToken(data.token);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user_data', JSON.stringify(data.user));
      }
    }

    return data;
  },

  /**
   * Registrar novo salão
   */
  async register(params: {
    salonName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const data = await fetchWithAuth<{
      success: boolean;
      token: string;
      user: any;
      salon: any;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (data.token) {
      setToken(data.token);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user_data', JSON.stringify(data.user));
      }
    }

    return data;
  },

  /**
   * Logout
   */
  logout() {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    return !!getToken();
  },

  /**
   * Buscar usuário do sessionStorage
   */
  getUser() {
    if (typeof window === 'undefined') return null;
    const userData = sessionStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
};

/**
 * API de Clientes
 */
export const clientesApi = {
  async list(params?: { search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    
    return fetchWithAuth(`/api/clientes?${query.toString()}`);
  },

  async getById(id: string) {
    return fetchWithAuth(`/api/clientes/${id}`);
  },

  async create(cliente: {
    name: string;
    phone: string;
    email?: string;
    birthDate?: string;
    address?: string;
    notes?: string;
    preferences?: string[];
  }) {
    return fetchWithAuth('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  },

  async update(id: string, cliente: Partial<{
    name: string;
    phone: string;
    email?: string;
    birthDate?: string;
    address?: string;
    notes?: string;
    preferences?: string[];
    status?: string;
  }>) {
    return fetchWithAuth(`/api/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/api/clientes/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API de Serviços
 */
export const servicosApi = {
  async list(params?: { search?: string; category?: string; isActive?: boolean }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));
    
    return fetchWithAuth(`/api/servicos?${query.toString()}`);
  },

  async getById(id: string) {
    return fetchWithAuth(`/api/servicos/${id}`);
  },

  async create(servico: {
    name: string;
    price: number;
    duration: number;
    description?: string;
    category?: string;
    commission?: number;
    isActive?: boolean;
  }) {
    return fetchWithAuth('/api/servicos', {
      method: 'POST',
      body: JSON.stringify(servico),
    });
  },

  async update(id: string, servico: Partial<{
    name: string;
    price: number;
    duration: number;
    description?: string;
    category?: string;
    commission?: number;
    isActive?: boolean;
  }>) {
    return fetchWithAuth(`/api/servicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(servico),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/api/servicos/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API de Profissionais
 */
export const profissionaisApi = {
  async list(params?: { search?: string; isActive?: boolean; specialty?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));
    if (params?.specialty) query.append('specialty', params.specialty);
    
    return fetchWithAuth(`/api/profissionais?${query.toString()}`);
  },

  async getById(id: string) {
    return fetchWithAuth(`/api/profissionais/${id}`);
  },

  async create(profissional: {
    name: string;
    email?: string;
    phone?: string;
    specialties?: string[];
    commission?: number;
    isActive?: boolean;
  }) {
    return fetchWithAuth('/api/profissionais', {
      method: 'POST',
      body: JSON.stringify(profissional),
    });
  },

  async update(id: string, profissional: Partial<{
    name: string;
    email?: string;
    phone?: string;
    specialties?: string[];
    commission?: number;
    isActive?: boolean;
  }>) {
    return fetchWithAuth(`/api/profissionais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profissional),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/api/profissionais/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API de Agendamentos
 */
export const agendamentosApi = {
  async list(params?: {
    status?: string;
    professionalId?: string;
    clientId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.professionalId) query.append('professionalId', params.professionalId);
    if (params?.clientId) query.append('clientId', params.clientId);
    if (params?.dateFrom) query.append('dateFrom', params.dateFrom);
    if (params?.dateTo) query.append('dateTo', params.dateTo);
    
    return fetchWithAuth(`/api/agendamentos?${query.toString()}`);
  },

  async getById(id: string) {
    return fetchWithAuth(`/api/agendamentos/${id}`);
  },

  async create(agendamento: {
    clientId: string;
    serviceId: string;
    professionalId: string;
    date: string;
    startTime: string;
    notes?: string;
  }) {
    return fetchWithAuth('/api/agendamentos', {
      method: 'POST',
      body: JSON.stringify(agendamento),
    });
  },

  async update(id: string, agendamento: Partial<{
    status?: string;
    notes?: string;
    paymentStatus?: string;
    totalPrice?: number;
  }>) {
    return fetchWithAuth(`/api/agendamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agendamento),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/api/agendamentos/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API de Transações
 */
export const transacoesApi = {
  async list(params?: {
    type?: string;
    professionalId?: string;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.professionalId) query.append('professionalId', params.professionalId);
    if (params?.dateFrom) query.append('dateFrom', params.dateFrom);
    if (params?.dateTo) query.append('dateTo', params.dateTo);
    if (params?.category) query.append('category', params.category);
    
    return fetchWithAuth(`/api/transacoes?${query.toString()}`);
  },

  async getById(id: string) {
    return fetchWithAuth(`/api/transacoes/${id}`);
  },

  async create(transacao: {
    type: string;
    amount: number;
    description: string;
    category?: string;
    paymentMethod?: string;
    professionalId?: string;
    date?: string;
  }) {
    return fetchWithAuth('/api/transacoes', {
      method: 'POST',
      body: JSON.stringify(transacao),
    });
  },

  async update(id: string, transacao: Partial<{
    description?: string;
    category?: string;
    paymentMethod?: string;
    amount?: number;
  }>) {
    return fetchWithAuth(`/api/transacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transacao),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/api/transacoes/${id}`, {
      method: 'DELETE',
    });
  },

  async getDashboard(params?: { dateFrom?: string; dateTo?: string }) {
    const query = new URLSearchParams();
    if (params?.dateFrom) query.append('dateFrom', params.dateFrom);
    if (params?.dateTo) query.append('dateTo', params.dateTo);
    
    return fetchWithAuth(`/api/transacoes/dashboard?${query.toString()}`);
  },
};
