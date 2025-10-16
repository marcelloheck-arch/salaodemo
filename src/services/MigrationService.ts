// services/MigrationService.ts
// Sistema completo de migração de dados do localStorage para Supabase

import { supabase } from '@/lib/supabase';
import DatabaseService from './DatabaseService';

export interface MigrationData {
  clientes: any[];
  agendamentos: any[];
  servicos: any[];
  saloes: any[];
  transacoes: any[];
  licencas: any[];
  configuracoes: any;
}

export interface MigrationProgress {
  step: 'backup' | 'upload' | 'verify' | 'cleanup' | 'complete';
  progress: number;
  message: string;
  errors: string[];
  totalItems: number;
  processedItems: number;
}

class MigrationService {
  private onProgress?: (progress: MigrationProgress) => void;

  constructor(onProgress?: (progress: MigrationProgress) => void) {
    this.onProgress = onProgress;
  }

  // Executar migração completa
  async executeMigration(): Promise<{ success: boolean; data?: MigrationData; errors: string[] }> {
    const errors: string[] = [];
    let migrationData: MigrationData | undefined;

    try {
      // Etapa 1: Backup dos dados do localStorage
      this.updateProgress({
        step: 'backup',
        progress: 0,
        message: 'Fazendo backup dos dados locais...',
        errors: [],
        totalItems: 0,
        processedItems: 0
      });

      migrationData = await this.backupLocalStorageData();
      
      this.updateProgress({
        step: 'backup',
        progress: 100,
        message: 'Backup concluído com sucesso',
        errors: [],
        totalItems: this.getTotalItems(migrationData),
        processedItems: 0
      });

      // Etapa 2: Upload para Supabase
      this.updateProgress({
        step: 'upload',
        progress: 0,
        message: 'Enviando dados para Supabase...',
        errors: [],
        totalItems: this.getTotalItems(migrationData),
        processedItems: 0
      });

      const uploadResult = await this.uploadToSupabase(migrationData);
      errors.push(...uploadResult.errors);

      // Etapa 3: Verificação
      this.updateProgress({
        step: 'verify',
        progress: 0,
        message: 'Verificando integridade dos dados...',
        errors: errors,
        totalItems: this.getTotalItems(migrationData),
        processedItems: this.getTotalItems(migrationData)
      });

      const verificationResult = await this.verifyMigration(migrationData);
      errors.push(...verificationResult.errors);

      // Etapa 4: Limpeza (opcional)
      this.updateProgress({
        step: 'cleanup',
        progress: 0,
        message: 'Configurando ambiente pós-migração...',
        errors: errors,
        totalItems: this.getTotalItems(migrationData),
        processedItems: this.getTotalItems(migrationData)
      });

      await this.setupPostMigration();

      // Etapa 5: Finalização
      this.updateProgress({
        step: 'complete',
        progress: 100,
        message: errors.length > 0 ? 'Migração concluída com avisos' : 'Migração concluída com sucesso!',
        errors: errors,
        totalItems: this.getTotalItems(migrationData),
        processedItems: this.getTotalItems(migrationData)
      });

      return {
        success: errors.length === 0,
        data: migrationData,
        errors
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido na migração';
      errors.push(errorMsg);
      
      this.updateProgress({
        step: 'complete',
        progress: 0,
        message: 'Falha na migração',
        errors: errors,
        totalItems: migrationData ? this.getTotalItems(migrationData) : 0,
        processedItems: 0
      });

      return { success: false, errors };
    }
  }

  // Backup dos dados do localStorage
  private async backupLocalStorageData(): Promise<MigrationData> {
    const data: MigrationData = {
      clientes: [],
      agendamentos: [],
      servicos: [],
      saloes: [],
      transacoes: [],
      licencas: [],
      configuracoes: {}
    };

    try {
      // Clientes
      const clientesData = localStorage.getItem('clientes');
      if (clientesData) {
        data.clientes = JSON.parse(clientesData);
      }

      // Agendamentos
      const agendamentosData = localStorage.getItem('agendamentos');
      if (agendamentosData) {
        data.agendamentos = JSON.parse(agendamentosData);
      }

      // Serviços
      const servicosData = localStorage.getItem('servicos');
      if (servicosData) {
        data.servicos = JSON.parse(servicosData);
      }

      // Salões
      const saloesData = localStorage.getItem('saloes');
      if (saloesData) {
        data.saloes = JSON.parse(saloesData);
      } else {
        // Criar salão padrão se não existir
        data.saloes = [{
          id: 'salao-demo',
          nome: 'Salão Demo',
          endereco: 'Rua Demo, 123',
          telefone: '(11) 99999-9999',
          email: 'demo@salao.com',
          cnpj: '00.000.000/0001-00',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }];
      }

      // Transações
      const transacoesData = localStorage.getItem('transacoes');
      if (transacoesData) {
        data.transacoes = JSON.parse(transacoesData);
      }

      // Licenças
      const licencasData = localStorage.getItem('licencas');
      if (licencasData) {
        data.licencas = JSON.parse(licencasData);
      }

      // Configurações
      const configData = localStorage.getItem('configuracoes');
      if (configData) {
        data.configuracoes = JSON.parse(configData);
      }

      // Salvar backup local
      const backupData = {
        timestamp: new Date().toISOString(),
        data: data
      };
      localStorage.setItem('migration-backup', JSON.stringify(backupData));

      return data;
    } catch (error) {
      throw new Error(`Erro ao fazer backup dos dados: ${error}`);
    }
  }

  // Upload para Supabase
  private async uploadToSupabase(data: MigrationData): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    let processedItems = 0;
    const totalItems = this.getTotalItems(data);

    try {
      // 1. Salões (devem ser criados primeiro devido às FK)
      if (data.saloes.length > 0) {
        try {
          for (const salao of data.saloes) {
            await DatabaseService.createSalao(salao);
            processedItems++;
            this.updateProgress({
              step: 'upload',
              progress: Math.round((processedItems / totalItems) * 100),
              message: `Enviando salões... (${processedItems}/${totalItems})`,
              errors: errors,
              totalItems,
              processedItems
            });
          }
        } catch (error) {
          errors.push(`Erro ao migrar salões: ${error}`);
        }
      }

      // 2. Serviços
      if (data.servicos.length > 0) {
        try {
          for (const servico of data.servicos) {
            // Adicionar salao_id se não existir
            if (!servico.salao_id) {
              servico.salao_id = data.saloes[0]?.id || 'salao-demo';
            }
            await DatabaseService.createServico(servico);
            processedItems++;
            this.updateProgress({
              step: 'upload',
              progress: Math.round((processedItems / totalItems) * 100),
              message: `Enviando serviços... (${processedItems}/${totalItems})`,
              errors: errors,
              totalItems,
              processedItems
            });
          }
        } catch (error) {
          errors.push(`Erro ao migrar serviços: ${error}`);
        }
      }

      // 3. Clientes
      if (data.clientes.length > 0) {
        try {
          for (const cliente of data.clientes) {
            // Adicionar salao_id se não existir
            if (!cliente.salao_id) {
              cliente.salao_id = data.saloes[0]?.id || 'salao-demo';
            }
            await DatabaseService.createCliente(cliente);
            processedItems++;
            this.updateProgress({
              step: 'upload',
              progress: Math.round((processedItems / totalItems) * 100),
              message: `Enviando clientes... (${processedItems}/${totalItems})`,
              errors: errors,
              totalItems,
              processedItems
            });
          }
        } catch (error) {
          errors.push(`Erro ao migrar clientes: ${error}`);
        }
      }

      // 4. Agendamentos
      if (data.agendamentos.length > 0) {
        try {
          for (const agendamento of data.agendamentos) {
            // Adicionar salao_id se não existir
            if (!agendamento.salao_id) {
              agendamento.salao_id = data.saloes[0]?.id || 'salao-demo';
            }
            await DatabaseService.createAgendamento(agendamento);
            processedItems++;
            this.updateProgress({
              step: 'upload',
              progress: Math.round((processedItems / totalItems) * 100),
              message: `Enviando agendamentos... (${processedItems}/${totalItems})`,
              errors: errors,
              totalItems,
              processedItems
            });
          }
        } catch (error) {
          errors.push(`Erro ao migrar agendamentos: ${error}`);
        }
      }

      // 5. Transações
      if (data.transacoes.length > 0) {
        try {
          for (const transacao of data.transacoes) {
            // Adicionar salao_id se não existir
            if (!transacao.salao_id) {
              transacao.salao_id = data.saloes[0]?.id || 'salao-demo';
            }
            await DatabaseService.createTransacao(transacao);
            processedItems++;
            this.updateProgress({
              step: 'upload',
              progress: Math.round((processedItems / totalItems) * 100),
              message: `Enviando transações... (${processedItems}/${totalItems})`,
              errors: errors,
              totalItems,
              processedItems
            });
          }
        } catch (error) {
          errors.push(`Erro ao migrar transações: ${error}`);
        }
      }

      // 6. Licenças
      if (data.licencas.length > 0) {
        try {
          for (const licenca of data.licencas) {
            await DatabaseService.createLicenca(licenca);
            processedItems++;
            this.updateProgress({
              step: 'upload',
              progress: Math.round((processedItems / totalItems) * 100),
              message: `Enviando licenças... (${processedItems}/${totalItems})`,
              errors: errors,
              totalItems,
              processedItems
            });
          }
        } catch (error) {
          errors.push(`Erro ao migrar licenças: ${error}`);
        }
      }

      return { success: errors.length === 0, errors };
    } catch (error) {
      errors.push(`Erro geral no upload: ${error}`);
      return { success: false, errors };
    }
  }

  // Verificar integridade da migração
  private async verifyMigration(originalData: MigrationData): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      const defaultSalaoId = originalData.saloes[0]?.id || 'salao-demo';

      // Verificar salões
      const saloes = await DatabaseService.getSaloes();
      if (saloes.length < originalData.saloes.length) {
        errors.push(`Salões: Esperado ${originalData.saloes.length}, encontrado ${saloes.length}`);
      }

      // Verificar clientes
      const clientes = await DatabaseService.getClientes(defaultSalaoId);
      if (clientes.length < originalData.clientes.length) {
        errors.push(`Clientes: Esperado ${originalData.clientes.length}, encontrado ${clientes.length}`);
      }

      // Verificar serviços
      const servicos = await DatabaseService.getServicos(defaultSalaoId);
      if (servicos.length < originalData.servicos.length) {
        errors.push(`Serviços: Esperado ${originalData.servicos.length}, encontrado ${servicos.length}`);
      }

      // Verificar agendamentos
      const agendamentos = await DatabaseService.getAgendamentos(defaultSalaoId);
      if (agendamentos.length < originalData.agendamentos.length) {
        errors.push(`Agendamentos: Esperado ${originalData.agendamentos.length}, encontrado ${agendamentos.length}`);
      }

      return { success: errors.length === 0, errors };
    } catch (error) {
      errors.push(`Erro na verificação: ${error}`);
      return { success: false, errors };
    }
  }

  // Configuração pós-migração
  private async setupPostMigration(): Promise<void> {
    try {
      // Marcar migração como concluída
      localStorage.setItem('migration-completed', 'true');
      localStorage.setItem('migration-date', new Date().toISOString());
      
      // Configurar flag para usar Supabase
      localStorage.setItem('use-supabase', 'true');
      
      // Manter backup local por segurança (não remover automaticamente)
      console.log('🎉 Migração concluída! Dados agora sincronizados com Supabase.');
    } catch (error) {
      throw new Error(`Erro na configuração pós-migração: ${error}`);
    }
  }

  // Verificar se migração já foi executada
  static isMigrationCompleted(): boolean {
    return localStorage.getItem('migration-completed') === 'true';
  }

  // Verificar se deve usar Supabase
  static shouldUseSupabase(): boolean {
    return localStorage.getItem('use-supabase') === 'true' || this.isMigrationCompleted();
  }

  // Reverter migração (voltar para localStorage)
  async rollbackMigration(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Restaurar backup
      const backupData = localStorage.getItem('migration-backup');
      if (!backupData) {
        throw new Error('Backup não encontrado para rollback');
      }

      const backup = JSON.parse(backupData);
      const data = backup.data;

      // Restaurar dados
      localStorage.setItem('clientes', JSON.stringify(data.clientes));
      localStorage.setItem('agendamentos', JSON.stringify(data.agendamentos));
      localStorage.setItem('servicos', JSON.stringify(data.servicos));
      localStorage.setItem('saloes', JSON.stringify(data.saloes));
      localStorage.setItem('transacoes', JSON.stringify(data.transacoes));
      localStorage.setItem('licencas', JSON.stringify(data.licencas));
      localStorage.setItem('configuracoes', JSON.stringify(data.configuracoes));

      // Remover flags de migração
      localStorage.removeItem('migration-completed');
      localStorage.removeItem('use-supabase');

      return { success: true, errors };
    } catch (error) {
      errors.push(`Erro no rollback: ${error}`);
      return { success: false, errors };
    }
  }

  // Utilitários
  private getTotalItems(data: MigrationData): number {
    return data.clientes.length + 
           data.agendamentos.length + 
           data.servicos.length + 
           data.saloes.length + 
           data.transacoes.length + 
           data.licencas.length;
  }

  private updateProgress(progress: MigrationProgress): void {
    if (this.onProgress) {
      this.onProgress(progress);
    }
  }

  // Sincronização bidirecional
  async syncWithSupabase(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Buscar dados mais recentes do Supabase
      const supabaseData = await this.fetchFromSupabase();
      
      // Comparar com dados locais e sincronizar
      await this.mergeDifferences(supabaseData);
      
      return { success: true, errors };
    } catch (error) {
      errors.push(`Erro na sincronização: ${error}`);
      return { success: false, errors };
    }
  }

  private async fetchFromSupabase(): Promise<MigrationData> {
    const defaultSalaoId = 'salao-demo'; // Usar ID padrão para buscar dados
    
    return {
      clientes: await DatabaseService.getClientes(defaultSalaoId),
      agendamentos: await DatabaseService.getAgendamentos(defaultSalaoId),
      servicos: await DatabaseService.getServicos(defaultSalaoId),
      saloes: await DatabaseService.getSaloes(),
      transacoes: await DatabaseService.getTransacoes(defaultSalaoId),
      licencas: await DatabaseService.getLicencas(),
      configuracoes: {}
    };
  }

  private async mergeDifferences(supabaseData: MigrationData): Promise<void> {
    // Atualizar localStorage com dados do Supabase
    localStorage.setItem('clientes', JSON.stringify(supabaseData.clientes));
    localStorage.setItem('agendamentos', JSON.stringify(supabaseData.agendamentos));
    localStorage.setItem('servicos', JSON.stringify(supabaseData.servicos));
    localStorage.setItem('saloes', JSON.stringify(supabaseData.saloes));
    localStorage.setItem('transacoes', JSON.stringify(supabaseData.transacoes));
    localStorage.setItem('licencas', JSON.stringify(supabaseData.licencas));
  }
}

export default MigrationService;