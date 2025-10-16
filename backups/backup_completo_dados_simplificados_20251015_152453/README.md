# 💅 Agenda Salão - Sistema Completo de Gerenciamento

Sistema web empresarial completo para gerenciamento de salões de beleza com sistema de licenciamento, relatórios avançados e design moderno glassmorphism, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## ✨ Características Principais

### 🔐 Sistema de Licenciamento
- **Registro Público**: Formulário multi-step para novos salões
- **Painel Administrativo**: Aprovação e gestão de licenças
- **Editor de Planos**: Criação e edição de planos de assinatura
- **Geração Automática**: Criação automática de licenças após aprovação
- **Validação Dinâmica**: Sistema de autenticação por email/licença

### 📊 Relatórios e Analytics
- **Dashboard Interativo**: KPIs e métricas em tempo real
- **Relatórios Financeiros**: Receitas, despesas e comissões
- **Análise Operacional**: Ocupação, serviços e performance
- **Gestão de Clientes**: Segmentação e análise de comportamento
- **Gráficos Interativos**: Visualizações com Chart.js
- **Exportação de Dados**: Relatórios em PDF e Excel

### 🎯 Gestão Completa
- **Dashboard Personalizado**: Dados dinâmicos do usuário logado
- **Sistema de Agendamentos**: Gestão completa de horários e serviços
- **Controle Financeiro**: Comissões, pagamentos e caixa
- **Gestão de Clientes**: Cadastro completo com histórico
- **Sistema de Avaliações**: Coleta e exibição de feedback público
- **Perfil Dinâmico**: Informações personalizadas por salão

### 🎨 Interface e UX
- **Design Moderno**: Interface glassmorphism com cores neutras
- **Dados Dinâmicos**: Nome, email e informações reais do usuário
- **Avatar Personalizado**: Iniciais dinâmicas do usuário logado
- **Responsive Design**: Otimizado para todos os dispositivos
- **Navegação Intuitiva**: Menu lateral com categorização clara

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática e interfaces completas
- **Tailwind CSS** - Estilização utilitária responsiva
- **Chart.js** - Gráficos interativos para relatórios
- **Lucide React** - Ícones modernos e consistentes
- **LocalStorage** - Persistência de dados do cliente

### Arquitetura e Padrões
- **Component-Based Architecture** - Componentes reutilizáveis
- **TypeScript Interfaces** - Tipagem forte para licenças e relatórios
- **Service Layer** - LocalStorageService para persistência
- **Custom Hooks** - Lógica reutilizável para autenticação
- **Responsive Design** - Mobile-first approach

### Funcionalidades Técnicas
- **Sistema Multi-nível**: Autenticação para admins e usuários
- **Validação Dinâmica**: Credenciais flexíveis com debug
- **Dados Persistentes**: Sistema robusto de localStorage
- **Debug Tools** - Scripts de teste e diagnóstico
- **Hot Reload** - Desenvolvimento com atualizações instantâneas

## � Sistema de Licenciamento

### Fluxo Completo de Registro
1. **Registro Público**: Novos salões se cadastram via formulário multi-step
2. **Seleção de Plano**: Escolha entre 4 tiers de pricing (Starter, Professional, Premium, Enterprise)
3. **Aprovação Admin**: Administradores revisam e aprovam/rejeitam registros
4. **Geração de Licença**: Sistema gera automaticamente chaves de licença
5. **Acesso ao Sistema**: Login com email + chave de licença

### Credenciais de Teste

#### Super Admin
```
Email: superadmin@agendusalao.com
Senha: SuperAdmin@2024
```

#### Salão Demo (sem licença)
```
Email: admin@salao.com
Senha: admin123
```

#### Salão com Licença Ativa
```
Email: admin@salao.com
Senha: admin123
Licença: TEST-1234-ABCD-5678
```

### Scripts de Teste Disponíveis
- `test-credentials.js` - Credenciais do sistema
- `debug-system.js` - Diagnóstico completo
- `dynamic-test.js` - Criação de usuários de teste

## 📊 Sistema de Relatórios

### Dashboards Disponíveis
- **Geral**: Visão consolidada com KPIs principais
- **Financeiro**: Receitas, despesas, comissões e lucros
- **Operacional**: Taxa de ocupação, serviços mais solicitados
- **Clientes**: Segmentação, retenção e análise comportamental
- **Marketing**: Campanhas, conversões e ROI
- **Personalizado**: Relatórios sob demanda com filtros

### Tipos de Gráficos
- Gráficos de linha para tendências temporais
- Gráficos de barras para comparações
- Gráficos de pizza para distribuições
- Cards de métricas para KPIs
- Tabelas dinâmicas para dados detalhados

## �📦 Instalação e Configuração

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

O projeto estará disponível em `http://localhost:3004`

### Como Testar o Sistema

#### 1. Login Direto (Credenciais na seção acima)
Use as credenciais fornecidas para acessar diferentes níveis do sistema.

#### 2. Criação de Usuário de Teste
```javascript
// Abra o console do navegador (F12) e execute:
createDynamicTestUser("Maria Silva", "maria@teste.com", "Salão Beleza", "TESTE-2024-KEY");
loginUser("maria@teste.com", "TESTE-2024-KEY");
```

#### 3. Registro Público
- Acesse a tela de login
- Clique em "Cadastrar Novo Salão"
- Preencha o formulário multi-step
- Aguarde aprovação do admin

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

### ✅ Sistema Core Completo
- [x] **Sistema de Licenciamento** - Registro, aprovação e geração automática
- [x] **Painel Administrativo** - Gestão completa de licenças e usuários
- [x] **Editor de Planos** - CRUD completo para planos de assinatura
- [x] **Criação Manual de Licenças** - Wizard em 3 etapas para admins
- [x] **Autenticação Multi-nível** - Super admin, admins de salão e usuários

### ✅ Sistema de Relatórios
- [x] **Dashboard Interativo** - 6 abas de relatórios especializados
- [x] **Métricas Financeiras** - Receitas, despesas, comissões e lucros
- [x] **Analytics Operacionais** - Taxa de ocupação e performance
- [x] **Análise de Clientes** - Segmentação e comportamento
- [x] **Gráficos Dinâmicos** - Chart.js com visualizações interativas
- [x] **Exportação de Dados** - Relatórios em PDF e Excel

### ✅ Interface e UX
- [x] **Dados Dinâmicos** - Informações reais do usuário logado
- [x] **Avatar Personalizado** - Iniciais dinâmicas do nome
- [x] **Perfil Sincronizado** - Configurações com dados do usuário
- [x] **Design Responsivo** - Otimizado para mobile e desktop
- [x] **Sistema de Debug** - Ferramentas completas para desenvolvimento

### ✅ Funcionalidades Base
- [x] **Sistema de Login** - Autenticação robusta com validação
- [x] **Dashboard Principal** - Métricas e visão geral personalizada
- [x] **Gestão de Agendamentos** - Calendário e horários
- [x] **Controle de Caixa** - Faturamento, comissões e relatórios
- [x] **Gestão de Clientes** - Cadastro completo com histórico
- [x] **Sistema de Avaliações** - Coleta e exibição de feedback
- [x] **Controle de Produtos** - Estoque e vendas
- [x] **Gestão de Serviços** - Catálogo completo com preços
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
npm run dev           # Inicia servidor em http://localhost:3004

# Build para produção
npm run build

# Iniciar em produção
npm run start

# Linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 🧪 Ferramentas de Debug

### Scripts de Teste (Console do Navegador)
```javascript
// Criar usuário de teste
createDynamicTestUser("Nome", "email@teste.com", "Nome do Salão", "CHAVE-LICENCA");

// Fazer login
loginUser("email@teste.com", "CHAVE-LICENCA");

// Limpar localStorage
localStorage.clear();

// Debug completo do sistema
// Execute debug-system.js no console
```

### Arquivos de Documentação
- `SISTEMA_LICENCIAMENTO.md` - Documentação completa do sistema de licenças
- `SISTEMA_AVALIACOES.md` - Sistema de avaliações e feedback
- `docs/RELATORIOS_SISTEMA.md` - Documentação dos relatórios
- `BACKUP_STATUS.md` - Status de backups e versionamento

## 📈 Próximas Funcionalidades

### 🚧 Em Desenvolvimento
- [ ] Integração com APIs de pagamento
- [ ] Sistema de notificações push
- [ ] Backup automático na nuvem
- [ ] Chat interno para equipe
- [ ] Sistema de comissões avançado

### 🔮 Roadmap Futuro
- [ ] App mobile companion
- [ ] Sistema de fidelidade
- [ ] Multi-unidades
- [ ] IA para recomendações
- [ ] Marketplace de produtos

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