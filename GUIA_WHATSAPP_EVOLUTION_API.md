# 📱 Guia Rápido - Evolution API WhatsApp

## 🚀 **Como Usar (Passo a Passo)**

### **1. Instalar Docker Desktop**
- Download: https://www.docker.com/products/docker-desktop
- Instale e reinicie o computador se necessário

### **2. Rodar Evolution API no Docker**

Abra o PowerShell e execute:

```powershell
docker run -d --name evolution-api -p 8080:8080 -e AUTHENTICATION_API_KEY=minha-chave-secreta-123 atendai/evolution-api:latest
```

**Importante**: Troque `minha-chave-secreta-123` por uma chave própria!

### **3. Configurar o Projeto**

1. Abra o arquivo `.env.local` na raiz do projeto
2. Atualize as linhas:
```env
NEXT_PUBLIC_EVOLUTION_API_URL=http://localhost:8080
NEXT_PUBLIC_EVOLUTION_API_KEY=minha-chave-secreta-123
```
**Use a MESMA chave que você colocou no Docker!**

### **4. Instalar Dependência**

No terminal do projeto:
```bash
npm install axios
```

### **5. Reiniciar o Servidor**

```bash
npm run dev
```

### **6. Conectar WhatsApp**

1. No sistema, vá em **"WhatsApp"** no menu
2. Clique em **"Conectar WhatsApp"**
3. Um QR Code aparecerá na tela
4. Abra o WhatsApp no celular
5. Vá em **Aparelhos Conectados** > **Conectar um aparelho**
6. Escaneie o QR Code
7. Aguarde a confirmação de conexão ✅

### **7. Testar Envio**

1. No painel do WhatsApp, vá na aba **"Teste de Envio"**
2. Digite um número (formato: 11999999999)
3. Escreva uma mensagem
4. Clique em **"Enviar Mensagem de Teste"**

## 📋 **Comandos Úteis do Docker**

```powershell
# Ver se está rodando
docker ps

# Parar Evolution API
docker stop evolution-api

# Iniciar Evolution API
docker start evolution-api

# Ver logs
docker logs evolution-api

# Remover (caso precise reinstalar)
docker rm -f evolution-api
```

## 🔧 **Solução de Problemas**

### **Erro: "Não consegue conectar à API"**
- Verifique se o Docker está rodando: `docker ps`
- Verifique se a porta 8080 está livre
- Confira se a `AUTHENTICATION_API_KEY` está correta

### **Erro: "QR Code não aparece"**
- Aguarde 10-15 segundos após clicar em conectar
- Recarregue a página
- Verifique os logs: `docker logs evolution-api`

### **Erro: "Mensagem não enviada"**
- Verifique se o WhatsApp está conectado
- Confira o formato do número (só números, com DDD)
- Exemplo correto: `11999999999`

## 🌐 **Para Produção (Render/Vercel)**

Quando for para produção:

1. **Hospede a Evolution API separadamente**:
   - Railway: https://railway.app
   - Render: https://render.com
   - Digital Ocean: https://digitalocean.com

2. **Atualize o .env.local** com a URL de produção:
```env
NEXT_PUBLIC_EVOLUTION_API_URL=https://sua-evolution-api.railway.app
```

## 📚 **Documentação Oficial**

- Evolution API: https://doc.evolution-api.com/
- GitHub: https://github.com/EvolutionAPI/evolution-api

## ✅ **Pronto!**

Agora você tem WhatsApp totalmente funcional integrado ao sistema! 🎉

Você pode:
- ✅ Enviar mensagens
- ✅ Enviar lembretes automáticos
- ✅ Confirmar agendamentos
- ✅ Enviar fotos/documentos
