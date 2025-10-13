// Sistema de persistência local para registros e licenças
import { UserRegistration, SystemLicense } from '@/types/license';

const STORAGE_KEYS = {
  REGISTRATIONS: 'agenda_salao_registrations',
  LICENSES: 'agenda_salao_licenses',
  LAST_UPDATE: 'agenda_salao_last_update'
};

export class LocalStorageService {
  private static instance: LocalStorageService;

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Salvar registros
  saveRegistrations(registrations: UserRegistration[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
    } catch (error) {
      console.error('Erro ao salvar registros:', error);
    }
  }

  // Carregar registros
  loadRegistrations(): UserRegistration[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (data) {
        const registrations = JSON.parse(data);
        // Converter strings de data de volta para objetos Date
        return registrations.map((reg: any) => ({
          ...reg,
          dataCadastro: new Date(reg.dataCadastro)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
    return [];
  }

  // Adicionar novo registro
  addRegistration(registration: UserRegistration): void {
    const registrations = this.loadRegistrations();
    registrations.push(registration);
    this.saveRegistrations(registrations);
  }

  // Atualizar registro existente
  updateRegistration(id: string, updates: Partial<UserRegistration>): void {
    const registrations = this.loadRegistrations();
    const index = registrations.findIndex(reg => reg.id === id);
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...updates };
      this.saveRegistrations(registrations);
    }
  }

  // Salvar licenças
  saveLicenses(licenses: SystemLicense[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(licenses));
    } catch (error) {
      console.error('Erro ao salvar licenças:', error);
    }
  }

  // Carregar licenças
  loadLicenses(): SystemLicense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LICENSES);
      if (data) {
        const licenses = JSON.parse(data);
        // Converter strings de data de volta para objetos Date
        return licenses.map((license: any) => ({
          ...license,
          dataAtivacao: new Date(license.dataAtivacao),
          dataVencimento: new Date(license.dataVencimento)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar licenças:', error);
    }
    return [];
  }

  // Adicionar nova licença
  addLicense(license: SystemLicense): void {
    const licenses = this.loadLicenses();
    licenses.push(license);
    this.saveLicenses(licenses);
  }

  // Limpar todos os dados (útil para reset)
  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
      localStorage.removeItem(STORAGE_KEYS.LICENSES);
      localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }

  // Verificar se há dados salvos
  hasData(): boolean {
    return localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) !== null;
  }

  // Obter estatísticas
  getStats() {
    const registrations = this.loadRegistrations();
    const licenses = this.loadLicenses();
    
    return {
      totalRegistrations: registrations.length,
      pendingRegistrations: registrations.filter(r => r.status === 'pendente').length,
      approvedRegistrations: registrations.filter(r => r.status === 'aprovado').length,
      rejectedRegistrations: registrations.filter(r => r.status === 'rejeitado').length,
      activeLicenses: licenses.filter(l => l.status === 'ativa').length,
      totalLicenses: licenses.length
    };
  }

  // Migrar dados mockados para localStorage (executar uma vez)
  migrateMockData(mockRegistrations: UserRegistration[], mockLicenses: SystemLicense[]): void {
    if (!this.hasData()) {
      this.saveRegistrations(mockRegistrations);
      this.saveLicenses(mockLicenses);
      console.log('✅ Dados mockados migrados para localStorage');
    }
  }
}