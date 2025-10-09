export interface License {
  id: string;
  licenseKey: string;
  planType: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'suspended' | 'pending';
  clientId: string;
  clientName: string;
  clientEmail: string;
  createdAt: Date;
  expiresAt: Date;
  maxUsers: number;
  features: LicenseFeature[];
  paymentStatus: 'paid' | 'pending' | 'failed';
  renewalDate?: Date;
}

export interface LicenseFeature {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  cnpj?: string;
  address: Address;
  licenses: License[];
  createdAt: Date;
  status: 'active' | 'inactive' | 'blocked';
  totalRevenue: number;
}

export interface Address {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  permissions: string[];
  lastLogin: Date;
}

export interface SalonUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  clientId: string;
  licenseId: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface PlanConfig {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  price: number;
  duration: number; // em meses
  maxUsers: number;
  features: LicenseFeature[];
  description: string;
  popular?: boolean;
}