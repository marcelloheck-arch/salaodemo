"""
Sistema de Processamento e Análise de Dados
Python superior para manipulação de grandes volumes de dados
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import io
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import asyncio
import sqlite3
from sqlalchemy import create_engine
import warnings
warnings.filterwarnings('ignore')

app = FastAPI(title="Sistema de Processamento de Dados", description="Big Data com Python")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class ProcessamentoDadosRequest(BaseModel):
    tipo_arquivo: str  # 'csv', 'excel', 'json'
    operacoes: List[str]  # ['limpeza', 'agregacao', 'analise']
    parametros: Optional[Dict[str, Any]] = {}

class ExportacaoRequest(BaseModel):
    formato: str  # 'csv', 'excel', 'json', 'pdf'
    dados_incluir: List[str]
    filtros: Optional[Dict[str, Any]] = {}

class ProcessadorDados:
    """Sistema avançado de processamento de dados"""
    
    def __init__(self):
        self.datasets_cache = {}
        self.historico_operacoes = []
        self._inicializar_database()
    
    def _inicializar_database(self):
        """Inicializa database para cache de dados"""
        self.engine = create_engine('sqlite:///dados_cache.db')
    
    async def processar_arquivo(self, arquivo_bytes: bytes, nome_arquivo: str, 
                              tipo_arquivo: str, operacoes: List[str]) -> Dict[str, Any]:
        """Processa arquivo de dados"""
        try:
            # Carregar dados baseado no tipo
            if tipo_arquivo == 'csv':
                df = pd.read_csv(io.BytesIO(arquivo_bytes))
            elif tipo_arquivo == 'excel':
                df = pd.read_excel(io.BytesIO(arquivo_bytes))
            elif tipo_arquivo == 'json':
                data = json.loads(arquivo_bytes.decode('utf-8'))
                df = pd.json_normalize(data)
            else:
                raise ValueError(f"Tipo de arquivo não suportado: {tipo_arquivo}")
            
            # Análise inicial
            resultado = {
                'arquivo': nome_arquivo,
                'analise_inicial': self._analisar_dataset_inicial(df),
                'operacoes_realizadas': []
            }
            
            # Aplicar operações solicitadas
            df_processado = df.copy()
            
            for operacao in operacoes:
                if operacao == 'limpeza':
                    df_processado, info_limpeza = self._limpar_dados(df_processado)
                    resultado['operacoes_realizadas'].append({
                        'operacao': 'limpeza',
                        'resultado': info_limpeza
                    })
                
                elif operacao == 'agregacao':
                    agregacoes = self._gerar_agregacoes(df_processado)
                    resultado['operacoes_realizadas'].append({
                        'operacao': 'agregacao',
                        'resultado': agregacoes
                    })
                
                elif operacao == 'analise':
                    analises = self._analise_estatistica_avancada(df_processado)
                    resultado['operacoes_realizadas'].append({
                        'operacao': 'analise_estatistica',
                        'resultado': analises
                    })
                
                elif operacao == 'qualidade':
                    qualidade = self._avaliar_qualidade_dados(df_processado)
                    resultado['operacoes_realizadas'].append({
                        'operacao': 'avaliacao_qualidade',
                        'resultado': qualidade
                    })
            
            # Salvar no cache
            dataset_id = f"dataset_{len(self.datasets_cache)}"
            self.datasets_cache[dataset_id] = {
                'dataframe': df_processado,
                'metadata': resultado,
                'timestamp': datetime.now()
            }
            
            resultado['dataset_id'] = dataset_id
            resultado['analise_final'] = self._analisar_dataset_inicial(df_processado)
            
            return resultado
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro no processamento: {str(e)}")
    
    def _analisar_dataset_inicial(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Análise inicial do dataset"""
        return {
            'dimensoes': {
                'linhas': len(df),
                'colunas': len(df.columns),
                'celulas_totais': len(df) * len(df.columns)
            },
            'colunas': {
                'nomes': df.columns.tolist(),
                'tipos': df.dtypes.astype(str).to_dict(),
                'valores_unicos': df.nunique().to_dict(),
                'valores_nulos': df.isnull().sum().to_dict()
            },
            'memoria': {
                'tamanho_mb': round(df.memory_usage(deep=True).sum() / 1024**2, 2),
                'densidade': round((1 - df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100, 2)
            },
            'amostra': df.head(3).to_dict('records') if len(df) > 0 else []
        }
    
    def _limpar_dados(self, df: pd.DataFrame) -> tuple[pd.DataFrame, Dict[str, Any]]:
        """Limpeza automática de dados"""
        df_limpo = df.copy()
        info_limpeza = {
            'operacoes_realizadas': [],
            'estatisticas': {}
        }
        
        # Remover duplicatas
        duplicatas_antes = len(df_limpo)
        df_limpo = df_limpo.drop_duplicates()
        duplicatas_removidas = duplicatas_antes - len(df_limpo)
        
        if duplicatas_removidas > 0:
            info_limpeza['operacoes_realizadas'].append(f"Removidas {duplicatas_removidas} linhas duplicadas")
        
        # Tratar valores nulos
        for coluna in df_limpo.columns:
            nulos_antes = df_limpo[coluna].isnull().sum()
            
            if nulos_antes > 0:
                if df_limpo[coluna].dtype in ['int64', 'float64']:
                    # Preencher com mediana para numéricos
                    mediana = df_limpo[coluna].median()
                    df_limpo[coluna] = df_limpo[coluna].fillna(mediana)
                    info_limpeza['operacoes_realizadas'].append(
                        f"Coluna '{coluna}': {nulos_antes} valores nulos preenchidos com mediana ({mediana})"
                    )
                else:
                    # Preencher com moda para categóricos
                    if not df_limpo[coluna].mode().empty:
                        moda = df_limpo[coluna].mode().iloc[0]
                        df_limpo[coluna] = df_limpo[coluna].fillna(moda)
                        info_limpeza['operacoes_realizadas'].append(
                            f"Coluna '{coluna}': {nulos_antes} valores nulos preenchidos com moda ('{moda}')"
                        )
        
        # Remover outliers em colunas numéricas
        for coluna in df_limpo.select_dtypes(include=[np.number]).columns:
            Q1 = df_limpo[coluna].quantile(0.25)
            Q3 = df_limpo[coluna].quantile(0.75)
            IQR = Q3 - Q1
            limite_inferior = Q1 - 1.5 * IQR
            limite_superior = Q3 + 1.5 * IQR
            
            outliers_antes = len(df_limpo)
            df_limpo = df_limpo[(df_limpo[coluna] >= limite_inferior) & (df_limpo[coluna] <= limite_superior)]
            outliers_removidos = outliers_antes - len(df_limpo)
            
            if outliers_removidos > 0:
                info_limpeza['operacoes_realizadas'].append(
                    f"Coluna '{coluna}': {outliers_removidos} outliers removidos"
                )
        
        # Padronizar tipos de dados
        for coluna in df_limpo.columns:
            if df_limpo[coluna].dtype == 'object':
                try:
                    # Tentar converter para datetime
                    pd.to_datetime(df_limpo[coluna], errors='raise')
                    df_limpo[coluna] = pd.to_datetime(df_limpo[coluna])
                    info_limpeza['operacoes_realizadas'].append(f"Coluna '{coluna}' convertida para datetime")
                except:
                    # Tentar converter para numérico
                    numeric = pd.to_numeric(df_limpo[coluna], errors='coerce')
                    if not numeric.isnull().all():
                        df_limpo[coluna] = numeric
                        info_limpeza['operacoes_realizadas'].append(f"Coluna '{coluna}' convertida para numérico")
        
        info_limpeza['estatisticas'] = {
            'linhas_antes': duplicatas_antes,
            'linhas_depois': len(df_limpo),
            'reducao_percentual': round((1 - len(df_limpo) / duplicatas_antes) * 100, 2) if duplicatas_antes > 0 else 0
        }
        
        return df_limpo, info_limpeza
    
    def _gerar_agregacoes(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Gera agregações automáticas dos dados"""
        agregacoes = {}
        
        # Agregações por colunas numéricas
        colunas_numericas = df.select_dtypes(include=[np.number]).columns
        
        if len(colunas_numericas) > 0:
            agregacoes['numericas'] = {}
            for coluna in colunas_numericas:
                agregacoes['numericas'][coluna] = {
                    'count': int(df[coluna].count()),
                    'mean': float(df[coluna].mean()),
                    'median': float(df[coluna].median()),
                    'std': float(df[coluna].std()),
                    'min': float(df[coluna].min()),
                    'max': float(df[coluna].max()),
                    'q25': float(df[coluna].quantile(0.25)),
                    'q75': float(df[coluna].quantile(0.75))
                }
        
        # Agregações por colunas categóricas
        colunas_categoricas = df.select_dtypes(include=['object', 'category']).columns
        
        if len(colunas_categoricas) > 0:
            agregacoes['categoricas'] = {}
            for coluna in colunas_categoricas:
                value_counts = df[coluna].value_counts()
                agregacoes['categoricas'][coluna] = {
                    'valores_unicos': int(df[coluna].nunique()),
                    'valor_mais_frequente': str(value_counts.index[0]) if len(value_counts) > 0 else None,
                    'frequencia_maxima': int(value_counts.iloc[0]) if len(value_counts) > 0 else 0,
                    'distribuicao_top_5': value_counts.head(5).to_dict()
                }
        
        # Correlações (apenas para numéricas)
        if len(colunas_numericas) > 1:
            correlacoes = df[colunas_numericas].corr()
            # Encontrar correlações mais fortes
            correlacoes_fortes = []
            for i in range(len(correlacoes.columns)):
                for j in range(i+1, len(correlacoes.columns)):
                    corr_valor = correlacoes.iloc[i, j]
                    if abs(corr_valor) > 0.5:
                        correlacoes_fortes.append({
                            'variavel_1': correlacoes.columns[i],
                            'variavel_2': correlacoes.columns[j],
                            'correlacao': round(float(corr_valor), 3),
                            'interpretacao': 'forte' if abs(corr_valor) > 0.7 else 'moderada'
                        })
            
            agregacoes['correlacoes'] = {
                'matriz_completa': correlacoes.round(3).to_dict(),
                'correlacoes_significativas': correlacoes_fortes
            }
        
        return agregacoes
    
    def _analise_estatistica_avancada(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Análise estatística avançada"""
        analises = {}
        
        # Testes de normalidade para colunas numéricas
        colunas_numericas = df.select_dtypes(include=[np.number]).columns
        
        if len(colunas_numericas) > 0:
            analises['normalidade'] = {}
            for coluna in colunas_numericas:
                dados = df[coluna].dropna()
                if len(dados) > 0:
                    from scipy import stats
                    
                    # Teste de Shapiro-Wilk (para amostras pequenas)
                    if len(dados) <= 5000:
                        shapiro_stat, shapiro_p = stats.shapiro(dados)
                        normalidade_shapiro = shapiro_p > 0.05
                    else:
                        shapiro_stat, shapiro_p = None, None
                        normalidade_shapiro = None
                    
                    # Skewness e Kurtosis
                    skewness = stats.skew(dados)
                    kurtosis = stats.kurtosis(dados)
                    
                    analises['normalidade'][coluna] = {
                        'shapiro_test': {
                            'estatistica': float(shapiro_stat) if shapiro_stat else None,
                            'p_valor': float(shapiro_p) if shapiro_p else None,
                            'normal': normalidade_shapiro
                        },
                        'skewness': float(skewness),
                        'kurtosis': float(kurtosis),
                        'interpretacao_skew': self._interpretar_skewness(skewness),
                        'interpretacao_kurt': self._interpretar_kurtosis(kurtosis)
                    }
        
        # Análise de padrões temporais (se houver colunas de data)
        colunas_data = df.select_dtypes(include=['datetime64']).columns
        
        if len(colunas_data) > 0:
            analises['padroes_temporais'] = {}
            for coluna in colunas_data:
                dados_tempo = df[coluna].dropna()
                if len(dados_tempo) > 0:
                    analises['padroes_temporais'][coluna] = {
                        'periodo_inicio': str(dados_tempo.min()),
                        'periodo_fim': str(dados_tempo.max()),
                        'span_dias': (dados_tempo.max() - dados_tempo.min()).days,
                        'distribuicao_mensal': dados_tempo.dt.month.value_counts().to_dict(),
                        'distribuicao_diaria': dados_tempo.dt.dayofweek.value_counts().to_dict()
                    }
        
        return analises
    
    def _interpretar_skewness(self, skew: float) -> str:
        """Interpreta valor de skewness"""
        if abs(skew) < 0.5:
            return "aproximadamente simétrica"
        elif skew > 0.5:
            return "assimétrica à direita (cauda longa à direita)"
        else:
            return "assimétrica à esquerda (cauda longa à esquerda)"
    
    def _interpretar_kurtosis(self, kurt: float) -> str:
        """Interpreta valor de kurtosis"""
        if abs(kurt) < 0.5:
            return "distribuição normal (mesocúrtica)"
        elif kurt > 0.5:
            return "distribuição leptocúrtica (picos altos)"
        else:
            return "distribuição platicúrtica (picos baixos)"
    
    def _avaliar_qualidade_dados(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Avalia qualidade geral dos dados"""
        # Cálculo de métricas de qualidade
        total_células = len(df) * len(df.columns)
        células_vazias = df.isnull().sum().sum()
        completude = (1 - células_vazias / total_células) * 100
        
        # Consistência de tipos
        inconsistencias_tipo = 0
        for coluna in df.columns:
            if df[coluna].dtype == 'object':
                # Verificar se valores numéricos estão como string
                try:
                    pd.to_numeric(df[coluna], errors='raise')
                    inconsistencias_tipo += 1
                except:
                    pass
        
        # Duplicatas
        duplicatas = len(df) - len(df.drop_duplicates())
        taxa_duplicacao = (duplicatas / len(df)) * 100 if len(df) > 0 else 0
        
        # Outliers em colunas numéricas
        total_outliers = 0
        colunas_numericas = df.select_dtypes(include=[np.number]).columns
        
        for coluna in colunas_numericas:
            Q1 = df[coluna].quantile(0.25)
            Q3 = df[coluna].quantile(0.75)
            IQR = Q3 - Q1
            outliers = df[(df[coluna] < Q1 - 1.5 * IQR) | (df[coluna] > Q3 + 1.5 * IQR)]
            total_outliers += len(outliers)
        
        # Score de qualidade geral
        score_completude = completude
        score_consistencia = max(0, 100 - inconsistencias_tipo * 10)
        score_unicidade = max(0, 100 - taxa_duplicacao)
        score_pureza = max(0, 100 - (total_outliers / len(df)) * 100) if len(df) > 0 else 100
        
        score_geral = (score_completude + score_consistencia + score_unicidade + score_pureza) / 4
        
        return {
            'scores': {
                'completude': round(score_completude, 2),
                'consistencia': round(score_consistencia, 2),
                'unicidade': round(score_unicidade, 2),
                'pureza': round(score_pureza, 2),
                'qualidade_geral': round(score_geral, 2)
            },
            'metricas_detalhadas': {
                'total_celulas': total_celulas,
                'celulas_vazias': int(células_vazias),
                'taxa_completude': round(completude, 2),
                'duplicatas_encontradas': int(duplicatas),
                'inconsistencias_tipo': int(inconsistencias_tipo),
                'outliers_detectados': int(total_outliers)
            },
            'recomendacoes': self._gerar_recomendacoes_qualidade(score_geral, células_vazias, duplicatas, inconsistencias_tipo)
        }
    
    def _gerar_recomendacoes_qualidade(self, score: float, vazias: int, duplicatas: int, inconsistencias: int) -> List[str]:
        """Gera recomendações baseadas na qualidade dos dados"""
        recomendacoes = []
        
        if score < 60:
            recomendacoes.append("Qualidade dos dados baixa - revisão geral necessária")
        elif score < 80:
            recomendacoes.append("Qualidade dos dados moderada - algumas melhorias recomendadas")
        else:
            recomendacoes.append("Boa qualidade dos dados")
        
        if vazias > 0:
            recomendacoes.append(f"Tratar {vazias} células vazias com imputação ou remoção")
        
        if duplicatas > 0:
            recomendacoes.append(f"Remover {duplicatas} registros duplicados")
        
        if inconsistencias > 0:
            recomendacoes.append(f"Corrigir {inconsistencias} inconsistências de tipo de dados")
        
        return recomendacoes
    
    def exportar_dados(self, dataset_id: str, formato: str, filtros: Dict[str, Any] = None) -> bytes:
        """Exporta dados em diferentes formatos"""
        if dataset_id not in self.datasets_cache:
            raise HTTPException(status_code=404, detail="Dataset não encontrado")
        
        df = self.datasets_cache[dataset_id]['dataframe']
        
        # Aplicar filtros se fornecidos
        if filtros:
            for coluna, valor in filtros.items():
                if coluna in df.columns:
                    df = df[df[coluna] == valor]
        
        # Exportar conforme formato
        buffer = io.BytesIO()
        
        if formato == 'csv':
            df.to_csv(buffer, index=False)
        elif formato == 'excel':
            df.to_excel(buffer, index=False, engine='openpyxl')
        elif formato == 'json':
            buffer.write(df.to_json(orient='records', indent=2).encode())
        else:
            raise ValueError(f"Formato não suportado: {formato}")
        
        return buffer.getvalue()

# Instanciar processador
processador = ProcessadorDados()

# Endpoints
@app.get("/")
async def root():
    return {"message": "Sistema de Processamento de Dados - Python Superior", "status": "online"}

@app.post("/dados/processar")
async def processar_dados(file: UploadFile = File(...), request: ProcessamentoDadosRequest = ProcessamentoDadosRequest):
    """Processa arquivo de dados com operações avançadas"""
    if not file.filename.endswith(('.csv', '.xlsx', '.json')):
        raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
    
    contents = await file.read()
    resultado = await processador.processar_arquivo(
        contents, 
        file.filename, 
        request.tipo_arquivo,
        request.operacoes
    )
    
    return resultado

@app.get("/dados/datasets")
async def listar_datasets():
    """Lista datasets em cache"""
    datasets = []
    for dataset_id, info in processador.datasets_cache.items():
        datasets.append({
            'id': dataset_id,
            'timestamp': info['timestamp'].isoformat(),
            'linhas': len(info['dataframe']),
            'colunas': len(info['dataframe'].columns),
            'metadata': info['metadata']['analise_inicial']['dimensoes']
        })
    
    return {'datasets_disponiveis': datasets}

@app.get("/dados/capacidades")
async def capacidades_sistema():
    """Lista capacidades do sistema de processamento"""
    return {
        'operacoes_disponiveis': {
            'limpeza': 'Remove duplicatas, trata nulos, remove outliers',
            'agregacao': 'Estatísticas descritivas e correlações',
            'analise': 'Testes estatísticos e padrões temporais',
            'qualidade': 'Avaliação de completude e consistência'
        },
        'formatos_importacao': ['CSV', 'Excel', 'JSON'],
        'formatos_exportacao': ['CSV', 'Excel', 'JSON'],
        'vantagens_python': [
            'Pandas para manipulação eficiente de dataframes',
            'NumPy para operações vetorizadas rápidas',
            'SciPy para testes estatísticos avançados',
            'SQLAlchemy para integração com databases',
            'Processamento em memória de grandes volumes',
            'Algoritmos de machine learning integrados'
        ],
        'capacidades_especiais': [
            'Detecção automática de tipos de dados',
            'Limpeza inteligente de dados',
            'Análise estatística avançada',
            'Avaliação de qualidade de dados',
            'Cache de datasets para reprocessamento',
            'Exportação otimizada'
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("📊 SISTEMA DE PROCESSAMENTO DE DADOS - PYTHON SUPERIOR")
    print("🗄️ Big Data com Pandas, NumPy e SciPy")
    print("🧹 Limpeza e análise automática de dados")
    print("🚀 Servidor rodando em http://localhost:8006")
    
    uvicorn.run(app, host="0.0.0.0", port=8006)