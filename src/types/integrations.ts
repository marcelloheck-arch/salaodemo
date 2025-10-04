// Tipos para o sistema de autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'employee';
  avatar?: string;
  salonId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipos para integrações WhatsApp
export interface WhatsAppMessage {
  id: string;
  to: string;
  message: string;
  type: 'confirmation' | 'reminder' | 'custom';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  scheduledFor?: Date;
  sentAt?: Date;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  type: 'confirmation' | 'reminder' | 'promotion' | 'welcome';
}

export interface WhatsAppConfig {
  enabled: boolean;
  phoneNumber: string;
  apiKey: string;
  webhookUrl?: string;
  autoConfirmation: boolean;
  reminderHours: number[];
  templates: WhatsAppTemplate[];
}

// Tipos para integração Google Calendar
export interface GoogleCalendarEvent {
  id: string;
  appointmentId: string;
  googleEventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees: string[];
  color?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface GoogleCalendarConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  calendarId: string;
  syncBidirectional: boolean;
  defaultColor: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: Date;
}

// Tipos para notificações
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

export interface NotificationSettings {
  email: {
    newBookings: boolean;
    cancellations: boolean;
    dailyReport: boolean;
    weeklyReport: boolean;
    reminderFailures: boolean;
  };
  push: {
    clientArrival: boolean;
    upcomingAppointment: boolean;
    unconfirmedBookings: boolean;
    dailyGoalReached: boolean;
  };
  whatsapp: {
    enabled: boolean;
    adminNumber: string;
    criticalAlerts: boolean;
  };
}

// Tipos para perfil do salão
export interface SalonProfile {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  logo?: string;
  description: string;
  website?: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      closed: boolean;
    };
  };
  services: SalonService[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SalonService {
  id: string;
  name: string;
  description?: string;
  duration: number; // em minutos
  price: number;
  category: string;
  active: boolean;
  professionals: string[]; // IDs dos profissionais
}

// Tipos para sistema de logs/auditoria
export interface SystemLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Tipos para configurações do sistema
export interface SystemSettings {
  salon: SalonProfile;
  integrations: {
    whatsapp: WhatsAppConfig;
    googleCalendar: GoogleCalendarConfig;
  };
  notifications: NotificationSettings;
  security: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
  };
  business: {
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
  };
}

// Tipos para integrações de pagamento (futuro)
export interface PaymentProvider {
  id: string;
  name: string;
  type: 'pix' | 'credit_card' | 'debit_card' | 'cash';
  config: Record<string, any>;
  enabled: boolean;
}

// Tipos para backup e sincronização
export interface BackupInfo {
  id: string;
  type: 'automatic' | 'manual';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  size: number;
  createdAt: Date;
  downloadUrl?: string;
}

export interface SyncStatus {
  whatsapp: {
    lastSync: Date;
    status: 'connected' | 'disconnected' | 'error';
    messagesSent: number;
    errors: number;
  };
  googleCalendar: {
    lastSync: Date;
    status: 'connected' | 'disconnected' | 'error';
    eventsSynced: number;
    conflicts: number;
  };
}