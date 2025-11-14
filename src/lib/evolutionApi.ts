/**
 * Cliente Evolution API para WhatsApp
 * Documentação: https://doc.evolution-api.com
 */

import axios, { AxiosInstance } from 'axios';

interface EvolutionApiConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
}

interface SendMessagePayload {
  number: string;
  text: string;
}

interface QRCodeResponse {
  qrcode: {
    base64: string;
    pairingCode?: string;
  };
}

interface InstanceStatusResponse {
  instance: {
    instanceName: string;
    status: string;
    profileName?: string;
    profilePictureUrl?: string;
  };
  connectionStatus: string;
}

interface SendMessageResponse {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation: string;
  };
  messageTimestamp: number;
  status: string;
}

class EvolutionApiClient {
  private client: AxiosInstance;
  private instanceName: string;

  constructor(config: EvolutionApiConfig) {
    this.instanceName = config.instanceName;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey,
      },
      timeout: 30000,
    });
  }

  /**
   * Criar ou obter instância existente
   */
  async createInstance(): Promise<void> {
    try {
      await this.client.post('/instance/create', {
        instanceName: this.instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      });
      console.log('✅ Instância criada:', this.instanceName);
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.log('ℹ️ Instância já existe:', this.instanceName);
      } else {
        console.error('❌ Erro ao criar instância:', error.message);
        throw error;
      }
    }
  }

  /**
   * Conectar à instância e obter QR Code
   */
  async connect(): Promise<string> {
    try {
      const response = await this.client.get<QRCodeResponse>(
        `/instance/connect/${this.instanceName}`
      );
      
      if (response.data?.qrcode?.base64) {
        console.log('📱 QR Code obtido com sucesso');
        return response.data.qrcode.base64;
      }
      
      throw new Error('QR Code não retornado pela API');
    } catch (error: any) {
      console.error('❌ Erro ao conectar:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verificar status da conexão
   */
  async getStatus(): Promise<{
    connected: boolean;
    profileName?: string;
    status: string;
  }> {
    try {
      const response = await this.client.get<InstanceStatusResponse>(
        `/instance/connectionState/${this.instanceName}`
      );
      
      const isConnected = response.data.connectionStatus === 'open';
      
      return {
        connected: isConnected,
        profileName: response.data.instance?.profileName,
        status: response.data.connectionStatus,
      };
    } catch (error: any) {
      console.error('❌ Erro ao verificar status:', error.message);
      return {
        connected: false,
        status: 'disconnected',
      };
    }
  }

  /**
   * Enviar mensagem de texto
   */
  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    try {
      const response = await this.client.post<SendMessageResponse>(
        `/message/sendText/${this.instanceName}`,
        {
          number: payload.number,
          text: payload.text,
        }
      );
      
      console.log('✅ Mensagem enviada para:', payload.number);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Desconectar instância
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.delete(`/instance/logout/${this.instanceName}`);
      console.log('✅ Instância desconectada:', this.instanceName);
    } catch (error: any) {
      console.error('❌ Erro ao desconectar:', error.message);
      throw error;
    }
  }

  /**
   * Deletar instância
   */
  async deleteInstance(): Promise<void> {
    try {
      await this.client.delete(`/instance/delete/${this.instanceName}`);
      console.log('✅ Instância deletada:', this.instanceName);
    } catch (error: any) {
      console.error('❌ Erro ao deletar instância:', error.message);
      throw error;
    }
  }

  /**
   * Configurar webhook para receber mensagens
   */
  async setWebhook(webhookUrl: string): Promise<void> {
    try {
      await this.client.post(`/webhook/set/${this.instanceName}`, {
        url: webhookUrl,
        webhook_by_events: true,
        events: [
          'MESSAGES_UPSERT',
          'CONNECTION_UPDATE',
          'QRCODE_UPDATED',
        ],
      });
      console.log('✅ Webhook configurado:', webhookUrl);
    } catch (error: any) {
      console.error('❌ Erro ao configurar webhook:', error.message);
      throw error;
    }
  }
}

// Singleton instance
let evolutionClient: EvolutionApiClient | null = null;

export function getEvolutionClient(): EvolutionApiClient {
  if (!evolutionClient) {
    const config: EvolutionApiConfig = {
      baseUrl: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
      apiKey: process.env.EVOLUTION_API_KEY || '',
      instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'agendusalao',
    };

    if (!config.apiKey) {
      throw new Error('EVOLUTION_API_KEY não configurada no .env.local');
    }

    evolutionClient = new EvolutionApiClient(config);
  }

  return evolutionClient;
}

export type { SendMessagePayload, QRCodeResponse, InstanceStatusResponse, SendMessageResponse };
