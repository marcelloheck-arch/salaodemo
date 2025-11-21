# 🎭 SalaoGerent - Demonstração Interativa

Uma demonstração interativa e completa do sistema de gerenciamento para salões de beleza SalaoGerent.

![SalaoGerent Demo](https://img.shields.io/badge/Demo-Interativa-purple?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Sobre Esta Demonstração

Esta é uma versão **totalmente funcional no front-end** do sistema SalaoGerent, criada especificamente para demonstrar todas as funcionalidades e interfaces do sistema real. **Todos os dados são simulados** e as operações funcionam apenas durante a sessão de demonstração.

## 🎯 Objetivo

Permitir que potenciais clientes explorem e testem todas as funcionalidades do sistema de forma interativa, sem necessidade de configuração de banco de dados ou backend.

## ✨ Funcionalidades Demonstradas

### 🔐 Sistema de Autenticação
- Login com qualquer credencial (demonstração)
- Três perfis de acesso rápido: Admin, Profissional, Cliente
- Interface de login elegante com glassmorphism

### 📊 Dashboard Principal
- **Estatísticas em tempo real simuladas**
- KPIs principais: agendamentos, clientes, receita, profissionais
- Gráficos interativos com Chart.js
- Ações rápidas para principais funcionalidades
- Lista de agendamentos do dia

### 📅 Módulo de Agendamentos
- Visualização completa de agendamentos em tabela
- Filtros por data, profissional, status e busca por cliente
- Status coloridos e intuitivos
- Ações de edição e cancelamento
- Interface responsiva e moderna

### 👥 Gestão de Clientes
- Cards visuais com informações completas
- Sistema de clientes VIP
- Estatísticas de total gasto e visitas
- Busca e filtros avançados
- Informações de contato e endereço

### 👨‍💼 Gestão de Profissionais
- Perfis completos com especialidades
- Horários de trabalho configuráveis
- Sistema de comissões
- Status ativo/inativo
- Visualização de agenda individual

### ✂️ Catálogo de Serviços
- Organização por categorias
- Informações de duração e preço
- Vinculação com profissionais aptos
- Status ativo/inativo
- Descrições detalhadas

### 💰 Módulo Financeiro
- Dashboard financeiro com KPIs
- Gráficos de receitas vs despesas
- Fluxo de caixa detalhado
- Categorização de transações
- Relatórios visuais

### 📈 Relatórios e Analytics
- KPIs avançados de performance
- Gráficos de evolução temporal
- Ranking de serviços mais realizados
- Performance por profissional
- Opções de exportação

### ⚙️ Configurações
- Informações do estabelecimento
- Configurações de sistema
- Preferências de interface
- Sistema de abas organizadas

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Glassmorphism, gradientes, animações
- **Tailwind CSS**: Framework CSS utilitário
- **JavaScript Vanilla**: Lógica da aplicação
- **Chart.js**: Gráficos interativos
- **Lucide Icons**: Iconografia moderna
- **Date-fns**: Manipulação de datas

## 🎨 Design

### Conceito Visual
- **Glassmorphism**: Efeitos de vidro com blur
- **Gradientes**: Paleta roxa/rosa elegante
- **Responsivo**: Funciona em mobile, tablet e desktop
- **Animações**: Transições suaves e micro-interações

### Paleta de Cores
- **Primária**: Gradiente roxo (#8B5CF6) para rosa (#EC4899)
- **Sucesso**: Verde (#10B981)
- **Aviso**: Amarelo (#F59E0B)
- **Erro**: Vermelho (#EF4444)
- **Info**: Azul (#3B82F6)

## 📱 Responsividade

### Desktop (1280px+)
- Layout completo com sidebar fixa
- Múltiplas colunas de dados
- Gráficos em grade 2x2

### Tablet (768px - 1279px)
- Sidebar colapsável
- Layout adaptativo
- Gráficos responsivos

### Mobile (até 767px)
- Sidebar deslizante
- Layout single-column
- Touch-friendly
- Menu hamburger

## 🚀 Como Usar

### 1. Acesso à Demonstração
1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Aguarde o carregamento (2 segundos)
3. Use qualquer credencial para fazer login

### 2. Login Rápido
- **Admin**: Clique no botão "Admin" ou use admin@salao.com / demo123
- **Profissional**: Clique no botão "Profissional"
- **Cliente**: Clique no botão "Cliente"

### 3. Navegação
- Use o menu lateral para navegar entre módulos
- Explore todas as funcionalidades livremente
- Teste os filtros, buscas e ações

### 4. Funcionalidades Interativas
- **Criar**: Use os botões "+" para simular criação
- **Editar**: Clique nos ícones de edição
- **Excluir**: Teste as exclusões (com confirmação)
- **Filtrar**: Use os filtros em todas as telas

## 💡 Recursos Especiais

### Dados Pré-populados
- 4 agendamentos de exemplo
- 3 clientes (incluindo VIPs)
- 3 profissionais com especialidades
- 8 serviços em categorias
- Transações financeiras diversas

### Simulação Realística
- **Status de agendamentos**: Agendado, Confirmado, Em Andamento, Concluído, Cancelado
- **Cálculos automáticos**: Receitas, médias, estatísticas
- **Datas dinâmicas**: Baseadas na data atual
- **Persistência de sessão**: localStorage para demonstração

### Feedback Visual
- **Toasts**: Notificações para todas as ações
- **Loading states**: Estados de carregamento
- **Hover effects**: Efeitos de interação
- **Animações**: Transições suaves

## 🎪 Demonstração de Funcionalidades

### Para Gestores/Donos
1. Acesse como **Admin**
2. Explore o **Dashboard** com métricas completas
3. Teste o **módulo financeiro** com relatórios
4. Configure o sistema em **Configurações**

### Para Profissionais
1. Acesse como **Profissional**
2. Veja sua **agenda individual**
3. Consulte seus **ganhos e comissões**
4. Teste **ações de agendamento**

### Para Atendentes
1. Acesse como **Admin**
2. Teste **cadastro de clientes**
3. Crie **novos agendamentos**
4. Gerencie a **agenda completa**

## 🔧 Estrutura dos Arquivos

```
demo/
├── index.html          # Página principal
├── script.js           # Lógica principal da aplicação
├── pages.js            # Renderização das páginas
├── styles.css          # Estilos personalizados
└── README.md           # Esta documentação
```

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dispositivos Testados
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablets (iPad, Android tablets)
- ✅ Smartphones (iOS, Android)

## 🎯 Casos de Uso da Demo

### Para Vendas
- Demonstração completa do produto
- Showcase de todas as funcionalidades
- Interface profissional e moderna
- Experiência de usuário real

### Para Clientes Potenciais
- Teste livre sem compromisso
- Exploração de todas as telas
- Simulação de uso real
- Avaliação de usabilidade

### Para Apresentações
- Demo offline funcional
- Dados pré-populados
- Interface estável
- Sem dependências externas

## ⚠️ Limitações da Demonstração

- **Dados não persistem**: Tudo é resetado ao recarregar
- **Sem backend real**: Todas as operações são simuladas
- **Sem autenticação real**: Qualquer credencial funciona
- **Sem integração externa**: APIs e serviços são mockados

## 🚀 Deploy e Hospedagem

### GitHub Pages
1. Faça upload dos arquivos para um repositório GitHub
2. Ative GitHub Pages na configuração do repositório
3. Acesse via `https://username.github.io/repository-name`

### Servidor Local
```bash
# Com Python
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com PHP
php -S localhost:8000
```

## 📞 Suporte e Informações

Esta demonstração foi criada para showcasing do sistema SalaoGerent. Para informações sobre a **versão completa com backend**, entre em contato:

- 📧 **Email**: contato@salaogenrent.com
- 📱 **WhatsApp**: (11) 99999-9999
- 🌐 **Website**: www.salaogerent.com

---

## 🎉 Aproveite a Demonstração!

Explore livremente todas as funcionalidades e sinta como é gerenciar um salão com o SalaoGerent!

**💡 Dica**: Teste todas as telas, clique em todos os botões e experimente os filtros - tudo foi projetado para funcionar de forma realística!

---

*Esta é uma demonstração técnica criada para fins de apresentação do produto SalaoGerent.*