/**
 * API de Autenticação
 * POST /api/auth/login - Login de usuário
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
            licenseStatus: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    // Verificar senha
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Usuário inativo. Contate o administrador.' },
        { status: 403 }
      );
    }

    // Verificar se tem salão
    if (!user.salon) {
      return NextResponse.json(
        { error: 'Usuário não possui salão associado' },
        { status: 403 }
      );
    }

    // Verificar licença do salão
    if (user.salon.licenseStatus !== 'ACTIVE') {
      return NextResponse.json(
        { error: `Licença ${user.salon.licenseStatus}. Renove sua assinatura.` },
        { status: 403 }
      );
    }

    // Verificar se licença não expirou
    if (new Date(user.salon.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Licença expirada. Renove sua assinatura.' },
        { status: 403 }
      );
    }

    // Gerar JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      salonId: user.salon.id,
      role: user.role,
    });

    // Retornar dados do usuário e token
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        salon: {
          id: user.salon.id,
          name: user.salon.name,
          licenseStatus: user.salon.licenseStatus,
          expiresAt: user.salon.expiresAt,
        },
      },
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}
