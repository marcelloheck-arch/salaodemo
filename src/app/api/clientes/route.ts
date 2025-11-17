/**
 * API de Clientes - CRUD Completo com Multi-Tenant
 * GET    /api/clientes - Listar todos os clientes do salão
 * POST   /api/clientes - Criar novo cliente
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth-utils';

// GET - Listar clientes do salão
export async function GET(req: NextRequest) {
  try {
    // 1. Autenticar requisição
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { error: auth.error || 'Não autenticado' },
        { status: 401 }
      );
    }

    // 2. Extrair filtros da query string
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    // 3. Buscar clientes APENAS do salão do usuário (Multi-Tenant)
    const where: any = {
      salonId: auth.user.salonId, // 🔒 ISOLAMENTO MULTI-TENANT
    };

    // Filtro de busca
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Filtro de status
    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    const clientes = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        address: true,
        notes: true,
        preferences: true,
        totalSpent: true,
        totalVisits: true,
        lastVisit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Não incluir salonId na resposta (segurança)
      },
    });

    return NextResponse.json({
      success: true,
      count: clientes.length,
      clientes,
    });

  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    );
  }
}

// POST - Criar novo cliente
export async function POST(req: NextRequest) {
  try {
    // 1. Autenticar
    const auth = await authenticateRequest(req);
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { error: auth.error || 'Não autenticado' },
        { status: 401 }
      );
    }

    // 2. Validar corpo da requisição
    const body = await req.json();
    const {
      name,
      email,
      phone,
      birthDate,
      address,
      notes,
      preferences = [],
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // 3. Verificar se telefone já existe no salão
    if (phone) {
      const existingClient = await prisma.client.findFirst({
        where: {
          salonId: auth.user.salonId,
          phone,
        },
      });

      if (existingClient) {
        return NextResponse.json(
          { error: 'Já existe um cliente com este telefone' },
          { status: 409 }
        );
      }
    }

    // 4. Criar cliente
    const cliente = await prisma.client.create({
      data: {
        name,
        email: email || null,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        address: address || null,
        notes: notes || null,
        preferences,
        status: 'ACTIVE',
        salonId: auth.user.salonId, // 🔒 Associar ao salão do usuário
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      cliente: {
        id: cliente.id,
        name: cliente.name,
        email: cliente.email,
        phone: cliente.phone,
        birthDate: cliente.birthDate,
        address: cliente.address,
        notes: cliente.notes,
        preferences: cliente.preferences,
        status: cliente.status,
        createdAt: cliente.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar cliente' },
      { status: 500 }
    );
  }
}
