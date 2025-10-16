// services/NotificationService.ts
// Sistema completo de notificações: Push, Email, SMS e Agendadas

import WhatsAppService from './WhatsAppService';

export interface NotificationConfig {
  enabled: boolean;
  channels: ('push' | 'email' | 'sms' | 'whatsapp')[];
  timing: {
    confirmation: boolean; // Imediato após agendamento
    reminder24h: boolean; // 24h antes
    reminder2h: boolean; // 2h antes
    custom: { hours: number; enabled: boolean }[]; // Lembretes customizados
  };
  templates: {
    confirmation: string;
    reminder: string;
    cancellation: string;
    rescheduling: string;
  };
}

export interface NotificationData {
  id: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'rescheduling' | 'custom';
  channel: 'push' | 'email' | 'sms' | 'whatsapp';
  recipient: {
    name: string;
    email?: string;
    phone?: string;
    pushToken?: string;
  };
  agendamento: {
    id: string;
    data: string;
    hora: string;
    servico: string;
    profissional: string;
    salao: string;
    endereco?: string;
  };
  scheduledFor?: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

class NotificationService {
  private config: NotificationConfig;
  private notifications: NotificationData[] = [];
  private pushSubscription: PushSubscription | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.initializePushNotifications();
    this.startScheduler();
  }

  // Configuração padrão
  private getDefaultConfig(): NotificationConfig {
    return {
      enabled: true,
      channels: ['push', 'whatsapp'],
      timing: {
        confirmation: true,
        reminder24h: true,
        reminder2h: true,
        custom: [
          { hours: 48, enabled: false }, // 2 dias antes
          { hours: 1, enabled: false }   // 1 hora antes
        ]
      },
      templates: {
        confirmation: '✅ Agendamento confirmado para {data} às {hora}. Serviço: {servico} com {profissional}.',
        reminder: '⏰ Lembrete: Você tem agendamento amanhã às {hora}. Serviço: {servico} com {profissional}.',
        cancellation: '❌ Seu agendamento para {data} às {hora} foi cancelado. Entre em contato para reagendar.',
        rescheduling: '📅 Seu agendamento foi reagendado. Nova data: {data} às {hora}. Serviço: {servico}.'
      }
    };
  }

  private loadConfig(): NotificationConfig {
    if (typeof window === 'undefined') {
      return this.getDefaultConfig();
    }
    const saved = localStorage.getItem('notification-config');
    return saved ? JSON.parse(saved) : this.getDefaultConfig();
  }

  private saveConfig(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notification-config', JSON.stringify(this.config));
    }
  }

  // Push Notifications
  private async initializePushNotifications(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        
        // Verificar se já tem permissão
        if (Notification.permission === 'granted') {
          await this.subscribeToPush(registration);
        }
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }

  async requestPushPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser não suporta notificações');
      return false;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await this.subscribeToPush(registration);
      return true;
    }
    
    return false;
  }

  private async subscribeToPush(registration: ServiceWorkerRegistration): Promise<void> {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ) as any
      });
      
      this.pushSubscription = subscription;
      
      // Enviar subscription para o servidor
      await this.sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('Erro ao inscrever para push:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Erro ao enviar subscription:', error);
    }
  }

  // Agendar notificação
  async scheduleNotification(
    type: NotificationData['type'],
    agendamentoData: NotificationData['agendamento'],
    recipient: NotificationData['recipient'],
    customMessage?: string
  ): Promise<void> {
    if (!this.config.enabled) return;

    const agendamentoDate = new Date(`${agendamentoData.data}T${agendamentoData.hora}`);
    const notifications: Partial<NotificationData>[] = [];

    // Confirmação imediata
    if (type === 'confirmation' && this.config.timing.confirmation) {
      notifications.push({
        type: 'confirmation',
        scheduledFor: new Date(), // Imediato
      });
    }

    // Lembretes programados
    if (type === 'confirmation') {
      // 24h antes
      if (this.config.timing.reminder24h) {
        const reminder24h = new Date(agendamentoDate.getTime() - 24 * 60 * 60 * 1000);
        if (reminder24h > new Date()) {
          notifications.push({
            type: 'reminder',
            scheduledFor: reminder24h,
          });
        }
      }

      // 2h antes
      if (this.config.timing.reminder2h) {
        const reminder2h = new Date(agendamentoDate.getTime() - 2 * 60 * 60 * 1000);
        if (reminder2h > new Date()) {
          notifications.push({
            type: 'reminder',
            scheduledFor: reminder2h,
          });
        }
      }

      // Lembretes customizados
      this.config.timing.custom.forEach(custom => {
        if (custom.enabled) {
          const customTime = new Date(agendamentoDate.getTime() - custom.hours * 60 * 60 * 1000);
          if (customTime > new Date()) {
            notifications.push({
              type: 'reminder',
              scheduledFor: customTime,
            });
          }
        }
      });
    }

    // Criar notificações para cada canal configurado
    for (const notificationBase of notifications) {
      for (const channel of this.config.channels) {
        const notification: NotificationData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: notificationBase.type || type,
          channel,
          recipient,
          agendamento: agendamentoData,
          scheduledFor: notificationBase.scheduledFor,
          status: 'pending',
          createdAt: new Date(),
          ...(customMessage && { customMessage })
        };

        this.notifications.push(notification);
      }
    }

    this.saveNotifications();
  }

  // Enviar notificação imediata
  async sendNotification(notificationId: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification || notification.status !== 'pending') {
      return false;
    }

    try {
      const message = this.buildMessage(notification);
      let success = false;

      switch (notification.channel) {
        case 'push':
          success = await this.sendPushNotification(notification, message);
          break;
        case 'email':
          success = await this.sendEmailNotification(notification, message);
          break;
        case 'whatsapp':
          success = await this.sendWhatsAppNotification(notification, message);
          break;
        case 'sms':
          success = await this.sendSMSNotification(notification, message);
          break;
      }

      // Atualizar status
      notification.status = success ? 'sent' : 'failed';
      notification.sentAt = new Date();
      
      if (!success) {
        notification.error = 'Falha no envio';
      }

      this.saveNotifications();
      return success;
    } catch (error) {
      notification.status = 'failed';
      notification.error = error instanceof Error ? error.message : 'Erro desconhecido';
      this.saveNotifications();
      return false;
    }
  }

  // Implementações específicas de cada canal
  private async sendPushNotification(notification: NotificationData, message: string): Promise<boolean> {
    if (!this.pushSubscription) return false;

    try {
      // Enviar para servidor que fará o push
      const response = await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.pushSubscription,
          message,
          title: `Agendamento - ${notification.agendamento.salao}`,
          data: {
            agendamentoId: notification.agendamento.id,
            type: notification.type
          }
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao enviar push notification:', error);
      return false;
    }
  }

  private async sendEmailNotification(notification: NotificationData, message: string): Promise<boolean> {
    if (!notification.recipient.email) return false;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: notification.recipient.email,
          subject: `Agendamento - ${notification.agendamento.salao}`,
          html: this.buildEmailHTML(notification, message),
          text: message
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  private async sendWhatsAppNotification(notification: NotificationData, message: string): Promise<boolean> {
    if (!notification.recipient.phone) return false;

    try {
      return await WhatsAppService.enviarMensagem(notification.recipient.phone, message);
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      return false;
    }
  }

  private async sendSMSNotification(notification: NotificationData, message: string): Promise<boolean> {
    if (!notification.recipient.phone) return false;

    try {
      // Integração com serviço de SMS (ex: Twilio, Zenvia)
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: notification.recipient.phone,
          message: message.substring(0, 160) // Limitar SMS
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return false;
    }
  }

  // Construir mensagem personalizada
  private buildMessage(notification: NotificationData): string {
    const template = (this.config.templates as any)[notification.type] || '';
    
    return template
      .replace('{data}', this.formatDate(notification.agendamento.data))
      .replace('{hora}', notification.agendamento.hora)
      .replace('{servico}', notification.agendamento.servico)
      .replace('{profissional}', notification.agendamento.profissional)
      .replace('{salao}', notification.agendamento.salao)
      .replace('{endereco}', notification.agendamento.endereco || '')
      .replace('{nome}', notification.recipient.name);
  }

  private buildEmailHTML(notification: NotificationData, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Agendamento - ${notification.agendamento.salao}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
          .details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💇‍♀️ ${notification.agendamento.salao}</h1>
            <p>Informações do seu agendamento</p>
          </div>
          <div class="content">
            <h2>Olá, ${notification.recipient.name}!</h2>
            <p>${message}</p>
            
            <div class="details">
              <h3>📋 Detalhes do Agendamento:</h3>
              <p><strong>📅 Data:</strong> ${this.formatDate(notification.agendamento.data)}</p>
              <p><strong>⏰ Horário:</strong> ${notification.agendamento.hora}</p>
              <p><strong>💇 Serviço:</strong> ${notification.agendamento.servico}</p>
              <p><strong>👨‍💼 Profissional:</strong> ${notification.agendamento.profissional}</p>
              ${notification.agendamento.endereco ? `<p><strong>📍 Local:</strong> ${notification.agendamento.endereco}</p>` : ''}
            </div>
            
            <p>⏰ <strong>Importante:</strong> Chegue com 10 minutos de antecedência.</p>
            
            <a href="tel:${notification.recipient.phone}" class="button">📞 Entrar em Contato</a>
          </div>
          <div class="footer">
            <p>Esta é uma mensagem automática do sistema de agendamentos.</p>
            <p>© 2024 ${notification.agendamento.salao} - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Scheduler para envio automático
  private startScheduler(): void {
    setInterval(() => {
      this.processScheduledNotifications();
    }, 60000); // Verificar a cada minuto
  }

  private async processScheduledNotifications(): Promise<void> {
    const now = new Date();
    const pendingNotifications = this.notifications.filter(
      n => n.status === 'pending' && 
           n.scheduledFor && 
           n.scheduledFor <= now
    );

    for (const notification of pendingNotifications) {
      await this.sendNotification(notification.id);
    }
  }

  // Utilitários
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private saveNotifications(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
  }

  private loadNotifications(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const saved = localStorage.getItem('notifications');
    if (saved) {
      this.notifications = JSON.parse(saved).map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        scheduledFor: n.scheduledFor ? new Date(n.scheduledFor) : undefined,
        sentAt: n.sentAt ? new Date(n.sentAt) : undefined
      }));
    }
  }

  // API pública
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  getNotifications(filter?: {
    status?: NotificationData['status'];
    type?: NotificationData['type'];
    channel?: NotificationData['channel'];
  }): NotificationData[] {
    let filtered = [...this.notifications];
    
    if (filter) {
      if (filter.status) filtered = filtered.filter(n => n.status === filter.status);
      if (filter.type) filtered = filtered.filter(n => n.type === filter.type);
      if (filter.channel) filtered = filtered.filter(n => n.channel === filter.channel);
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async cancelNotification(notificationId: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && notification.status === 'pending') {
      notification.status = 'cancelled';
      this.saveNotifications();
      return true;
    }
    return false;
  }

  getStats(): {
    total: number;
    sent: number;
    pending: number;
    failed: number;
    byChannel: Record<string, number>;
    byType: Record<string, number>;
  } {
    const stats = {
      total: this.notifications.length,
      sent: this.notifications.filter(n => n.status === 'sent').length,
      pending: this.notifications.filter(n => n.status === 'pending').length,
      failed: this.notifications.filter(n => n.status === 'failed').length,
      byChannel: {} as Record<string, number>,
      byType: {} as Record<string, number>
    };

    this.notifications.forEach(n => {
      stats.byChannel[n.channel] = (stats.byChannel[n.channel] || 0) + 1;
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    });

    return stats;
  }
}

export default new NotificationService();