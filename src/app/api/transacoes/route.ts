/**
 * API de Transações
 * GET  /api/transacoes - Listar transações
 * POST /api/transacoes - Criar transação manual
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

// GET - Listar transações
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const professionalId = searchParams.get('professionalId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const category = searchParams.get('category');

    const where: any = {
      salonId: auth.user.salonId,
    };

    if (type) {
      where.type = type.toUpperCase();
    }

    if (professionalId) {
      where.professionalId = professionalId;
    }

    if (category) {
      where.category = category;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const transacoes = await prisma.transaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: {
        professional: {
          select: { id: true, name: true },
        },
        appointment: {
          select: {
            id: true,
            date: true,
            startTime: true,
            client: { select: { name: true } },
            service: { select: { name: true } },
          },
        },
      },
    });

    const transacoesFormatted = transacoes.map((t: any) => ({
      ...t,
      amount: t.amount.toNumber(),
      commissionAmount: t.commissionAmount?.toNumber() || 0,
    }));

    return NextResponse.json({
      success: true,
      count: transacoes.length,
      transacoes: transacoesFormatted,
    });

  } catch (error) {
    console.error('Erro ao listar transações:', error);
    return NextResponse.json(
      { error: 'Erro ao listar transações' },
      { status: 500 }
    );
  }
}

// POST - Criar transação manual
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      type,
      amount,
      description,
      category,
      paymentMethod,
      professionalId,
      date,
    } = body;

    // Validações
    if (!type || !amount || !description) {
      return NextResponse.json(
        { error: 'Tipo, valor e descrição são obrigatórios' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Calcular comissão se houver profissional
    let commissionRate = 0;
    let commissionAmount = 0;

    if (professionalId && type === 'INCOME') {
      const professional = await prisma.professional.findUnique({
        where: { id: professionalId },
      });

      if (professional && professional.salonId === auth.user.salonId) {
        commissionRate = professional.commission;
        commissionAmount = (amount * commissionRate) / 100;
      }
    }

    const transacao = await prisma.transaction.create({
      data: {
        type: type.toUpperCase(),
        amount: amount,
        description,
        category: category || 'Outros',
        paymentMethod: paymentMethod || 'CASH',
        commissionRate,
        commissionAmount: commissionAmount,
        professionalId: professionalId || null,
        date: date ? new Date(date) : new Date(),
        salonId: auth.user.salonId,
      },
      include: {
        professional: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Transação criada com sucesso',
        transacao: {
          ...transacao,
          amount: transacao.amount.toNumber(),
          commissionAmount: transacao.commissionAmount?.toNumber() || 0,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    );
  }
}
