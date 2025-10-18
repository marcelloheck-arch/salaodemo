import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com fallbacks para build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Verificação mais suave para permitir builds sem configuração
const isProduction = process.env.NODE_ENV === 'production';
const hasRealConfig = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

// Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      saloes: {
        Row: {
          id: string;
          nome: string;
          email: string;
          telefone?: string;
          endereco?: string;
          created_at: string;
          updated_at: string;
          status: 'ativo' | 'inativo';
          licenca_id?: string;
        };
        Insert: Omit<Database['public']['Tables']['saloes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['saloes']['Insert']>;
      };
      clientes: {
        Row: {
          id: string;
          salao_id: string;
          nome: string;
          email?: string;
          telefone: string;
          data_nascimento?: string;
          endereco?: string;
          observacoes?: string;
          created_at: string;
          updated_at: string;
          status: 'ativo' | 'inativo';
        };
        Insert: Omit<Database['public']['Tables']['clientes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>;
      };
      servicos: {
        Row: {
          id: string;
          salao_id: string;
          nome: string;
          descricao?: string;
          preco: number;
          duracao: number; // em minutos
          categoria?: string;
          created_at: string;
          updated_at: string;
          status: 'ativo' | 'inativo';
        };
        Insert: Omit<Database['public']['Tables']['servicos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['servicos']['Insert']>;
      };
      agendamentos: {
        Row: {
          id: string;
          salao_id: string;
          cliente_id: string;
          servico_id: string;
          data_agendamento: string;
          hora_inicio: string;
          hora_fim: string;
          valor_total: number;
          status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
          observacoes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['agendamentos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['agendamentos']['Insert']>;
      };
      licencas: {
        Row: {
          id: string;
          chave_ativacao: string;
          plano_id: string;
          status: 'ativa' | 'suspensa' | 'cancelada' | 'expirada';
          data_ativacao: string;
          data_vencimento: string;
          salao_id?: string;
          recursos_ativos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['licencas']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['licencas']['Insert']>;
      };
      transacoes: {
        Row: {
          id: string;
          salao_id: string;
          agendamento_id?: string;
          tipo: 'receita' | 'despesa';
          categoria: string;
          descricao: string;
          valor: number;
          data_transacao: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transacoes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transacoes']['Insert']>;
      };
    };
  };
}

// Helper para verificar se está conectado
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('saloes').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Conexão com Supabase estabelecida' };
  } catch (error) {
    return { success: false, message: `Erro de conexão: ${error}` };
  }
}