/**
 * API de Dashboard Financeiro
 * GET /api/transacoes/dashboard - Resumo financeiro
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const where: any = {
      salonId: auth.user.salonId,
    };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    // Buscar todas as transações do período
    const transacoes = await prisma.transaction.findMany({
      where,
      select: {
        type: true,
        amount: true,
        commissionAmount: true,
      },
    });

    // Calcular totais
    let totalIncome = 0;
    let totalExpense = 0;
    let totalCommissions = 0;

    transacoes.forEach(t => {
      const amount = t.amount.toNumber();
      const commission = t.commissionAmount?.toNumber() || 0;

      if (t.type === 'INCOME') {
        totalIncome += amount;
        totalCommissions += commission;
      } else {
        totalExpense += amount;
      }
    });

    const netProfit = totalIncome - totalExpense - totalCommissions;

    return NextResponse.json({
      success: true,
      dashboard: {
        totalIncome,
        totalExpense,
        totalCommissions,
        netProfit,
        transactionCount: transacoes.length,
        period: {
          from: dateFrom || null,
          to: dateTo || null,
        },
      },
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dashboard financeiro' },
      { status: 500 }
    );
  }
}
