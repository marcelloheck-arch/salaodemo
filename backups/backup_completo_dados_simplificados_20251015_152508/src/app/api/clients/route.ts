import { NextRequest, NextResponse } from 'next/server';
import { getAllLicenseClients, upsertLicenseClient } from '@/lib/licenseDatabase';

export async function GET() {
  try {
    const clients = await getAllLicenseClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await upsertLicenseClient(data);
    
    if (client) {
      return NextResponse.json(client, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}