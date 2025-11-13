# Sistema de Portais - Cliente e Profissional

## 🎯 Visão Geral

Sistema completo com **3 níveis de acesso**:

1. **👤 Portal do Cliente** - Clientes podem se cadastrar, fazer login e agendar horários
2. **💼 Portal do Profissional** - Profissionais podem se cadastrar, fazer login e ver seus agendamentos
3. **👑 Admin/Salão** - Visão completa de tudo (já existente)

## 📁 Arquivos Criados

### Componentes

1. **`ClienteAuthPage.tsx`** - Login e Cadastro de Clientes
   - Formulário de login com email/senha
   - Formulário de cadastro completo
   - Validações de email, senha, etc.
   - Integração com localStorage

2. **`ClientePortalPage.tsx`** - Portal de Agendamento do Cliente
   - Seleção de serviço
   - Escolha de profissional
   - Seleção de data
   - Escolha de horário disponível
   - Confirmação e finalização
   - Sistema de progresso visual (5 etapas)

3. **`ProfissionalAuthPage.tsx`** - Login e Cadastro de Profissionais
   - Formulário de login
   - Cadastro com especialidades
   - Configuração de disponibilidade (dias e horários)
   - Biografia e informações profissionais

4. **`ProfissionalDashboardPage.tsx`** - Dashboard do Profissional
   - Visualiza APENAS seus próprios agendamentos
   - Estatísticas pessoais
   - Filtros (hoje, próximos, concluídos)
   - Ações (concluir, cancelar)

## 🔐 Sistema de Cadastro

### Cadastro de Cliente

**Campos Obrigatórios:**
- ✅ Nome Completo
- ✅ Email (validado)
- ✅ Telefone
- ✅ Senha (mínimo 6 caracteres)
- ✅ Confirmar Senha

**Campos Opcionais:**
- CPF
- Data de Nascimento
- Endereço
- Observações (preferências, alergias, etc.)

**Armazenamento:**
```typescript
localStorage.setItem('clientes', JSON.stringify([{
  id: string,
  nome: string,
  email: string,
  telefone: string,
  senha: string,
  dataNascimento?: string,
  cpf?: string,
  endereco?: string,
  observacoes?: string,
  criadoEm: string
}]))
```

### Cadastro de Profissional

**Campos Obrigatórios:**
- ✅ Nome Completo
- ✅ Email (validado)
- ✅ Telefone
- ✅ Senha (mínimo 6 caracteres)
- ✅ Especialidades (mínimo 1)
- ✅ Disponibilidade (mínimo 1 dia)

**Especialidades Disponíveis:**
- Cortes Femininos
- Cortes Masculinos
- Coloração
- Mechas
- Manicure
- Pedicure
- Depilação
- Maquiagem
- Penteados
- Escova
- Hidratação
- Barbearia
- Estética Facial
- Design de Sobrancelhas

**Configuração de Disponibilidade:**
```typescript
{
  segunda: { ativo: true, inicio: '09:00', fim: '18:00' },
  terca: { ativo: true, inicio: '09:00', fim: '18:00' },
  // ... outros dias
}
```

**Campos Opcionais:**
- CPF
- Biografia/Sobre

**Armazenamento:**
```typescript
localStorage.setItem('profissionais', JSON.stringify([{
  id: string,
  nome: string,
  email: string,
  telefone: string,
  senha: string,
  especialidades: string[],
  cpf?: string,
  bio?: string,
  disponibilidade: [{
    diaSemana: number, // 0-6
    horaInicio: string,
    horaFim: string
  }],
  criadoEm: string
}]))
```

## 🌐 Portal do Cliente

### Fluxo de Agendamento (5 Etapas)

#### 1️⃣ Escolher Serviço
- Lista de serviços disponíveis
- Mostra duração e preço
- Cards clicáveis

#### 2️⃣ Escolher Profissional
- Filtra profissionais que fazem o serviço
- Mostra especialidades
- Avatar com inicial do nome

#### 3️⃣ Selecionar Data
- Input de data (mínimo: hoje)
- Valida se profissional trabalha naquele dia

#### 4️⃣ Escolher Horário
- Gera horários disponíveis baseado na disponibilidade do profissional
- Slots de 30 minutos
- Mostra horários ocupados (mock - em produção consultar agendamentos reais)
- Visual de horários: disponível (verde) vs ocupado (cinza)

#### 5️⃣ Confirmar Dados
- Resumo completo do agendamento
- Formulário com dados do cliente (pre-preenchido se logado)
- Botão de confirmação

#### 6️⃣ Confirmação
- Tela de sucesso
- Detalhes do agendamento
- Botão para novo agendamento

### Agendamento Salvo

```typescript
{
  id: string,
  clienteId: string,
  clienteNome: string,
  clienteTelefone: string,
  clienteEmail?: string,
  servicoId: string,
  servicoNome: string,
  profissionalId: string,
  profissionalNome: string,
  data: string, // YYYY-MM-DD
  horario: string, // HH:MM
  duracao: number,
  valor: number,
  status: 'confirmado',
  criadoEm: string
}
```

## 💼 Portal do Profissional

### Dashboard Pessoal

**Estatísticas:**
- 📅 **Hoje**: Agendamentos do dia atual
- ✅ **Concluídos**: Total de atendimentos finalizados
- 📊 **Total**: Todos os agendamentos
- 💰 **Receita**: Soma dos valores de agendamentos concluídos

**Filtros:**
- **Hoje**: Agendamentos de hoje
- **Próximos**: Agendamentos futuros (não concluídos)
- **Todos**: Todos os agendamentos
- **Concluídos**: Apenas finalizados

**Informações por Agendamento:**
- Cliente (nome, telefone, email)
- Serviço
- Data e horário
- Duração
- Valor
- Status

**Ações Disponíveis:**
- ✅ **Marcar como Concluído** (se status = confirmado)
- ❌ **Cancelar** (se status = confirmado)

### Segurança

**Isolamento de Dados:**
- Profissional vê APENAS seus próprios agendamentos
- Filtro por `profissionalId` no localStorage
- Sem acesso a dados de outros profissionais

## 🔗 Acesso aos Portais

### Via Menu do Admin

No menu lateral do sistema admin:
- 🌐 **Portal Cliente** - Acesso ao portal de agendamento
- 💼 **Portal Profissional** - Acesso ao dashboard do profissional

### URLs Diretas (Futuro)

Para produção, criar rotas públicas:
```
/cliente - Portal do cliente
/profissional - Portal do profissional
/admin - Sistema administrativo (atual)
```

## 🎨 Interface

### Design Consistente

Todos os portais usam:
- **Glassmorphism** com backdrop blur
- **Gradiente roxo/rosa** (identidade visual)
- **Responsivo** (mobile-first)
- **Animações suaves** (hover, transitions)

### Cores

- **Primary**: Purple 600 → Pink 600
- **Success**: Green 600
- **Error**: Red 600
- **Info**: Blue 600
- **Warning**: Yellow 600

## 💾 Persistência de Dados

### LocalStorage (Atual)

```typescript
// Clientes
localStorage.getItem('clientes')

// Profissionais
localStorage.getItem('profissionais')

// Agendamentos
localStorage.getItem('agendamentos')
```

### Migração para Banco de Dados (Produção)

1. Criar tabelas no PostgreSQL:
   - `clientes`
   - `profissionais`
   - `agendamentos`

2. Criar API endpoints:
   ```
   POST /api/clientes/register
   POST /api/clientes/login
   POST /api/profissionais/register
   POST /api/profissionais/login
   POST /api/agendamentos
   GET /api/agendamentos/profissional/:id
   GET /api/horarios-disponiveis
   ```

3. Substituir localStorage por fetch/axios

## 🔒 Segurança

### Validações Implementadas

**Email:**
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Verificação de duplicidade

**Senha:**
- Mínimo 6 caracteres
- Confirmação obrigatória
- Exibição/ocultação com ícone

**Dados Obrigatórios:**
- Nome, email, telefone, senha
- Especialidades (profissional)
- Disponibilidade (profissional)

### Melhorias para Produção

⚠️ **IMPORTANTE - Implementar:**

1. **Hash de Senhas**
   ```typescript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(senha, 10);
   ```

2. **JWT Tokens**
   ```typescript
   const token = jwt.sign({ userId, type: 'cliente' }, SECRET_KEY);
   ```

3. **HTTPS Obrigatório**

4. **Rate Limiting**

5. **Sanitização de Inputs**

6. **CSRF Protection**

7. **Session Management**

## 🚀 Como Usar

### 1. Cadastrar Profissional

1. Menu Admin → "💼 Portal Profissional"
2. Clicar em "Cadastrar"
3. Preencher dados:
   - Nome, email, telefone, senha
   - Selecionar especialidades
   - Configurar dias/horários de trabalho
4. Clicar em "Criar Conta"
5. Fazer login

### 2. Cadastrar Cliente

1. Menu Admin → "🌐 Portal Cliente"
2. Clicar em "Cadastrar"
3. Preencher dados básicos
4. Clicar em "Criar Conta"
5. Sistema loga automaticamente

### 3. Cliente Fazer Agendamento

1. Cliente logado no portal
2. Seguir 5 etapas:
   - Escolher serviço
   - Escolher profissional
   - Selecionar data
   - Escolher horário
   - Confirmar dados
3. Receber confirmação

### 4. Profissional Ver Agendamentos

1. Profissional logado no dashboard
2. Ver estatísticas no topo
3. Filtrar agendamentos (hoje, próximos, etc.)
4. Marcar como concluído ou cancelar

## 📊 Dados Mock (Desenvolvimento)

### Serviços Pré-cadastrados

```typescript
[
  { nome: 'Corte Feminino', duracao: 60, preco: 80 },
  { nome: 'Corte Masculino', duracao: 30, preco: 50 },
  { nome: 'Manicure', duracao: 45, preco: 40 },
  { nome: 'Hidratação', duracao: 90, preco: 120 }
]
```

### Profissionais Exemplo

```typescript
[
  { nome: 'Maria Silva', especialidades: ['Cortes', 'Coloração'] },
  { nome: 'Ana Santos', especialidades: ['Manicure', 'Pedicure'] },
  { nome: 'João Oliveira', especialidades: ['Barbearia'] },
  { nome: 'Carla Lima', especialidades: ['Estética', 'Manicure'] }
]
```

## 🔮 Próximos Passos

### Fase 1 - Melhorias Imediatas

- [ ] Integração com serviços/profissionais reais do sistema admin
- [ ] Verificação real de horários ocupados
- [ ] Upload de foto de perfil (profissional)
- [ ] Histórico de agendamentos do cliente

### Fase 2 - Funcionalidades Avançadas

- [ ] Sistema de avaliações (cliente avalia profissional)
- [ ] Chat entre cliente e profissional
- [ ] Notificações por email
- [ ] Notificações por WhatsApp (integrar com Evolution API)
- [ ] Lembretes automáticos

### Fase 3 - Admin Integration

- [ ] Admin aprovar cadastros de profissionais
- [ ] Admin gerenciar horários dos profissionais
- [ ] Admin ver todos os agendamentos em calendário único
- [ ] Relatórios por profissional

### Fase 4 - Pagamentos

- [ ] Cliente escolher forma de pagamento ao agendar
- [ ] Pagamento antecipado (PIX, cartão)
- [ ] Comissões por profissional

## 📝 Notas Importantes

### Horários Disponíveis

Atualmente usa **mock** com 30% de chance de estar ocupado. Em produção:

```typescript
const horariosOcupados = agendamentos
  .filter(a => 
    a.profissionalId === profissionalId &&
    a.data === data &&
    a.status !== 'cancelado'
  )
  .map(a => a.horario);

// Marcar como indisponível se estiver em horariosOcupados
```

### Multi-Estabelecimento

Para suportar múltiplos salões:

1. Adicionar `salaoId` em todas as entidades
2. Filtrar por salão no portal do cliente
3. Cliente escolhe salão antes de serviço

### Conformidade LGPD

Adicionar:
- Termo de consentimento no cadastro
- Opção de exportar dados
- Opção de deletar conta
- Política de privacidade
- Termo de uso

## 🆘 Troubleshooting

**Login não funciona**
- Verificar `localStorage.getItem('clientes')` ou `'profissionais'`
- Confirmar email e senha corretos
- Limpar cache do navegador

**Horários não aparecem**
- Verificar se profissional trabalha no dia selecionado
- Conferir disponibilidade configurada no cadastro

**Agendamento não salva**
- Abrir console (F12) e ver erros
- Verificar `localStorage.getItem('agendamentos')`
- Limpar localStorage e tentar novamente

## 📞 Resumo

✅ Sistema completo com 3 níveis de acesso  
✅ Cadastro robusto de clientes e profissionais  
✅ Portal de agendamento intuitivo (5 etapas)  
✅ Dashboard profissional com isolamento de dados  
✅ Design responsivo e moderno  
✅ Pronto para desenvolvimento com dados mock  
🔜 Migração para API e banco de dados em produção
