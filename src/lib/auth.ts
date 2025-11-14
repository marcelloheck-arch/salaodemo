'use client'

import { useState } from 'react';
import { LicenseWithFeatures as License } from '@/lib/licenseDatabase';

export type UserType = 'super_admin' | 'salon_admin' | 'salon_user';

export interface SalonUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  licenseId: string;
}

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
  licenseId?: string;
  clientId?: string;
  permissions: string[];
  licenseData?: License;
}

export class AuthService {
  private static readonly SUPER_ADMIN_CREDENTIALS = {
    email: 'superadmin@agendusalao.com',
    password: 'SuperAdmin@2024'
  };

  private static readonly SALON_ADMIN_CREDENTIALS = {
    email: 'admin@salao.com',
    password: 'admin123'
  };

  static validateLicense(licenseKey: string): Promise<License | null> {
    return new Promise((resolve) => {
      // Validação de licença - em produção conectar com banco de dados
      setTimeout(() => {
        // Sistema limpo - sem licenças de teste
        // Retorna null para forçar cadastro/validação real
        resolve(null);
      }, 500);
    });
  }

  static async authenticateUser(
    email: string, 
    password: string, 
    licenseKey?: string
  ): Promise<AuthUser | null> {
    
    // Verificar Super Admin
    if (email === this.SUPER_ADMIN_CREDENTIALS.email && 
        password === this.SUPER_ADMIN_CREDENTIALS.password) {
      return {
        id: 'super_admin_1',
        name: 'Super Administrador',
        email,
        type: 'super_admin',
        permissions: ['*'] // Todas as permissões
      };
    }

    // Verificar Admin do Salão
    if (email === this.SALON_ADMIN_CREDENTIALS.email && 
        password === this.SALON_ADMIN_CREDENTIALS.password) {
      
      // Se forneceu chave de licença, validar
      if (licenseKey) {
        const license = await this.validateLicense(licenseKey);
        if (!license) {
          throw new Error('Licença inválida ou expirada');
        }
        
        return {
          id: 'salon_admin_1',
          name: 'Admin do Salão',
          email,
          type: 'salon_admin',
          licenseId: license.id,
          clientId: license.clientId,
          permissions: this.getPermissionsForLicense(license),
          licenseData: license
        };
      } else {
        // Login sem licença (modo demo limitado)
        return {
          id: 'salon_admin_demo',
          name: 'Admin do Salão (Demo)',
          email,
          type: 'salon_admin',
          permissions: ['agendamentos:read', 'clientes:read', 'servicos:read']
        };
      }
    }

    return null;
  }

  private static getPermissionsForLicense(license: License): string[] {
    const basePermissions = ['agendamentos:*', 'clientes:*', 'servicos:*'];
    
    // Adicionar permissões baseadas nas features da licença
    license.features.forEach(feature => {
      if (feature.enabled) {
        basePermissions.push(`${feature.id}:*`);
      }
    });

    return basePermissions;
  }

  static hasPermission(user: AuthUser, permission: string): boolean {
    if (user.type === 'super_admin') return true;
    
    return user.permissions.includes(permission) || 
           user.permissions.includes('*') ||
           user.permissions.some(p => p.startsWith(permission.split(':')[0] + ':*'));
  }

  static getLicenseRestrictions(user: AuthUser): {
    maxUsers: number;
    availableFeatures: string[];
    isExpired: boolean;
    daysUntilExpiry: number;
  } | null {
    if (user.type === 'super_admin' || !user.licenseData) return null;

    const license = user.licenseData;
    const now = new Date();
    const expiryDate = new Date(license.expiresAt);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      maxUsers: license.maxUsers,
      availableFeatures: license.features.filter(f => f.enabled).map(f => f.id),
      isExpired: daysUntilExpiry <= 0,
      daysUntilExpiry
    };
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, licenseKey?: string) => {
    setLoading(true);
    setError(null);

    try {
      const authUser = await AuthService.authenticateUser(email, password, licenseKey);
      if (authUser) {
        setUser(authUser);
        localStorage.setItem('authUser', JSON.stringify(authUser));
        return authUser;
      } else {
        setError('Credenciais inválidas');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const checkAuth = () => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        const authUser = JSON.parse(stored);
        setUser(authUser);
        return authUser;
      } catch {
        localStorage.removeItem('authUser');
      }
    }
    return null;
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    hasPermission: (permission: string) => user ? AuthService.hasPermission(user, permission) : false,
    getLicenseRestrictions: () => user ? AuthService.getLicenseRestrictions(user) : null
  };
}