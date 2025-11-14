import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Webhook recebido:', JSON.stringify(body, null, 2));

    const event = body.event;
    
    switch (event) {
      case 'MESSAGES_UPSERT':
        await handleMessageReceived(body.data);
        break;
      
      case 'CONNECTION_UPDATE':
        await handleConnectionUpdate(body.data);
        break;
      
      case 'QRCODE_UPDATED':
        await handleQRCodeUpdate(body.data);
        break;
      
      default:
        console.log('Evento desconhecido:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error.message);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

async function handleMessageReceived(data: any) {
  try {
    const message = data.message;
    const from = data.key.remoteJid;
    
    if (message.conversation) {
      console.log(`💬 Mensagem de ${from}: ${message.conversation}`);
      
      // Aqui você pode processar a mensagem com IA, salvar no banco, etc.
      // Exemplo: enviar para o assistente de IA
    }
  } catch (error: any) {
    console.error('Erro ao processar mensagem:', error.message);
  }
}

async function handleConnectionUpdate(data: any) {
  try {
    console.log('🔌 Atualização de conexão:', data.state);
    
    if (data.state === 'open') {
      console.log('✅ WhatsApp conectado!');
    } else if (data.state === 'close') {
      console.log('❌ WhatsApp desconectado');
    }
  } catch (error: any) {
    console.error('Erro ao processar conexão:', error.message);
  }
}

async function handleQRCodeUpdate(data: any) {
  try {
    console.log('📱 QR Code atualizado');
    // Aqui você poderia atualizar o QR code em tempo real via WebSocket
  } catch (error: any) {
    console.error('Erro ao processar QR code:', error.message);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
