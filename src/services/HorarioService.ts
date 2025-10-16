import DatabaseService from './DatabaseService';
import { addMinutes, format, parse, isBefore, isAfter, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interfaces
interface HorarioDisponivel {
  hora: string;
  disponivel: boolean;
  agendamento?: any;
  profissional?: string;
}

interface ConfiguracaoFuncionamento {
  salao_id: string;
  dias_funcionamento: number[]; // 0=domingo, 1=segunda, etc
  horario_abertura: string;
  horario_fechamento: string;
  intervalo_almoco_inicio?: string;
  intervalo_almoco_fim?: string;
  intervalo_atendimento: number; // em minutos
  antecedencia_minima: number; // em horas
  limite_agendamento: number; // dias no futuro
  ultimo_horario_agendamento: string;
}

interface Profissional {
  id: string;
  nome: string;
  especialidades: string[];
  horario_funcionamento?: {
    dias: number[];
    inicio: string;
    fim: string;
  };
}

export class HorarioService {
  // Configuração padrão
  private static configPadrao: ConfiguracaoFuncionamento = {
    salao_id: '',
    dias_funcionamento: [1, 2, 3, 4, 5, 6], // Segunda a sábado
    horario_abertura: '08:00',
    horario_fechamento: '18:00',
    intervalo_almoco_inicio: '12:00',
    intervalo_almoco_fim: '13:00',
    intervalo_atendimento: 30, // 30 minutos
    antecedencia_minima: 2, // 2 horas
    limite_agendamento: 30, // 30 dias
    ultimo_horario_agendamento: '17:00'
  };

  // ============================================================================
  // HORÁRIOS DISPONÍVEIS - PRINCIPAL
  // ============================================================================
  
  static async getHorariosDisponiveis(
    salaoId: string, 
    data: string, 
    servicoId: string,
    profissionalId?: string
  ): Promise<HorarioDisponivel[]> {
    try {
      // 1. Buscar configurações do salão
      const config = await this.getConfiguracaoSalao(salaoId);
      
      // 2. Validar se o dia funciona
      const dataObj = new Date(data + 'T00:00:00');
      const diaSemana = dataObj.getDay();
      
      if (!config.dias_funcionamento.includes(diaSemana)) {
        return []; // Salão fechado neste dia
      }
      
      // 3. Buscar serviço para obter duração
      const servico = await DatabaseService.getServicos(salaoId);
      const servicoSelecionado = servico.find(s => s.id === servicoId);
      
      if (!servicoSelecionado) {
        throw new Error('Serviço não encontrado');
      }
      
      // 4. Buscar agendamentos do dia
      const agendamentos = await DatabaseService.getAgendamentos(salaoId, data, data);
      
      // 5. Gerar grade de horários
      const gradeHorarios = this.gerarGradeHorarios(config, data);
      
      // 6. Verificar disponibilidade
      const horariosDisponiveis = this.verificarDisponibilidade(
        gradeHorarios,
        agendamentos,
        servicoSelecionado.duracao,
        config,
        profissionalId
      );
      
      return horariosDisponiveis;
      
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  }

  // ============================================================================
  // GERAR GRADE DE HORÁRIOS
  // ============================================================================
  
  private static gerarGradeHorarios(
    config: ConfiguracaoFuncionamento, 
    data: string
  ): string[] {
    const horarios: string[] = [];
    const dataAtual = new Date();
    const dataAgendamento = new Date(data + 'T00:00:00');
    
    // Horário inicial
    let horaAtual = parse(config.horario_abertura, 'HH:mm', dataAgendamento);
    const horaFechamento = parse(config.horario_fechamento, 'HH:mm', dataAgendamento);
    const ultimoHorario = parse(config.ultimo_horario_agendamento, 'HH:mm', dataAgendamento);
    
    // Se for hoje, considerar antecedência mínima
    if (isSameDay(dataAgendamento, dataAtual)) {
      const horaMinima = addMinutes(dataAtual, config.antecedencia_minima * 60);
      if (isAfter(horaMinima, horaAtual)) {
        horaAtual = horaMinima;
        // Arredondar para próximo intervalo
        const minutos = horaAtual.getMinutes();
        const proximoIntervalo = Math.ceil(minutos / config.intervalo_atendimento) * config.intervalo_atendimento;
        horaAtual.setMinutes(proximoIntervalo);
        horaAtual.setSeconds(0);
      }
    }
    
    // Gerar horários
    while (isBefore(horaAtual, ultimoHorario) && isBefore(horaAtual, horaFechamento)) {
      const horaString = format(horaAtual, 'HH:mm');
      
      // Verificar se não está no intervalo do almoço
      if (config.intervalo_almoco_inicio && config.intervalo_almoco_fim) {
        const inicioAlmoco = parse(config.intervalo_almoco_inicio, 'HH:mm', dataAgendamento);
        const fimAlmoco = parse(config.intervalo_almoco_fim, 'HH:mm', dataAgendamento);
        
        if (!(isAfter(horaAtual, inicioAlmoco) && isBefore(horaAtual, fimAlmoco))) {
          horarios.push(horaString);
        }
      } else {
        horarios.push(horaString);
      }
      
      // Próximo horário
      horaAtual = addMinutes(horaAtual, config.intervalo_atendimento);
    }
    
    return horarios;
  }

  // ============================================================================
  // VERIFICAR DISPONIBILIDADE
  // ============================================================================
  
  private static verificarDisponibilidade(
    gradeHorarios: string[],
    agendamentos: any[],
    duracaoServico: number,
    config: ConfiguracaoFuncionamento,
    profissionalId?: string
  ): HorarioDisponivel[] {
    return gradeHorarios.map(hora => {
      const disponivel = this.isHorarioDisponivel(
        hora,
        agendamentos,
        duracaoServico,
        profissionalId
      );
      
      const agendamentoConflito = agendamentos.find(ag => 
        this.hasConflito(hora, duracaoServico, ag.hora_inicio, ag.hora_fim)
      );
      
      return {
        hora,
        disponivel,
        agendamento: agendamentoConflito,
        profissional: agendamentoConflito?.profissional_id
      };
    });
  }

  private static isHorarioDisponivel(
    horaInicio: string,
    agendamentos: any[],
    duracaoServico: number,
    profissionalId?: string
  ): boolean {
    // Calcular hora de fim do novo agendamento
    const inicio = parse(horaInicio, 'HH:mm', new Date());
    const fim = addMinutes(inicio, duracaoServico);
    const horaFim = format(fim, 'HH:mm');
    
    // Verificar conflitos
    for (const agendamento of agendamentos) {
      // Se especificou profissional, só verificar agendamentos dele
      if (profissionalId && agendamento.profissional_id !== profissionalId) {
        continue;
      }
      
      // Verificar sobreposição
      if (this.hasConflito(horaInicio, duracaoServico, agendamento.hora_inicio, agendamento.hora_fim)) {
        return false;
      }
    }
    
    return true;
  }

  private static hasConflito(
    novoInicio: string,
    novaDuracao: number,
    agendamentoInicio: string,
    agendamentoFim: string
  ): boolean {
    const inicio1 = parse(novoInicio, 'HH:mm', new Date());
    const fim1 = addMinutes(inicio1, novaDuracao);
    
    const inicio2 = parse(agendamentoInicio, 'HH:mm', new Date());
    const fim2 = parse(agendamentoFim, 'HH:mm', new Date());
    
    // Verificar sobreposição
    return (isBefore(inicio1, fim2) && isAfter(fim1, inicio2));
  }

  // ============================================================================
  // CONFIGURAÇÕES DO SALÃO
  // ============================================================================
  
  static async getConfiguracaoSalao(salaoId: string): Promise<ConfiguracaoFuncionamento> {
    try {
      // Por enquanto, retornar configuração padrão
      // TODO: Implementar tabela de configurações no banco
      return {
        ...this.configPadrao,
        salao_id: salaoId
      };
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      return {
        ...this.configPadrao,
        salao_id: salaoId
      };
    }
  }

  static async salvarConfiguracaoSalao(
    salaoId: string, 
    config: Partial<ConfiguracaoFuncionamento>
  ): Promise<boolean> {
    try {
      // TODO: Implementar salvamento no banco
      console.log('Salvando configuração:', { salaoId, config });
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  }

  // ============================================================================
  // VALIDAÇÕES AVANÇADAS
  // ============================================================================
  
  static validarAgendamento(
    salaoId: string,
    data: string,
    hora: string,
    servicoId: string,
    profissionalId?: string
  ): { valido: boolean; erro?: string } {
    const dataAgendamento = new Date(data + 'T' + hora + ':00');
    const agora = new Date();
    
    // 1. Verificar se não é no passado
    if (isBefore(dataAgendamento, agora)) {
      return { valido: false, erro: 'Não é possível agendar no passado' };
    }
    
    // 2. Verificar antecedência mínima (2 horas padrão)
    const minimoAntecedencia = addMinutes(agora, 2 * 60);
    if (isBefore(dataAgendamento, minimoAntecedencia)) {
      return { valido: false, erro: 'Antecedência mínima de 2 horas' };
    }
    
    // 3. Verificar limite futuro (30 dias padrão)
    const maximoFuturo = addMinutes(agora, 30 * 24 * 60);
    if (isAfter(dataAgendamento, maximoFuturo)) {
      return { valido: false, erro: 'Agendamento muito distante (máximo 30 dias)' };
    }
    
    // 4. Verificar dia da semana
    const diaSemana = dataAgendamento.getDay();
    const diasFuncionamento = [1, 2, 3, 4, 5, 6]; // Segunda a sábado
    if (!diasFuncionamento.includes(diaSemana)) {
      return { valido: false, erro: 'Salão fechado neste dia' };
    }
    
    return { valido: true };
  }

  // ============================================================================
  // SUGESTÕES INTELIGENTES
  // ============================================================================
  
  static async sugerirHorarios(
    salaoId: string,
    servicoId: string,
    dataPreferida?: string,
    profissionalId?: string
  ): Promise<{ data: string; horarios: string[] }[]> {
    const sugestoes: { data: string; horarios: string[] }[] = [];
    const dataInicio = dataPreferida ? new Date(dataPreferida) : new Date();
    
    // Buscar por 7 dias
    for (let i = 0; i < 7; i++) {
      const data = new Date(dataInicio);
      data.setDate(data.getDate() + i);
      const dataString = format(data, 'yyyy-MM-dd');
      
      const horarios = await this.getHorariosDisponiveis(
        salaoId, 
        dataString, 
        servicoId, 
        profissionalId
      );
      
      const horariosLivres = horarios
        .filter(h => h.disponivel)
        .map(h => h.hora)
        .slice(0, 5); // Máximo 5 horários por dia
      
      if (horariosLivres.length > 0) {
        sugestoes.push({
          data: dataString,
          horarios: horariosLivres
        });
      }
    }
    
    return sugestoes;
  }

  // ============================================================================
  // UTILITÁRIOS
  // ============================================================================
  
  static formatarHorario(hora: string): string {
    return hora;
  }
  
  static formatarData(data: string): string {
    const dataObj = new Date(data + 'T00:00:00');
    return format(dataObj, "dd 'de' MMMM", { locale: ptBR });
  }
  
  static getDiaDaSemana(data: string): string {
    const dataObj = new Date(data + 'T00:00:00');
    return format(dataObj, 'EEEE', { locale: ptBR });
  }

  // ============================================================================
  // RELATÓRIOS
  // ============================================================================
  
  static async getOcupacaoDia(salaoId: string, data: string): Promise<{
    total_horarios: number;
    horarios_ocupados: number;
    taxa_ocupacao: number;
    horarios_livres: string[];
  }> {
    const config = await this.getConfiguracaoSalao(salaoId);
    const gradeHorarios = this.gerarGradeHorarios(config, data);
    const agendamentos = await DatabaseService.getAgendamentos(salaoId, data, data);
    
    const horariosOcupados = agendamentos.length;
    const totalHorarios = gradeHorarios.length;
    const taxaOcupacao = totalHorarios > 0 ? (horariosOcupados / totalHorarios) * 100 : 0;
    
    const horariosDisponiveis = await this.getHorariosDisponiveis(salaoId, data, 'any');
    const horariosLivres = horariosDisponiveis
      .filter(h => h.disponivel)
      .map(h => h.hora);
    
    return {
      total_horarios: totalHorarios,
      horarios_ocupados: horariosOcupados,
      taxa_ocupacao: Math.round(taxaOcupacao),
      horarios_livres: horariosLivres
    };
  }
}

export default HorarioService;