/**
 * API de Registro
 * POST /api/auth/register - Criar novo salão e usuário
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth-utils';

// Gerar license key única
function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  
  const key = Array.from({ length: segments }, () =>
    Array.from({ length: segmentLength }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
  ).join('-');
  
  return `SAL-${key}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      // Dados do salão
      salonName,
      ownerName,
      email,
      phone,
      password,
      // Dados opcionais
      address,
      city,
      state,
      zipCode,
      planType = 'STARTER',
    } = body;

    // Validação
    if (!salonName || !ownerName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Gerar license key única
    let licenseKey = generateLicenseKey();
    let licenseExists = await prisma.salon.findUnique({
      where: { licenseKey },
    });
    
    while (licenseExists) {
      licenseKey = generateLicenseKey();
      licenseExists = await prisma.salon.findUnique({
        where: { licenseKey },
      });
    }

    // Calcular data de expiração (30 dias de trial)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Criar usuário e salão em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar usuário
      const user = await tx.user.create({
        data: {
          email,
          name: ownerName,
          password: passwordHash,
          role: 'OWNER',
        },
      });

      // 2. Criar salão
      const salon = await tx.salon.create({
        data: {
          name: salonName,
          ownerName,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          licenseKey,
          planType,
          licenseStatus: 'TRIAL',
          expiresAt,
          ownerId: user.id,
        },
      });

      // 3. Criar horários padrão (Segunda a Sexta, 9h-18h)
      const workingHours = [];
      for (let day = 1; day <= 5; day++) {
        workingHours.push({
          salonId: salon.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isClosed: false,
        });
      }
      // Sábado 9h-14h
      workingHours.push({
        salonId: salon.id,
        dayOfWeek: 6,
        startTime: '09:00',
        endTime: '14:00',
        isClosed: false,
      });
      // Domingo fechado
      workingHours.push({
        salonId: salon.id,
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '18:00',
        isClosed: true,
      });

      await tx.workingHours.createMany({
        data: workingHours,
      });

      return { user, salon };
    });

    // Gerar token
    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
      salonId: result.salon.id,
      role: result.user.role,
    });

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'Salão criado com sucesso! Você tem 30 dias de teste grátis.',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      salon: {
        id: result.salon.id,
        name: result.salon.name,
        licenseKey: result.salon.licenseKey,
        licenseStatus: result.salon.licenseStatus,
        expiresAt: result.salon.expiresAt,
        planType: result.salon.planType,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar salão' },
      { status: 500 }
    );
  }
}
