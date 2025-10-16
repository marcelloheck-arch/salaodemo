# 🚀 Guia de Configuração do Supabase

## 📋 Passo a Passo para Configurar o Banco de Dados

### 1. **Criar Conta no Supabase**
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado)

### 2. **Criar Novo Projeto**
1. Clique em "New Project"
2. Escolha uma organização (pode criar uma nova)
3. Preencha:
   - **Name**: `agendusalao-production` (ou nome de sua escolha)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: `South America (São Paulo)` (para melhor performance no Brasil)
4. Clique em "Create new project"
5. ⏰ Aguarde 2-3 minutos para o projeto ser criado

### 3. **Configurar Variáveis de Ambiente**

#### 3.1. **Obter Credenciais**
1. No painel do Supabase, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: `https://xxxxxxxxxxx.supabase.co`)
   - **API Key (anon public)** (chave longa que começa com `eyJ...`)

#### 3.2. **Configurar .env.local**
1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores:

```env
# Supabase Configuration - SUBSTITUA PELOS SEUS VALORES REAIS
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui

# Database Configuration  
DATABASE_URL=postgresql://postgres:SUA-SENHA@db.sua-url-aqui.supabase.co:5432/postgres

# App Configuration
NEXTAUTH_SECRET=sua-chave-secreta-aleatoria-aqui
NEXTAUTH_URL=http://localhost:3001
```

### 4. **Executar Script do Banco**

#### 4.1. **Acessar SQL Editor**
1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New query"

#### 4.2. **Executar Schema**
1. Abra o arquivo `supabase/schema.sql` deste projeto
2. Copie **TODO** o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN** (▶️)
5. ✅ Aguarde aparecer "Success. No rows returned"

### 5. **Verificar Instalação**

#### 5.1. **Verificar Tabelas**
1. No Supabase, vá em **Table Editor**
2. Você deve ver as tabelas:
   - ✅ saloes
   - ✅ clientes  
   - ✅ servicos
   - ✅ agendamentos
   - ✅ licencas
   - ✅ transacoes
   - ✅ registros_usuario

#### 5.2. **Verificar Dados de Exemplo**
1. Clique na tabela **saloes**
2. Deve ter 1 registro: "Salão Exemplo"
3. Clique na tabela **clientes**
4. Deve ter 1 registro: "Cliente Exemplo"

### 6. **Testar Conexão**

#### 6.1. **Iniciar Servidor**
```bash
npm run dev
```

#### 6.2. **Verificar Logs**
- Se aparecer erros de conexão, verifique:
  - ✅ URLs corretas no `.env.local`
  - ✅ Chaves corretas (sem espaços extras)
  - ✅ Senha do banco correta

### 7. **Configurações de Produção**

#### 7.1. **Para Deploy no Vercel**
1. No Vercel, vá em **Settings** → **Environment Variables**
2. Adicione as mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (usar URL de produção)

#### 7.2. **Segurança (Importante!)**
1. No Supabase, vá em **Authentication** → **Settings**
2. Configure **Site URL** para sua URL de produção
3. Em **Auth** → **URL Configuration**, adicione sua URL de produção

### 8. **Backup e Monitoramento**

#### 8.1. **Backup Automático**
- ✅ Supabase faz backup automático (tier gratuito: 7 dias)
- 💰 Para backups maiores, considere upgrade

#### 8.2. **Monitoramento**
1. Vá em **Settings** → **Billing**
2. Configure alertas de uso
3. Monitore o **Database Usage**

---

## 🚨 **Solução de Problemas Comuns**

### ❌ "Invalid API key"
- ✅ Verifique se copiou a chave completa
- ✅ Certifique-se que é a chave **anon** (pública)

### ❌ "Connection refused"
- ✅ Verifique se a URL está correta
- ✅ Aguarde o projeto terminar de ser criado

### ❌ "Password authentication failed"
- ✅ Verifique a senha no DATABASE_URL
- ✅ Use a senha criada na configuração do projeto

### ❌ "Table doesn't exist"
- ✅ Execute novamente o script `schema.sql`
- ✅ Verifique se executou sem erros

---

## 📞 **Suporte**

Se tiver problemas:
1. 📖 Consulte: https://supabase.com/docs
2. 💬 Discord: https://discord.supabase.com
3. 🐛 Issues: https://github.com/supabase/supabase/issues

---

## 🎯 **Próximos Passos Após Configuração**

1. ✅ Testar login no sistema
2. ✅ Criar alguns clientes de teste
3. ✅ Fazer agendamentos de teste
4. ✅ Verificar se dados persistem
5. 🚀 Deploy no Vercel

**Tempo estimado total: 30-60 minutos** ⏰