/**
 * API de Transação Individual
 * GET    /api/transacoes/[id] - Buscar transação
 * PUT    /api/transacoes/[id] - Atualizar transação
 * DELETE /api/transacoes/[id] - Deletar transação
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, validateTenantAccess } from '@/lib/auth-utils';
import { Decimal } from '@prisma/client/runtime/library';

// GET - Buscar transação
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const transacao = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        professional: true,
        appointment: {
          include: {
            client: { select: { name: true, phone: true } },
            service: { select: { name: true, price: true } },
          },
        },
      },
    });

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, transacao.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      transacao: {
        ...transacao,
        amount: transacao.amount.toNumber(),
        commissionAmount: transacao.commissionAmount?.toNumber() || 0,
      },
    });

  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transação' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar transação
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const existing = await prisma.transaction.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
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
      description,
      category,
      paymentMethod,
      amount,
    } = body;

    // Validações
    if (amount !== undefined && amount <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Se valor mudou, recalcular comissão
    let updateData: any = {
      ...(description && { description }),
      ...(category && { category }),
      ...(paymentMethod && { paymentMethod }),
    };

    if (amount !== undefined) {
      updateData.amount = new Decimal(amount);

      if (existing.professionalId && existing.commissionRate > 0) {
        const newCommission = (amount * existing.commissionRate) / 100;
        updateData.commissionAmount = new Decimal(newCommission);
      }
    }

    const transacao = await prisma.transaction.update({
      where: { id: params.id },
      data: updateData,
      include: {
        professional: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Transação atualizada com sucesso',
      transacao: {
        ...transacao,
        amount: transacao.amount.toNumber(),
        commissionAmount: transacao.commissionAmount?.toNumber() || 0,
      },
    });

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar transação' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar transação
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const transacao = await prisma.transaction.findUnique({
      where: { id: params.id },
    });

    if (!transacao) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, transacao.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    await prisma.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Transação removida com sucesso',
    });

  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao remover transação' },
      { status: 500 }
    );
  }
}
