# 🔄 Guia de Migração Frontend → Backend

## ✅ O que já está pronto:

### 1. **Sistema de Autenticação** ✅
- `src/lib/api.ts` - Wrapper fetch com JWT automático
- `src/contexts/AuthContext.tsx` - Context para gerenciar autenticação
- `src/components/MultiLevelLogin_v2.tsx` - Login integrado com API
- AuthProvider adicionado no `layout.tsx`

### 2. **APIs Prontas para Uso** ✅
Todas as funções estão em `src/lib/api.ts`:

```typescript
import { authApi, clientesApi, servicosApi, profissionaisApi, agendamentosApi, transacoesApi } from '@/lib/api';

// Autenticação
await authApi.login(email, password);
await authApi.register({ salonName, ownerName, email, phone, password });
authApi.logout();
authApi.isAuthenticated();
authApi.getUser();

// Clientes
await clientesApi.list({ search: '', status: 'ACTIVE' });
await clientesApi.getById(id);
await clientesApi.create({ name, phone, email, ... });
await clientesApi.update(id, { name, phone, ... });
await clientesApi.delete(id);

// Serviços
await servicosApi.list({ search: '', category: '', isActive: true });
await servicosApi.getById(id);
await servicosApi.create({ name, price, duration, ... });
await servicosApi.update(id, { name, price, ... });
await servicosApi.delete(id);

// Profissionais
await profissionaisApi.list({ search: '', isActive: true, specialty: '' });
await profissionaisApi.getById(id);
await profissionaisApi.create({ name, email, phone, specialties, commission });
await profissionaisApi.update(id, { name, commission, ... });
await profissionaisApi.delete(id);

// Agendamentos
await agendamentosApi.list({ status: '', professionalId: '', clientId: '', dateFrom: '', dateTo: '' });
await agendamentosApi.getById(id);
await agendamentosApi.create({ clientId, serviceId, professionalId, date, startTime, notes });
await agendamentosApi.update(id, { status: 'COMPLETED', paymentStatus: 'PAID' });
await agendamentosApi.delete(id);

// Transações
await transacoesApi.list({ type: '', professionalId: '', dateFrom: '', dateTo: '', category: '' });
await transacoesApi.getById(id);
await transacoesApi.create({ type, amount, description, category, paymentMethod, professionalId });
await transacoesApi.update(id, { description, amount, ... });
await transacoesApi.delete(id);
await transacoesApi.getDashboard({ dateFrom: '', dateTo: '' });
```

---

## 🔄 Como Migrar Componentes

### ⚠️ **IMPORTANTE**: Banco de Dados Necessário

**TODAS as chamadas de API vão falhar até que o banco de dados esteja configurado.**

Você tem 2 opções:

#### Opção A: PostgreSQL Local
```bash
# 1. Instalar PostgreSQL
winget install PostgreSQL

# 2. Criar banco
createdb agendusalao

# 3. Atualizar .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agendusalao?schema=public"

# 4. Rodar migrations
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio  # Visualizar banco
```

#### Opção B: Usar Render Database (Recomendado para Teste)
```bash
# 1. Criar PostgreSQL no Render (Free tier)
# 2. Copiar External Database URL
# 3. Atualizar .env local
DATABASE_URL="postgresql://user:pass@host:5432/database"

# 4. Rodar migrations
npx prisma migrate dev --name init
```

---

## 📝 Passo a Passo da Migração

### **ANTES DE TUDO**: Configurar Banco de Dados
```bash
# Escolha uma das opções acima e rode:
npx prisma migrate dev --name init
npx prisma generate

# Verificar se funcionou:
npx prisma studio  # Deve abrir interface web mostrando tabelas vazias
```

---

### 1️⃣ **Migrar MainApp.tsx** (Trocar MultiLevelLogin)

**Arquivo**: `src/components/MainApp.tsx`

**Buscar:**
```tsx
import MultiLevelLogin from './MultiLevelLogin';
```

**Substituir por:**
```tsx
import MultiLevelLogin from './MultiLevelLogin_v2';
```

**Resultado**: Login usará API backend ao invés de localStorage.

---

### 2️⃣ **Migrar ClientesPage.tsx**

**Arquivo**: `src/components/ClientesPage.tsx`

**ANTES** (localStorage):
```typescript
// Buscar clientes
const clientesData = localStorage.getItem('clientes');
const clientes = clientesData ? JSON.parse(clientesData) : [];

// Criar cliente
const novoCliente = { id: Date.now().toString(), ...dados };
const updated = [...clientes, novoCliente];
localStorage.setItem('clientes', JSON.stringify(updated));
```

**DEPOIS** (API):
```typescript
import { clientesApi } from '@/lib/api';
import { useState, useEffect } from 'react';

// No componente:
const [clientes, setClientes] = useState([]);
const [loading, setLoading] = useState(true);

// Carregar clientes
useEffect(() => {
  async function loadClientes() {
    try {
      const response = await clientesApi.list();
      setClientes(response.clientes);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }
  loadClientes();
}, []);

// Criar cliente
const handleCreate = async (dados) => {
  try {
    const response = await clientesApi.create(dados);
    setClientes([...clientes, response.cliente]);
    alert('Cliente criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    alert(error.message || 'Erro ao criar cliente');
  }
};

// Atualizar cliente
const handleUpdate = async (id, dados) => {
  try {
    const response = await clientesApi.update(id, dados);
    setClientes(clientes.map(c => c.id === id ? response.cliente : c));
    alert('Cliente atualizado!');
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    alert(error.message || 'Erro ao atualizar cliente');
  }
};

// Deletar cliente
const handleDelete = async (id) => {
  if (!confirm('Tem certeza que deseja deletar este cliente?')) return;
  
  try {
    await clientesApi.delete(id);
    setClientes(clientes.filter(c => c.id !== id));
    alert('Cliente removido!');
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    alert(error.message || 'Erro ao deletar cliente');
  }
};
```

---

### 3️⃣ **Migrar ServicosPage.tsx**

**Mesmo padrão do ClientesPage**, mas usar `servicosApi`:

```typescript
import { servicosApi } from '@/lib/api';

// Carregar
const response = await servicosApi.list();
setServicos(response.servicos);

// Criar
await servicosApi.create({ name, price, duration, category, commission });

// Atualizar
await servicosApi.update(id, { name, price, isActive });

// Deletar
await servicosApi.delete(id);
```

---

### 4️⃣ **Migrar ProfissionaisPage.tsx**

```typescript
import { profissionaisApi } from '@/lib/api';

// Carregar
const response = await profissionaisApi.list();
setProfissionais(response.profissionais);

// Criar
await profissionaisApi.create({ 
  name, 
  email, 
  phone, 
  specialties: ['Corte', 'Barba'], 
  commission: 30 
});

// Atualizar
await profissionaisApi.update(id, { name, commission });

// Deletar
await profissionaisApi.delete(id);
```

---

### 5️⃣ **Migrar DashboardAgendamentos.tsx**

```typescript
import { agendamentosApi } from '@/lib/api';

// Carregar
const response = await agendamentosApi.list({ 
  dateFrom: '2025-01-01', 
  dateTo: '2025-12-31' 
});
setAgendamentos(response.agendamentos);

// Criar (com validações automáticas)
await agendamentosApi.create({
  clientId: '123',
  serviceId: '456',
  professionalId: '789',
  date: '2025-01-20',
  startTime: '14:00',
  notes: 'Cliente preferencial'
});
// Backend vai verificar:
// - Horário não está no passado
// - Está dentro do expediente
// - Profissional está disponível
// - Calcula endTime automaticamente

// Completar agendamento (cria transação automaticamente)
await agendamentosApi.update(id, { 
  status: 'COMPLETED',
  paymentStatus: 'PAID'
});
// Backend cria Transaction automaticamente!
```

---

### 6️⃣ **Migrar CaixaPage.tsx**

```typescript
import { transacoesApi } from '@/lib/api';

// Carregar transações
const response = await transacoesApi.list({ 
  dateFrom: '2025-01-01',
  dateTo: '2025-01-31'
});
setTransacoes(response.transacoes);

// Dashboard financeiro
const dashboard = await transacoesApi.getDashboard({ 
  dateFrom: '2025-01-01',
  dateTo: '2025-01-31'
});
// Retorna: { totalIncome, totalExpense, totalCommissions, netProfit }

// Criar transação manual
await transacoesApi.create({
  type: 'EXPENSE',
  amount: 500,
  description: 'Compra de produtos',
  category: 'Estoque',
  paymentMethod: 'CREDIT_CARD'
});
```

---

## 🧪 Como Testar Sem Migrar Tudo

Você pode testar as APIs sem migrar os componentes:

### 1. Abrir Console do Navegador (F12)

### 2. Testar Registro:
```javascript
// Importar não funciona no console, então fazer fetch direto:
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    salonName: 'Meu Salão Teste',
    ownerName: 'João Silva',
    email: 'joao@teste.com',
    phone: '11999999999',
    password: 'senha123'
  })
}).then(r => r.json()).then(console.log);
```

### 3. Testar Login:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@teste.com',
    password: 'senha123'
  })
}).then(r => r.json()).then(data => {
  console.log(data);
  sessionStorage.setItem('auth_token', data.token);  // Salvar token
});
```

### 4. Testar Criar Cliente:
```javascript
const token = sessionStorage.getItem('auth_token');
fetch('/api/clientes', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Maria Santos',
    phone: '11988888888',
    email: 'maria@email.com'
  })
}).then(r => r.json()).then(console.log);
```

### 5. Testar Listar Clientes:
```javascript
const token = sessionStorage.getItem('auth_token');
fetch('/api/clientes', {
  headers: { 
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json()).then(console.log);
```

---

## 🎯 Ordem Recomendada de Migração

1. ✅ **Configurar banco de dados** (OBRIGATÓRIO primeiro)
2. ✅ **Testar APIs no console** (validar que funciona)
3. 🔄 **MainApp.tsx** - trocar MultiLevelLogin para _v2
4. 🔄 **ClientesPage.tsx** - migrar CRUD de clientes
5. 🔄 **ServicosPage.tsx** - migrar CRUD de serviços
6. 🔄 **ProfissionaisPage.tsx** - migrar CRUD de profissionais
7. 🔄 **DashboardAgendamentos.tsx** - migrar CRUD de agendamentos
8. 🔄 **CaixaPage.tsx** - migrar transações + dashboard

---

## ⚠️ Erros Comuns e Soluções

### Erro: "fetch failed" ou "ECONNREFUSED"
**Causa**: Banco de dados não configurado ou servidor Next.js não rodando.
**Solução**: 
```bash
# 1. Verificar se servidor está rodando
npm run dev

# 2. Verificar se migrations foram aplicadas
npx prisma migrate dev --name init

# 3. Testar conexão com banco
npx prisma studio
```

### Erro: "401 Unauthorized"
**Causa**: Token JWT inválido ou expirado.
**Solução**: Fazer logout e login novamente.

### Erro: "Prisma Client not found"
**Causa**: Prisma Client não foi gerado após criar schema.
**Solução**: 
```bash
npx prisma generate
npm run dev  # Reiniciar servidor
```

### Erro: "Cannot find module @/lib/api"
**Causa**: Import path incorreto ou arquivo não foi criado.
**Solução**: Verificar se `src/lib/api.ts` existe.

---

## 📊 Status da Migração

| Componente | Status | Prioridade |
|------------|--------|-----------|
| ✅ AuthContext | Pronto | - |
| ✅ API Helper | Pronto | - |
| ✅ MultiLevelLogin_v2 | Pronto | - |
| ⏳ MainApp.tsx | Pendente | ALTA |
| ⏳ ClientesPage.tsx | Pendente | ALTA |
| ⏳ ServicosPage.tsx | Pendente | MÉDIA |
| ⏳ ProfissionaisPage.tsx | Pendente | MÉDIA |
| ⏳ DashboardAgendamentos.tsx | Pendente | ALTA |
| ⏳ CaixaPage.tsx | Pendente | MÉDIA |

---

## 🚀 Próximo Passo IMEDIATO

**Configure o banco de dados AGORA** para começar a testar:

```bash
# Opção mais rápida - PostgreSQL local:
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio  # Deve abrir http://localhost:5555

# Ou usar Render (se já criou lá):
# 1. Copiar DATABASE_URL do Render
# 2. Colar no .env
# 3. Rodar: npx prisma migrate dev --name init
```

Depois disso, você pode testar o login na interface ou pelo console do navegador.

**Me avise quando o banco estiver configurado para continuarmos!** 🎯
