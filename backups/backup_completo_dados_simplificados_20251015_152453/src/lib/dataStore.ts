'use client';

import { LicenseWithFeatures as License } from '@/lib/licenseDatabase';

// Interface para um cliente simplificado
export interface SimpleClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  licenseKey?: string;
  createdAt: string;
}

// Chaves do localStorage
const STORAGE_KEYS = {
  LICENSES: 'agenda_salao_licenses',
  CLIENTS: 'agenda_salao_clients'
};

// Sistema de armazenamento de dados
export class DataStore {
  // Licenças
  static getLicenses(): License[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LICENSES);
      if (!stored) return [];
      
      const licenses = JSON.parse(stored);
      // Converter strings de data para objetos Date
      return licenses.map((license: any) => ({
        ...license,
        createdAt: new Date(license.createdAt),
        expiresAt: new Date(license.expiresAt),
        renewalDate: license.renewalDate ? new Date(license.renewalDate) : undefined
      }));
    } catch (error) {
      console.error('Erro ao carregar licenças:', error);
      return [];
    }
  }

  static saveLicense(license: License): void {
    if (typeof window === 'undefined') return;
    
    try {
      const licenses = this.getLicenses();
      const existingIndex = licenses.findIndex(l => l.id === license.id);
      
      if (existingIndex >= 0) {
        licenses[existingIndex] = license;
      } else {
        licenses.push(license);
      }
      
      localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(licenses));
      
      // Sincronizar com clientes se a licença tiver cliente associado
      if (license.clientName && license.clientEmail) {
        this.syncClientFromLicense(license);
      }
    } catch (error) {
      console.error('Erro ao salvar licença:', error);
    }
  }

  static deleteLicense(licenseId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const licenses = this.getLicenses();
      const filteredLicenses = licenses.filter(l => l.id !== licenseId);
      localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(filteredLicenses));
    } catch (error) {
      console.error('Erro ao deletar licença:', error);
    }
  }

  // Clientes
  static getClients(): SimpleClient[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (!stored) return [];
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  }

  static saveClient(client: SimpleClient): void {
    if (typeof window === 'undefined') return;
    
    try {
      const clients = this.getClients();
      const existingIndex = clients.findIndex(c => c.id === client.id);
      
      if (existingIndex >= 0) {
        clients[existingIndex] = client;
      } else {
        clients.push(client);
      }
      
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  }

  // Sincronização entre licenças e clientes
  private static syncClientFromLicense(license: License): void {
    const clients = this.getClients();
    const existingClient = clients.find(c => c.email === license.clientEmail);
    
    if (!existingClient) {
      // Criar novo cliente a partir da licença
      const newClient: SimpleClient = {
        id: license.clientId,
        name: license.clientName,
        email: license.clientEmail,
        licenseKey: license.licenseKey,
        createdAt: new Date().toISOString()
      };
      this.saveClient(newClient);
    } else {
      // Atualizar cliente existente com a licença
      existingClient.licenseKey = license.licenseKey;
      this.saveClient(existingClient);
    }
  }

  // Limpar todos os dados (para desenvolvimento)
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEYS.LICENSES);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
  }

  // Sincronizar dados entre diferentes seções
  static syncData(): void {
    // Sincronizar licenças com clientes
    const licenses = this.getLicenses();
    licenses.forEach(license => {
      if (license.clientName && license.clientEmail) {
        this.syncClientFromLicense(license);
      }
    });
  }
}

// Hook para detectar mudanças no localStorage
export function useStorageSync(callback: () => void) {
  if (typeof window !== 'undefined') {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('agenda_salao_')) {
        callback();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Também escutar mudanças customizadas
    const handleCustomChange = () => callback();
    window.addEventListener('dataStoreUpdate', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataStoreUpdate', handleCustomChange);
    };
  }
}

// Disparar evento customizado para sincronização
export function triggerDataSync(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dataStoreUpdate'));
  }
}