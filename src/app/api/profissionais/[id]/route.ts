/**
 * API de Profissional Individual
 * GET    /api/profissionais/[id] - Buscar profissional
 * PUT    /api/profissionais/[id] - Atualizar profissional
 * DELETE /api/profissionais/[id] - Deletar profissional
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, validateTenantAccess } from '@/lib/auth-utils';

// GET - Buscar profissional
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const profissional = await prisma.professional.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          where: { status: 'CONFIRMED' },
          orderBy: { date: 'desc' },
          take: 10,
          select: {
            id: true,
            date: true,
            startTime: true,
            client: { select: { name: true } },
            service: { select: { name: true } },
          },
        },
        transactions: {
          orderBy: { date: 'desc' },
          take: 10,
          select: {
            id: true,
            date: true,
            type: true,
            amount: true,
            commissionAmount: true,
          },
        },
      },
    });

    if (!profissional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, profissional.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, profissional });

  } catch (error) {
    console.error('Erro ao buscar profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar profissional' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar profissional
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const existing = await prisma.professional.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
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
      email,
      phone,
      specialties,
      commission,
      isActive,
    } = body;

    // Validações
    if (commission !== undefined && (commission < 0 || commission > 100)) {
      return NextResponse.json(
        { error: 'Comissão deve estar entre 0 e 100' },
        { status: 400 }
      );
    }

    // Verificar email duplicado
    if (email && email !== existing.email) {
      const duplicate = await prisma.professional.findFirst({
        where: {
          salonId: auth.user.salonId,
          email,
          id: { not: params.id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Email já cadastrado para outro profissional' },
          { status: 409 }
        );
      }
    }

    const profissional = await prisma.professional.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(specialties && { specialties }),
        ...(commission !== undefined && { commission }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profissional atualizado com sucesso',
      profissional,
    });

  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar profissional' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar profissional
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const profissional = await prisma.professional.findUnique({
      where: { id: params.id },
    });

    if (!profissional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, profissional.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    await prisma.professional.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Profissional removido com sucesso',
    });

  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao remover profissional' },
      { status: 500 }
    );
  }
}
