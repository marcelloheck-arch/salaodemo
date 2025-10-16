import React from 'react';
import { X } from 'lucide-react';
import { format, addHours, startOfWeek, addDays, isSameDay, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WorkingHours, AppointmentSlot } from '../types/schedule';

interface TimeSlotInfo {
  time: string;
  isAvailable: boolean;
  appointment?: AppointmentSlot;
  date: Date;
}

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  workingHours: WorkingHours[];
  appointments: AppointmentSlot[];
  onTimeSlotClick?: (date: Date, time: string) => void;
}

export const AgendaModal: React.FC<AgendaModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  workingHours,
  appointments,
  onTimeSlotClick
}) => {
  if (!isOpen) return null;

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const generateTimeSlots = (dayIndex: number) => {
    // dayIndex: 0=Segunda, 1=Terça, ..., 6=Domingo
    // dayOfWeek no WorkingHours: 1=Segunda, 2=Terça, ..., 0=Domingo
    const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1;
    const daySettings = workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
    
    if (!daySettings || !daySettings.isOpen) return [];

    const slots = [];
    let currentTime = parse(daySettings.openTime, 'HH:mm', new Date());
    const endTime = parse(daySettings.closeTime, 'HH:mm', new Date());
    const lunchStart = daySettings.breakStart ? parse(daySettings.breakStart, 'HH:mm', new Date()) : null;
    const lunchEnd = daySettings.breakEnd ? parse(daySettings.breakEnd, 'HH:mm', new Date()) : null;

    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      
      // Verificar se está no horário de almoço
      const isLunchTime = lunchStart && lunchEnd && 
        currentTime >= lunchStart && currentTime < lunchEnd;

      if (!isLunchTime) {
        const currentDate = days[dayIndex];
        
        // Para demonstração, vamos simular alguns agendamentos
        const mockAppointment = (timeString === '10:00' && dayIndex === 0) ? {
          id: '1',
          clientName: 'Maria Silva',
          serviceName: 'Corte + Escova'
        } : (timeString === '14:30' && dayIndex === 2) ? {
          id: '2', 
          clientName: 'João Santos',
          serviceName: 'Corte Masculino'
        } : null;

        slots.push({
          time: timeString,
          isAvailable: !mockAppointment,
          appointment: mockAppointment,
          date: currentDate
        });
      }

      currentTime = addHours(currentTime, 0.5); // 30 minutos
    }

    return slots;
  };

  const allTimeSlots = Array.from(
    new Set(
      days.flatMap((_, dayIndex) => 
        generateTimeSlots(dayIndex).map(slot => slot.time)
      )
    )
  ).sort();

  const handleSlotClick = (date: Date, time: string) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(date, time);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Agenda da Semana
            </h2>
            <p className="text-purple-200 mt-1">
              {format(weekStart, 'dd/MM', { locale: ptBR })} - {format(addDays(weekStart, 6), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Agenda Grid */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-8 gap-2">
            {/* Header com horários */}
            <div className="text-center font-medium text-purple-200 text-sm">
              Horário
            </div>
            {days.map((day, index) => (
              <div key={day.toISOString()} className="text-center">
                <div className="text-sm font-medium text-white">
                  {dayNames[index]}
                </div>
                <div className={`text-xs mt-1 ${
                  isSameDay(day, selectedDate) 
                    ? 'text-pink-300 font-bold' 
                    : 'text-purple-200'
                }`}>
                  {format(day, 'dd/MM', { locale: ptBR })}
                </div>
              </div>
            ))}

            {/* Slots de tempo */}
            {allTimeSlots.map(time => (
              <React.Fragment key={time}>
                <div className="text-center text-sm text-purple-200 font-medium py-2">
                  {time}
                </div>
                {days.map((day, dayIndex) => {
                  const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1;
                  const daySettings = workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
                  
                  if (!daySettings || !daySettings.isOpen) {
                    return (
                      <div 
                        key={`${day.toISOString()}-${time}`}
                        className="h-12 bg-gray-500/20 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-xs text-gray-400">Fechado</span>
                      </div>
                    );
                  }

                  const timeSlots = generateTimeSlots(dayIndex);
                  const slot = timeSlots.find(s => s.time === time);

                  if (!slot) {
                    return (
                      <div 
                        key={`${day.toISOString()}-${time}`}
                        className="h-12 bg-gray-600/20 rounded-lg"
                      />
                    );
                  }

                  return (
                    <button
                      key={`${day.toISOString()}-${time}`}
                      onClick={() => handleSlotClick(day, time)}
                      className={`h-12 rounded-lg transition-all duration-200 text-xs font-medium ${
                        slot.isAvailable
                          ? 'bg-green-500/30 hover:bg-green-500/40 text-green-200 border border-green-400/30'
                          : 'bg-red-500/30 hover:bg-red-500/40 text-red-200 border border-red-400/30'
                      } hover:scale-105 hover:shadow-lg`}
                    >
                      {slot.isAvailable ? (
                        'Livre'
                      ) : (
                        <div className="px-1">
                          <div className="font-bold">{slot.appointment?.clientName}</div>
                          <div className="text-xs opacity-80">{slot.appointment?.serviceName}</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/5">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/30 border border-green-400/30 rounded"></div>
              <span className="text-green-200">Horário Livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/30 border border-red-400/30 rounded"></div>
              <span className="text-red-200">Horário Ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500/20 rounded"></div>
              <span className="text-gray-400">Fechado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};