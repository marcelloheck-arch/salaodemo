/**
 * API de Cliente Individual
 * PUT    /api/clientes/[id] - Atualizar cliente
 * DELETE /api/clientes/[id] - Deletar cliente
 * GET    /api/clientes/[id] - Buscar cliente específico
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, validateTenantAccess } from '@/lib/auth-utils';

// GET - Buscar cliente específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const cliente = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 10,
          select: {
            id: true,
            date: true,
            startTime: true,
            status: true,
            totalPrice: true,
            service: { select: { name: true } },
          },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Validar acesso multi-tenant
    if (!validateTenantAccess(auth.user.salonId, cliente.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, cliente });

  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar cliente' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cliente
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Verificar se cliente existe e pertence ao salão
    const existingClient = await prisma.client.findUnique({
      where: { id: params.id },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, existingClient.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Atualizar dados
    const body = await req.json();
    const {
      name,
      email,
      phone,
      birthDate,
      address,
      notes,
      preferences,
      status,
    } = body;

    const cliente = await prisma.client.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(phone && { phone }),
        ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : null }),
        ...(address !== undefined && { address: address || null }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(preferences && { preferences }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cliente atualizado com sucesso',
      cliente,
    });

  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar cliente
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Verificar se cliente existe e pertence ao salão
    const cliente = await prisma.client.findUnique({
      where: { id: params.id },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(auth.user.salonId, cliente.salonId)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Deletar (CASCADE vai remover agendamentos relacionados)
    await prisma.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Cliente removido com sucesso',
    });

  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao remover cliente' },
      { status: 500 }
    );
  }
}
