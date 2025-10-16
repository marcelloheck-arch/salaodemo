'use server';

import { prisma } from '@/lib/prisma';

// Tipos para o frontend (usando os tipos existentes)
export interface LicenseWithFeatures {
  id: string;
  licenseKey: string;
  planType: string;
  status: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  createdAt: Date;
  expiresAt: Date;
  maxUsers: number;
  paymentStatus: string;
  renewalDate: Date | null;
  features: {
    id: string;
    name: string;
    enabled: boolean;
    description: string | null;
  }[];
}

export interface SimpleClient {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  licenseKey?: string | null;
  status: string;
  createdAt: Date;
}

// Serviços de licenças
export async function getAllLicenses(): Promise<LicenseWithFeatures[]> {
  try {
    const licenses = await prisma.license.findMany({
      include: {
        features: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return licenses.map((license: any) => ({
      ...license,
      planType: license.planType.toLowerCase(),
      status: license.status.toLowerCase(),
      paymentStatus: license.paymentStatus.toLowerCase()
    }));
  } catch (error) {
    console.error('Erro ao buscar licenças:', error);
    return [];
  }
}

export async function createLicense(data: {
  licenseKey: string;
  planType: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  expiresAt: Date;
  maxUsers: number;
  features: { name: string; enabled: boolean; description?: string }[];
}): Promise<LicenseWithFeatures | null> {
  try {
    // Mapear planType string para enum
    const planTypeMap: { [key: string]: any } = {
      'basic': 'BASIC',
      'premium': 'PREMIUM',
      'enterprise': 'ENTERPRISE'
    };

    const license = await prisma.license.create({
      data: {
        licenseKey: data.licenseKey,
        planType: planTypeMap[data.planType] || 'BASIC',
        status: 'PENDING',
        clientId: data.clientId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        expiresAt: data.expiresAt,
        maxUsers: data.maxUsers,
        paymentStatus: 'PENDING',
        features: {
          create: data.features.map(feature => ({
            name: feature.name,
            enabled: feature.enabled,
            description: feature.description || null
          }))
        }
      },
      include: {
        features: true
      }
    });

    // Criar ou atualizar cliente
    await upsertLicenseClient({
      id: data.clientId,
      name: data.clientName,
      email: data.clientEmail,
      licenseKey: data.licenseKey
    });

    return {
      ...license,
      planType: license.planType.toLowerCase(),
      status: license.status.toLowerCase(),
      paymentStatus: license.paymentStatus.toLowerCase(),
      features: license.features.map(f => ({
        id: f.id,
        name: f.name,
        enabled: f.enabled,
        description: f.description
      }))
    };
  } catch (error) {
    console.error('Erro ao criar licença:', error);
    return null;
  }
}

export async function updateLicense(
  licenseId: string, 
  data: Partial<{
    status: string;
    expiresAt: Date;
    renewalDate: Date;
  }>
): Promise<LicenseWithFeatures | null> {
  try {
    // Mapear status string para enum
    const statusMap: { [key: string]: string } = {
      'active': 'ACTIVE',
      'expired': 'EXPIRED',
      'suspended': 'SUSPENDED',
      'pending': 'PENDING'
    };

    const updateData: any = {};
    
    if (data.status) {
      updateData.status = statusMap[data.status] || 'PENDING';
    }
    
    if (data.expiresAt) {
      updateData.expiresAt = data.expiresAt;
    }
    
    if (data.renewalDate) {
      updateData.renewalDate = data.renewalDate;
    }

    const license = await prisma.license.update({
      where: { id: licenseId },
      data: updateData,
      include: {
        features: true
      }
    });

    return {
      ...license,
      planType: license.planType.toLowerCase(),
      status: license.status.toLowerCase(),
      paymentStatus: license.paymentStatus.toLowerCase()
    };
  } catch (error) {
    console.error('Erro ao atualizar licença:', error);
    return null;
  }
}

export async function deleteLicense(licenseId: string): Promise<boolean> {
  try {
    await prisma.license.delete({
      where: { id: licenseId }
    });
    return true;
  } catch (error) {
    console.error('Erro ao deletar licença:', error);
    return false;
  }
}

// Serviços de clientes
export async function getAllLicenseClients(): Promise<SimpleClient[]> {
  try {
    const clients = await prisma.licenseClient.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return clients.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      licenseKey: client.licenseKey,
      status: client.status.toLowerCase(),
      createdAt: client.createdAt
    }));
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

export async function upsertLicenseClient(data: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  licenseKey?: string;
}): Promise<SimpleClient | null> {
  try {
    const client = await prisma.licenseClient.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        licenseKey: data.licenseKey || null,
        phone: data.phone || null
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        licenseKey: data.licenseKey || null
      }
    });

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      licenseKey: client.licenseKey,
      status: client.status.toLowerCase(),
      createdAt: client.createdAt
    };
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    return null;
  }
}

// Estatísticas
export async function getLicenseStats() {
  try {
    const [total, active, expired, expiringSoon] = await Promise.all([
      prisma.license.count(),
      prisma.license.count({ where: { status: 'ACTIVE' } }),
      prisma.license.count({ where: { status: 'EXPIRED' } }),
      prisma.license.count({
        where: {
          status: 'ACTIVE',
          expiresAt: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
          }
        }
      })
    ]);

    return { total, active, expired, expiringSoon };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { total: 0, active: 0, expired: 0, expiringSoon: 0 };
  }
}