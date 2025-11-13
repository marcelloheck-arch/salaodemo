/**
 * API Route para WhatsApp Web.js
 * Conexão real com WhatsApp via QR Code
 */

import { NextRequest, NextResponse } from 'next/server';

// Tipos
interface WhatsAppMessage {
  from: string;
  body: string;
  timestamp: number;
}

interface WhatsAppStatus {
  connected: boolean;
  qrCode?: string;
  phoneNumber?: string;
}

// Estado global (em produção, usar Redis ou banco de dados)
let whatsappClient: any = null;
let currentQRCode: string | null = null;
let isConnected: boolean = false;
let currentPhoneNumber: string | null = null;
let messageCallbacks: Set<(msg: WhatsAppMessage) => void> = new Set();

// Dynamic import do whatsapp-web.js (apenas server-side)
async function getWhatsAppClient() {
  if (typeof window !== 'undefined') {
    throw new Error('WhatsApp Web.js só pode ser usado no servidor');
  }
  
  const { Client, LocalAuth } = await import('whatsapp-web.js');
  return { Client, LocalAuth };
}

/**
 * Inicializar cliente WhatsApp
 */
async function initializeWhatsAppClient() {
  if (whatsappClient) {
    return whatsappClient;
  }

  try {
    // Usar dynamic import
    const { Client, LocalAuth } = await getWhatsAppClient();
    
    whatsappClient = new Client({
      authStrategy: new LocalAuth({
        clientId: 'agenda-salao-whatsapp'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    // QR Code gerado
    whatsappClient.on('qr', (qr: string) => {
      console.log('📱 QR Code gerado');
      currentQRCode = qr;
      isConnected = false;
    });

    // Cliente pronto
    whatsappClient.on('ready', () => {
      console.log('✅ WhatsApp conectado!');
      isConnected = true;
      currentQRCode = null;
      
      // Obter número de telefone
      whatsappClient.info.then((info: any) => {
        currentPhoneNumber = info.wid.user;
        console.log(`📱 Número conectado: ${currentPhoneNumber}`);
      });
    });

    // Cliente autenticado
    whatsappClient.on('authenticated', () => {
      console.log('🔐 WhatsApp autenticado');
    });

    // Cliente desconectado
    whatsappClient.on('disconnected', (reason: string) => {
      console.log('❌ WhatsApp desconectado:', reason);
      isConnected = false;
      currentQRCode = null;
      currentPhoneNumber = null;
      whatsappClient = null;
    });

    // Receber mensagens
    whatsappClient.on('message', async (message: any) => {
      console.log('📨 Mensagem recebida:', message.from, message.body);
      
      const whatsappMessage: WhatsAppMessage = {
        from: message.from,
        body: message.body,
        timestamp: message.timestamp
      };

      // Notificar todos os callbacks
      messageCallbacks.forEach(callback => callback(whatsappMessage));
    });

    // Inicializar
    await whatsappClient.initialize();
    console.log('🚀 Cliente WhatsApp inicializado');

    return whatsappClient;
  } catch (error) {
    console.error('❌ Erro ao inicializar WhatsApp:', error);
    throw error;
  }
}

/**
 * GET - Obter status da conexão
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'status') {
      const status: WhatsAppStatus = {
        connected: isConnected,
        qrCode: currentQRCode || undefined,
        phoneNumber: currentPhoneNumber || undefined
      };

      return NextResponse.json(status);
    }

    if (action === 'connect') {
      if (!whatsappClient) {
        await initializeWhatsAppClient();
      }

      // Aguardar QR Code ou conexão
      let attempts = 0;
      while (!currentQRCode && !isConnected && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      const status: WhatsAppStatus = {
        connected: isConnected,
        qrCode: currentQRCode || undefined,
        phoneNumber: currentPhoneNumber || undefined
      };

      return NextResponse.json(status);
    }

    if (action === 'disconnect') {
      if (whatsappClient) {
        await whatsappClient.destroy();
        whatsappClient = null;
        isConnected = false;
        currentQRCode = null;
        currentPhoneNumber = null;
      }

      return NextResponse.json({ success: true, message: 'Desconectado' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Erro na API WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST - Enviar mensagem
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, to, message } = body;

    if (action === 'send') {
      if (!whatsappClient || !isConnected) {
        return NextResponse.json(
          { error: 'WhatsApp não está conectado' },
          { status: 400 }
        );
      }

      // Enviar mensagem
      await whatsappClient.sendMessage(to, message);

      return NextResponse.json({ success: true, message: 'Mensagem enviada' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

// Configurar runtime para Node.js (necessário para puppeteer)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
