import { NextRequest, NextResponse } from 'next/server';
// import { getAllLicenses, createLicense, updateLicense, deleteLicense, getLicenseStats } from '@/lib/licenseDatabase';

export async function GET(request: NextRequest) {
  try {
    // Mock data para não usar Prisma no build
    const mockLicenses = [
      {
        id: '1',
        licenseKey: 'DEMO-LICENSE-123',
        planType: 'Professional',
        status: 'active',
        clientName: 'Salão Demo',
        expiresAt: new Date('2025-12-31')
      }
    ];

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      return NextResponse.json({ 
        totalLicenses: 1, 
        activeLicenses: 1, 
        expiredLicenses: 0 
      });
    } else {
      return NextResponse.json(mockLicenses);
    }
  } catch (error) {
    console.error('Erro ao buscar licenças:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Mock response - criar nova licença simulada
    const newLicense = {
      id: Date.now().toString(),
      licenseKey: `LIC-${Date.now()}`,
      planType: data.planType || 'Professional',
      status: 'active',
      clientName: data.clientName || 'Cliente Demo',
      expiresAt: new Date('2025-12-31'),
      createdAt: new Date()
    };
    
    return NextResponse.json(newLicense, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar licença:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID da licença é obrigatório' }, { status: 400 });
    }

    const data = await request.json();
    
    // Mock response - atualizar licença simulada
    const updatedLicense = {
      id: id,
      ...data,
      updatedAt: new Date()
    };
    
    return NextResponse.json(updatedLicense);
  } catch (error) {
    console.error('Erro ao atualizar licença:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID da licença é obrigatório' }, { status: 400 });
    }

    // Mock response - deletar licença simulada
    const success = true; // Simular sucesso
    
    if (success) {
      return NextResponse.json({ message: 'Licença excluída com sucesso' });
    } else {
      return NextResponse.json({ error: 'Licença não encontrada' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erro ao excluir licença:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}