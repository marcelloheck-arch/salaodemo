/**
 * API de Profissionais
 * GET  /api/profissionais - Listar profissionais
 * POST /api/profissionais - Criar profissional
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

// GET - Listar profissionais
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const specialty = searchParams.get('specialty');

    const where: any = {
      salonId: auth.user.salonId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    if (specialty) {
      where.specialties = {
        has: specialty,
      };
    }

    const profissionais = await prisma.professional.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialties: true,
        commission: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: profissionais.length,
      profissionais,
    });

  } catch (error) {
    console.error('Erro ao listar profissionais:', error);
    return NextResponse.json(
      { error: 'Erro ao listar profissionais' },
      { status: 500 }
    );
  }
}

// POST - Criar profissional
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      specialties = [],
      commission = 0,
      isActive = true,
    } = body;

    // Validações
    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (commission < 0 || commission > 100) {
      return NextResponse.json(
        { error: 'Comissão deve estar entre 0 e 100' },
        { status: 400 }
      );
    }

    // Verificar email duplicado no salão
    if (email) {
      const existing = await prisma.professional.findFirst({
        where: {
          salonId: auth.user.salonId,
          email,
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Email já cadastrado para outro profissional' },
          { status: 409 }
        );
      }
    }

    const profissional = await prisma.professional.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        specialties,
        commission,
        isActive,
        salonId: auth.user.salonId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialties: true,
        commission: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Profissional criado com sucesso',
        profissional,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao criar profissional' },
      { status: 500 }
    );
  }
}
