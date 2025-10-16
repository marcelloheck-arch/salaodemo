// services/WhatsAppService.ts
// Integração com Evolution API para WhatsApp Business

export interface WhatsAppMessage {
  to: string;
  message: string;
  type: 'text' | 'template' | 'media';
  scheduledFor?: Date;
}

export interface WhatsAppTemplate {
  name: string;
  components: {
    type: 'header' | 'body' | 'footer';
    text: string;
    variables?: string[];
  }[];
}

export interface AgendamentoNotification {
  clienteNome: string;
  clienteTelefone: string;
  servicoNome: string;
  profissionalNome: string;
  dataHora: string;
  salaoNome: string;
  salaoEndereco?: string;
  observacoes?: string;
}

class WhatsAppService {
  private apiUrl: string;
  private apiKey: string;
  private instanceName: string;
  
  constructor() {
    // Configurações da Evolution API
    this.apiUrl = process.env.NEXT_PUBLIC_EVOLUTION_API_URL || 'https://evolution-api.com';
    this.apiKey = process.env.NEXT_PUBLIC_EVOLUTION_API_KEY || '';
    this.instanceName = process.env.NEXT_PUBLIC_EVOLUTION_INSTANCE || 'agendamento-salao';
  }

  private async makeRequest(endpoint: string, data: any, method: 'GET' | 'POST' = 'POST') {
    try {
      const response = await fetch(`${this.apiUrl}/${this.instanceName}/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
        },
        body: method === 'POST' ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição WhatsApp:', error);
      throw error;
    }
  }

  // Verificar status da instância
  async verificarStatus(): Promise<{ connected: boolean; qrCode?: string }> {
    try {
      const response = await this.makeRequest('connect', {}, 'GET');
      return {
        connected: response.instance?.state === 'open',
        qrCode: response.qrcode?.base64
      };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return { connected: false };
    }
  }

  // Enviar mensagem simples
  async enviarMensagem(telefone: string, mensagem: string): Promise<boolean> {
    try {
      const numeroFormatado = this.formatarNumero(telefone);
      
      await this.makeRequest('message/sendText', {
        number: numeroFormatado,
        text: mensagem
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  }

  // Confirmar agendamento
  async confirmarAgendamento(dadosAgendamento: AgendamentoNotification): Promise<boolean> {
    const mensagem = this.montarMensagemConfirmacao(dadosAgendamento);
    return await this.enviarMensagem(dadosAgendamento.clienteTelefone, mensagem);
  }

  // Lembrete de agendamento (24h antes)
  async enviarLembrete(dadosAgendamento: AgendamentoNotification): Promise<boolean> {
    const mensagem = this.montarMensagemLembrete(dadosAgendamento);
    return await this.enviarMensagem(dadosAgendamento.clienteTelefone, mensagem);
  }

  // Reagendamento
  async notificarReagendamento(dadosAgendamento: AgendamentoNotification, novaDataHora: string): Promise<boolean> {
    const mensagem = this.montarMensagemReagendamento(dadosAgendamento, novaDataHora);
    return await this.enviarMensagem(dadosAgendamento.clienteTelefone, mensagem);
  }

  // Cancelamento
  async notificarCancelamento(dadosAgendamento: AgendamentoNotification, motivo?: string): Promise<boolean> {
    const mensagem = this.montarMensagemCancelamento(dadosAgendamento, motivo);
    return await this.enviarMensagem(dadosAgendamento.clienteTelefone, mensagem);
  }

  // Consultar horários disponíveis via WhatsApp
  async enviarHorariosDisponiveis(telefone: string, horarios: string[], data: string): Promise<boolean> {
    const mensagem = this.montarMensagemHorarios(horarios, data);
    return await this.enviarMensagem(telefone, mensagem);
  }

  // Formatar número de telefone
  private formatarNumero(telefone: string): string {
    // Remove todos os caracteres não numéricos
    let numero = telefone.replace(/\D/g, '');
    
    // Adiciona código do país se não existir (Brasil = 55)
    if (!numero.startsWith('55') && numero.length === 11) {
      numero = '55' + numero;
    }
    
    return numero + '@s.whatsapp.net';
  }

  // Montar mensagens
  private montarMensagemConfirmacao(dados: AgendamentoNotification): string {
    return `✅ *Agendamento Confirmado!*

Olá ${dados.clienteNome}! 👋

Seu agendamento foi confirmado com sucesso:

📅 *Data:* ${dados.dataHora}
💇 *Serviço:* ${dados.servicoNome}
👨‍💼 *Profissional:* ${dados.profissionalNome}
🏪 *Local:* ${dados.salaoNome}
${dados.salaoEndereco ? `📍 *Endereço:* ${dados.salaoEndereco}` : ''}

${dados.observacoes ? `📝 *Observações:* ${dados.observacoes}` : ''}

⏰ *Importante:* Chegue com 10 minutos de antecedência.

Para reagendar ou cancelar, entre em contato conosco.

Obrigado por escolher nossos serviços! ✨`;
  }

  private montarMensagemLembrete(dados: AgendamentoNotification): string {
    return `⏰ *Lembrete de Agendamento*

Olá ${dados.clienteNome}! 👋

Lembre-se que você tem agendamento amanhã:

📅 *Data:* ${dados.dataHora}
💇 *Serviço:* ${dados.servicoNome}
👨‍💼 *Profissional:* ${dados.profissionalNome}
🏪 *Local:* ${dados.salaoNome}

⏰ *Chegue com 10 minutos de antecedência.*

Se precisar reagendar ou cancelar, entre em contato conosco o mais rápido possível.

Aguardamos você! ✨`;
  }

  private montarMensagemReagendamento(dados: AgendamentoNotification, novaDataHora: string): string {
    return `📅 *Agendamento Reagendado*

Olá ${dados.clienteNome}! 👋

Seu agendamento foi reagendado:

❌ *Data anterior:* ${dados.dataHora}
✅ *Nova data:* ${novaDataHora}

💇 *Serviço:* ${dados.servicoNome}
👨‍💼 *Profissional:* ${dados.profissionalNome}
🏪 *Local:* ${dados.salaoNome}

⏰ *Chegue com 10 minutos de antecedência.*

Obrigado pela compreensão! ✨`;
  }

  private montarMensagemCancelamento(dados: AgendamentoNotification, motivo?: string): string {
    return `❌ *Agendamento Cancelado*

Olá ${dados.clienteNome}! 👋

Seu agendamento foi cancelado:

📅 *Data:* ${dados.dataHora}
💇 *Serviço:* ${dados.servicoNome}
👨‍💼 *Profissional:* ${dados.profissionalNome}

${motivo ? `📝 *Motivo:* ${motivo}` : ''}

Para reagendar, entre em contato conosco.

Obrigado pela compreensão! ✨`;
  }

  private montarMensagemHorarios(horarios: string[], data: string): string {
    const horariosFormatados = horarios.map(h => `• ${h}`).join('\n');
    
    return `⏰ *Horários Disponíveis*

📅 *Data:* ${data}

Horários disponíveis:
${horariosFormatados}

Para agendar, escolha um dos horários disponíveis e nos informe:
1. Horário desejado
2. Serviço desejado
3. Seu nome completo

Aguardamos seu retorno! ✨`;
  }

  // Agendar mensagem para envio posterior
  async agendarMensagem(telefone: string, mensagem: string, dataEnvio: Date): Promise<boolean> {
    try {
      // Evolution API suporta agendamento nativo ou usando setTimeout para agendamentos locais
      const agora = new Date();
      const tempoEspera = dataEnvio.getTime() - agora.getTime();

      if (tempoEspera > 0) {
        setTimeout(async () => {
          await this.enviarMensagem(telefone, mensagem);
        }, tempoEspera);
        return true;
      } else {
        // Se a data já passou, envia imediatamente
        return await this.enviarMensagem(telefone, mensagem);
      }
    } catch (error) {
      console.error('Erro ao agendar mensagem:', error);
      return false;
    }
  }

  // Configurar webhook para receber mensagens
  async configurarWebhook(webhookUrl: string): Promise<boolean> {
    try {
      await this.makeRequest('webhook', {
        url: webhookUrl,
        events: ['messages.upsert', 'messages.update']
      });
      return true;
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      return false;
    }
  }

  // Processar mensagem recebida (para bot de agendamentos)
  async processarMensagemRecebida(mensagem: any): Promise<void> {
    try {
      const texto = mensagem.message?.conversation?.toLowerCase() || '';
      const remetente = mensagem.key?.remoteJid;

      // Comandos básicos do bot
      if (texto.includes('horarios') || texto.includes('horários')) {
        await this.enviarMensagem(remetente, 
          '⏰ Para consultar horários disponíveis, me informe a data desejada no formato DD/MM/AAAA'
        );
      } else if (texto.includes('agendar')) {
        await this.enviarMensagem(remetente,
          '📅 Para agendar, preciso das seguintes informações:\n1. Data desejada\n2. Horário\n3. Serviço\n4. Seu nome completo'
        );
      } else if (texto.includes('cancelar')) {
        await this.enviarMensagem(remetente,
          '❌ Para cancelar um agendamento, me informe a data e horário do seu agendamento.'
        );
      } else if (texto.includes('menu') || texto.includes('ajuda')) {
        await this.enviarMenuPrincipal(remetente);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  }

  private async enviarMenuPrincipal(telefone: string): Promise<void> {
    const menu = `🏪 *Menu Principal - Agendamento Salão*

Comandos disponíveis:

📅 *agendar* - Fazer novo agendamento
⏰ *horarios* - Consultar horários disponíveis  
❌ *cancelar* - Cancelar agendamento
📞 *contato* - Falar com atendente
📍 *endereco* - Ver localização
💰 *precos* - Consultar preços

Digite o comando desejado para continuar! ✨`;

    await this.enviarMensagem(telefone, menu);
  }
}

export default new WhatsAppService();