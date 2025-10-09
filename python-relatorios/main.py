"""
Sistema de Relatórios Avançados - Python Superior
Processamento de dados, análises estatísticas e geração de relatórios complexos
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from decimal import Decimal, ROUND_HALF_UP
import json
from enum import Enum
import statistics
from collections import defaultdict

app = FastAPI(title="Sistema de Relatórios Avançados", description="Python para análises complexas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums
class TipoRelatorio(str, Enum):
    VENDAS = "vendas"
    CLIENTES = "clientes"
    SERVICOS = "servicos"
    FUNCIONARIOS = "funcionarios"
    FINANCEIRO = "financeiro"
    OPERACIONAL = "operacional"

class PeriodoAnalise(str, Enum):
    DIARIO = "diario"
    SEMANAL = "semanal"
    MENSAL = "mensal"
    TRIMESTRAL = "trimestral"
    ANUAL = "anual"

# Modelos
class RelatorioRequest(BaseModel):
    tipo: TipoRelatorio
    periodo: PeriodoAnalise
    data_inicio: date
    data_fim: date
    filtros: Optional[Dict[str, Any]] = None

class AnaliseRequest(BaseModel):
    metricas: List[str]
    dimensoes: List[str]
    periodo: PeriodoAnalise
    data_inicio: date
    data_fim: date

# Dados simulados mais robustos
def gerar_dados_completos():
    """Gera dataset completo para análises avançadas"""
    np.random.seed(42)  # Para resultados consistentes
    
    # Clientes
    clientes = []
    for i in range(200):
        cliente = {
            'id': f'cli_{i+1:03d}',
            'nome': f'Cliente {i+1}',
            'idade': np.random.randint(18, 70),
            'sexo': np.random.choice(['F', 'M'], p=[0.7, 0.3]),
            'cidade': np.random.choice(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador'], p=[0.4, 0.3, 0.2, 0.1]),
            'data_cadastro': datetime.now() - timedelta(days=np.random.randint(1, 365)),
            'telefone': f'(11) 9{np.random.randint(1000, 9999)}-{np.random.randint(1000, 9999)}',
            'preferencia_horario': np.random.choice(['manhã', 'tarde', 'noite'], p=[0.3, 0.5, 0.2]),
            'frequencia_media': np.random.randint(15, 90),  # dias entre visitas
            'gasto_medio': np.random.normal(80, 25),
            'vip': np.random.choice([True, False], p=[0.15, 0.85])
        }
        clientes.append(cliente)
    
    # Funcionários
    funcionarios = [
        {'id': 'func_001', 'nome': 'Maria Silva', 'especialidade': 'corte_coloracao', 'experiencia': 8, 'comissao': 0.15},
        {'id': 'func_002', 'nome': 'João Santos', 'especialidade': 'barba_masculino', 'experiencia': 5, 'comissao': 0.12},
        {'id': 'func_003', 'nome': 'Ana Costa', 'especialidade': 'manicure_pedicure', 'experiencia': 12, 'comissao': 0.18},
        {'id': 'func_004', 'nome': 'Pedro Lima', 'especialidade': 'corte_masculino', 'experiencia': 3, 'comissao': 0.10},
        {'id': 'func_005', 'nome': 'Carla Souza', 'especialidade': 'tratamentos', 'experiencia': 15, 'comissao': 0.20}
    ]
    
    # Serviços
    servicos = [
        {'id': 'srv_001', 'nome': 'Corte Feminino', 'categoria': 'corte', 'preco': 45.0, 'duracao': 45, 'popularidade': 0.25},
        {'id': 'srv_002', 'nome': 'Corte Masculino', 'categoria': 'corte', 'preco': 25.0, 'duracao': 30, 'popularidade': 0.20},
        {'id': 'srv_003', 'nome': 'Coloração', 'categoria': 'coloracao', 'preco': 120.0, 'duracao': 120, 'popularidade': 0.15},
        {'id': 'srv_004', 'nome': 'Escova', 'categoria': 'finalizacao', 'preco': 35.0, 'duracao': 40, 'popularidade': 0.18},
        {'id': 'srv_005', 'nome': 'Manicure', 'categoria': 'unhas', 'preco': 20.0, 'duracao': 45, 'popularidade': 0.22},
        {'id': 'srv_006', 'nome': 'Pedicure', 'categoria': 'unhas', 'preco': 25.0, 'duracao': 60, 'popularidade': 0.15},
        {'id': 'srv_007', 'nome': 'Hidratação', 'categoria': 'tratamento', 'preco': 60.0, 'duracao': 60, 'popularidade': 0.10},
        {'id': 'srv_008', 'nome': 'Barba', 'categoria': 'masculino', 'preco': 15.0, 'duracao': 20, 'popularidade': 0.12}
    ]
    
    # Gerar agendamentos com padrões realistas
    agendamentos = []
    data_base = datetime.now() - timedelta(days=90)
    
    for dias in range(90):
        data_atual = data_base + timedelta(days=dias)
        
        # Mais agendamentos em fins de semana
        if data_atual.weekday() >= 5:  # Sábado/Domingo
            num_agendamentos = np.random.poisson(15)
        else:
            num_agendamentos = np.random.poisson(8)
        
        for _ in range(num_agendamentos):
            cliente = np.random.choice(clientes)
            servico = np.random.choice(servicos, p=[s['popularidade'] for s in servicos])
            funcionario = np.random.choice(funcionarios)
            
            # Horários realistas
            hora = np.random.choice(range(8, 19), p=[0.05, 0.08, 0.12, 0.15, 0.12, 0.08, 0.05, 0.10, 0.10, 0.10, 0.05])
            minuto = np.random.choice([0, 30])
            
            # Status baseado na data
            if data_atual.date() < datetime.now().date():
                status = np.random.choice(['concluido', 'cancelado', 'faltou'], p=[0.85, 0.10, 0.05])
            else:
                status = np.random.choice(['agendado', 'confirmado'], p=[0.3, 0.7])
            
            # Variação de preço (promoções, etc)
            preco_final = servico['preco'] * np.random.uniform(0.8, 1.2)
            
            agendamento = {
                'id': f'ag_{len(agendamentos)+1:05d}',
                'cliente_id': cliente['id'],
                'funcionario_id': funcionario['id'],
                'servico_id': servico['id'],
                'data_hora': data_atual.replace(hour=hora, minute=minuto),
                'status': status,
                'preco_cobrado': round(preco_final, 2),
                'duracao_real': servico['duracao'] + np.random.randint(-10, 20),
                'avaliacao': np.random.randint(3, 6) if status == 'concluido' else None,
                'observacoes': np.random.choice([None, 'Cliente satisfeito', 'Reagendou', 'Primeira vez'], p=[0.7, 0.1, 0.1, 0.1])
            }
            agendamentos.append(agendamento)
    
    return {
        'clientes': clientes,
        'funcionarios': funcionarios,
        'servicos': servicos,
        'agendamentos': agendamentos
    }

# Gerar dados na inicialização
dados_sistema = gerar_dados_completos()

class AnalisadorAvancado:
    """Classe para análises estatísticas complexas"""
    
    @staticmethod
    def calcular_kpis_periodo(data_inicio: date, data_fim: date) -> Dict[str, Any]:
        """Calcula KPIs principais do período"""
        agendamentos_periodo = [
            a for a in dados_sistema['agendamentos']
            if data_inicio <= a['data_hora'].date() <= data_fim
        ]
        
        if not agendamentos_periodo:
            return {"erro": "Nenhum agendamento no período"}
        
        df = pd.DataFrame(agendamentos_periodo)
        
        # KPIs básicos
        total_agendamentos = len(df)
        agendamentos_concluidos = len(df[df['status'] == 'concluido'])
        taxa_conclusao = (agendamentos_concluidos / total_agendamentos * 100) if total_agendamentos > 0 else 0
        
        receita_total = df[df['status'] == 'concluido']['preco_cobrado'].sum()
        ticket_medio = df[df['status'] == 'concluido']['preco_cobrado'].mean()
        
        # Análises avançadas
        clientes_unicos = df['cliente_id'].nunique()
        servicos_mais_vendidos = df[df['status'] == 'concluido']['servico_id'].value_counts().head(3).to_dict()
        
        # Análise temporal
        df['dia_semana'] = pd.to_datetime(df['data_hora']).dt.day_name()
        df['hora'] = pd.to_datetime(df['data_hora']).dt.hour
        
        melhor_dia = df['dia_semana'].value_counts().index[0]
        melhor_horario = df['hora'].value_counts().index[0]
        
        # Taxa de cancelamento
        cancelamentos = len(df[df['status'].isin(['cancelado', 'faltou'])])
        taxa_cancelamento = (cancelamentos / total_agendamentos * 100) if total_agendamentos > 0 else 0
        
        # Avaliação média
        avaliacoes = df[df['avaliacao'].notna()]['avaliacao']
        avaliacao_media = avaliacoes.mean() if len(avaliacoes) > 0 else 0
        
        return {
            'periodo': f"{data_inicio} a {data_fim}",
            'kpis_basicos': {
                'total_agendamentos': total_agendamentos,
                'agendamentos_concluidos': agendamentos_concluidos,
                'taxa_conclusao': round(taxa_conclusao, 2),
                'receita_total': round(receita_total, 2),
                'ticket_medio': round(ticket_medio, 2),
                'clientes_atendidos': clientes_unicos
            },
            'performance': {
                'taxa_cancelamento': round(taxa_cancelamento, 2),
                'avaliacao_media': round(avaliacao_media, 2),
                'melhor_dia_semana': melhor_dia,
                'melhor_horario': f"{melhor_horario}:00"
            },
            'top_servicos': servicos_mais_vendidos
        }
    
    @staticmethod
    def analise_crescimento(periodo: PeriodoAnalise) -> Dict[str, Any]:
        """Análise de crescimento com tendências"""
        hoje = datetime.now().date()
        
        if periodo == PeriodoAnalise.MENSAL:
            periodo_atual = hoje.replace(day=1)
            periodo_anterior = (periodo_atual - timedelta(days=1)).replace(day=1)
            periodo_anterior_fim = periodo_atual - timedelta(days=1)
        elif periodo == PeriodoAnalise.SEMANAL:
            inicio_semana = hoje - timedelta(days=hoje.weekday())
            periodo_atual = inicio_semana
            periodo_anterior = inicio_semana - timedelta(days=7)
            periodo_anterior_fim = inicio_semana - timedelta(days=1)
        else:  # DIARIO
            periodo_atual = hoje
            periodo_anterior = hoje - timedelta(days=1)
            periodo_anterior_fim = periodo_anterior
        
        # Dados período atual
        atual = AnalisadorAvancado.calcular_kpis_periodo(periodo_atual, hoje)
        anterior = AnalisadorAvancado.calcular_kpis_periodo(periodo_anterior, periodo_anterior_fim)
        
        if 'erro' in atual or 'erro' in anterior:
            return {"erro": "Dados insuficientes para análise de crescimento"}
        
        # Calcular crescimento
        def calc_crescimento(atual_val, anterior_val):
            if anterior_val == 0:
                return 100 if atual_val > 0 else 0
            return ((atual_val - anterior_val) / anterior_val) * 100
        
        crescimento_receita = calc_crescimento(
            atual['kpis_basicos']['receita_total'],
            anterior['kpis_basicos']['receita_total']
        )
        
        crescimento_agendamentos = calc_crescimento(
            atual['kpis_basicos']['total_agendamentos'],
            anterior['kpis_basicos']['total_agendamentos']
        )
        
        crescimento_clientes = calc_crescimento(
            atual['kpis_basicos']['clientes_atendidos'],
            anterior['kpis_basicos']['clientes_atendidos']
        )
        
        return {
            'periodo_analise': periodo.value,
            'comparacao': {
                'receita': {
                    'atual': atual['kpis_basicos']['receita_total'],
                    'anterior': anterior['kpis_basicos']['receita_total'],
                    'crescimento_percentual': round(crescimento_receita, 2)
                },
                'agendamentos': {
                    'atual': atual['kpis_basicos']['total_agendamentos'],
                    'anterior': anterior['kpis_basicos']['total_agendamentos'],
                    'crescimento_percentual': round(crescimento_agendamentos, 2)
                },
                'clientes': {
                    'atual': atual['kpis_basicos']['clientes_atendidos'],
                    'anterior': anterior['kpis_basicos']['clientes_atendidos'],
                    'crescimento_percentual': round(crescimento_clientes, 2)
                }
            },
            'tendencia_geral': 'crescimento' if crescimento_receita > 0 else 'declinio' if crescimento_receita < 0 else 'estavel'
        }
    
    @staticmethod
    def analise_cohort_clientes() -> Dict[str, Any]:
        """Análise de coorte de clientes (retenção)"""
        df_agendamentos = pd.DataFrame(dados_sistema['agendamentos'])
        df_agendamentos = df_agendamentos[df_agendamentos['status'] == 'concluido']
        df_agendamentos['data'] = pd.to_datetime(df_agendamentos['data_hora']).dt.date
        
        # Primeira visita de cada cliente
        primeira_visita = df_agendamentos.groupby('cliente_id')['data'].min().reset_index()
        primeira_visita.columns = ['cliente_id', 'primeira_visita']
        primeira_visita['cohort_group'] = pd.to_datetime(primeira_visita['primeira_visita']).dt.to_period('M')
        
        # Merge com dados originais
        df_cohort = df_agendamentos.merge(primeira_visita, on='cliente_id')
        df_cohort['periodo'] = pd.to_datetime(df_cohort['data']).dt.to_period('M')
        df_cohort['period_number'] = (df_cohort['periodo'] - df_cohort['cohort_group']).apply(attrgetter('n'))
        
        # Calcular cohort table
        cohort_data = df_cohort.groupby(['cohort_group', 'period_number'])['cliente_id'].nunique().reset_index()
        cohort_sizes = primeira_visita.groupby('cohort_group')['cliente_id'].nunique()
        
        cohort_table = cohort_data.pivot(index='cohort_group', columns='period_number', values='cliente_id')
        
        # Calcular taxas de retenção
        retention_table = cohort_table.divide(cohort_sizes, axis=0)
        
        # Média de retenção por período
        avg_retention = retention_table.mean().fillna(0).round(4)
        
        return {
            'retencao_media': {
                'mes_0': float(avg_retention.get(0, 1.0)),  # Mês da primeira visita
                'mes_1': float(avg_retention.get(1, 0.0)),
                'mes_2': float(avg_retention.get(2, 0.0)),
                'mes_3': float(avg_retention.get(3, 0.0)),
                'mes_6': float(avg_retention.get(6, 0.0))
            },
            'interpretacao': {
                'taxa_retorno_mes1': f"{avg_retention.get(1, 0) * 100:.1f}%",
                'clientes_fieis': f"{avg_retention.get(3, 0) * 100:.1f}%",
                'recomendacao': "Foco em retenção" if avg_retention.get(1, 0) < 0.3 else "Retenção saudável"
            }
        }

# Importar attrgetter para cohort analysis
from operator import attrgetter

# Endpoints da API
@app.get("/")
async def root():
    return {"message": "Sistema de Relatórios Avançados - Python Superior", "status": "online"}

@app.get("/relatorios/kpis")
async def obter_kpis(
    data_inicio: date = Query(..., description="Data início"),
    data_fim: date = Query(..., description="Data fim")
):
    """Obtém KPIs principais do período"""
    return AnalisadorAvancado.calcular_kpis_periodo(data_inicio, data_fim)

@app.get("/relatorios/crescimento")
async def analise_crescimento(periodo: PeriodoAnalise = PeriodoAnalise.MENSAL):
    """Análise de crescimento comparativo"""
    return AnalisadorAvancado.analise_crescimento(periodo)

@app.get("/relatorios/cohort")
async def analise_cohort():
    """Análise de coorte de clientes"""
    return AnalisadorAvancado.analise_cohort_clientes()

@app.get("/relatorios/dashboard-executivo")
async def dashboard_executivo():
    """Dashboard executivo completo"""
    hoje = datetime.now().date()
    inicio_mes = hoje.replace(day=1)
    
    # Compilar dados do dashboard
    kpis_mes = AnalisadorAvancado.calcular_kpis_periodo(inicio_mes, hoje)
    crescimento = AnalisadorAvancado.analise_crescimento(PeriodoAnalise.MENSAL)
    cohort = AnalisadorAvancado.analise_cohort_clientes()
    
    # Análise de funcionários
    df_agendamentos = pd.DataFrame(dados_sistema['agendamentos'])
    df_concluidos = df_agendamentos[df_agendamentos['status'] == 'concluido']
    
    performance_funcionarios = df_concluidos.groupby('funcionario_id').agg({
        'preco_cobrado': ['sum', 'count', 'mean'],
        'avaliacao': 'mean'
    }).round(2)
    
    # Top performers
    funcionarios_dict = {f['id']: f['nome'] for f in dados_sistema['funcionarios']}
    top_funcionarios = []
    
    for func_id, dados in performance_funcionarios.iterrows():
        top_funcionarios.append({
            'nome': funcionarios_dict.get(func_id, func_id),
            'receita_total': float(dados[('preco_cobrado', 'sum')]),
            'atendimentos': int(dados[('preco_cobrado', 'count')]),
            'ticket_medio': float(dados[('preco_cobrado', 'mean')]),
            'avaliacao_media': float(dados[('avaliacao', 'mean')]) if not pd.isna(dados[('avaliacao', 'mean')]) else 0
        })
    
    top_funcionarios = sorted(top_funcionarios, key=lambda x: x['receita_total'], reverse=True)[:3]
    
    return {
        'data_atualizacao': datetime.now().isoformat(),
        'kpis_mes_atual': kpis_mes,
        'analise_crescimento': crescimento,
        'retencao_clientes': cohort,
        'top_funcionarios': top_funcionarios,
        'insights_automaticos': [
            f"Melhor dia da semana: {kpis_mes.get('performance', {}).get('melhor_dia_semana', 'N/A')}",
            f"Taxa de conclusão: {kpis_mes.get('kpis_basicos', {}).get('taxa_conclusao', 0)}%",
            f"Tendência: {crescimento.get('tendencia_geral', 'estável')}"
        ]
    }

@app.get("/relatorios/previsao-demanda")
async def previsao_demanda():
    """Previsão de demanda usando análise estatística"""
    df = pd.DataFrame(dados_sistema['agendamentos'])
    df['data'] = pd.to_datetime(df['data_hora']).dt.date
    
    # Agrupar por dia
    demanda_diaria = df.groupby('data').size().reset_index(name='agendamentos')
    demanda_diaria['data'] = pd.to_datetime(demanda_diaria['data'])
    demanda_diaria['dia_semana'] = demanda_diaria['data'].dt.day_name()
    
    # Média por dia da semana
    media_por_dia = demanda_diaria.groupby('dia_semana')['agendamentos'].mean().round(2)
    
    # Próximos 7 dias
    hoje = datetime.now().date()
    previsoes = []
    
    for i in range(7):
        data_futura = hoje + timedelta(days=i+1)
        dia_semana = data_futura.strftime('%A')
        previsao = media_por_dia.get(dia_semana, 5)  # Default 5
        
        previsoes.append({
            'data': data_futura.isoformat(),
            'dia_semana': dia_semana,
            'agendamentos_previstos': int(previsao),
            'confianca': 'alta' if previsao > 8 else 'media' if previsao > 5 else 'baixa'
        })
    
    return {
        'previsoes_proximos_7_dias': previsoes,
        'media_historica_por_dia': media_por_dia.to_dict(),
        'recomendacoes': [
            "Agendar mais funcionários nos dias de alta demanda",
            "Oferecer promoções em dias de baixa demanda",
            "Considerar horários estendidos em dias populares"
        ]
    }

@app.get("/relatorios/analise-servicos")
async def analise_detalhada_servicos():
    """Análise detalhada de performance dos serviços"""
    df = pd.DataFrame(dados_sistema['agendamentos'])
    df_concluidos = df[df['status'] == 'concluido']
    
    # Mapear serviços
    servicos_dict = {s['id']: s for s in dados_sistema['servicos']}
    
    # Análise por serviço
    analise_servicos = df_concluidos.groupby('servico_id').agg({
        'preco_cobrado': ['sum', 'mean', 'count'],
        'avaliacao': 'mean',
        'duracao_real': 'mean'
    }).round(2)
    
    resultados = []
    for servico_id, dados in analise_servicos.iterrows():
        servico_info = servicos_dict.get(servico_id, {})
        
        receita_total = float(dados[('preco_cobrado', 'sum')])
        quantidade = int(dados[('preco_cobrado', 'count')])
        preco_medio = float(dados[('preco_cobrado', 'mean')])
        avaliacao = float(dados[('avaliacao', 'mean')]) if not pd.isna(dados[('avaliacao', 'mean')]) else 0
        duracao_media = float(dados[('duracao_real', 'mean')])
        
        # Calcular métricas derivadas
        preco_original = servico_info.get('preco', preco_medio)
        variacao_preco = ((preco_medio - preco_original) / preco_original * 100) if preco_original > 0 else 0
        
        resultados.append({
            'servico': servico_info.get('nome', servico_id),
            'categoria': servico_info.get('categoria', 'N/A'),
            'estatisticas': {
                'receita_total': receita_total,
                'quantidade_vendida': quantidade,
                'preco_medio_cobrado': preco_medio,
                'preco_tabela': preco_original,
                'variacao_preco_percent': round(variacao_preco, 2),
                'avaliacao_media': avaliacao,
                'duracao_media_real': duracao_media,
                'duracao_prevista': servico_info.get('duracao', 60)
            },
            'performance': {
                'popularidade': 'alta' if quantidade > 20 else 'media' if quantidade > 10 else 'baixa',
                'satisfacao': 'alta' if avaliacao >= 4.5 else 'media' if avaliacao >= 3.5 else 'baixa',
                'eficiencia_tempo': 'boa' if duracao_media <= servico_info.get('duracao', 60) else 'atencao'
            }
        })
    
    # Ordenar por receita
    resultados = sorted(resultados, key=lambda x: x['estatisticas']['receita_total'], reverse=True)
    
    return {
        'analise_por_servico': resultados,
        'resumo_geral': {
            'servico_mais_lucrativo': resultados[0]['servico'] if resultados else 'N/A',
            'total_servicos_ativos': len(resultados),
            'receita_total_servicos': sum(s['estatisticas']['receita_total'] for s in resultados)
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("📊 SISTEMA DE RELATÓRIOS AVANÇADOS - PYTHON SUPERIOR")
    print("🔬 Análises estatísticas complexas")
    print("📈 KPIs, crescimento, coorte e previsões")
    print("🚀 Servidor rodando em http://localhost:8003")
    
    uvicorn.run(app, host="0.0.0.0", port=8003)