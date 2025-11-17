/**
 * API de Serviço Individual
 * GET    /api/servicos/[id] - Buscar serviço específico
 * PUT    /api/servicos/[id] - Atualizar serviço
 * DELETE /api/servicos/[id] - Deletar serviço
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, validateTenantAccess } from '@/lib/auth-utils';
import { Decimal } from '@prisma/client/runtime/library';

// GET - Buscar serviço específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const servico = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          where: { status: 'CONFIRMED' },
          orderBy: { date: 'desc' },
          take: 5,
          select: {
            id: true,
            date: true,
            startTime: true,
            client: { select: { name: true } },
          },
        },
      },
    });

    if (!servico) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, servico.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      servico: {
        ...servico,
        price: servico.price.toNumber(),
      },
    });

  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar serviço' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar serviço
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const existing = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, existing.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      duration,
      category,
      commission,
      isActive,
    } = body;

    // Validações
    if (price !== undefined && price <= 0) {
      return NextResponse.json(
        { error: 'Preço deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (duration !== undefined && duration <= 0) {
      return NextResponse.json(
        { error: 'Duração deve ser maior que zero' },
        { status: 400 }
      );
    }

    if (commission !== undefined && (commission < 0 || commission > 100)) {
      return NextResponse.json(
        { error: 'Comissão deve estar entre 0 e 100' },
        { status: 400 }
      );
    }

    const servico = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: new Decimal(price) }),
        ...(duration !== undefined && { duration }),
        ...(category && { category }),
        ...(commission !== undefined && { commission }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Serviço atualizado com sucesso',
      servico: {
        ...servico,
        price: servico.price.toNumber(),
      },
    });

  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar serviço' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar serviço
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const servico = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!servico) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, servico.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    await prisma.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Serviço removido com sucesso',
    });

  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao remover serviço' },
      { status: 500 }
    );
  }
}
