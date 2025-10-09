"""
Sistema de Caixa - Microserviço Python para Gestão Financeira
Especializado em cálculos financeiros, análises de fluxo de caixa e relatórios
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from decimal import Decimal, ROUND_HALF_UP
import json

app = FastAPI(title="Sistema de Caixa", description="Microserviço Python para gestão financeira")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de dados
class Transacao(BaseModel):
    id: Optional[str] = None
    tipo: str  # 'entrada', 'saida'
    categoria: str  # 'servico', 'produto', 'despesa', 'comissao'
    subcategoria: Optional[str] = None
    valor: float
    descricao: str
    data_hora: datetime
    metodo_pagamento: str  # 'dinheiro', 'cartao_credito', 'cartao_debito', 'pix'
    cliente_id: Optional[str] = None
    funcionario_id: Optional[str] = None
    observacoes: Optional[str] = None

class RelatorioRequest(BaseModel):
    data_inicio: date
    data_fim: date
    categoria: Optional[str] = None
    metodo_pagamento: Optional[str] = None

class CalculoComissao(BaseModel):
    funcionario_id: str
    periodo_inicio: date
    periodo_fim: date
    percentual_comissao: float

# Simulação de dados em memória (em produção seria um banco de dados)
transacoes_db = []

# Dados mock para demonstração
def gerar_dados_mock():
    """Gera dados mock realistas para demonstração"""
    import random
    from datetime import datetime, timedelta
    
    categorias = {
        'entrada': {
            'servico': ['Corte de Cabelo', 'Escova', 'Manicure', 'Pedicure', 'Coloração', 'Hidratação'],
            'produto': ['Shampoo', 'Condicionador', 'Máscara', 'Óleo Capilar', 'Esmalte', 'Base']
        },
        'saida': {
            'despesa': ['Aluguel', 'Energia', 'Água', 'Internet', 'Material', 'Limpeza'],
            'comissao': ['Comissão Funcionário']
        }
    }
    
    metodos = ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix']
    funcionarios = ['func_001', 'func_002', 'func_003']
    
    # Gerar transações dos últimos 30 dias
    data_base = datetime.now()
    
    for i in range(150):  # 150 transações
        # Mais entradas que saídas (80% entradas, 20% saídas)
        tipo = 'entrada' if random.random() < 0.8 else 'saida'
        categoria = random.choice(list(categorias[tipo].keys()))
        subcategoria = random.choice(categorias[tipo][categoria])
        
        # Valores realistas
        if tipo == 'entrada':
            if categoria == 'servico':
                valor = random.uniform(25, 120)  # Serviços entre R$ 25-120
            else:  # produto
                valor = random.uniform(15, 80)   # Produtos entre R$ 15-80
        else:  # saida
            if categoria == 'despesa':
                valor = random.uniform(50, 800)  # Despesas entre R$ 50-800
            else:  # comissao
                valor = random.uniform(10, 40)   # Comissões entre R$ 10-40
        
        # Data aleatória nos últimos 30 dias
        dias_atras = random.randint(0, 30)
        data_transacao = data_base - timedelta(days=dias_atras)
        
        transacao = {
            'id': f'trans_{i+1:03d}',
            'tipo': tipo,
            'categoria': categoria,
            'subcategoria': subcategoria,
            'valor': round(valor, 2),
            'descricao': f'{subcategoria} - {data_transacao.strftime("%d/%m")}',
            'data_hora': data_transacao,
            'metodo_pagamento': random.choice(metodos),
            'cliente_id': f'cliente_{random.randint(1, 50):03d}' if tipo == 'entrada' else None,
            'funcionario_id': random.choice(funcionarios),
            'observacoes': None
        }
        
        transacoes_db.append(transacao)

# Gerar dados mock na inicialização
gerar_dados_mock()

class CaixaCalculator:
    """Classe especializada em cálculos financeiros"""
    
    @staticmethod
    def calcular_saldo_atual() -> Dict[str, Any]:
        """Calcula o saldo atual do caixa"""
        entradas = sum(t['valor'] for t in transacoes_db if t['tipo'] == 'entrada')
        saidas = sum(t['valor'] for t in transacoes_db if t['tipo'] == 'saida')
        saldo = entradas - saidas
        
        return {
            'saldo_atual': round(saldo, 2),
            'total_entradas': round(entradas, 2),
            'total_saidas': round(saidas, 2),
            'margem_liquida': round((saldo / entradas * 100) if entradas > 0 else 0, 2)
        }
    
    @staticmethod
    def calcular_fluxo_diario(dias: int = 30) -> List[Dict[str, Any]]:
        """Calcula fluxo de caixa diário"""
        data_limite = datetime.now() - timedelta(days=dias)
        
        # Filtrar transações do período
        transacoes_periodo = [t for t in transacoes_db if t['data_hora'] >= data_limite]
        
        # Agrupar por dia
        df = pd.DataFrame(transacoes_periodo)
        if df.empty:
            return []
        
        df['data'] = pd.to_datetime(df['data_hora']).dt.date
        
        # Calcular entradas e saídas por dia
        resultado = []
        for data in pd.date_range(start=data_limite.date(), end=datetime.now().date()):
            transacoes_dia = df[df['data'] == data.date()]
            
            entradas = transacoes_dia[transacoes_dia['tipo'] == 'entrada']['valor'].sum()
            saidas = transacoes_dia[transacoes_dia['tipo'] == 'saida']['valor'].sum()
            
            resultado.append({
                'data': data.strftime('%Y-%m-%d'),
                'entradas': round(float(entradas) if not pd.isna(entradas) else 0, 2),
                'saidas': round(float(saidas) if not pd.isna(saidas) else 0, 2),
                'saldo_dia': round(float(entradas - saidas) if not pd.isna(entradas - saidas) else 0, 2)
            })
        
        return resultado
    
    @staticmethod
    def calcular_por_metodo_pagamento() -> List[Dict[str, Any]]:
        """Analisa distribuição por método de pagamento"""
        df = pd.DataFrame(transacoes_db)
        if df.empty:
            return []
        
        # Filtrar apenas entradas
        entradas = df[df['tipo'] == 'entrada']
        
        resultado = entradas.groupby('metodo_pagamento')['valor'].agg(['sum', 'count']).reset_index()
        resultado.columns = ['metodo', 'total', 'quantidade']
        
        total_geral = resultado['total'].sum()
        
        return [
            {
                'metodo': row['metodo'],
                'total': round(float(row['total']), 2),
                'quantidade': int(row['quantidade']),
                'percentual': round(float(row['total']) / total_geral * 100, 2) if total_geral > 0 else 0
            }
            for _, row in resultado.iterrows()
        ]
    
    @staticmethod
    def calcular_comissoes(funcionario_id: str, data_inicio: date, data_fim: date, percentual: float) -> Dict[str, Any]:
        """Calcula comissões de funcionários"""
        # Filtrar vendas do funcionário no período
        vendas = [
            t for t in transacoes_db 
            if (t['funcionario_id'] == funcionario_id and 
                t['tipo'] == 'entrada' and
                data_inicio <= t['data_hora'].date() <= data_fim)
        ]
        
        total_vendas = sum(v['valor'] for v in vendas)
        comissao = total_vendas * (percentual / 100)
        
        return {
            'funcionario_id': funcionario_id,
            'periodo': f"{data_inicio} a {data_fim}",
            'total_vendas': round(total_vendas, 2),
            'percentual_comissao': percentual,
            'valor_comissao': round(comissao, 2),
            'quantidade_vendas': len(vendas)
        }
    
    @staticmethod
    def analise_categorias() -> List[Dict[str, Any]]:
        """Análise de performance por categoria"""
        df = pd.DataFrame(transacoes_db)
        if df.empty:
            return []
        
        # Analisar apenas entradas
        entradas = df[df['tipo'] == 'entrada']
        
        analise = entradas.groupby('categoria').agg({
            'valor': ['sum', 'mean', 'count'],
            'subcategoria': 'nunique'
        }).round(2)
        
        analise.columns = ['total', 'ticket_medio', 'quantidade', 'variedade']
        analise = analise.reset_index()
        
        total_geral = analise['total'].sum()
        
        return [
            {
                'categoria': row['categoria'],
                'total': round(float(row['total']), 2),
                'ticket_medio': round(float(row['ticket_medio']), 2),
                'quantidade': int(row['quantidade']),
                'variedade': int(row['variedade']),
                'participacao': round(float(row['total']) / total_geral * 100, 2) if total_geral > 0 else 0
            }
            for _, row in analise.iterrows()
        ]

# Endpoints da API
@app.get("/")
async def root():
    return {"message": "Sistema de Caixa - Microserviço Python", "status": "online"}

@app.get("/caixa/saldo")
async def obter_saldo():
    """Obtém saldo atual do caixa"""
    return CaixaCalculator.calcular_saldo_atual()

@app.get("/caixa/fluxo-diario")
async def obter_fluxo_diario(dias: int = 30):
    """Obtém fluxo de caixa diário"""
    return CaixaCalculator.calcular_fluxo_diario(dias)

@app.get("/caixa/metodos-pagamento")
async def obter_analise_pagamentos():
    """Obtém análise por métodos de pagamento"""
    return CaixaCalculator.calcular_por_metodo_pagamento()

@app.get("/caixa/categorias")
async def obter_analise_categorias():
    """Obtém análise por categorias"""
    return CaixaCalculator.analise_categorias()

@app.post("/caixa/comissoes")
async def calcular_comissoes(calculo: CalculoComissao):
    """Calcula comissões de funcionário"""
    return CaixaCalculator.calcular_comissoes(
        calculo.funcionario_id,
        calculo.periodo_inicio,
        calculo.periodo_fim,
        calculo.percentual_comissao
    )

@app.post("/caixa/transacao")
async def adicionar_transacao(transacao: Transacao):
    """Adiciona nova transação"""
    transacao_dict = transacao.dict()
    transacao_dict['id'] = f"trans_{len(transacoes_db) + 1:03d}"
    transacoes_db.append(transacao_dict)
    
    return {"message": "Transação adicionada com sucesso", "id": transacao_dict['id']}

@app.get("/caixa/transacoes")
async def listar_transacoes(
    data_inicio: Optional[str] = None,
    data_fim: Optional[str] = None,
    tipo: Optional[str] = None,
    categoria: Optional[str] = None
):
    """Lista transações com filtros opcionais"""
    transacoes = transacoes_db.copy()
    
    # Aplicar filtros
    if data_inicio:
        data_inicio_dt = datetime.fromisoformat(data_inicio)
        transacoes = [t for t in transacoes if t['data_hora'] >= data_inicio_dt]
    
    if data_fim:
        data_fim_dt = datetime.fromisoformat(data_fim)
        transacoes = [t for t in transacoes if t['data_hora'] <= data_fim_dt]
    
    if tipo:
        transacoes = [t for t in transacoes if t['tipo'] == tipo]
    
    if categoria:
        transacoes = [t for t in transacoes if t['categoria'] == categoria]
    
    # Ordenar por data (mais recentes primeiro)
    transacoes.sort(key=lambda x: x['data_hora'], reverse=True)
    
    return transacoes

@app.get("/caixa/resumo-periodo")
async def resumo_periodo(data_inicio: str, data_fim: str):
    """Resumo financeiro de um período específico"""
    data_inicio_dt = datetime.fromisoformat(data_inicio)
    data_fim_dt = datetime.fromisoformat(data_fim)
    
    transacoes_periodo = [
        t for t in transacoes_db 
        if data_inicio_dt <= t['data_hora'] <= data_fim_dt
    ]
    
    entradas = sum(t['valor'] for t in transacoes_periodo if t['tipo'] == 'entrada')
    saidas = sum(t['valor'] for t in transacoes_periodo if t['tipo'] == 'saida')
    
    # Análise por categoria
    df = pd.DataFrame(transacoes_periodo)
    if not df.empty:
        por_categoria = df.groupby(['tipo', 'categoria'])['valor'].sum().to_dict()
    else:
        por_categoria = {}
    
    return {
        'periodo': f"{data_inicio} a {data_fim}",
        'total_entradas': round(entradas, 2),
        'total_saidas': round(saidas, 2),
        'saldo_periodo': round(entradas - saidas, 2),
        'quantidade_transacoes': len(transacoes_periodo),
        'por_categoria': {f"{k[0]}_{k[1]}": round(float(v), 2) for k, v in por_categoria.items()},
        'ticket_medio': round(entradas / len([t for t in transacoes_periodo if t['tipo'] == 'entrada']), 2) if any(t['tipo'] == 'entrada' for t in transacoes_periodo) else 0
    }

if __name__ == "__main__":
    import uvicorn
    print("🏦 Iniciando Sistema de Caixa - Microserviço Python")
    print("📊 Especializado em cálculos financeiros e análises")
    print("🔧 Endpoints disponíveis:")
    print("   - GET /caixa/saldo - Saldo atual")
    print("   - GET /caixa/fluxo-diario - Fluxo diário")
    print("   - GET /caixa/metodos-pagamento - Análise pagamentos")
    print("   - GET /caixa/categorias - Análise categorias")
    print("   - POST /caixa/comissoes - Cálculo comissões")
    print("   - POST /caixa/transacao - Nova transação")
    print("   - GET /caixa/transacoes - Listar transações")
    print("   - GET /caixa/resumo-periodo - Resumo período")
    print("🚀 Servidor rodando em http://localhost:8002")
    
    uvicorn.run(app, host="0.0.0.0", port=8002)