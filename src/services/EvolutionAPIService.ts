/**
 * Evolution API - Serviço de Integração WhatsApp
 * Documentação: https://doc.evolution-api.com/
 */

import axios from 'axios';

// Configurações - Altere conforme sua instalação
const EVOLUTION_API_URL = process.env.NEXT_PUBLIC_EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.NEXT_PUBLIC_EVOLUTION_API_KEY || 'sua_chave_api_aqui';
const INSTANCE_NAME = 'agendamento-salao'; // Nome da sua instância

// Cliente axios configurado
const api = axios.create({
  baseURL: EVOLUTION_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': EVOLUTION_API_KEY
  }
});

export interface WhatsAppStatus {
  connected: boolean;
  qrCode?: string;
  phoneNumber?: string;
  profilePicUrl?: string;
  profileName?: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EvolutionAPIService {
  /**
   * Criar ou conectar instância
   */
  async criarInstancia(): Promise<{ qrCode?: string; error?: string }> {
    try {
      // Verificar se instância já existe
      const statusResponse = await api.get(`/instance/connectionState/${INSTANCE_NAME}`);
      
      if (statusResponse.data.state === 'open') {
        return { qrCode: undefined }; // Já conectado
      }

      // Criar nova instância
      const response = await api.post('/instance/create', {
        instanceName: INSTANCE_NAME,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      });

      // Buscar QR Code
      const qrResponse = await api.get(`/instance/connect/${INSTANCE_NAME}`);
      
      return {
        qrCode: qrResponse.data.base64 || qrResponse.data.code
      };
    } catch (error: any) {
      console.error('Erro ao criar instância:', error);
      return {
        error: error.response?.data?.message || 'Erro ao conectar WhatsApp'
      };
    }
  }

  /**
   * Verificar status da conexão
   */
  async verificarStatus(): Promise<WhatsAppStatus> {
    try {
      const response = await api.get(`/instance/connectionState/${INSTANCE_NAME}`);
      const data = response.data;

      return {
        connected: data.state === 'open',
        phoneNumber: data.instance?.owner || undefined,
        profileName: data.instance?.profileName || undefined,
        profilePicUrl: data.instance?.profilePicUrl || undefined
      };
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      
      // Se instância não existe, retornar desconectado
      if (error.response?.status === 404) {
        return { connected: false };
      }

      return { connected: false };
    }
  }

  /**
   * Desconectar instância
   */
  async desconectar(): Promise<boolean> {
    try {
      await api.delete(`/instance/logout/${INSTANCE_NAME}`);
      return true;
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      return false;
    }
  }

  /**
   * Enviar mensagem de texto
   */
  async enviarMensagem(
    numeroDestino: string,
    mensagem: string
  ): Promise<SendMessageResponse> {
    try {
      // Formatar número (remover caracteres especiais, adicionar código do país)
      const numeroFormatado = this.formatarNumero(numeroDestino);

      const response = await api.post(`/message/sendText/${INSTANCE_NAME}`, {
        number: numeroFormatado,
        text: mensagem
      });

      return {
        success: true,
        messageId: response.data.key?.id
      };
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao enviar mensagem'
      };
    }
  }

  /**
   * Enviar mensagem com mídia
   */
  async enviarMensagemComMidia(
    numeroDestino: string,
    mensagem: string,
    mediaUrl: string,
    mediaType: 'image' | 'document' | 'video' | 'audio' = 'image'
  ): Promise<SendMessageResponse> {
    try {
      const numeroFormatado = this.formatarNumero(numeroDestino);

      const response = await api.post(`/message/sendMedia/${INSTANCE_NAME}`, {
        number: numeroFormatado,
        mediatype: mediaType,
        media: mediaUrl,
        caption: mensagem
      });

      return {
        success: true,
        messageId: response.data.key?.id
      };
    } catch (error: any) {
      console.error('Erro ao enviar mídia:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao enviar mídia'
      };
    }
  }

  /**
   * Enviar lembrete de agendamento
   */
  async enviarLembreteAgendamento(
    numeroCliente: string,
    nomeCliente: string,
    dataAgendamento: string,
    horaAgendamento: string,
    nomeServico: string,
    nomeProfissional: string
  ): Promise<SendMessageResponse> {
    const mensagem = `
🎉 *Lembrete de Agendamento*

Olá ${nomeCliente}! 👋

Você tem um agendamento marcado:

📅 *Data:* ${dataAgendamento}
⏰ *Horário:* ${horaAgendamento}
💇 *Serviço:* ${nomeServico}
👤 *Profissional:* ${nomeProfissional}

📍 Nos vemos em breve!

_Para confirmar ou cancelar, responda esta mensagem._
    `.trim();

    return this.enviarMensagem(numeroCliente, mensagem);
  }

  /**
   * Enviar confirmação de agendamento
   */
  async enviarConfirmacaoAgendamento(
    numeroCliente: string,
    nomeCliente: string,
    dataAgendamento: string,
    horaAgendamento: string,
    nomeServico: string
  ): Promise<SendMessageResponse> {
    const mensagem = `
✅ *Agendamento Confirmado!*

Olá ${nomeCliente}! 

Seu agendamento foi confirmado com sucesso! 🎊

📅 *Data:* ${dataAgendamento}
⏰ *Horário:* ${horaAgendamento}
💇 *Serviço:* ${nomeServico}

Aguardamos você! 💚

_Em caso de dúvidas, responda esta mensagem._
    `.trim();

    return this.enviarMensagem(numeroCliente, mensagem);
  }

  /**
   * Formatar número de telefone
   * Formato esperado: 5511999999999 (DDI + DDD + Número)
   */
  private formatarNumero(numero: string): string {
    // Remove caracteres não numéricos
    let numeroLimpo = numero.replace(/\D/g, '');

    // Se não tem código do país, adiciona 55 (Brasil)
    if (!numeroLimpo.startsWith('55')) {
      numeroLimpo = '55' + numeroLimpo;
    }

    // Adiciona @ no final (formato WhatsApp)
    return numeroLimpo + '@s.whatsapp.net';
  }

  /**
   * Verificar saúde da API
   */
  async verificarSaudeAPI(): Promise<boolean> {
    try {
      const response = await axios.get(`${EVOLUTION_API_URL}/`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default new EvolutionAPIService();
