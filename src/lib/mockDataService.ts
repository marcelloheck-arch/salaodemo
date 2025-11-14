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
      });
    }

    // Serviços
    const services: MockService[] = [
      { id: 'service_1', name: 'Corte Feminino', price: 45, duration: 60, category: 'corte', popularity: 95 },
      { id: 'service_2', name: 'Escova', price: 35, duration: 45, category: 'penteado', popularity: 85 },
      { id: 'service_3', name: 'Tintura', price: 120, duration: 120, category: 'coloracao', popularity: 70 },
      { id: 'service_4', name: 'Mechas', price: 180, duration: 180, category: 'coloracao', popularity: 60 },
      { id: 'service_5', name: 'Hidratação', price: 60, duration: 90, category: 'tratamento', popularity: 80 },
      { id: 'service_6', name: 'Progressiva', price: 200, duration: 240, category: 'tratamento', popularity: 45 },
      { id: 'service_7', name: 'Sobrancelha', price: 25, duration: 30, category: 'estetica', popularity: 90 },
      { id: 'service_8', name: 'Manicure', price: 30, duration: 60, category: 'unhas', popularity: 85 },
      { id: 'service_9', name: 'Pedicure', price: 35, duration: 60, category: 'unhas', popularity: 80 },
      { id: 'service_10', name: 'Unhas em Gel', price: 80, duration: 90, category: 'unhas', popularity: 65 }
    ];

    // Profissionais
    const staff: MockStaff[] = [
      {
        id: 'staff_1',
        name: 'Marina Souza',
        specialties: ['corte', 'coloracao'],
        hourlyRate: 40,
        workingHours: { start: '08:00', end: '18:00', daysOff: [0] } // Não trabalha domingo
      },
      {
        id: 'staff_2',
        name: 'Carla Santos',
        specialties: ['penteado', 'tratamento'],
        hourlyRate: 35,
        workingHours: { start: '09:00', end: '17:00', daysOff: [0, 1] } // Não trabalha domingo e segunda
      },
      {
        id: 'staff_3',
        name: 'Ana Lima',
        specialties: ['unhas', 'estetica'],
        hourlyRate: 30,
        workingHours: { start: '08:00', end: '16:00', daysOff: [0] } // Não trabalha domingo
      }
    ];

    // Gerar agendamentos e transações para últimos 60 dias
    const appointments: MockAppointment[] = [];
    const transactions: MockTransaction[] = [];
    let appointmentId = 1;
    let transactionId = 1;

    for (let day = 60; day >= 0; day--) {
      const currentDate = subDays(new Date(), day);
      const dayOfWeek = currentDate.getDay();
      
      // Pular domingos
      if (dayOfWeek === 0) continue;

      // Número de agendamentos por dia
      let numAppointments;
      if (dayOfWeek === 6) { // Sábado
        numAppointments = Math.floor(Math.random() * 8) + 12; // 12-20
      } else { // Segunda a sexta
        numAppointments = Math.floor(Math.random() * 6) + 8; // 8-14
      }

      for (let i = 0; i < numAppointments; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        const availableStaff = staff.filter(s => s.specialties.includes(service.category));
        const selectedStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];

        const hour = Math.floor(Math.random() * 9) + 8; // 8h às 17h
        const minute = Math.random() < 0.5 ? 0 : 30;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Status do agendamento
        const statusRandom = Math.random();
        let status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
        if (day === 0) { // Hoje
          status = statusRandom < 0.7 ? 'scheduled' : 'completed';
        } else { // Dias passados
          if (statusRandom < 0.85) status = 'completed';
          else if (statusRandom < 0.95) status = 'cancelled';
          else status = 'no_show';
        }

        const appointment: MockAppointment = {
          id: `appointment_${appointmentId}`,
          clientId: client.id,
          serviceId: service.id,
          staffId: selectedStaff.id,
          date: format(currentDate, 'yyyy-MM-dd'),
          time,
          status,
          totalPrice: service.price,
          notes: Math.random() < 0.3 ? 'Cliente fidelidade' : undefined
        };
        appointments.push(appointment);

        // Criar transação se o agendamento foi completado
        if (status === 'completed') {
          const discount = Math.random() < 0.15 ? Math.random() * 0.2 : 0; // 15% chance de desconto
          const finalAmount = service.price * (1 - discount);
          
          const paymentMethods = ['dinheiro', 'cartao_debito', 'cartao_credito', 'pix'] as const;
          const paymentWeights = [0.2, 0.25, 0.35, 0.2];
          const randomValue = Math.random();
          let paymentMethod: typeof paymentMethods[number] = 'dinheiro';
          
          let cumulativeWeight = 0;
          for (let j = 0; j < paymentMethods.length; j++) {
            cumulativeWeight += paymentWeights[j];
            if (randomValue <= cumulativeWeight) {
              paymentMethod = paymentMethods[j];
              break;
            }
          }

          const transaction: MockTransaction = {
            id: `transaction_${transactionId}`,
            appointmentId: appointment.id,
            clientId: client.id,
            amount: Math.round(finalAmount * 100) / 100,
            paymentMethod,
            date: format(currentDate, 'yyyy-MM-dd'),
            time,
            serviceName: service.name,
            staffName: selectedStaff.name,
            discount
          };
          transactions.push(transaction);
          
          // Atualizar total gasto do cliente
          client.totalSpent += finalAmount;
          
          transactionId++;
        }

        appointmentId++;
      }
    }

    // Arredondar totais dos clientes
    clients.forEach(client => {
      client.totalSpent = Math.round(client.totalSpent * 100) / 100;
    });

    this.data = {
      clients,
      services,
      staff,
      appointments,
      transactions
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