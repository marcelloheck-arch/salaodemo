// Mock Data Service - Simula dados reais de um salão funcionando
import { addDays, subDays, format, startOfMonth, endOfMonth } from 'date-fns';

export interface MockClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  createdAt: string;
  totalSpent: number;
  lastVisit: string;
  segment: 'premium' | 'regular' | 'occasional';
}

export interface MockService {
  id: string;
  name: string;
  price: number;
  duration: number; // em minutos
  category: string;
  popularity: number;
}

export interface MockAppointment {
  id: string;
  clientId: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  totalPrice: number;
  notes?: string;
}

export interface MockTransaction {
  id: string;
  appointmentId: string;
  clientId: string;
  amount: number;
  paymentMethod: 'dinheiro' | 'cartao_debito' | 'cartao_credito' | 'pix';
  date: string;
  time: string;
  serviceName: string;
  staffName: string;
  discount: number;
}

export interface MockStaff {
  id: string;
  name: string;
  specialties: string[];
  hourlyRate: number;
  workingHours: {
    start: string;
    end: string;
    daysOff: number[]; // 0 = domingo, 1 = segunda...
  };
}

class MockDataService {
  private static instance: MockDataService;
  private data: {
    clients: MockClient[];
    services: MockService[];
    staff: MockStaff[];
    appointments: MockAppointment[];
    transactions: MockTransaction[];
  } | null = null;

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private generateMockData() {
    if (this.data) return this.data;

    // Sistema limpo - sem dados simulados para vendas/testes
    // Novos usuários começam com dados vazios
    this.data = {
      clients: [],
      services: [],
      staff: [],
      appointments: [],
      transactions: []
    };

    return this.data;
  }

  // Métodos públicos para acessar os dados
  public getClients(): MockClient[] {
    return this.generateMockData().clients;
  }

  public getServices(): MockService[] {
    return this.generateMockData().services;
  }

  public getStaff(): MockStaff[] {
    return this.generateMockData().staff;
  }

  public getAppointments(): MockAppointment[] {
    return this.generateMockData().appointments;
  }

  public getTransactions(): MockTransaction[] {
    return this.generateMockData().transactions;
  }

  public getAllData() {
    return this.generateMockData();
  }

  // Métodos para analytics
  public getRevenueData(days: number = 30) {
    const transactions = this.getTransactions();
    const cutoffDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
    
    return transactions
      .filter(t => t.date >= cutoffDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  public getTopClients(limit: number = 10) {
    return this.getClients()
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  public getServicePerformance() {
    const transactions = this.getTransactions();
    const services = this.getServices();
    
    const performance = services.map(service => {
      const serviceTransactions = transactions.filter(t => t.serviceName === service.name);
      const totalRevenue = serviceTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalBookings = serviceTransactions.length;
      
      return {
        ...service,
        totalRevenue,
        totalBookings,
        avgPrice: totalBookings > 0 ? totalRevenue / totalBookings : 0
      };
    });
    
    return performance.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }
}

export default MockDataService.getInstance();