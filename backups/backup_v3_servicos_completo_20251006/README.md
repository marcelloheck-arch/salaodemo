# 💅 Agenda Salão - Sistema de Gerenciamento de Salão de Beleza

Sistema web completo para gerenciamento de salão de beleza com design moderno glassmorphism, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## ✨ Características Principais

- **Design Moderno**: Interface glassmorphism com paleta de cores roxo/rosa
- **Dashboard Interativo**: Métricas em tempo real e visualizações
- **Sistema de Agendamentos**: Gestão completa de horários e serviços
- **Controle Financeiro**: Comissões, pagamentos e relatórios
- **Gestão de Clientes**: Cadastro completo com histórico
- **Integração WhatsApp**: Confirmações e lembretes automáticos
- **Google Calendar**: Sincronização bidirecional

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos
- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização de dados
- **React Hook Form + Zod** - Formulários com validação

### Funcionalidades
- **Glassmorphism UI** - Design moderno com efeitos de vidro
- **Responsive Design** - Otimizado para todos os dispositivos
- **Real-time Updates** - Atualizações em tempo real
- **Dark/Light Mode** - Suporte a temas
- **PWA Ready** - Progressive Web App

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd agenda-salao

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### Credenciais de Demonstração
```
Email: admin@salao.com
Senha: admin123
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui.tsx            # Componentes base de interface
│   ├── MainApp.tsx       # App principal com navegação
│   ├── LoginPage.tsx     # Sistema de autenticação
│   ├── CaixaPage.tsx     # Controle de caixa
│   ├── IntegrationsPage.tsx # WhatsApp e Google Calendar
│   ├── ProfilePage.tsx   # Perfil do salão
│   └── DashboardLayout.tsx # Layout do dashboard
├── lib/                   # Utilitários e configurações
│   └── utils.ts          # Funções auxiliares
├── store/                # Estado global (Zustand)
├── types/                # Definições de tipos TypeScript
│   ├── index.ts          # Tipos principais
│   └── integrations.ts   # Tipos das integrações
└── ...
```

## 🎨 Sistema de Design

### Paleta de Cores
- **Primary**: #8B5CF6 (Roxo vibrante)
- **Secondary**: #EC4899 (Rosa)
- **Success**: #10B981 (Verde)
- **Warning**: #F59E0B (Laranja)
- **Danger**: #EF4444 (Vermelho)

### Componentes Glassmorphism
- Background: `rgba(255, 255, 255, 0.95)`
- Backdrop-filter: `blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.18)`
- Box-shadow: `0 8px 32px 0 rgba(31, 38, 135, 0.37)`

## 📱 Funcionalidades Implementadas

### ✅ Fase 1 - MVP Completo
- [x] **Sistema de Login** - Autenticação para proprietários
- [x] **Dashboard Principal** - Métricas e visão geral
- [x] **Controle de Caixa** - Faturamento, comissões e relatórios
- [x] **Integração WhatsApp** - Configuração e automação
- [x] **Integração Google Calendar** - Sincronização bidirecional
- [x] **Perfil do Salão** - Gestão completa de informações
- [x] **Sistema de Notificações** - Email, push e WhatsApp
- [x] **Interface Responsiva** - Design moderno e limpo
- [x] **Navegação Completa** - Sidebar com todas as funcionalidades
- [x] **Tipos TypeScript** - Sistema completo de tipagem
- [x] **Componentes Reutilizáveis** - UI components padronizados

### 🚧 Em Desenvolvimento
- [ ] Sistema completo de agendamentos
- [ ] Gestão avançada de clientes
- [ ] Relatórios financeiros detalhados
- [ ] Sistema de comissões automatizado
- [ ] App mobile companion

## 🔐 **Funcionalidades Detalhadas**

### **1. Sistema de Autenticação**
- Login seguro para proprietários
- Controle de sessão com localStorage
- Credenciais de demonstração incluídas
- Interface de login moderna e responsiva

### **2. Dashboard Principal**
- Métricas em tempo real
- Ações rápidas para funcionalidades principais
- Visão geral do negócio
- Cards informativos com estatísticas

### **3. Controle de Caixa**
- Faturamento total e por período
- Cálculo automático de comissões
- Relatórios por profissional
- Análise de serviços mais rentáveis
- Filtros avançados por data e profissional

### **4. Integração WhatsApp**
- Configuração completa da API WhatsApp Business
- Mensagens automáticas de confirmação
- Lembretes programados (24h, 1h, 30min antes)
- Templates de mensagens personalizáveis
- Teste de conectividade integrado

### **5. Integração Google Calendar**
- Sincronização bidirecional completa
- Configuração OAuth2 simplificada
- Cores personalizadas por tipo de evento
- Instruções detalhadas de configuração
- Status de conexão em tempo real

### **6. Perfil do Salão**
- Informações completas do estabelecimento
- Upload de logo personalizado
- Horários de funcionamento configuráveis
- Gestão de serviços oferecidos
- Edição inline com salvamento automático

### **7. Sistema de Notificações**
- Central de configurações de notificações
- Suporte a email, push e WhatsApp
- Personalização por tipo de evento
- Histórico de notificações enviadas

### **8. Interface e Navegação**
- Sidebar responsiva com menu principal
- Header com informações contextuais
- Design inspirado no Fixei Sync
- Transições suaves e animações
- Suporte completo a mobile e desktop

### 🔮 Próximas Funcionalidades
- [ ] Sistema de notificações
- [ ] Relatórios avançados
- [ ] App mobile companion
- [ ] Sistema de fidelidade
- [ ] Multi-unidades

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm run start

# Linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Roadmap

### Q1 2024
- [ ] Sistema completo de agendamentos
- [ ] Gestão de clientes
- [ ] Controle financeiro básico

### Q2 2024
- [ ] Integrações (WhatsApp, Google Calendar)
- [ ] Sistema de notificações
- [ ] Relatórios avançados

### Q3 2024
- [ ] App mobile
- [ ] Sistema de fidelidade
- [ ] Analytics avançado

---

**Desenvolvido com ❤️ para salões de beleza modernos**