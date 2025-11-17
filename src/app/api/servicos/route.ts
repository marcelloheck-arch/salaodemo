/**
 * API de Serviços
 * GET  /api/servicos - Listar todos os serviços do salão
 * POST /api/servicos - Criar novo serviço
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

// GET - Listar serviços
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const isActive = searchParams.get('isActive');

    // Query com filtro multi-tenant
    const where: any = {
      salonId: auth.user.salonId,
    };

    // Busca por nome ou descrição
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtro por categoria
    if (category !== 'all') {
      where.category = category;
    }

    // Filtro por status ativo/inativo
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const servicos = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        category: true,
        commission: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Converter Decimal para number no retorno
    const servicosFormatted = servicos.map((s: any) => ({
      ...s,
      price: s.price.toNumber(),
    }));

    return NextResponse.json({
      success: true,
      count: servicos.length,
      servicos: servicosFormatted,
    });

  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return NextResponse.json(
      { error: 'Erro ao listar serviços' },
      { status: 500 }
    );
  }
}

// POST - Criar serviço
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      duration,
      category,
      commission,
      isActive = true,
    } = body;

    // Validações
    if (!name || !price || !duration) {
      return NextResponse.json(
        { error: 'Nome, preço e duração são obrigatórios' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Preço deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (duration <= 0) {
      return NextResponse.json(
        { error: 'Duração deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (commission && (commission < 0 || commission > 100)) {
      return NextResponse.json(
        { error: 'Comissão deve estar entre 0 e 100' },
        { status: 400 }
      );
    }

    // Criar serviço com salonId
    const servico = await prisma.service.create({
      data: {
        name,
        description: description || null,
        price: price,
        duration,
        category: category || 'Geral',
        commission: commission || 0,
        isActive,
        salonId: auth.user.salonId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        category: true,
        commission: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Serviço criado com sucesso',
        servico: {
          ...servico,
          price: servico.price.toNumber(),
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao criar serviço' },
      { status: 500 }
    );
  }
}
