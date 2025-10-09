"""
Sistema de Recomendações e Machine Learning
Python superior para algoritmos de recomendação e análise preditiva
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

app = FastAPI(title="Sistema de Recomendações ML", description="Machine Learning para salão")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class RecomendacaoRequest(BaseModel):
    cliente_id: str
    tipo: str  # 'servico', 'horario', 'funcionario'
    limite: Optional[int] = 5

class SegmentacaoRequest(BaseModel):
    criterios: List[str]  # 'valor', 'frequencia', 'preferencias'
    num_segmentos: Optional[int] = 4

# Dados simulados para ML
def gerar_dados_ml():
    """Gera dados otimizados para machine learning"""
    np.random.seed(42)
    
    # Clientes com mais atributos para ML
    clientes = []
    for i in range(150):
        cliente = {
            'id': f'cli_{i+1:03d}',
            'idade': np.random.randint(18, 65),
            'sexo': np.random.choice(['F', 'M'], p=[0.75, 0.25]),
            'renda_estimada': np.random.choice(['baixa', 'media', 'alta'], p=[0.3, 0.5, 0.2]),
            'frequencia_mensal': np.random.poisson(2) + 1,
            'gasto_medio': np.random.normal(75, 30),
            'horario_preferido': np.random.choice(['manha', 'tarde', 'noite'], p=[0.25, 0.55, 0.20]),
            'dia_preferido': np.random.choice(['seg', 'ter', 'qua', 'qui', 'sex', 'sab'], p=[0.1, 0.1, 0.1, 0.15, 0.2, 0.35]),
            'sensibilidade_preco': np.random.choice(['baixa', 'media', 'alta'], p=[0.2, 0.6, 0.2]),
            'servicos_favoritos': np.random.choice(['corte', 'coloracao', 'unhas', 'tratamento'], 
                                                 size=np.random.randint(1, 3), replace=False).tolist(),
            'tempo_cliente': np.random.randint(1, 36),  # meses
            'ultima_visita': datetime.now() - timedelta(days=np.random.randint(1, 60))
        }
        cliente['valor_total_gasto'] = cliente['gasto_medio'] * cliente['frequencia_mensal'] * cliente['tempo_cliente']
        clientes.append(cliente)
    
    # Histórico de serviços
    servicos = [
        {'id': 'srv_001', 'nome': 'Corte Feminino', 'categoria': 'corte', 'preco': 45, 'tags': ['basico', 'rapido']},
        {'id': 'srv_002', 'nome': 'Corte Masculino', 'categoria': 'corte', 'preco': 25, 'tags': ['masculino', 'rapido']},
        {'id': 'srv_003', 'nome': 'Coloração', 'categoria': 'cor', 'preco': 120, 'tags': ['premium', 'demorado']},
        {'id': 'srv_004', 'nome': 'Mechas', 'categoria': 'cor', 'preco': 180, 'tags': ['premium', 'tendencia']},
        {'id': 'srv_005', 'nome': 'Escova', 'categoria': 'finalizacao', 'preco': 35, 'tags': ['basico', 'evento']},
        {'id': 'srv_006', 'nome': 'Hidratação', 'categoria': 'tratamento', 'preco': 60, 'tags': ['cuidado', 'saude']},
        {'id': 'srv_007', 'nome': 'Manicure', 'categoria': 'unhas', 'preco': 20, 'tags': ['basico', 'relaxante']},
        {'id': 'srv_008', 'nome': 'Pedicure', 'categoria': 'unhas', 'preco': 25, 'tags': ['basico', 'cuidado']},
        {'id': 'srv_009', 'nome': 'Unha Gel', 'categoria': 'unhas', 'preco': 45, 'tags': ['premium', 'duravel']},
        {'id': 'srv_010', 'nome': 'Botox Capilar', 'categoria': 'tratamento', 'preco': 150, 'tags': ['premium', 'rejuvenescimento']}
    ]
    
    # Interações cliente-serviço
    interacoes = []
    for cliente in clientes:
        num_interacoes = np.random.poisson(cliente['frequencia_mensal'] * 3)  # 3 meses de histórico
        
        for _ in range(num_interacoes):
            # Escolher serviço baseado em preferências
            servicos_filtrados = [s for s in servicos if s['categoria'] in cliente['servicos_favoritos']]
            if not servicos_filtrados:
                servicos_filtrados = servicos
            
            servico = np.random.choice(servicos_filtrados)
            
            # Simular satisfação
            satisfacao = np.random.uniform(3.0, 5.0)
            if servico['preco'] > cliente['gasto_medio'] * 1.5:
                satisfacao *= 0.8  # Menor satisfação se muito caro
            
            interacao = {
                'cliente_id': cliente['id'],
                'servico_id': servico['id'],
                'data': datetime.now() - timedelta(days=np.random.randint(1, 90)),
                'satisfacao': round(satisfacao, 1),
                'preco_pago': servico['preco'] * np.random.uniform(0.9, 1.1),
                'repetiria': satisfacao >= 4.0
            }
            interacoes.append(interacao)
    
    return {
        'clientes': clientes,
        'servicos': servicos,
        'interacoes': interacoes
    }

# Gerar dados ML
dados_ml = gerar_dados_ml()

class SistemaRecomendacao:
    """Sistema de recomendações usando machine learning"""
    
    def __init__(self):
        self.clientes_df = pd.DataFrame(dados_ml['clientes'])
        self.servicos_df = pd.DataFrame(dados_ml['servicos'])
        self.interacoes_df = pd.DataFrame(dados_ml['interacoes'])
        
        # Preparar dados para ML
        self._preparar_dados()
        self._treinar_modelos()
    
    def _preparar_dados(self):
        """Prepara dados para algoritmos de ML"""
        # Matriz cliente-serviço
        self.matriz_cliente_servico = self.interacoes_df.pivot_table(
            index='cliente_id',
            columns='servico_id', 
            values='satisfacao',
            fill_value=0
        )
        
        # Features dos clientes para clustering
        self.features_clientes = self.clientes_df.copy()
        self.features_clientes['sexo_num'] = self.features_clientes['sexo'].map({'F': 0, 'M': 1})
        self.features_clientes['renda_num'] = self.features_clientes['renda_estimada'].map({'baixa': 0, 'media': 1, 'alta': 2})
        self.features_clientes['sensibilidade_num'] = self.features_clientes['sensibilidade_preco'].map({'baixa': 0, 'media': 1, 'alta': 2})
        
        # Features numéricas para clustering
        self.features_numericas = ['idade', 'frequencia_mensal', 'gasto_medio', 'tempo_cliente', 'valor_total_gasto', 'sexo_num', 'renda_num', 'sensibilidade_num']
        
        # Vetorização de tags dos serviços
        tags_text = self.servicos_df['tags'].apply(lambda x: ' '.join(x))
        self.tfidf_servicos = TfidfVectorizer()
        self.matriz_servicos_features = self.tfidf_servicos.fit_transform(tags_text)
    
    def _treinar_modelos(self):
        """Treina modelos de ML"""
        # Scaler para normalização
        self.scaler = StandardScaler()
        features_scaled = self.scaler.fit_transform(self.features_clientes[self.features_numericas])
        
        # K-means para segmentação de clientes
        self.kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
        self.clusters = self.kmeans.fit_predict(features_scaled)
        self.features_clientes['cluster'] = self.clusters
    
    def recomendar_servicos(self, cliente_id: str, limite: int = 5) -> List[Dict[str, Any]]:
        """Recomenda serviços usando collaborative filtering"""
        if cliente_id not in self.matriz_cliente_servico.index:
            return self._recomendar_para_novo_cliente(limite)
        
        # Perfil do cliente
        perfil_cliente = self.matriz_cliente_servico.loc[cliente_id]
        
        # Calcular similaridade com outros clientes
        similaridades = cosine_similarity([perfil_cliente], self.matriz_cliente_servico)[0]
        clientes_similares = pd.Series(similaridades, index=self.matriz_cliente_servico.index).sort_values(ascending=False)[1:6]  # Top 5 similares
        
        # Serviços recomendados baseados em clientes similares
        recomendacoes = {}
        for cliente_similar, similaridade in clientes_similares.items():
            perfil_similar = self.matriz_cliente_servico.loc[cliente_similar]
            
            for servico_id, rating in perfil_similar.items():
                if rating > 0 and perfil_cliente[servico_id] == 0:  # Serviço não experimentado
                    if servico_id not in recomendacoes:
                        recomendacoes[servico_id] = 0
                    recomendacoes[servico_id] += rating * similaridade
        
        # Ordenar e limitar recomendações
        servicos_recomendados = sorted(recomendacoes.items(), key=lambda x: x[1], reverse=True)[:limite]
        
        # Enriquecer com informações dos serviços
        resultado = []
        for servico_id, score in servicos_recomendados:
            servico_info = self.servicos_df[self.servicos_df['id'] == servico_id].iloc[0]
            resultado.append({
                'servico_id': servico_id,
                'nome': servico_info['nome'],
                'categoria': servico_info['categoria'],
                'preco': servico_info['preco'],
                'score_recomendacao': round(float(score), 2),
                'confianca': 'alta' if score > 15 else 'media' if score > 8 else 'baixa'
            })
        
        return resultado
    
    def _recomendar_para_novo_cliente(self, limite: int) -> List[Dict[str, Any]]:
        """Recomenda serviços populares para novos clientes"""
        popularidade = self.interacoes_df.groupby('servico_id')['satisfacao'].agg(['count', 'mean']).sort_values('count', ascending=False)
        
        resultado = []
        for servico_id in popularidade.head(limite).index:
            servico_info = self.servicos_df[self.servicos_df['id'] == servico_id].iloc[0]
            stats = popularidade.loc[servico_id]
            
            resultado.append({
                'servico_id': servico_id,
                'nome': servico_info['nome'],
                'categoria': servico_info['categoria'],
                'preco': servico_info['preco'],
                'score_recomendacao': round(float(stats['mean']), 2),
                'confianca': 'media',
                'motivo': 'popular'
            })
        
        return resultado
    
    def segmentar_clientes(self, num_segmentos: int = 4) -> Dict[str, Any]:
        """Segmenta clientes usando clustering"""
        # Análise dos clusters
        analise_clusters = {}
        
        for cluster_id in range(num_segmentos):
            clientes_cluster = self.features_clientes[self.features_clientes['cluster'] == cluster_id]
            
            if len(clientes_cluster) > 0:
                analise_clusters[f'segmento_{cluster_id}'] = {
                    'quantidade_clientes': len(clientes_cluster),
                    'perfil': {
                        'idade_media': round(clientes_cluster['idade'].mean(), 1),
                        'gasto_medio': round(clientes_cluster['gasto_medio'].mean(), 2),
                        'frequencia_media': round(clientes_cluster['frequencia_mensal'].mean(), 1),
                        'valor_total_medio': round(clientes_cluster['valor_total_gasto'].mean(), 2),
                        'sexo_predominante': clientes_cluster['sexo'].mode().iloc[0] if len(clientes_cluster['sexo'].mode()) > 0 else 'N/A',
                        'renda_predominante': clientes_cluster['renda_estimada'].mode().iloc[0] if len(clientes_cluster['renda_estimada'].mode()) > 0 else 'N/A'
                    },
                    'caracteristicas': self._caracterizar_segmento(clientes_cluster),
                    'recomendacoes_marketing': self._gerar_recomendacoes_marketing(clientes_cluster)
                }
        
        return {
            'segmentacao': analise_clusters,
            'resumo': {
                'total_clientes_analisados': len(self.features_clientes),
                'numero_segmentos': num_segmentos,
                'segmento_mais_valioso': max(analise_clusters.keys(), 
                                          key=lambda x: analise_clusters[x]['perfil']['valor_total_medio'])
            }
        }
    
    def _caracterizar_segmento(self, clientes_segmento: pd.DataFrame) -> List[str]:
        """Caracteriza um segmento de clientes"""
        caracteristicas = []
        
        # Análise de gasto
        gasto_medio = clientes_segmento['gasto_medio'].mean()
        if gasto_medio > 100:
            caracteristicas.append("Alto valor por visita")
        elif gasto_medio < 50:
            caracteristicas.append("Econômicos")
        
        # Análise de frequência
        freq_media = clientes_segmento['frequencia_mensal'].mean()
        if freq_media > 3:
            caracteristicas.append("Muito frequentes")
        elif freq_media < 1.5:
            caracteristicas.append("Ocasionais")
        
        # Análise demográfica
        idade_media = clientes_segmento['idade'].mean()
        if idade_media < 30:
            caracteristicas.append("Jovens")
        elif idade_media > 45:
            caracteristicas.append("Maduros")
        
        return caracteristicas
    
    def _gerar_recomendacoes_marketing(self, clientes_segmento: pd.DataFrame) -> List[str]:
        """Gera recomendações de marketing para o segmento"""
        recomendacoes = []
        
        gasto_medio = clientes_segmento['gasto_medio'].mean()
        freq_media = clientes_segmento['frequencia_mensal'].mean()
        
        if gasto_medio > 100:
            recomendacoes.append("Oferecer serviços premium e pacotes VIP")
        elif gasto_medio < 50:
            recomendacoes.append("Criar promoções e combos econômicos")
        
        if freq_media > 3:
            recomendacoes.append("Programa de fidelidade com benefícios crescentes")
        elif freq_media < 1.5:
            recomendacoes.append("Campanhas de reativação e lembretes")
        
        return recomendacoes
    
    def analisar_churn(self) -> Dict[str, Any]:
        """Análise de risco de churn dos clientes"""
        hoje = datetime.now()
        clientes_risco = []
        
        for _, cliente in self.clientes_df.iterrows():
            dias_ultima_visita = (hoje - cliente['ultima_visita']).days
            frequencia_esperada = 30 / cliente['frequencia_mensal']  # Dias entre visitas
            
            # Calcular risco
            if dias_ultima_visita > frequencia_esperada * 2:
                risco = 'alto'
            elif dias_ultima_visita > frequencia_esperada * 1.5:
                risco = 'medio'
            else:
                risco = 'baixo'
            
            if risco != 'baixo':
                clientes_risco.append({
                    'cliente_id': cliente['id'],
                    'dias_sem_visita': dias_ultima_visita,
                    'risco_churn': risco,
                    'valor_total_gasto': cliente['valor_total_gasto'],
                    'frequencia_normal': cliente['frequencia_mensal'],
                    'acao_recomendada': self._recomendar_acao_retencao(risco, cliente)
                })
        
        # Ordenar por valor do cliente
        clientes_risco = sorted(clientes_risco, key=lambda x: x['valor_total_gasto'], reverse=True)
        
        return {
            'clientes_em_risco': clientes_risco[:20],  # Top 20
            'estatisticas': {
                'total_em_risco': len(clientes_risco),
                'risco_alto': len([c for c in clientes_risco if c['risco_churn'] == 'alto']),
                'risco_medio': len([c for c in clientes_risco if c['risco_churn'] == 'medio']),
                'valor_em_risco': sum(c['valor_total_gasto'] for c in clientes_risco)
            }
        }
    
    def _recomendar_acao_retencao(self, risco: str, cliente: pd.Series) -> str:
        """Recomenda ação para retenção do cliente"""
        if risco == 'alto':
            if cliente['valor_total_gasto'] > 1000:
                return "Contato pessoal + desconto especial"
            else:
                return "Campanha de reativação com desconto"
        elif risco == 'medio':
            return "Lembrete por WhatsApp + promoção"
        else:
            return "Monitoramento"

# Instanciar sistema
sistema_recomendacao = SistemaRecomendacao()

# Endpoints
@app.get("/")
async def root():
    return {"message": "Sistema de Recomendações ML - Python Superior", "status": "online"}

@app.post("/ml/recomendacoes/servicos")
async def recomendar_servicos(request: RecomendacaoRequest):
    """Recomenda serviços para um cliente"""
    recomendacoes = sistema_recomendacao.recomendar_servicos(request.cliente_id, request.limite)
    return {
        'cliente_id': request.cliente_id,
        'recomendacoes': recomendacoes,
        'algoritmo': 'collaborative_filtering'
    }

@app.post("/ml/segmentacao")
async def segmentar_clientes(request: SegmentacaoRequest):
    """Segmenta clientes usando machine learning"""
    segmentacao = sistema_recomendacao.segmentar_clientes(request.num_segmentos)
    return segmentacao

@app.get("/ml/churn-analysis")
async def analise_churn():
    """Análise de risco de churn"""
    return sistema_recomendacao.analisar_churn()

@app.get("/ml/insights-automaticos")
async def insights_automaticos():
    """Gera insights automáticos usando ML"""
    # Top clientes por valor
    top_clientes = sistema_recomendacao.features_clientes.nlargest(5, 'valor_total_gasto')[['id', 'valor_total_gasto', 'frequencia_mensal']]
    
    # Serviços mais satisfatórios
    satisfacao_servicos = sistema_recomendacao.interacoes_df.groupby('servico_id')['satisfacao'].mean().sort_values(ascending=False)
    
    # Padrões de comportamento
    comportamentos = sistema_recomendacao.features_clientes.groupby('horario_preferido').size()
    
    return {
        'top_clientes_valiosos': top_clientes.to_dict('records'),
        'servicos_mais_satisfatorios': satisfacao_servicos.head(5).to_dict(),
        'padroes_horario': comportamentos.to_dict(),
        'insights_gerados': [
            f"Horário mais popular: {comportamentos.idxmax()}",
            f"Serviço com maior satisfação: {satisfacao_servicos.index[0]}",
            f"Cliente mais valioso: {top_clientes.iloc[0]['id']} (R$ {top_clientes.iloc[0]['valor_total_gasto']:.2f})"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🤖 SISTEMA DE RECOMENDAÇÕES ML - PYTHON SUPERIOR")
    print("🧠 Machine Learning para recomendações inteligentes")
    print("🎯 Segmentação automática e análise de churn")
    print("🚀 Servidor rodando em http://localhost:8004")
    
    uvicorn.run(app, host="0.0.0.0", port=8004)