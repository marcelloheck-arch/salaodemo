// Sistema de notificações por email para administradores

import { UserRegistration, SYSTEM_FEATURES } from '@/types/license';

export interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  corpo: string;
  variaveis: string[];
}

export interface EmailNotification {
  id: string;
  para: string;
  assunto: string;
  corpo: string;
  dataEnvio: Date;
  status: 'enviado' | 'pendente' | 'erro';
  tentativas: number;
  tipoNotificacao: 'novo_cadastro' | 'licenca_gerada' | 'licenca_expirada' | 'pagamento_pendente';
}

// Templates de email
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'novo_cadastro_admin',
    nome: 'Notificação de Novo Cadastro (Admin)',
    assunto: '[AGENDA SALÃO] Novo cadastro: {{nomeEmpresa}}',
    corpo: `
Olá Administrador,

Um novo usuário solicitou acesso ao sistema Agenda Salão:

👤 DADOS DO SOLICITANTE:
• Nome: {{nome}}
• Email: {{email}}
• Telefone: {{telefone}}
• Empresa: {{nomeEmpresa}}
• CNPJ: {{cnpj}}
• Endereço: {{endereco}}
• Cidade: {{cidade}}/{{estado}}
• Data do Cadastro: {{dataCadastro}}

📝 OBSERVAÇÕES:
{{observacoes}}

🔗 AÇÕES NECESSÁRIAS:
1. Acesse o painel administrativo
2. Analise os dados do solicitante
3. Gere a licença personalizada
4. Envie as credenciais para o cliente

Link do painel: https://agendasalao.com/admin

Atenciosamente,
Sistema Agenda Salão
    `,
    variaveis: ['nome', 'email', 'telefone', 'nomeEmpresa', 'cnpj', 'endereco', 'cidade', 'estado', 'dataCadastro', 'observacoes']
  },
  {
    id: 'licenca_aprovada_cliente',
    nome: 'Licença Aprovada (Cliente)',
    assunto: '🎉 Sua licença do Agenda Salão foi aprovada!',
    corpo: `
Olá {{nome}},

Parabéns! Sua solicitação de acesso ao Agenda Salão foi aprovada! 🎉

🔑 DADOS DE ACESSO:
• Chave de Ativação: {{chaveAtivacao}}
• Plano: {{nomePlano}}
• Válida até: {{dataVencimento}}
• Máx. Usuários: {{maxUsuarios}}
• Máx. Clientes: {{maxClientes}}

📋 RECURSOS INCLUSOS:
{{recursosLista}}

🚀 COMO COMEÇAR:
1. Acesse: https://agendasalao.com/login
2. Clique em "Primeiro Acesso"
3. Digite sua chave de ativação
4. Crie sua senha de acesso
5. Configure seu salão

💡 DICAS PARA COMEÇAR:
• Cadastre seus funcionários
• Configure seus serviços e preços
• Importe sua agenda de clientes
• Explore os recursos do seu plano

📞 SUPORTE:
• WhatsApp: (11) 99999-9999
• Email: suporte@agendasalao.com
• Chat online: Segunda a Sexta, 8h às 18h

Bem-vindo(a) ao Agenda Salão!
Equipe Agenda Salão
    `,
    variaveis: ['nome', 'chaveAtivacao', 'nomePlano', 'dataVencimento', 'maxUsuarios', 'maxClientes', 'recursosLista']
  },
  {
    id: 'licenca_rejeitada_cliente',
    nome: 'Licença Rejeitada (Cliente)',
    assunto: 'Informações adicionais necessárias - Agenda Salão',
    corpo: `
Olá {{nome}},

Recebemos sua solicitação de acesso ao Agenda Salão para {{nomeEmpresa}}.

❌ MOTIVO DA REJEIÇÃO:
{{motivoRejeicao}}

📋 PRÓXIMOS PASSOS:
{{proximosPassos}}

💬 ENTRE EM CONTATO:
Se tiver dúvidas ou quiser esclarecer os pontos mencionados, entre em contato conosco:

• WhatsApp: (11) 99999-9999
• Email: suporte@agendasalao.com
• Horário: Segunda a Sexta, 8h às 18h

Estamos aqui para ajudar!
Equipe Agenda Salão
    `,
    variaveis: ['nome', 'nomeEmpresa', 'motivoRejeicao', 'proximosPassos']
  },
  {
    id: 'licenca_expirando',
    nome: 'Licença Expirando (Cliente)',
    assunto: '⚠️ Sua licença do Agenda Salão expira em breve',
    corpo: `
Olá {{nome}},

Sua licença do Agenda Salão está próxima do vencimento:

⏰ INFORMAÇÕES DA LICENÇA:
• Empresa: {{nomeEmpresa}}
• Plano Atual: {{nomePlano}}
• Vencimento: {{dataVencimento}}
• Dias Restantes: {{diasRestantes}}

🔄 RENOVAR AGORA:
Para manter seu acesso sem interrupções:

1. Acesse: https://agendasalao.com/renovar
2. Escolha seu plano
3. Efetue o pagamento
4. Continue usando normalmente

💎 APROVEITE PARA FAZER UPGRADE:
{{suguestaoUpgrade}}

📞 DÚVIDAS?
• WhatsApp: (11) 99999-9999
• Email: renovacao@agendasalao.com

Não perca o acesso ao seu sistema!
Equipe Agenda Salão
    `,
    variaveis: ['nome', 'nomeEmpresa', 'nomePlano', 'dataVencimento', 'diasRestantes', 'suguestaoUpgrade']
  }
];

// Classe para gerenciar envio de emails
export class EmailService {
  private static instance: EmailService;
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Substitui variáveis no template
  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return result;
  }

  // Envia email de novo cadastro para admin
  async notifyNewRegistration(registration: UserRegistration, plan?: any): Promise<void> {
    const template = EMAIL_TEMPLATES.find(t => t.id === 'novo_cadastro_admin');
    if (!template) return;

    const variables = {
      nome: registration.nome,
      email: registration.email,
      telefone: registration.telefone || 'Não informado',
      nomeEmpresa: registration.nomeEmpresa,
      cnpj: registration.cnpj || 'Não informado',
      endereco: registration.endereco || 'Não informado',
      cidade: registration.cidade,
      estado: registration.estado,
      dataCadastro: registration.dataCadastro.toLocaleDateString('pt-BR'),
      observacoes: registration.observacoes || 'Nenhuma observação'
    };

    const emailData: EmailNotification = {
      id: `email_${Date.now()}`,
      para: 'admin@agendasalao.com', // Seu email de admin
      assunto: this.replaceVariables(template.assunto, variables),
      corpo: this.replaceVariables(template.corpo, variables),
      dataEnvio: new Date(),
      status: 'pendente',
      tentativas: 0,
      tipoNotificacao: 'novo_cadastro'
    };

    // Simular envio de email
    console.log('📧 EMAIL ADMIN - NOVO CADASTRO:', emailData);
    
    // Em produção, integrar com serviço de email (SendGrid, AWS SES, etc.)
    // await this.sendEmail(emailData);
  }

  // Envia email de licença aprovada para cliente
  async notifyLicenseApproved(
    registration: UserRegistration, 
    license: any, 
    plan: any, 
    features: string[]
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.find(t => t.id === 'licenca_aprovada_cliente');
    if (!template) return;

    const featuresNames = features.map(featureId => {
      const feature = SYSTEM_FEATURES.find(f => f.id === featureId);
      return `• ${feature?.nome || featureId}`;
    }).join('\n');

    const variables = {
      nome: registration.nome,
      chaveAtivacao: license.chaveAtivacao,
      nomePlano: plan.nome,
      dataVencimento: license.dataVencimento.toLocaleDateString('pt-BR'),
      maxUsuarios: license.limitesPersonalizados?.maxUsuarios || plan.maxUsuarios,
      maxClientes: license.limitesPersonalizados?.maxClientes || plan.maxClientes,
      recursosLista: featuresNames
    };

    const emailData: EmailNotification = {
      id: `email_${Date.now()}`,
      para: registration.email,
      assunto: this.replaceVariables(template.assunto, variables),
      corpo: this.replaceVariables(template.corpo, variables),
      dataEnvio: new Date(),
      status: 'pendente',
      tentativas: 0,
      tipoNotificacao: 'licenca_gerada'
    };

    console.log('📧 EMAIL CLIENTE - LICENÇA APROVADA:', emailData);
    
    // Em produção, integrar com serviço de email
    // await this.sendEmail(emailData);
  }

  // Envia email de licença rejeitada
  async notifyLicenseRejected(
    registration: UserRegistration, 
    reason: string, 
    nextSteps: string
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.find(t => t.id === 'licenca_rejeitada_cliente');
    if (!template) return;

    const variables = {
      nome: registration.nome,
      nomeEmpresa: registration.nomeEmpresa,
      motivoRejeicao: reason,
      proximosPassos: nextSteps
    };

    const emailData: EmailNotification = {
      id: `email_${Date.now()}`,
      para: registration.email,
      assunto: this.replaceVariables(template.assunto, variables),
      corpo: this.replaceVariables(template.corpo, variables),
      dataEnvio: new Date(),
      status: 'pendente',
      tentativas: 0,
      tipoNotificacao: 'licenca_gerada'
    };

    console.log('📧 EMAIL CLIENTE - LICENÇA REJEITADA:', emailData);
  }

  // Simula envio de email (em produção, usar serviço real)
  private async sendEmail(emailData: EmailNotification): Promise<boolean> {
    try {
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em produção, implementar integração com:
      // - SendGrid: await sgMail.send(emailData);
      // - AWS SES: await sesClient.sendEmail(emailData);
      // - Nodemailer: await transporter.sendMail(emailData);
      
      console.log('✅ Email enviado com sucesso:', emailData.para);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }
}