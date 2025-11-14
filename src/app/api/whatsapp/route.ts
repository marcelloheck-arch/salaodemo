import { NextRequest, NextResponse } from 'next/server';
import { getEvolutionClient } from '@/lib/evolutionApi';

interface WhatsAppStatus {
  connected: boolean;
  qrCode?: string;
  phoneNumber?: string;
  profileName?: string;
}

let currentQRCode: string | null = null;
let isConnected: boolean = false;
let currentPhoneNumber: string | null = null;

async function handleGetStatus(): Promise<NextResponse> {
  console.log('Status solicitado - Connected:', isConnected, 'QR Code:', currentQRCode ? 'disponivel' : 'null');
  
  try {
    const client = getEvolutionClient();
    const status = await client.getStatus();
    
    isConnected = status.connected;
    
    const response: WhatsAppStatus = {
      connected: status.connected,
      qrCode: currentQRCode || undefined,
      phoneNumber: currentPhoneNumber || undefined,
      profileName: status.profileName,
    };
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erro ao verificar status:', error.message);
    return NextResponse.json({
      connected: false,
      qrCode: currentQRCode || undefined,
    });
  }
}

async function handleConnect(): Promise<NextResponse> {
  try {
    console.log('Iniciando conexao...');
    
    const client = getEvolutionClient();
    await client.createInstance();
    const qrBase64 = await client.connect();
    currentQRCode = qrBase64;
    
    console.log('QR Code gerado com sucesso!');
    
    return NextResponse.json({
      success: true,
      message: 'QR Code gerado',
    });
  } catch (error: any) {
    console.error('Erro ao conectar:', error.message);
    return NextResponse.json(
      { error: 'Falha ao gerar QR Code', details: error.message },
      { status: 500 }
    );
  }
}

async function handleDisconnect(): Promise<NextResponse> {
  try {
    console.log('Desconectando...');
    
    const client = getEvolutionClient();
    await client.disconnect();
    
    isConnected = false;
    currentQRCode = null;
    currentPhoneNumber = null;
    
    console.log('Desconectado com sucesso!');
    
    return NextResponse.json({ success: true, message: 'Desconectado' });
  } catch (error: any) {
    console.error('Erro ao desconectar:', error.message);
    return NextResponse.json(
      { error: 'Falha ao desconectar', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'status':
      return handleGetStatus();
    case 'connect':
      return handleConnect();
    case 'disconnect':
      return handleDisconnect();
    default:
      return NextResponse.json(
        { error: 'Acao invalida' },
        { status: 400 }
      );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { number, message } = body;

    if (!number || !message) {
      return NextResponse.json(
        { error: 'Numero e mensagem obrigatorios' },
        { status: 400 }
      );
    }

    if (!isConnected) {
      return NextResponse.json(
        { error: 'WhatsApp nao conectado' },
        { status: 503 }
      );
    }

    console.log('Enviando mensagem para:', number);
    
    const client = getEvolutionClient();
    const result = await client.sendMessage({
      number,
      text: message,
    });

    console.log('Mensagem enviada com sucesso!');

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada',
      messageId: result.key.id,
    });
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error.message);
    return NextResponse.json(
      { error: 'Falha ao enviar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
