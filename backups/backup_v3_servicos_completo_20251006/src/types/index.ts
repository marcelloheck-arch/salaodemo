export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  birthday?: Date;
  preferences?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professional {
  id: string;
  name: string;
  avatar?: string;
  specialties: string[];
  commissionRate: number;
  isActive: boolean;
  workingHours: {
    start: string;
    end: string;
    daysOff: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // em minutos
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  clientId: string;
  client?: Client;
  professionalId: string;
  professional?: Professional;
  serviceIds: string[];
  services?: Service[];
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'cash' | 'card' | 'pix' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  professionalId: string;
  professional?: Professional;
  appointmentId: string;
  appointment?: Appointment;
  amount: number;
  rate: number;
  status: 'pending' | 'paid';
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentForm {
  clientType: 'existing' | 'new';
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  professionalId: string;
  serviceIds: string[];
  date: string;
  startTime: string;
  notes?: string;
}