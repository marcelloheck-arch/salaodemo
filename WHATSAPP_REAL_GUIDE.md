# 📱 Guia de Integração WhatsApp Real

## 🎯 Objetivo
Conectar o sistema com WhatsApp real usando **whatsapp-web.js** para receber e enviar mensagens automaticamente com IA.

---

## 📋 Pré-requisitos

### 1. Sistema Operacional
- ✅ Windows, Linux ou macOS
- ✅ Node.js 18+ instalado
- ✅ Mínimo 2GB RAM livre
- ✅ Mínimo 500MB espaço em disco

### 2. WhatsApp
- ✅ Número de WhatsApp ativo
- ✅ WhatsApp instalado no celular
- ✅ Internet estável

---

## 🚀 Instalação Completa

### Passo 1: Instalar Dependências

```bash
# whatsapp-web.js (biblioteca principal)
npm install whatsapp-web.js

# qrcode (gerador de QR Code)
npm install qrcode

# Types para TypeScript
npm install --save-dev @types/qrcode
```

**⚠️ IMPORTANTE:** A instalação do `whatsapp-web.js` pode demorar 5-10 minutos pois baixa o Chromium (200MB+).

---

### Passo 2: Arquivos Criados

Já criamos os seguintes arquivos no projeto:

1. **`src/app/api/whatsapp/route.ts`**
   - API Route do Next.js
   - Gerencia conexão WhatsApp
   - Recebe e envia mensagens
   - Gera QR Code

2. **`src/components/WhatsAppReal.tsx`**
   - Interface visual para conexão
   - Exibe QR Code real
   - Status de conexão
   - Integração com IA

3. **`src/components/WhatsAppAIAssistant.tsx`**
   - Sistema de IA já pronto
   - Análise de intenções
   - Respostas automáticas
   - Detecção de agendamentos

---

### Passo 3: Integrar no Sistema

Abra `WhatsAppAIAssistant.tsx` e substitua a seção de conexão simulada:

```typescript
// ANTES (simulado):
<div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
  <h3>Conexão WhatsApp (Simulado)</h3>
  <button onClick={simularConexao}>Conectar</button>
</div>

// DEPOIS (real):
import WhatsAppReal from './WhatsAppReal';

<WhatsAppReal
  onMessageReceived={(from, message) => {
    // Quando receber mensagem
    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      remetente: from,
      conteudo: message,
      timestamp: new Date(),
      tipo: 'recebida',
      processada: false
    };
    
    // Processar com IA
    processarMensagem(novaMensagem);
  }}
  onConnected={(phoneNumber) => {
    console.log('✅ WhatsApp conectado:', phoneNumber);
    setConectado(true);
  }}
  onDisconnected={() => {
    console.log('❌ WhatsApp desconectado');
    setConectado(false);
  }}
/>
```

---

## 🔧 Configuração Avançada

### Autenticação Persistente

O `whatsapp-web.js` salva a sessão em:
```
.wwebjs_auth/session-agenda-salao-whatsapp/
```

**Adicione ao `.gitignore`:**
```
.wwebjs_auth/
.wwebjs_cache/
```

### Variáveis de Ambiente

Crie `.env.local`:
```env
# WhatsApp
WHATSAPP_SESSION_ID=agenda-salao-whatsapp
WHATSAPP_HEADLESS=true

# Limites
WHATSAPP_MAX_CONNECTIONS=1
WHATSAPP_MESSAGE_TIMEOUT=30000
```

---

## 📱 Como Usar

### 1. Iniciar Conexão

1. Acesse o sistema administrativo
2. Vá em **"🤖 Assistente WhatsApp IA"**
3. Clique em **"Conectar WhatsApp"**
4. Aguarde o QR Code aparecer (5-15 segundos)

### 2. Conectar WhatsApp

1. Abra WhatsApp no celular
2. Menu → **Aparelhos conectados**
3. **Conectar um aparelho**
4. Escaneie o QR Code mostrado na tela

### 3. Pronto!

✅ Sistema conectado e funcionando!

- Mensagens recebidas são processadas pela IA
- Respostas enviadas automaticamente
- Agendamentos detectados e criados
- Histórico salvo no localStorage

---

## 🤖 Integração com IA

O sistema já possui IA completa que:

### Detecta Intenções:
- ✅ Agendamento (ex: "quero marcar corte amanhã às 14h")
- ✅ Cancelamento (ex: "preciso cancelar meu horário")
- ✅ Informação (ex: "quanto custa uma manicure?")

### Extrai Dados:
- 📅 Datas (15/11, amanhã, próxima segunda)
- ⏰ Horários (14h, 14:30, 2 da tarde)
- ✂️ Serviços (corte, manicure, escova, coloração, etc.)
- 📱 Nome e telefone do cliente

### Responde Automaticamente:
- 💰 Preços de serviços
- 📍 Endereço e horário de funcionamento
- ✅ Confirmações de agendamento
- ❌ Cancelamentos

---

## 🐛 Solução de Problemas

### Erro: "Could not find Chrome"

```bash
# Windows
npm install puppeteer

# Linux
sudo apt-get install chromium-browser

# macOS
brew install chromium
```

### Erro: "Session closed"

- Desconecte no celular
- Delete pasta `.wwebjs_auth/`
- Conecte novamente

### Erro: "QR Code not generated"

- Aguarde 30 segundos
- Verifique conexão com internet
- Reinicie o servidor

### Mensagens não chegam

1. Verifique se está conectado
2. Teste enviando mensagem manualmente
3. Verifique console do navegador
4. Veja logs do servidor

---

## 📊 Monitoramento

### Logs do Servidor

```bash
npm run dev

# Você verá:
# 📱 QR Code gerado
# ✅ WhatsApp conectado!
# 📨 Mensagem recebida: [número] [conteúdo]
# 💬 Resposta enviada: [número] [conteúdo]
```

### Status no Sistema

No painel administrativo:
- 🟢 Verde = Conectado
- 🟡 Amarelo = Conectando
- 🔴 Vermelho = Desconectado

---

## 🔒 Segurança

### Boas Práticas:

1. **Nunca compartilhe o QR Code**
   - Qualquer pessoa pode conectar seu WhatsApp

2. **Use número exclusivo**
   - Não use WhatsApp pessoal
   - Crie número comercial

3. **Monitore conexões**
   - WhatsApp → Aparelhos conectados
   - Desconecte dispositivos desconhecidos

4. **Backup da sessão**
   - Faça backup de `.wwebjs_auth/`
   - Evita reconexão frequente

---

## 💡 Dicas de Produção

### 1. Use PM2 para manter rodando

```bash
npm install -g pm2
pm2 start npm --name "agenda-salao" -- start
pm2 save
pm2 startup
```

### 2. Configure Webhooks

Para notificações em tempo real, configure webhooks para:
- Novo agendamento criado
- Confirmação de horário
- Lembrete de agendamento

### 3. Rate Limiting

WhatsApp tem limites:
- Máximo 256 mensagens por minuto
- Evite spam
- Use delays entre mensagens

---

## 🚀 Próximos Passos

### Funcionalidades Futuras:

1. **Envio de Mídia**
   - Fotos do estabelecimento
   - Promoções em imagem
   - Cardápio de serviços

2. **Mensagens Agendadas**
   - Lembretes automáticos
   - Confirmação de horário
   - Pesquisa de satisfação

3. **Grupos**
   - Grupo de profissionais
   - Avisos gerais
   - Promoções

4. **Chatbot Avançado**
   - Mais intenções
   - Context awareness
   - Aprendizado de máquina

---

## 📞 Suporte

### Problemas comuns:

1. **QR Code não aparece**
   - Aguarde 30 segundos
   - Reinicie servidor
   - Limpe cache

2. **Desconexão frequente**
   - Verifique internet
   - Use conexão estável
   - Evite VPN instável

3. **Mensagens duplicadas**
   - Verifique se não há múltiplas instâncias
   - Um WhatsApp por servidor

---

## 📚 Recursos

- [Documentação whatsapp-web.js](https://wwebjs.dev/)
- [GitHub whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [Comunidade Discord](https://discord.gg/wyKybbF)

---

## ✅ Checklist de Implantação

- [ ] Instalar dependências (`npm install whatsapp-web.js qrcode`)
- [ ] Configurar variáveis de ambiente
- [ ] Adicionar `.wwebjs_auth/` ao `.gitignore`
- [ ] Integrar WhatsAppReal no WhatsAppAIAssistant
- [ ] Testar conexão com QR Code
- [ ] Testar recebimento de mensagens
- [ ] Testar envio de respostas
- [ ] Testar detecção de agendamentos
- [ ] Configurar PM2 para produção
- [ ] Configurar backup da sessão
- [ ] Monitorar logs
- [ ] Treinar equipe

---

**Data de criação:** 13/11/2025

**Versão do sistema:** 1.0.0

**Status:** Pronto para implementação ✅
