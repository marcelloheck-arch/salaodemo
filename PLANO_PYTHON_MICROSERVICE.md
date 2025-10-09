# 🐍 PLANO DE IMPLEMENTAÇÃO: Microserviço Python

## 🎯 **ESTRUTURA DO PROJETO HÍBRIDO**

```
agenda_salao/
├── frontend/                 # Next.js App
│   ├── src/
│   ├── package.json
│   └── prisma/
├── python-analytics/         # FastAPI Microservice
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   └── api/
│   ├── requirements.txt
│   └── Dockerfile
└── docker-compose.yml       # Orquestração
```

## 🚀 **IMPLEMENTAÇÃO FASE 2B: Python Analytics**

### **1. Configuração Inicial**
```bash
# Criar estrutura Python
mkdir python-analytics
cd python-analytics

# Virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Dependências essenciais
pip install fastapi uvicorn pandas numpy scikit-learn
pip install psycopg2-binary python-multipart
pip install python-jose[cryptography] passlib[bcrypt]
```

### **2. Primeiro Endpoint: Análise de Receita**
```python
# python-analytics/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict
import asyncpg

app = FastAPI(title="Agenda Salão Analytics", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Agenda Salão Analytics API"}

@app.post("/analytics/revenue-forecast")
async def forecast_revenue(data: Dict):
    """
    Previsão de receita baseada em dados históricos
    """
    try:
        # Converter para DataFrame
        df = pd.DataFrame(data['transactions'])
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Análise de tendências
        daily_revenue = df.groupby(df['date'].dt.date)['amount'].sum()
        
        # Cálculo de métricas
        mean_revenue = daily_revenue.mean()
        trend_7d = daily_revenue.tail(7).mean()
        trend_30d = daily_revenue.tail(30).mean()
        
        # Previsão simples baseada em tendência
        growth_rate = (trend_7d - trend_30d) / trend_30d if trend_30d > 0 else 0
        forecast_next_week = trend_7d * (1 + growth_rate)
        
        # Detecção de sazonalidade
        df['day_of_week'] = df['date'].dt.dayofweek
        weekly_pattern = df.groupby('day_of_week')['amount'].mean().to_dict()
        
        return {
            "current_metrics": {
                "daily_average": float(mean_revenue),
                "weekly_average": float(trend_7d),
                "monthly_average": float(trend_30d),
                "growth_rate": float(growth_rate * 100)
            },
            "forecast": {
                "next_week_revenue": float(forecast_next_week),
                "confidence": 0.75  # Placeholder
            },
            "patterns": {
                "weekly_distribution": {
                    str(k): float(v) for k, v in weekly_pattern.items()
                },
                "best_day": int(max(weekly_pattern, key=weekly_pattern.get)),
                "worst_day": int(min(weekly_pattern, key=weekly_pattern.get))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analytics/client-insights")
async def analyze_clients(data: Dict):
    """
    Análise de comportamento de clientes
    """
    try:
        clients_df = pd.DataFrame(data['clients'])
        appointments_df = pd.DataFrame(data['appointments'])
        
        # Merge dados
        merged = appointments_df.merge(clients_df, left_on='clientId', right_on='id')
        
        # Análises
        client_frequency = merged.groupby('clientId').size()
        client_value = merged.groupby('clientId')['totalPrice'].sum()
        
        # Segmentação RFM simplificada
        recency = merged.groupby('clientId')['date'].max()
        frequency = client_frequency
        monetary = client_value
        
        # Scores
        recency_score = pd.qcut(recency.rank(), 3, labels=[1, 2, 3])
        frequency_score = pd.qcut(frequency.rank(), 3, labels=[1, 2, 3])
        monetary_score = pd.qcut(monetary.rank(), 3, labels=[1, 2, 3])
        
        # Combinação RFM
        rfm_score = recency_score.astype(str) + frequency_score.astype(str) + monetary_score.astype(str)
        
        # Classificação de clientes
        def classify_client(score):
            if score in ['333', '332', '323', '322']:
                return 'champions'
            elif score in ['331', '321', '312', '311']:
                return 'loyal_customers'
            elif score in ['233', '232', '223', '222']:
                return 'potential_loyalists'
            elif score in ['133', '132', '123', '122']:
                return 'new_customers'
            else:
                return 'at_risk'
        
        client_segments = rfm_score.apply(classify_client)
        segment_counts = client_segments.value_counts().to_dict()
        
        return {
            "total_clients": len(clients_df),
            "active_clients": len(client_frequency),
            "average_frequency": float(client_frequency.mean()),
            "average_value": float(client_value.mean()),
            "segments": segment_counts,
            "top_clients": client_value.nlargest(5).to_dict()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### **3. Integração com Next.js**
```typescript
// src/lib/analytics.ts
const ANALYTICS_API = process.env.ANALYTICS_API_URL || 'http://localhost:8000';

export class AnalyticsService {
  static async forecastRevenue(transactions: any[]) {
    const response = await fetch(`${ANALYTICS_API}/analytics/revenue-forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch revenue forecast');
    }
    
    return response.json();
  }
  
  static async analyzeClients(clients: any[], appointments: any[]) {
    const response = await fetch(`${ANALYTICS_API}/analytics/client-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clients, appointments })
    });
    
    return response.json();
  }
}
```

## 📊 **CASOS DE USO ESPECÍFICOS PARA PYTHON**

### **1. Otimização de Agenda (Algoritmo Genético)**
```python
# Quando: Múltiplos funcionários, múltiplos serviços, restrições complexas
def optimize_weekly_schedule(appointments, staff, constraints):
    # Implementar algoritmo genético
    # Fitness: maximizar receita + satisfação do cliente + eficiência
    pass
```

### **2. Previsão de No-Shows (Machine Learning)**
```python
# Quando: Histórico suficiente (500+ agendamentos)
def predict_no_show_probability(client_data, appointment_data, weather_data):
    # RandomForest com features engineered
    # ROC-AUC > 0.8 esperado
    pass
```

### **3. Análise de Sentimento (NLP)**
```python
# Quando: Reviews, feedback, mensagens WhatsApp
def analyze_customer_sentiment(texts):
    # BERT para português brasileiro
    # Classificação: positivo/neutro/negativo
    pass
```

### **4. Detecção de Anomalias (Estatística)**
```python
# Quando: Detectar padrões incomuns na receita/agendamentos
def detect_revenue_anomalies(time_series_data):
    # Isolation Forest + LSTM
    # Alertas automáticos
    pass
```

## 🔄 **PIPELINE DE IMPLEMENTAÇÃO**

### **Semana 1: Setup Básico**
- [ ] Configurar FastAPI
- [ ] Endpoints básicos de analytics
- [ ] Integração com PostgreSQL
- [ ] Primeiro endpoint no Next.js

### **Semana 2: Analytics Avançados**
- [ ] Previsão de receita
- [ ] Análise RFM de clientes
- [ ] Padrões sazonais
- [ ] Dashboard atualizado

### **Semana 3: Machine Learning**
- [ ] Modelo de no-shows
- [ ] Otimização de agenda
- [ ] Recomendações de serviços
- [ ] Validação de modelos

### **Semana 4: Produção**
- [ ] Docker containers
- [ ] CI/CD pipeline
- [ ] Monitoramento
- [ ] Deploy

## 🎯 **CRITÉRIOS DE DECISÃO**

**Use Python quando:**
- ✅ Cálculos estatísticos complexos
- ✅ Machine Learning
- ✅ Otimização matemática  
- ✅ Processamento de dados em lote
- ✅ Análises que requerem NumPy/Pandas

**Mantenha JavaScript quando:**
- ✅ Interface do usuário
- ✅ CRUD simples
- ✅ APIs REST básicas
- ✅ Validações de formulário
- ✅ Operações em tempo real

**Quer começar com qual funcionalidade Python?**
1. 📊 Análise de receita avançada
2. 🎯 Otimização de agenda
3. 🤖 Previsão de no-shows
4. 📈 Dashboard de BI