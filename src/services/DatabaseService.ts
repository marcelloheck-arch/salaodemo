import { supabase, Database } from '@/lib/supabase';

// Tipos de dados
type SalaoInsert = Database['public']['Tables']['saloes']['Insert'];
type SalaoUpdate = Database['public']['Tables']['saloes']['Update'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];
type ServicoInsert = Database['public']['Tables']['servicos']['Insert'];
type ServicoUpdate = Database['public']['Tables']['servicos']['Update'];
type AgendamentoInsert = Database['public']['Tables']['agendamentos']['Insert'];
type AgendamentoUpdate = Database['public']['Tables']['agendamentos']['Update'];
type TransacaoInsert = Database['public']['Tables']['transacoes']['Insert'];
type LicencaInsert = Database['public']['Tables']['licencas']['Insert'];

export class DatabaseService {
  // ============================================================================
  // SALÕES
  // ============================================================================
  
  static async getSaloes() {
    const { data, error } = await supabase
      .from('saloes')
      .select('*')
      .eq('status', 'ativo')
      .order('nome');
    
    if (error) throw error;
    return data;
  }

  static async getSalaoById(id: string) {
    const { data, error } = await supabase
      .from('saloes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getSalaoByEmail(email: string) {
    const { data, error } = await supabase
      .from('saloes')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data;
  }

  static async createSalao(salao: SalaoInsert) {
    const { data, error } = await supabase
      .from('saloes')
      .insert(salao)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateSalao(id: string, updates: SalaoUpdate) {
    const { data, error } = await supabase
      .from('saloes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ============================================================================
  // CLIENTES
  // ============================================================================
  
  static async getClientes(salaoId: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('salao_id', salaoId)
      .eq('status', 'ativo')
      .order('nome');
    
    if (error) throw error;
    return data;
  }

  static async getClienteById(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createCliente(cliente: ClienteInsert) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateCliente(id: string, updates: ClienteUpdate) {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteCliente(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .update({ status: 'inativo' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ============================================================================
  // SERVIÇOS
  // ============================================================================
  
  static async getServicos(salaoId: string) {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('salao_id', salaoId)
      .eq('status', 'ativo')
      .order('nome');
    
    if (error) throw error;
    return data;
  }

  static async createServico(servico: ServicoInsert) {
    const { data, error } = await supabase
      .from('servicos')
      .insert(servico)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateServico(id: string, updates: ServicoUpdate) {
    const { data, error } = await supabase
      .from('servicos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteServico(id: string) {
    const { data, error } = await supabase
      .from('servicos')
      .update({ status: 'inativo' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ============================================================================
  // AGENDAMENTOS
  // ============================================================================
  
  static async getAgendamentos(salaoId: string, dataInicio?: string, dataFim?: string) {
    let query = supabase
      .from('agendamentos')
      .select(`
        *,
        cliente:clientes(nome, telefone),
        servico:servicos(nome, preco, duracao)
      `)
      .eq('salao_id', salaoId)
      .order('data_agendamento', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (dataInicio) {
      query = query.gte('data_agendamento', dataInicio);
    }
    if (dataFim) {
      query = query.lte('data_agendamento', dataFim);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  static async createAgendamento(agendamento: AgendamentoInsert) {
    const { data, error } = await supabase
      .from('agendamentos')
      .insert(agendamento)
      .select(`
        *,
        cliente:clientes(nome, telefone),
        servico:servicos(nome, preco, duracao)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateAgendamento(id: string, updates: AgendamentoUpdate) {
    const { data, error } = await supabase
      .from('agendamentos')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        cliente:clientes(nome, telefone),
        servico:servicos(nome, preco, duracao)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteAgendamento(id: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }

  // ============================================================================
  // TRANSAÇÕES FINANCEIRAS
  // ============================================================================
  
  static async getTransacoes(salaoId: string, mes?: string) {
    let query = supabase
      .from('transacoes')
      .select('*')
      .eq('salao_id', salaoId)
      .order('data_transacao', { ascending: false });

    if (mes) {
      const startDate = `${mes}-01`;
      const endDate = `${mes}-31`;
      query = query.gte('data_transacao', startDate).lte('data_transacao', endDate);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  static async createTransacao(transacao: TransacaoInsert) {
    const { data, error } = await supabase
      .from('transacoes')
      .insert(transacao)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTransacao(id: string, updates: Partial<TransacaoInsert>) {
    const { data, error } = await supabase
      .from('transacoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTransacao(id: string) {
    const { data, error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }

  // ============================================================================
  // LICENÇAS
  // ============================================================================
  
  static async getLicencas() {
    const { data, error } = await supabase
      .from('licencas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getLicencaByChave(chaveAtivacao: string) {
    const { data, error } = await supabase
      .from('licencas')
      .select('*')
      .eq('chave_ativacao', chaveAtivacao)
      .single();
    
    if (error) return null;
    return data;
  }

  static async createLicenca(licenca: LicencaInsert) {
    const { data, error } = await supabase
      .from('licencas')
      .insert(licenca)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async ativarLicenca(chaveAtivacao: string, salaoId: string) {
    const { data, error } = await supabase
      .from('licencas')
      .update({ 
        salao_id: salaoId,
        status: 'ativa',
        data_ativacao: new Date().toISOString()
      })
      .eq('chave_ativacao', chaveAtivacao)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ============================================================================
  // REGISTROS DE USUÁRIO
  // ============================================================================
  
  static async getRegistrosUsuario() {
    const { data, error } = await supabase
      .from('registros_usuario')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createRegistroUsuario(registro: any) {
    const { data, error } = await supabase
      .from('registros_usuario')
      .insert(registro)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateRegistroUsuario(id: string, updates: any) {
    const { data, error } = await supabase
      .from('registros_usuario')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ============================================================================
  // RELATÓRIOS E ESTATÍSTICAS
  // ============================================================================
  
  static async getEstatisticasSalao(salaoId: string) {
    // Buscar dados em paralelo
    const [clientes, agendamentos, transacoes, servicos] = await Promise.all([
      this.getClientes(salaoId),
      this.getAgendamentos(salaoId),
      this.getTransacoes(salaoId),
      this.getServicos(salaoId)
    ]);

    // Calcular estatísticas
    const totalClientes = clientes?.length || 0;
    const totalServicos = servicos?.length || 0;
    const agendamentosHoje = agendamentos?.filter(a => 
      a.data_agendamento === new Date().toISOString().split('T')[0]
    ).length || 0;

    const receitaMes = transacoes?.filter(t => 
      t.tipo === 'receita' && 
      t.data_transacao.startsWith(new Date().toISOString().slice(0, 7))
    ).reduce((sum, t) => sum + Number(t.valor), 0) || 0;

    return {
      totalClientes,
      totalServicos,
      agendamentosHoje,
      receitaMes,
      agendamentos: agendamentos?.length || 0,
      transacoes: transacoes?.length || 0
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  static async testConnection() {
    try {
      const { data, error } = await supabase.from('saloes').select('count').limit(1);
      if (error) throw error;
      return { success: true, message: 'Conexão com banco estabelecida' };
    } catch (error: any) {
      return { success: false, message: `Erro: ${error.message}` };
    }
  }
}

export default DatabaseService;