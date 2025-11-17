/**
 * API Pública - Área do Profissional
 * Endpoint público para profissionais consultarem seus agendamentos
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Buscar profissional pelo telefone
    const professional = await prisma.professional.findFirst({
      where: {
        phone: {
          contains: phone.replace(/\D/g, ''), // Remove caracteres não numéricos
        },
      },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!professional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    // Buscar agendamentos do profissional
    const appointments = await prisma.appointment.findMany({
      where: {
        professionalId: professional.id,
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Últimos 30 dias
        },
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            duration: true,
          },
        },
        client: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { date: 'desc' },
        { startTime: 'desc' },
      ],
    });

    // Buscar transações do profissional
    const transactions = await prisma.transaction.findMany({
      where: {
        professionalId: professional.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Últimas 50 transações
    });

    // Calcular estatísticas
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const appointmentsThisMonth = appointments.filter(
      (apt: any) => new Date(apt.date) >= startOfMonth
    );

    const completedAppointments = appointments.filter(
      (apt: any) => apt.status === 'COMPLETED'
    );

    const totalEarnings = transactions.reduce(
      (sum: number, trans: any) => sum + Number(trans.commissionAmount || 0),
      0
    );

    const earningsThisMonth = transactions
      .filter((trans: any) => new Date(trans.createdAt) >= startOfMonth)
      .reduce((sum: number, trans: any) => sum + Number(trans.commissionAmount || 0), 0);

    // Formatar resposta
    const response = {
      profissional: {
        id: professional.id,
        name: professional.name,
        phone: professional.phone,
        email: professional.email,
        specialties: professional.specialties,
        commissionRate: Number(professional.commissionRate),
        salon: professional.salon,
        totalAppointments: appointments.length,
        completedAppointments: completedAppointments.length,
        appointmentsThisMonth: appointmentsThisMonth.length,
        totalEarnings,
        earningsThisMonth,
      },
      agendamentos: appointments.map((apt: any) => ({
        id: apt.id,
        date: apt.date.toISOString().split('T')[0],
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        service: {
          name: apt.service.name,
          price: Number(apt.service.price),
          duration: apt.service.duration,
        },
        client: {
          name: apt.client.name,
          phone: apt.client.phone,
        },
        notes: apt.notes,
      })),
      transacoes: transactions.map((trans: any) => ({
        id: trans.id,
        date: trans.createdAt.toISOString().split('T')[0],
        amount: Number(trans.amount),
        commissionAmount: Number(trans.commissionAmount),
        paymentMethod: trans.paymentMethod,
        description: trans.description,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar dados do profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
