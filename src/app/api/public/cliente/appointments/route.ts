/**
 * API Pública - Consulta de Agendamentos por Telefone
 * Endpoint público para clientes consultarem seus agendamentos
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Limpar telefone (remover caracteres especiais)
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Telefone inválido' },
        { status: 400 }
      );
    }

    // Buscar cliente pelo telefone
    const cliente = await prisma.client.findFirst({
      where: {
        phone: {
          contains: cleanPhone,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        salonId: true,
        salon: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Nenhum cliente encontrado com este telefone' },
        { status: 404 }
      );
    }

    // Buscar agendamentos do cliente
    const agendamentos = await prisma.appointment.findMany({
      where: {
        clientId: cliente.id,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            specialties: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    // Calcular estatísticas
    const completedAppointments = agendamentos.filter(
      (a) => a.status === 'COMPLETED'
    );

    const totalVisits = completedAppointments.length;
    const totalSpent = completedAppointments.reduce(
      (sum, a) => sum + Number(a.totalPrice || 0),
      0
    );

    // Buscar transações (histórico de pagamentos)
    const transacoes = await prisma.transaction.findMany({
      where: {
        appointment: {
          clientId: cliente.id,
        },
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        type: true,
        amount: true,
        paymentMethod: true,
        date: true,
        description: true,
      },
      take: 10, // Últimas 10 transações
    });

    // Formatar resposta
    const response = {
      cliente: {
        id: cliente.id,
        name: cliente.name,
        phone: cliente.phone,
        email: cliente.email,
        salon: cliente.salon,
        totalVisits,
        totalSpent,
      },
      agendamentos: agendamentos.map((a) => ({
        id: a.id,
        date: a.date.toISOString().split('T')[0],
        startTime: a.startTime,
        endTime: a.endTime,
        status: a.status,
        totalPrice: Number(a.totalPrice || 0),
        notes: a.notes,
        service: a.service,
        professional: a.professional,
      })),
      transacoes,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar agendamentos públicos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    );
  }
}
