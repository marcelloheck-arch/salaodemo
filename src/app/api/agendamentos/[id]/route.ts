/**
 * API de Agendamento Individual
 * GET    /api/agendamentos/[id] - Buscar agendamento
 * PUT    /api/agendamentos/[id] - Atualizar agendamento
 * DELETE /api/agendamentos/[id] - Deletar agendamento
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, validateTenantAccess } from '@/lib/auth-utils';

// GET - Buscar agendamento
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const agendamento = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        service: true,
        professional: true,
      },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, agendamento.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      agendamento: {
        ...agendamento,
        totalPrice: agendamento.totalPrice.toNumber(),
        service: {
          ...agendamento.service,
          price: agendamento.service.price.toNumber(),
        },
      },
    });

  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar agendamento' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar agendamento
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const existing = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
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
    const { status, notes, paymentStatus, totalPrice } = body;

    // Atualizar campos permitidos
    const agendamento = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(paymentStatus && { paymentStatus }),
        ...(totalPrice !== undefined && { totalPrice: totalPrice }),
      },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        service: { select: { id: true, name: true, price: true } },
        professional: { select: { id: true, name: true } },
      },
    });

    // Se status mudou para COMPLETED, criar transação
    if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      const professional = await prisma.professional.findUnique({
        where: { id: agendamento.professionalId },
      });

      const commissionRate = professional?.commission || 0;
      const amount = agendamento.totalPrice.toNumber();
      const commissionAmount = (amount * commissionRate) / 100;

      await prisma.transaction.create({
        data: {
          type: 'INCOME',
          amount: amount,
          description: `Serviço: ${agendamento.service.name}`,
          category: 'Serviço',
          paymentMethod: 'CASH', // Default, pode ser atualizado depois
          commissionRate,
          commissionAmount: commissionAmount,
          appointmentId: agendamento.id,
          professionalId: agendamento.professionalId,
          salonId: auth.user.salonId,
          date: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento atualizado com sucesso',
      agendamento: {
        ...agendamento,
        totalPrice: agendamento.totalPrice.toNumber(),
        service: {
          ...agendamento.service,
          price: agendamento.service.price.toNumber(),
        },
      },
    });

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar agendamento
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const agendamento = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, agendamento.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Agendamento removido com sucesso',
    });

  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao remover agendamento' },
      { status: 500 }
    );
  }
}
