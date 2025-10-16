'use client'

import { LicenseWithFeatures as License } from '@/lib/licenseDatabase';

// Tipos locais para configuração de planos
export interface PlanConfig {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  price: number;
  duration: number;
  maxUsers: number;
  description: string;
  popular?: boolean;
  features: {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
  }[];
}

export class LicenseGenerator {
  private static generateLicenseKey(): string {
    const segments = [];
    
    // Gerar 4 segmentos de 4 caracteres cada
    for (let i = 0; i < 4; i++) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    
    return segments.join('-');
  }

  static generateLicense(
    clientId: string,
    clientName: string,
    clientEmail: string,
    planConfig: PlanConfig
  ): License {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(now.getMonth() + planConfig.duration);

    return {
      id: crypto.randomUUID(),
      licenseKey: this.generateLicenseKey(),
      planType: planConfig.type,
      status: 'pending',
      clientId,
      clientName,
      clientEmail,
      createdAt: now,
      expiresAt,
      maxUsers: planConfig.maxUsers,
      features: planConfig.features,
      paymentStatus: 'pending',
      renewalDate: expiresAt
    };
  }

  static validateLicense(licenseKey: string): boolean {
    // Validar formato da licença
    const licenseRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return licenseRegex.test(licenseKey);
  }

  static calculateRevenue(licenses: License[]): number {
    const planPrices: Record<string, number> = {
      basic: 29.90,
      premium: 49.90,
      enterprise: 99.90
    };

    return licenses.reduce((total, license) => {
      if (license.paymentStatus === 'paid') {
        return total + (planPrices[license.planType] || 0);
      }
      return total;
    }, 0);
  }

  static getLicenseStatus(license: License): {
    status: string;
    daysUntilExpiry: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
  } {
    const now = new Date();
    const expiryDate = new Date(license.expiresAt);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      status: license.status,
      daysUntilExpiry,
      isExpired: daysUntilExpiry <= 0,
      isExpiringSoon: daysUntilExpiry <= 7 && daysUntilExpiry > 0
    };
  }
}

export const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: 'basic',
    name: 'Plano Básico',
    type: 'basic',
    price: 29.90,
    duration: 1,
    maxUsers: 3,
    description: 'Ideal para salões pequenos',
    features: [
      { id: 'agendamentos', name: 'Agendamentos', enabled: true, description: 'Sistema de agendamentos básico' },
      { id: 'clientes', name: 'Clientes', enabled: true, description: 'Cadastro de clientes' },
      { id: 'servicos', name: 'Serviços', enabled: true, description: 'Cadastro de serviços' },
      { id: 'caixa', name: 'Caixa', enabled: false, description: 'Controle financeiro' },
      { id: 'relatorios', name: 'Relatórios', enabled: false, description: 'Relatórios avançados' }
    ]
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    type: 'premium',
    price: 49.90,
    duration: 1,
    maxUsers: 10,
    description: 'Para salões em crescimento',
    popular: true,
    features: [
      { id: 'agendamentos', name: 'Agendamentos', enabled: true, description: 'Sistema de agendamentos completo' },
      { id: 'clientes', name: 'Clientes', enabled: true, description: 'Cadastro completo de clientes' },
      { id: 'servicos', name: 'Serviços', enabled: true, description: 'Cadastro de serviços e produtos' },
      { id: 'caixa', name: 'Caixa', enabled: true, description: 'Controle financeiro completo' },
      { id: 'relatorios', name: 'Relatórios', enabled: true, description: 'Relatórios básicos' },
      { id: 'integracoes', name: 'Integrações', enabled: false, description: 'WhatsApp e outras integrações' }
    ]
  },
  {
    id: 'enterprise',
    name: 'Plano Enterprise',
    type: 'enterprise',
    price: 99.90,
    duration: 1,
    maxUsers: -1, // Ilimitado
    description: 'Para redes e grandes salões',
    features: [
      { id: 'agendamentos', name: 'Agendamentos', enabled: true, description: 'Sistema de agendamentos avançado' },
      { id: 'clientes', name: 'Clientes', enabled: true, description: 'CRM completo' },
      { id: 'servicos', name: 'Serviços', enabled: true, description: 'Gestão completa de serviços e produtos' },
      { id: 'caixa', name: 'Caixa', enabled: true, description: 'Controle financeiro avançado' },
      { id: 'relatorios', name: 'Relatórios', enabled: true, description: 'Relatórios completos e personalizados' },
      { id: 'integracoes', name: 'Integrações', enabled: true, description: 'Todas as integrações disponíveis' },
      { id: 'multistore', name: 'Multi-lojas', enabled: true, description: 'Gestão de múltiplas unidades' },
      { id: 'api', name: 'API', enabled: true, description: 'Acesso à API para integrações personalizadas' }
    ]
  }
];