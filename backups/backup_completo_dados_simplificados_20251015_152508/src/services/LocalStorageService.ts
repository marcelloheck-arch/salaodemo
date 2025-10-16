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

  // Gerenciamento de senhas
  setUserPassword(email: string, password: string): boolean {
    try {
      const registrations = this.loadRegistrations();
      const userIndex = registrations.findIndex(reg => 
        reg.email.toLowerCase().trim() === email.toLowerCase().trim()
      );
      
      if (userIndex !== -1) {
        registrations[userIndex].senha = password;
        registrations[userIndex].senhaDefinida = true;
        this.saveRegistrations(registrations);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao definir senha:', error);
      return false;
    }
  }

  // Verificar se usuário tem senha
  hasUserPassword(email: string): boolean {
    try {
      const registrations = this.loadRegistrations();
      const user = registrations.find(reg => 
        reg.email.toLowerCase().trim() === email.toLowerCase().trim()
      );
      return user?.senhaDefinida === true && !!user?.senha;
    } catch (error) {
      return false;
    }
  }

  // Validar senha
  validateUserPassword(email: string, password: string): boolean {
    try {
      const registrations = this.loadRegistrations();
      const user = registrations.find(reg => 
        reg.email.toLowerCase().trim() === email.toLowerCase().trim()
      );
      return user?.senha === password;
    } catch (error) {
      return false;
    }
  }
}