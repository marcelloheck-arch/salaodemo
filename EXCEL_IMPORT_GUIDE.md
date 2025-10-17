# 📊 Importação de Clientes via Excel

Sistema completo para importar clientes de arquivos Excel (.xlsx/.xls) para o sistema de gerenciamento do salão.

## ✨ Funcionalidades

### 🔄 Importação Inteligente
- **Detecção automática** de colunas
- **Validação completa** dos dados
- **Preview antes da importação**
- **Relatório de erros detalhado**

### 📋 Colunas Suportadas
O sistema detecta automaticamente as seguintes colunas:

| Campo | Variações Aceitas | Obrigatório |
|-------|------------------|-------------|
| **Nome** | Nome, Cliente | ✅ |
| **Telefone** | Telefone, Celular, Phone | ✅ |
| **Email** | Email, E-mail | ❌ |
| **Endereço** | Endereco, Endereço, Rua | ❌ |
| **Data Nascimento** | Nascimento, Aniversario, Data | ❌ |
| **Observações** | Observ, Obs, Nota | ❌ |

## 🚀 Como Usar

### 1. **Acessar a Funcionalidade**
- Vá para a página **Clientes**
- Clique no botão **"Importar Excel"** (verde)

### 2. **Preparar o Arquivo Excel**
- Baixe o **template** fornecido pelo sistema
- Preencha os dados dos clientes
- Mantenha a **primeira linha** como cabeçalho

### 3. **Fazer a Importação**
- Selecione seu arquivo Excel
- Aguarde o processamento
- Revise os dados na **tela de preview**
- Confirme a importação

## 📄 Exemplo de Planilha

```excel
| Nome          | Telefone      | Email              | Endereço           | Data Nascimento | Observações     |
|---------------|---------------|--------------------|--------------------|-----------------|-----------------| 
| João Silva    | 11999999999   | joao@email.com     | Rua das Flores, 123| 15/03/1990      | Cliente VIP     |
| Maria Santos  | 11888888888   | maria@email.com    | Av. Principal, 456 | 22/07/1985      | Manhã preferido |
```

## ✅ Validações Realizadas

### **Nome**
- ✅ Campo obrigatório
- ✅ Não pode estar vazio

### **Telefone**
- ✅ Campo obrigatório
- ✅ Mínimo 10 dígitos
- ✅ Remove formatação automaticamente

### **Email**
- ❌ Opcional
- ✅ Formato válido se preenchido

### **Data de Nascimento**
- ❌ Opcional
- ✅ Aceita vários formatos de data

## 🎯 Recursos Avançados

### **Preview Inteligente**
- 📊 Estatísticas da importação
- ✅ Contagem de registros válidos
- ❌ Lista de erros encontrados
- 👁️ Visualização dos dados

### **Tratamento de Erros**
- 🔍 Identificação automática de problemas
- 📝 Mensagens de erro descritivas
- 🛠️ Sugestões de correção
- ⚠️ Importação apenas de registros válidos

### **Template Automático**
- 📥 Download do template correto
- 💡 Exemplos de preenchimento
- 🏗️ Estrutura pré-definida

## 🛠️ Tecnologias Utilizadas

- **xlsx**: Leitura de arquivos Excel
- **file-saver**: Download de templates
- **React**: Interface moderna
- **TypeScript**: Tipagem segura

## 📋 Formato de Dados Importados

Cada cliente importado terá a seguinte estrutura:

```typescript
{
  id: string,              // Gerado automaticamente
  name: string,            // Do Excel
  phone: string,           // Limpo (apenas números)
  email: string,           // Do Excel (opcional)
  birthday: string,        // Do Excel (opcional)
  address: {               // Do Excel (opcional)
    street: string,
    neighborhood: '',      // Vazio inicialmente
    city: ''              // Vazio inicialmente
  },
  notes: string,           // Do Excel (opcional)
  totalSpent: 0,           // Inicializado em 0
  totalVisits: 0,          // Inicializado em 0
  averageTicket: 0,        // Inicializado em 0
  status: 'active',        // Padrão: ativo
  createdAt: string        // Data/hora atual
}
```

## 🎨 Interface

### **Tela de Upload**
- 📁 Área de drop para arquivo
- 📥 Botão de download do template
- 📋 Instruções de uso

### **Tela de Preview**
- 📊 Cards com estatísticas
- 📋 Tabela com dados importados
- ✅ Indicadores de status
- ❌ Lista de erros

### **Confirmação**
- ✅ Mensagem de sucesso
- 📈 Quantidade de clientes importados
- 🔄 Opção de nova importação

---

## 🎯 **Sistema Pronto para Uso!**

A funcionalidade de importação Excel está **100% implementada** e integrada ao sistema de gestão de clientes. 

**Para testar:**
1. Acesse a página Clientes
2. Clique em "Importar Excel"
3. Baixe o template
4. Preencha com seus dados
5. Faça a importação

**🚀 Economize tempo importando centenas de clientes de uma só vez!**