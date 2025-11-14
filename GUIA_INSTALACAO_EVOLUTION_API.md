# 🚀 Guia de Instalação - Evolution API

## ✅ O que foi feito

- ✅ Removido WPPConnect e Puppeteer (250 pacotes)
- ✅ Instaladas apenas 651 dependências (antes 901)
- ✅ Criado cliente Evolution API (`src/lib/evolutionApi.ts`)
- ✅ Atualizada API route (`src/app/api/whatsapp/route.ts`)
- ✅ Criado webhook para receber mensagens (`src/app/api/webhook/whatsapp/route.ts`)
- ✅ Atualizado `next.config.js` (sem Puppeteer)
- ✅ Componente React já compatível (`WhatsAppReal.tsx`)

## 📋 Próximos Passos

### 1️⃣ Instalar Evolution API

Você tem 3 opções:

#### **Opção A: Docker (Recomendado - Mais Fácil)**

```bash
# Criar pasta para o projeto
mkdir evolution-api
cd evolution-api

# Criar docker-compose.yml
```

Crie o arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  evolution-api:
    image: atendai/evolution-api:latest
    ports:
      - "8080:8080"
    environment:
      # Configurações básicas
      SERVER_URL: http://localhost:8080
      AUTHENTICATION_API_KEY: minha-chave-secreta-123
      
      # Opcional: PostgreSQL (recomendado para produção)
      # DATABASE_ENABLED: true
      # DATABASE_PROVIDER: postgresql
      # DATABASE_CONNECTION_URI: postgresql://user:pass@postgres:5432/evolution
      
    volumes:
      - evolution_instances:/evolution/instances
    restart: unless-stopped

volumes:
  evolution_instances:
```

```bash
# Iniciar Evolution API
docker-compose up -d

# Ver logs
docker-compose logs -f
```

#### **Opção B: NPM (Local)**

```bash
# Instalar globalmente
npm install -g @evolution/api

# Ou instalar localmente
npx @evolution/api
```

#### **Opção C: Cloud (Pago - R$29/mês)**

Acesse: https://evolution-api.com/pricing

---

### 2️⃣ Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` na raiz do projeto:

```env
# Evolution API Configuration
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=minha-chave-secreta-123
EVOLUTION_INSTANCE_NAME=agendusalao

# Database (já existentes)
DATABASE_URL=your-database-url
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:**
- `EVOLUTION_API_KEY` deve ser a mesma definida no `docker-compose.yml` (campo `AUTHENTICATION_API_KEY`)
- `EVOLUTION_INSTANCE_NAME` é o nome da sua instância WhatsApp (ex: `agendusalao`, `salao1`, etc.)

---

### 3️⃣ Iniciar Servidor Next.js

```bash
npm run dev
```

---

### 4️⃣ Conectar WhatsApp

1. Abra o navegador: http://localhost:3000
2. Vá para a seção **WhatsApp Real**
3. Clique em **"Conectar WhatsApp"**
4. **QR Code aparecerá instantaneamente!** 🎉
5. Escaneie com seu WhatsApp

---

## 🔧 Testes Manuais (Opcional)

### Testar Evolution API diretamente:

```bash
# 1. Criar instância
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: minha-chave-secreta-123" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "agendusalao",
    "qrcode": true
  }'

# 2. Conectar e obter QR Code
curl -X GET http://localhost:8080/instance/connect/agendusalao \
  -H "apikey: minha-chave-secreta-123"

# 3. Verificar status
curl -X GET http://localhost:8080/instance/connectionState/agendusalao \
  -H "apikey: minha-chave-secreta-123"

# 4. Enviar mensagem (após conectar)
curl -X POST http://localhost:8080/message/sendText/agendusalao \
  -H "apikey: minha-chave-secreta-123" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "5511999999999",
    "text": "Olá! Mensagem de teste"
  }'
```

---

## 📚 Documentação Evolution API

- **Documentação oficial**: https://doc.evolution-api.com
- **GitHub**: https://github.com/EvolutionAPI/evolution-api
- **Swagger UI**: http://localhost:8080/docs (após iniciar)

---

## 🎯 Vantagens vs WPPConnect

| Recurso | WPPConnect | Evolution API |
|---------|------------|---------------|
| **Dependências** | 901 pacotes | 651 pacotes |
| **Puppeteer** | ✅ Sim (100MB) | ❌ Não |
| **Tempo de inicialização** | 30-60s | 1-3s |
| **QR Code** | Instável | Instantâneo |
| **Produção** | ❌ Problemático | ✅ Pronto |
| **Multi-instância** | ❌ Difícil | ✅ Fácil |
| **Webhooks** | ❌ Manual | ✅ Nativo |
| **Cache issues** | ✅ Frequentes | ❌ Nenhum |

---

## 🆘 Problemas Comuns

### QR Code não aparece

1. Verifique se Evolution API está rodando:
   ```bash
   curl http://localhost:8080
   ```

2. Verifique logs do Docker:
   ```bash
   docker-compose logs -f
   ```

3. Verifique se `.env.local` está correto

### Erro "EVOLUTION_API_KEY não configurada"

Edite `.env.local` e adicione a chave:
```env
EVOLUTION_API_KEY=minha-chave-secreta-123
```

### Evolution API não inicia

Verifique se a porta 8080 está livre:
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

---

## 🎉 Pronto!

Agora você tem:
- ✅ WhatsApp conectado via Evolution API
- ✅ QR Code instantâneo
- ✅ Sem Puppeteer
- ✅ Pronto para produção
- ✅ 250 pacotes a menos

**Evolution API >> WPPConnect** 🚀
