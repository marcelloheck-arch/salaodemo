/**
 * API de Agendamentos
 * GET  /api/agendamentos - Listar agendamentos
 * POST /api/agendamentos - Criar agendamento (com validação de conflitos)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

// Função auxiliar: adicionar minutos ao horário
function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Função auxiliar: verificar se horários se sobrepõem
function hasTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}

// GET - Listar agendamentos
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const professionalId = searchParams.get('professionalId');
    const clientId = searchParams.get('clientId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const where: any = {
      salonId: auth.user.salonId,
    };

    if (status) {
      where.status = status.toUpperCase();
    }

    if (professionalId) {
      where.professionalId = professionalId;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const agendamentos = await prisma.appointment.findMany({
      where,
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
      include: {
        client: {
          select: { id: true, name: true, phone: true },
        },
        service: {
          select: { id: true, name: true, price: true, duration: true },
        },
        professional: {
          select: { id: true, name: true },
        },
      },
    });

    // Converter Decimal para number
    const agendamentosFormatted = agendamentos.map(a => ({
      ...a,
      totalPrice: a.totalPrice.toNumber(),
      service: {
        ...a.service,
        price: a.service.price.toNumber(),
      },
    }));

    return NextResponse.json({
      success: true,
      count: agendamentos.length,
      agendamentos: agendamentosFormatted,
    });

  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar agendamentos' },
      { status: 500 }
    );
  }
}

// POST - Criar agendamento
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      clientId,
      serviceId,
      professionalId,
      date,
      startTime,
      notes,
    } = body;

    // Validações básicas
    if (!clientId || !serviceId || !professionalId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Cliente, serviço, profissional, data e horário são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se data/hora não está no passado
    const appointmentDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Zerar horário para comparar só a data

    if (appointmentDate < now) {
      return NextResponse.json(
        { error: 'Não é possível agendar em datas passadas' },
        { status: 400 }
      );
    }

    // Buscar serviço para pegar duração e preço
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.salonId !== auth.user.salonId) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Calcular endTime
    const endTime = addMinutes(startTime, service.duration);

    // Verificar horário de funcionamento
    const dayOfWeek = appointmentDate.getDay();
    const workingHours = await prisma.workingHours.findFirst({
      where: {
        salonId: auth.user.salonId,
        dayOfWeek,
      },
    });

    if (!workingHours || !workingHours.isOpen) {
      return NextResponse.json(
        { error: 'Salão fechado neste dia' },
        { status: 400 }
      );
    }

    if (startTime < workingHours.startTime || endTime > workingHours.endTime) {
      return NextResponse.json(
        { error: `Horário fora do expediente (${workingHours.startTime} - ${workingHours.endTime})` },
        { status: 400 }
      );
    }

    // Verificar conflitos com outros agendamentos do profissional
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        salonId: auth.user.salonId,
        professionalId,
        date: appointmentDate,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    for (const existing of existingAppointments) {
      if (hasTimeOverlap(startTime, endTime, existing.startTime, existing.endTime)) {
        return NextResponse.json(
          {
            error: 'Conflito de horário: profissional já possui agendamento neste horário',
            conflictingAppointment: {
              startTime: existing.startTime,
              endTime: existing.endTime,
            },
          },
          { status: 409 }
        );
      }
    }

    // Criar agendamento
    const agendamento = await prisma.appointment.create({
      data: {
        clientId,
        serviceId,
        professionalId,
        date: appointmentDate,
        startTime,
        endTime,
        totalPrice: service.price,
        notes: notes || null,
        status: 'PENDING',
        salonId: auth.user.salonId,
      },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        service: { select: { id: true, name: true, price: true, duration: true } },
        professional: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Agendamento criado com sucesso',
        agendamento: {
          ...agendamento,
          totalPrice: agendamento.totalPrice.toNumber(),
          service: {
            ...agendamento.service,
            price: agendamento.service.price.toNumber(),
          },
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
      { status: 500 }
    );
  }
}
