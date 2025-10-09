from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json
from .mock_data import generate_mock_data
from .analytics import AnalyticsEngine

app = FastAPI(
    title="Agenda Salão Analytics API",
    description="Microserviço Python para analytics avançados do salão de beleza",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instanciar engine de analytics
analytics = AnalyticsEngine()

# Gerar dados mock na inicialização
mock_data = generate_mock_data()

@app.get("/")
async def root():
    return {
        "message": "🎯 Agenda Salão Analytics API",
        "version": "1.0.0",
        "status": "✅ Online",
        "endpoints": [
            "/analytics/revenue-forecast",
            "/analytics/client-insights",
            "/analytics/service-performance",
            "/analytics/staff-productivity",
            "/analytics/dashboard-summary"
        ]
    }

@app.get("/analytics/dashboard-summary")
async def get_dashboard_summary():
    """Dashboard principal com todas as métricas importantes"""
    try:
        summary = analytics.get_dashboard_summary(mock_data)
        return {
            "success": True,
            "data": summary,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analytics/revenue-forecast")
async def forecast_revenue(request_data: Dict[str, Any] = None):
    """Previsão de receita baseada em dados históricos"""
    try:
        # Usar dados mock se não houver dados reais
        data = request_data if request_data else mock_data
        forecast = analytics.forecast_revenue(data)
        
        return {
            "success": True,
            "forecast": forecast,
            "data_source": "mock" if not request_data else "real"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/client-insights")
async def get_client_insights():
    """Análise RFM e segmentação de clientes"""
    try:
        insights = analytics.analyze_clients(mock_data)
        return {
            "success": True,
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/service-performance")
async def get_service_performance():
    """Performance dos serviços oferecidos"""
    try:
        performance = analytics.analyze_service_performance(mock_data)
        return {
            "success": True,
            "performance": performance
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/staff-productivity")
async def get_staff_productivity():
    """Análise de produtividade da equipe"""
    try:
        productivity = analytics.analyze_staff_productivity(mock_data)
        return {
            "success": True,
            "productivity": productivity
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/mock-data")
async def get_mock_data():
    """Endpoint para visualizar os dados mock"""
    return {
        "success": True,
        "data": {
            "appointments_count": len(mock_data['appointments']),
            "clients_count": len(mock_data['clients']),
            "services_count": len(mock_data['services']),
            "transactions_count": len(mock_data['transactions']),
            "date_range": {
                "start": min([t['date'] for t in mock_data['transactions']]),
                "end": max([t['date'] for t in mock_data['transactions']])
            }
        },
        "sample_data": {
            "appointment": mock_data['appointments'][0] if mock_data['appointments'] else None,
            "client": mock_data['clients'][0] if mock_data['clients'] else None,
            "transaction": mock_data['transactions'][0] if mock_data['transactions'] else None
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)