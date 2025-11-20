import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

/**
 * GET /api/produtos
 * Lista todos os produtos do salão
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.salonId) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = {
      salonId: authResult.salonId,
      isActive: true,
    };

    if (category) where.category = category;
    if (status) where.status = status;

    const produtos = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: produtos,
    });
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/produtos
 * Cria um novo produto
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.salonId) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
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

    // Validações
    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, category, price' },
        { status: 400 }
      );
    }

    const produto = await prisma.product.create({
      data: {
        salonId: authResult.salonId,
        name,
        description,
        category,
        brand,
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : null,
        stock: stock || 0,
        minStock: minStock || 0,
        unit: unit || 'un',
        barcode,
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      data: produto,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto', details: error.message },
      { status: 500 }
    );
  }
}
