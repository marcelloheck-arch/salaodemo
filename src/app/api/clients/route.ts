import { NextRequest, NextResponse } from 'next/server';
// import { getAllLicenseClients, upsertLicenseClient } from '@/lib/licenseDatabase';

export async function GET() {
  try {
    // Mock data para não usar Prisma no build
    const mockClients = [
      {
        id: '1',
        name: 'Salão Demo',
        email: 'demo@salao.com',
        phone: '(11) 99999-9999',
        createdAt: new Date()
      }
    ];
    
    return NextResponse.json(mockClients);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Mock response - não usar Prisma no build
    const client = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date()
    };
    
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