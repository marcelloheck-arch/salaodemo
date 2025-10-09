export interface WorkingHours {
  id: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, etc.
  dayName: string;
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
  breakStart?: string; // "12:00"
  breakEnd?: string; // "14:00"
  maxConcurrentAppointments: number;
}

export interface TimeSlot {
  id: string;
  time: string; // "09:00"
  isAvailable: boolean;
  isBreak: boolean;
  appointments: AppointmentSlot[];
}

export interface AppointmentSlot {
  id: string;
  clientName: string;
  serviceName: string;
  professionalName: string;
  duration: number;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  googleEventId?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  description?: string;
  status: string;
}

export interface CalendarSettings {
  googleCalendarIntegration: boolean;
  googleCalendarId: string;
  autoSyncEnabled: boolean;
  defaultTimeSlotDuration: number; // em minutos
  advanceBookingDays: number;
  bufferTimeBetweenAppointments: number; // em minutos
}