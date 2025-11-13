# Sistema de Pagamentos e Relatórios Financeiros

## 📊 Visão Geral

Sistema completo de gerenciamento de pagamentos e análise financeira para salões de beleza, com suporte a múltiplos métodos de pagamento e relatórios detalhados.

## 🎯 Funcionalidades Implementadas

### 💰 Gestão de Pagamentos

- **Criação de Pagamentos**: Interface intuitiva para criar novos pagamentos
- **Múltiplos Métodos**: Suporte para 6 métodos de pagamento
  - PIX (com geração de copia e cola)
  - Cartão de Crédito
  - Cartão de Débito
  - Dinheiro
  - Boleto
  - Transferência Bancária

- **Status de Pagamento**: Acompanhamento completo do ciclo
  - Pendente
  - Processando
  - Aprovado
  - Recusado
  - Cancelado
  - Estornado

- **Gestão de Recebimentos**:
  - A Receber
  - Recebido
  - Atrasado
  - Cancelado

### 📈 Relatórios Financeiros

#### Dashboard Principal
- Receita Total
- Receita do Mês
- Ticket Médio
- Valores a Receber
- Valores em Atraso
- Taxa de Inadimplência

#### Gráficos e Análises
- Gráfico de receitas dos últimos 6 meses
- Métodos de pagamento mais populares
- Top 10 clientes (por valor gasto)

#### Relatório por Período
- Filtro personalizável (data início/fim)
- Total a receber no período
- Total recebido no período
- Total atrasado
- Taxas de gateway
- Valor líquido
- Exportação para CSV

#### Gestão de Inadimplência
- Lista de clientes inadimplentes
- Dias de atraso
- Valor total pendente
- Cálculo de multas e juros
- Detalhamento de cada pendência

## 🗂️ Estrutura de Arquivos

### Types (src/types/)
```
pagamentos.ts - Interfaces e tipos TypeScript
  ├─ MetodoPagamento
  ├─ StatusPagamento
  ├─ StatusRecebimento
  ├─ Pagamento
  ├─ RelatorioFinanceiro
  ├─ ClienteInadimplente
  ├─ ConfiguracaoPagamento
  ├─ DashboardFinanceiro
  └─ TransacaoGateway
```

### Services (src/services/)
```
PagamentoService.ts - Lógica de negócio de pagamentos
  ├─ criarPagamento()
  ├─ confirmarRecebimento()
  ├─ cancelarPagamento()
  ├─ calcularTaxa()
  ├─ calcularMultaJuros()
  ├─ listarPagamentos()
  ├─ listarPagamentosPendentes()
  └─ listarPagamentosAtrasados()

RelatorioFinanceiroService.ts - Análise e relatórios
  ├─ gerarRelatorioPeriodo()
  ├─ gerarRelatorioInadimplencia()
  ├─ gerarDashboard()
  ├─ gerarGraficoReceitas()
  ├─ obterMetodosPopulares()
  ├─ obterTopClientes()
  └─ exportarParaCSV()
```

### Components (src/components/)
```
PagamentosPage.tsx - Interface de gestão de pagamentos
RelatoriosFinanceirosPage.tsx - Interface de relatórios
```

## ⚙️ Configuração

### Taxas de Gateway (Configuráveis)
```typescript
taxaCartaoCredito: 3.99%
taxaCartaoDebito: 1.99%
taxaPix: 0.99%
taxaBoleto: 3.49%
```

### Multas e Juros por Atraso
```typescript
multaAtraso: 2% (fixo)
jurosAtraso: 0.033% ao dia (1% ao mês)
```

### Vencimento de Boleto
```typescript
diasVencimentoBoleto: 3 dias após emissão
```

## 🔌 Integração com Gateways de Pagamento

### Mercado Pago (Preparado)
```typescript
interface ConfiguracaoPagamento {
  mercadoPagoAccessToken?: string;
  mercadoPagoPublicKey?: string;
  ...
}
```

### Stripe (Preparado)
```typescript
interface ConfiguracaoPagamento {
  stripeSecretKey?: string;
  stripePublicKey?: string;
  ...
}
```

### PIX
```typescript
interface ConfiguracaoPagamento {
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
}
```

## 💾 Armazenamento

### LocalStorage (Temporário)
- Pagamentos: `localStorage.getItem('pagamentos')`
- Configurações: `localStorage.getItem('config-pagamento')`

### Migração para Banco de Dados
Para produção, migrar para PostgreSQL:
1. Substituir `localStorage` por chamadas de API
2. Implementar endpoints REST
3. Conectar ao Render PostgreSQL

## 🚀 Como Usar

### Acessar Páginas
1. **Pagamentos**: Menu lateral → "Pagamentos"
2. **Relatórios Financeiros**: Menu lateral → "Relatórios Financeiros"

### Criar Pagamento
1. Ir para página "Pagamentos"
2. Clicar em "+ Novo Pagamento"
3. Preencher formulário:
   - Cliente (obrigatório)
   - Valor (obrigatório)
   - Método de pagamento
   - Descrição
   - Data de vencimento
4. Clicar em "Criar Pagamento"

### Confirmar Recebimento
1. Na lista de pagamentos, localizar pagamento pendente
2. Clicar em "✓ Confirmar Recebimento"
3. Pagamento passa para status "Recebido"

### Gerar Relatório
1. Ir para "Relatórios Financeiros"
2. Selecionar aba "Relatório por Período"
3. Escolher data início e fim
4. Clicar em "Gerar"
5. Opcionalmente exportar para CSV

### Verificar Inadimplência
1. Ir para "Relatórios Financeiros"
2. Selecionar aba "Inadimplência"
3. Ver lista de clientes com pagamentos atrasados
4. Expandir detalhes para ver pendências individuais

## 📊 Fórmulas e Cálculos

### Cálculo de Taxa de Gateway
```typescript
taxa = (valor * percentual) / 100
valorLiquido = valor - taxa
```

### Cálculo de Multa e Juros
```typescript
diasAtraso = diasDiferenca(hoje, dataVencimento)
multa = (valor * 2) / 100  // 2% fixo
juros = (valor * 0.033 * diasAtraso) / 100  // 1% ao mês
total = valor + multa + juros
```

### Taxa de Inadimplência
```typescript
totalPendente = aReceber + emAtraso
taxaInadimplencia = (emAtraso / totalPendente) * 100
```

## 🎨 Interface

### Design
- Glassmorphism com backdrop blur
- Gradiente roxo/rosa (identidade visual)
- Responsivo (mobile-first)
- Cards informativos com ícones

### Cores por Status
- 🟢 Recebido: Verde (`text-green-600 bg-green-100`)
- 🔵 A Receber: Azul (`text-blue-600 bg-blue-100`)
- 🔴 Atrasado: Vermelho (`text-red-600 bg-red-100`)
- ⚫ Cancelado: Cinza (`text-gray-600 bg-gray-100`)

## 🔮 Próximos Passos

### Fase 1 - Integração Real (Próximo)
- [ ] Conectar Mercado Pago API
- [ ] Conectar Stripe API
- [ ] Webhook para confirmação automática
- [ ] QR Code PIX real

### Fase 2 - Banco de Dados
- [ ] Migrar localStorage para PostgreSQL
- [ ] Criar API endpoints
- [ ] Implementar autenticação de API

### Fase 3 - Automações
- [ ] Lembretes automáticos de vencimento
- [ ] Cobrança recorrente
- [ ] Notificações por WhatsApp
- [ ] Email de comprovante

### Fase 4 - Analytics Avançado
- [ ] Previsão de receitas
- [ ] Análise de tendências
- [ ] Comparativo de períodos
- [ ] Projeções financeiras

## 📝 Notas Importantes

### Segurança
- **NUNCA** commitar chaves de API no código
- Usar variáveis de ambiente para tokens
- Validar TODAS as entradas do usuário
- Implementar rate limiting
- Criptografar dados sensíveis

### Performance
- Implementar paginação para listas grandes
- Cachear relatórios pesados
- Lazy loading de componentes
- Debounce em buscas

### Conformidade
- LGPD: Consentimento para dados pessoais
- Notas fiscais: Integração futura
- Auditoria: Log de todas as transações

## 🆘 Suporte

### Problemas Comuns

**Pagamento não aparece na lista**
- Verificar localStorage: `console.log(localStorage.getItem('pagamentos'))`
- Limpar cache do navegador
- Recarregar página

**Taxas incorretas**
- Verificar configurações: `PagamentoService.obterConfiguracoes()`
- Ajustar em ConfiguracoesPage (futuro)

**Relatório vazio**
- Verificar se há pagamentos no período selecionado
- Verificar formato de datas (ISO 8601)

## 📞 Contato

Para dúvidas sobre implementação:
- Revisar este README
- Verificar comentários no código
- Consultar interfaces TypeScript em `types/pagamentos.ts`
