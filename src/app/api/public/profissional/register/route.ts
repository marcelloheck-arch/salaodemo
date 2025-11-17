/**
 * API Pública - Cadastro de Profissional
 * POST /api/public/profissional/register - Cadastro público de profissional
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      specialties,
      cpf,
      bio,
      workingHours,
      salonId
    } = body;

    // Validações básicas
    if (!name || !email || !phone || !specialties || specialties.length === 0) {
      return NextResponse.json(
        { error: 'Nome, email, telefone e especialidades são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Se não tem salonId, pegar o primeiro salão ativo (para demo)
    let finalSalonId = salonId;
    if (!finalSalonId) {
      const primeiroSalao = await prisma.salon.findFirst({
        where: { isActive: true },
        select: { id: true }
      });
      
      if (!primeiroSalao) {
        return NextResponse.json(
          { error: 'Nenhum salão disponível para cadastro' },
          { status: 400 }
        );
      }
      
      finalSalonId = primeiroSalao.id;
    }

    // Verificar se email já existe neste salão
    const profissionalExistente = await prisma.professional.findFirst({
      where: {
        email: email,
        salonId: finalSalonId
      }
    });

    if (profissionalExistente) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Criar profissional
    const profissional = await prisma.professional.create({
      data: {
        name,
        email,
        phone,
        specialties: specialties,
        cpf: cpf || null,
        bio: bio || null,
        commissionRate: 50, // Comissão padrão 50%
        salonId: finalSalonId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialties: true,
        cpf: true,
        bio: true,
        commissionRate: true,
        createdAt: true,
        salon: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Criar horários de trabalho se fornecidos
    if (workingHours && Array.isArray(workingHours) && workingHours.length > 0) {
      const horarios = workingHours.map((wh: any) => ({
        professionalId: profissional.id,
        dayOfWeek: wh.dayOfWeek,
        startTime: wh.startTime,
        endTime: wh.endTime,
        isAvailable: true
      }));

      await prisma.workingHours.createMany({
        data: horarios
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profissional cadastrado com sucesso! Aguarde aprovação do administrador.',
        profissional
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao cadastrar profissional:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar profissional' },
      { status: 500 }
    );
  }
}
