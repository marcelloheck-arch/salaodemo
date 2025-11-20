import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

/**
 * GET /api/produtos/[id]
 * Busca um produto específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.salonId) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    const produto = await prisma.product.findFirst({
      where: {
        id: params.id,
        salonId: authResult.salonId,
      },
    });

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: produto,
    });
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/produtos/[id]
 * Atualiza um produto
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.salonId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      brand,
      price,
      costPrice,
      stock,
      minStock,
      unit,
      barcode,
      status,
    } = body;

    // Verificar se produto existe e pertence ao salão
    const produtoExistente = await prisma.product.findFirst({
      where: {
        id: params.id,
        salonId: decoded.salonId,
      },
    });

    if (!produtoExistente) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const produto = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        brand,
        price: price !== undefined ? parseFloat(price) : undefined,
        costPrice: costPrice !== undefined ? (costPrice ? parseFloat(costPrice) : null) : undefined,
        stock: stock !== undefined ? stock : undefined,
        minStock: minStock !== undefined ? minStock : undefined,
        unit,
        barcode,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      data: produto,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/produtos/[id]
 * Deleta um produto (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.salonId) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    // Verificar se produto existe e pertence ao salão
    const produtoExistente = await prisma.product.findFirst({
      where: {
        id: params.id,
        salonId: authResult.salonId,
      },
    });

    if (!produtoExistente) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Soft delete
    await prisma.product.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Produto deletado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar produto', details: error.message },
      { status: 500 }
    );
  }
}
