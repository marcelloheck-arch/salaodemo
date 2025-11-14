export interface License {
  id: string;
  licenseKey: string;
  planType: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'suspended' | 'pending';
  clientId: string;
  clientName: string;
  clientEmail: string;
  createdAt: Date;
  expiresAt: Date;
  maxUsers: number;
  features: LicenseFeature[];
  paymentStatus: 'paid' | 'pending' | 'failed';
  renewalDate?: Date;
}

export interface LicenseFeature {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  cnpj?: string;
  address: Address;
  licenses: License[];
  createdAt: Date;
  status: 'active' | 'inactive' | 'blocked';
  totalRevenue: number;
}

export interface Address {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Sistema de Cadastro e Aprovação de Usuários
export interface UserRegistration {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  nomeEmpresa: string;
  cnpj?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
  observacoes?: string;
  dataCadastro: Date;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  planoSelecionado?: string; // ID do plano escolhido
  senha?: string; // Senha criada pelo usuário após primeiro login
  senhaDefinida?: boolean; // Flag para saber se o usuário já definiu senha
}

export interface LicensePlan {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  periodo: 'mensal' | 'anual';
  recursos: string[]; // IDs dos recursos inclusos
  maxUsuarios: number;
  maxClientes: number;
  maxAgendamentos: number;
  suportePrioritario: boolean;
  personalizacao: boolean;
  relatoriosAvancados: boolean;
  integracao: boolean;
  popular?: boolean;
  recomendado?: boolean;
}

export interface SystemLicense {
  id: string;
  chaveAtivacao: string;
  userId: string;
  planoId: string;
  status: 'ativa' | 'expirada' | 'suspensa' | 'cancelada';
  dataAtivacao: Date;
  dataVencimento: Date;
  renovacaoAutomatica: boolean;
  limitesPersonalizados?: {
    maxUsuarios?: number;
    maxClientes?: number;
    maxAgendamentosCustom?: number;
  };
  recursosAtivos: string[];
  observacoesAdmin?: string;
  clientData?: {
    name: string;
    email: string;
    phone?: string;
    company: string;
    cnpj?: string;
    address?: string;
    city: string;
    state: string;
  };
}

export interface SystemFeature {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'basico' | 'premium' | 'enterprise';
  icone: string;
  dependencias?: string[]; // IDs de outros recursos necessários
  email: string;
  telefone?: string;
  nomeEmpresa: string;
  cnpj?: string;
  endereco?: string;
  cidade: string;
  estado: string;
  dataCadastro: Date;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  observacoes?: string;
  motivoRejeicao?: string;
}

export interface AdminNotification {
  id: string;
  tipo: 'novo_cadastro' | 'renovacao' | 'suporte' | 'pagamento';
  usuarioId: string;
  titulo: string;
  mensagem: string;
  dataEnvio: Date;
  lido: boolean;
  dadosUsuario: UserRegistration;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface UserLicense {
  id: string;
  userId: string;
  registrationId: string;
  planoId: string;
  recursos: string[];
  dataInicio: Date;
  dataVencimento: Date;
  status: 'ativa' | 'expirada' | 'suspensa' | 'cancelada';
  chaveAtivacao: string;
  limitesPersonalizados?: {
    maxUsuarios?: number;
    maxClientes?: number;
    maxAgendamentos?: number;
    armazenamento?: number; // GB
  };
  observacoes?: string;
  geradaPor: string; // ID do admin que gerou
  dataGeracao: Date;
}

// Recursos disponíveis no sistema
export interface AvailableFeature {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'basico' | 'intermediario' | 'avancado';
  icone: string;
  ativo: boolean;
  dependencias?: string[]; // recursos necessários
}

// Recursos disponíveis
export const SYSTEM_FEATURES: AvailableFeature[] = [
  {
    id: 'agenda',
    nome: 'Sistema de Agendamentos',
    descricao: 'Agendamento online, calendário e notificações',
    categoria: 'basico',
    icone: '📅',
    ativo: true
  },
  {
    id: 'clientes',
    nome: 'Gestão de Clientes',
    descricao: 'Cadastro completo e histórico de atendimentos',
    categoria: 'basico',
    icone: '👥',
    ativo: true
  },
  {
    id: 'servicos',
    nome: 'Catálogo de Serviços',
    descricao: 'Gerenciamento de serviços, preços e duração',
    categoria: 'basico',
    icone: '💇‍♀️',
    ativo: true
  },
  {
    id: 'funcionarios',
    nome: 'Gestão de Funcionários',
    descricao: 'Cadastro, escalas e comissões',
    categoria: 'intermediario',
    icone: '👨‍💼',
    ativo: true,
    dependencias: ['servicos']
  },
  {
    id: 'produtos',
    nome: 'Controle de Estoque',
    descricao: 'Gestão de produtos e vendas',
    categoria: 'intermediario',
    icone: '📦',
    ativo: true
  },
  {
    id: 'financeiro',
    nome: 'Controle Financeiro',
    descricao: 'Fluxo de caixa, contas e relatórios',
    categoria: 'intermediario',
    icone: '💰',
    ativo: true
  },
  {
    id: 'relatorios',
    nome: 'Relatórios Avançados',
    descricao: 'Dashboards e análises detalhadas',
    categoria: 'avancado',
    icone: '📊',
    ativo: true,
    dependencias: ['financeiro']
  },
  {
    id: 'marketing',
    nome: 'Marketing Digital',
    descricao: 'Campanhas, promoções e fidelidade',
    categoria: 'avancado',
    icone: '📢',
    ativo: true,
    dependencias: ['clientes']
  },
  {
    id: 'multilocal',
    nome: 'Multi-estabelecimentos',
    descricao: 'Gestão de múltiplas unidades',
    categoria: 'avancado',
    icone: '🏢',
    ativo: true
  },
  {
    id: 'api',
    nome: 'Integração API',
    descricao: 'Conectar com sistemas externos',
    categoria: 'avancado',
    icone: '🔗',
    ativo: true
  },
  {
    id: 'backup',
    nome: 'Backup Automático',
    descricao: 'Backup diário dos dados',
    categoria: 'intermediario',
    icone: '☁️',
    ativo: true
  },
  {
    id: 'whatsapp',
    nome: 'Integração WhatsApp',
    descricao: 'Notificações e agendamentos via WhatsApp',
    categoria: 'avancado',
    icone: '📱',
    ativo: true,
    dependencias: ['agenda']
  }
];



export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  permissions: string[];
  lastLogin: Date;
}

export interface SalonUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  clientId: string;
  licenseId: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface PlanConfig {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  price: number;
  duration: number; // em meses
  maxUsers: number;
  features: LicenseFeature[];
  description: string;
  popular?: boolean;
}

// Planos disponíveis para cadastro
export const LICENSE_PLANS: LicensePlan[] = [
  {
    id: 'starter',
    nome: 'Starter',
    descricao: 'Ideal para salões pequenos começando a se digitalizar',
    preco: 49.90,
    periodo: 'mensal',
    recursos: [
      'agenda',
      'clientes',
      'servicos',
      'funcionarios'
    ],
    maxUsuarios: 2,
    maxClientes: 500,
    maxAgendamentos: 200,
    suportePrioritario: false,
    personalizacao: false,
    relatoriosAvancados: false,
    integracao: false
  },
  {
    id: 'professional',
    nome: 'Professional',
    descricao: 'Para salões estabelecidos que querem crescer',
    preco: 99.90,
    periodo: 'mensal',
    recursos: [
      'agenda',
      'clientes',
      'servicos',
      'funcionarios',
      'produtos',
      'financeiro',
      'backup'
    ],
    maxUsuarios: 5,
    maxClientes: 2000,
    maxAgendamentos: 1000,
    suportePrioritario: true,
    personalizacao: true,
    relatoriosAvancados: false,
    integracao: false,
    popular: true
  },
  {
    id: 'premium',
    nome: 'Premium',
    descricao: 'Solução completa para salões de alto padrão',
    preco: 199.90,
    periodo: 'mensal',
    recursos: [
      'agenda',
      'clientes',
      'servicos',
      'funcionarios',
      'produtos',
      'financeiro',
      'relatorios',
      'marketing',
      'backup',
      'whatsapp'
    ],
    maxUsuarios: 15,
    maxClientes: 10000,
    maxAgendamentos: 5000,
    suportePrioritario: true,
    personalizacao: true,
    relatoriosAvancados: true,
    integracao: true,
    recomendado: true
  },
  {
    id: 'enterprise',
    nome: 'Enterprise',
    descricao: 'Para redes de salões e franquias',
    preco: 399.90,
    periodo: 'mensal',
    recursos: [
      'agenda',
      'clientes',
      'servicos',
      'funcionarios',
      'produtos',
      'financeiro',
      'relatorios',
      'marketing',
      'multilocal',
      'api',
      'backup',
      'whatsapp'
    ],
    maxUsuarios: 50,
    maxClientes: 50000,
    maxAgendamentos: 25000,
    suportePrioritario: true,
    personalizacao: true,
    relatoriosAvancados: true,
    integracao: true
  }
];

// Arrays vazios para novos usuários - sistema pronto para produção
export const USER_REGISTRATIONS_MOCK: UserRegistration[] = [];

export const SYSTEM_LICENSES_MOCK: SystemLicense[] = [];