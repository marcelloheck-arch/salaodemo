export interface Professional {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string; // Ex: "Cabeleireiro", "Manicure", "Esteticista"
  commissionRate: number; // Percentual de comissão (0-100)
  isActive: boolean;
  hireDate: string;
  specialties: string[];
  avatar?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // em minutos
  commission: number; // percentual
  isActive: boolean;
}

export interface FinancialTransaction {
  id: string;
  appointmentId?: string; // ID do agendamento que gerou esta transação
  type: 'service' | 'product' | 'commission' | 'expense';
  amount: number;
  date: string;
  time?: string; // Hora da transação
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  commissionRate?: number; // Percentual da comissão
  commissionAmount: number;
  paymentMethod: 'cash' | 'card' | 'pix' | 'transfer';
  status: 'pending' | 'paid' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  professionalId: string;
  professionalName: string;
  transactionId: string;
  amount: number;
  percentage: number;
  date: string;
  status: 'pending' | 'paid';
  paymentDate?: string;
  notes?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  serviceRevenue: number;
  averageTicket: number;
  totalClients: number;
  totalTransactions: number;
  pendingCommissions: number;
  totalCommissions: number;
  revenueByProfessional: { [key: string]: number };
  revenueByService: { [key: string]: number };
  commissionsByProfessional: { [key: string]: number };
}

export interface DateFilter {
  startDate: string;
  endDate: string;
  professionalId?: string;
}