import { NextRequest, NextResponse } from 'next/server';
import { getAllLicenses, createLicense, updateLicense, deleteLicense, getLicenseStats } from '@/lib/licenseDatabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = await getLicenseStats();
      return NextResponse.json(stats);
    } else {
      const licenses = await getAllLicenses();
      return NextResponse.json(licenses);
    }
  } catch (error) {
    console.error('Erro ao buscar licenças:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const license = await createLicense(data);
    
    if (license) {
      return NextResponse.json(license, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Erro ao criar licença' }, { status: 400 });
    }
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
    const license = await updateLicense(id, data);
    
    if (license) {
      return NextResponse.json(license);
    } else {
      return NextResponse.json({ error: 'Licença não encontrada' }, { status: 404 });
    }
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

    const success = await deleteLicense(id);
    
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