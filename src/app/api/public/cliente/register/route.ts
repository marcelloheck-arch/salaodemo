/**
 * API Pública - Cadastro de Cliente
 * POST /api/public/cliente/register - Cadastro público de cliente
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      birthDate,
      cpf,
      address,
      notes,
      salonId
    } = body;

    // Validações básicas
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
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
    const clienteExistente = await prisma.client.findFirst({
      where: {
        email: email,
        salonId: finalSalonId
      }
    });

    if (clienteExistente) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Criar cliente
    const cliente = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        cpf: cpf || null,
        address: address || null,
        notes: notes || null,
        salonId: finalSalonId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        cpf: true,
        address: true,
        notes: true,
        createdAt: true,
        salon: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Cliente cadastrado com sucesso!',
        cliente: {
          ...cliente,
          birthDate: cliente.birthDate?.toISOString().split('T')[0] || null
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar cliente' },
      { status: 500 }
    );
  }
}
