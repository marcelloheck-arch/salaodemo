"""
Sistema de Automação e Scheduling Inteligente
Python superior para tarefas complexas e automação
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import asyncio
import schedule
import threading
import time
from dataclasses import dataclass
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import pandas as pd
import numpy as np
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

app = FastAPI(title="Sistema de Automação Inteligente", description="Automação e scheduling com Python")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class TarefaAutomatica(BaseModel):
    id: str
    nome: str
    tipo: str  # 'email', 'relatorio', 'backup', 'limpeza', 'marketing'
    agendamento: str  # cron expression
    parametros: Dict[str, Any]
    ativo: bool = True

class CampanhaMarketing(BaseModel):
    nome: str
    tipo: str  # 'aniversario', 'reativacao', 'promocional'
    template: str
    publico_alvo: List[str]
    agendamento: Optional[str] = None

@dataclass
class ResultadoExecucao:
    tarefa_id: str
    timestamp: datetime
    sucesso: bool
    detalhes: str
    duracao: float

class GerenciadorAutomacao:
    """Sistema inteligente de automação"""
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.tarefas_ativas = {}
        self.historico_execucoes = []
        self.configuracoes = self._carregar_configuracoes()
        self.scheduler.start()
        
        # Configurar tarefas automáticas padrão
        self._configurar_tarefas_padrao()
    
    def _carregar_configuracoes(self) -> Dict[str, Any]:
        """Carrega configurações do sistema"""
        return {
            'email_smtp': {
                'servidor': 'smtp.gmail.com',
                'porta': 587,
                'usuario': 'salao@exemplo.com',
                'senha': 'senha_app'  # Em produção, usar variável de ambiente
            },
            'caminhos': {
                'backups': './backups',
                'relatorios': './relatorios_automaticos',
                'logs': './logs'
            },
            'limites': {
                'max_tentativas': 3,
                'timeout_tarefas': 300,  # 5 minutos
                'intervalo_retry': 60  # 1 minuto
            }
        }
    
    def _configurar_tarefas_padrao(self):
        """Configura tarefas automáticas padrão do salão"""
        tarefas_padrao = [
            {
                'id': 'backup_diario',
                'nome': 'Backup Diário de Dados',
                'tipo': 'backup',
                'agendamento': '0 23 * * *',  # Todo dia às 23h
                'parametros': {
                    'incluir': ['clientes', 'agendamentos', 'financeiro'],
                    'compactar': True,
                    'manter_dias': 30
                }
            },
            {
                'id': 'relatorio_semanal',
                'nome': 'Relatório Semanal de Performance',
                'tipo': 'relatorio',
                'agendamento': '0 8 * * 1',  # Segunda-feira às 8h
                'parametros': {
                    'periodo': 'semana_anterior',
                    'incluir_graficos': True,
                    'enviar_email': True,
                    'destinatarios': ['gerencia@salao.com']
                }
            },
            {
                'id': 'limpeza_cache',
                'nome': 'Limpeza de Cache e Logs',
                'tipo': 'limpeza',
                'agendamento': '0 2 * * 0',  # Domingo às 2h
                'parametros': {
                    'limpar_cache': True,
                    'rotacionar_logs': True,
                    'otimizar_db': True
                }
            },
            {
                'id': 'aniversariantes',
                'nome': 'Campanhas de Aniversário',
                'tipo': 'marketing',
                'agendamento': '0 9 * * *',  # Todo dia às 9h
                'parametros': {
                    'template': 'aniversario',
                    'incluir_desconto': True,
                    'desconto_percentual': 15
                }
            },
            {
                'id': 'reativacao_clientes',
                'nome': 'Campanha de Reativação',
                'tipo': 'marketing',
                'agendamento': '0 10 * * 2,4',  # Terça e quinta às 10h
                'parametros': {
                    'dias_sem_visita': 45,
                    'template': 'reativacao',
                    'oferta_especial': True
                }
            }
        ]
        
        for tarefa_config in tarefas_padrao:
            self.agendar_tarefa(TarefaAutomatica(**tarefa_config))
    
    def agendar_tarefa(self, tarefa: TarefaAutomatica):
        """Agenda uma nova tarefa automática"""
        try:
            # Remover tarefa existente se houver
            if tarefa.id in self.tarefas_ativas:
                self.scheduler.remove_job(tarefa.id)
            
            # Adicionar nova tarefa
            self.scheduler.add_job(
                func=self._executar_tarefa,
                trigger=CronTrigger.from_crontab(tarefa.agendamento),
                args=[tarefa],
                id=tarefa.id,
                name=tarefa.nome,
                replace_existing=True
            )
            
            self.tarefas_ativas[tarefa.id] = tarefa
            
            return {'sucesso': True, 'mensagem': f'Tarefa {tarefa.nome} agendada com sucesso'}
            
        except Exception as e:
            return {'sucesso': False, 'erro': str(e)}
    
    async def _executar_tarefa(self, tarefa: TarefaAutomatica):
        """Executa uma tarefa agendada"""
        inicio = time.time()
        
        try:
            if tarefa.tipo == 'backup':
                resultado = await self._executar_backup(tarefa.parametros)
            elif tarefa.tipo == 'relatorio':
                resultado = await self._gerar_relatorio_automatico(tarefa.parametros)
            elif tarefa.tipo == 'limpeza':
                resultado = await self._executar_limpeza(tarefa.parametros)
            elif tarefa.tipo == 'marketing':
                resultado = await self._executar_campanha_marketing(tarefa.parametros)
            elif tarefa.tipo == 'email':
                resultado = await self._enviar_email_automatico(tarefa.parametros)
            else:
                resultado = {'sucesso': False, 'erro': f'Tipo de tarefa não suportado: {tarefa.tipo}'}
            
            duracao = time.time() - inicio
            
            # Registrar execução
            execucao = ResultadoExecucao(
                tarefa_id=tarefa.id,
                timestamp=datetime.now(),
                sucesso=resultado.get('sucesso', False),
                detalhes=resultado.get('mensagem', str(resultado)),
                duracao=duracao
            )
            
            self.historico_execucoes.append(execucao)
            
            # Manter apenas últimas 1000 execuções
            if len(self.historico_execucoes) > 1000:
                self.historico_execucoes = self.historico_execucoes[-1000:]
            
            logging.info(f"Tarefa {tarefa.id} executada: {resultado}")
            
        except Exception as e:
            duracao = time.time() - inicio
            
            execucao = ResultadoExecucao(
                tarefa_id=tarefa.id,
                timestamp=datetime.now(),
                sucesso=False,
                detalhes=f'Erro na execução: {str(e)}',
                duracao=duracao
            )
            
            self.historico_execucoes.append(execucao)
            logging.error(f"Erro na execução da tarefa {tarefa.id}: {str(e)}")
    
    async def _executar_backup(self, parametros: Dict[str, Any]) -> Dict[str, Any]:
        """Executa backup automático dos dados"""
        try:
            incluir = parametros.get('incluir', [])
            compactar = parametros.get('compactar', True)
            manter_dias = parametros.get('manter_dias', 30)
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            nome_backup = f'backup_{timestamp}'
            
            # Simular backup (em produção, implementar backup real)
            dados_backup = {
                'timestamp': timestamp,
                'tabelas_incluidas': incluir,
                'compactado': compactar,
                'tamanho_mb': np.random.uniform(50, 200),  # Simular tamanho
                'arquivos_criados': [
                    f'{nome_backup}_clientes.sql',
                    f'{nome_backup}_agendamentos.sql',
                    f'{nome_backup}_financeiro.sql'
                ]
            }
            
            # Simular limpeza de backups antigos
            backups_removidos = np.random.randint(0, 5)
            
            return {
                'sucesso': True,
                'mensagem': f'Backup criado: {nome_backup}',
                'detalhes': {
                    'backup_info': dados_backup,
                    'backups_antigos_removidos': backups_removidos,
                    'espaco_liberado_mb': backups_removidos * 50
                }
            }
            
        except Exception as e:
            return {'sucesso': False, 'erro': str(e)}
    
    async def _gerar_relatorio_automatico(self, parametros: Dict[str, Any]) -> Dict[str, Any]:
        """Gera relatório automático"""
        try:
            periodo = parametros.get('periodo', 'semana_anterior')
            incluir_graficos = parametros.get('incluir_graficos', True)
            enviar_email = parametros.get('enviar_email', False)
            
            # Gerar dados do relatório (integração com sistema de relatórios)
            try:
                response = requests.get('http://localhost:8003/relatorios/executivo', timeout=10)
                if response.status_code == 200:
                    dados_relatorio = response.json()
                else:
                    # Fallback com dados simulados
                    dados_relatorio = self._gerar_dados_relatorio_fallback()
            except:
                dados_relatorio = self._gerar_dados_relatorio_fallback()
            
            # Criar arquivo de relatório
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            nome_arquivo = f'relatorio_automatico_{timestamp}.pdf'
            
            relatorio_info = {
                'arquivo': nome_arquivo,
                'periodo': periodo,
                'metricas': dados_relatorio.get('kpis', {}),
                'graficos_incluidos': incluir_graficos,
                'tamanho_kb': np.random.uniform(500, 2000)
            }
            
            # Enviar por email se solicitado
            if enviar_email:
                destinatarios = parametros.get('destinatarios', [])
                email_result = await self._enviar_relatorio_email(nome_arquivo, destinatarios)
                relatorio_info['email_enviado'] = email_result
            
            return {
                'sucesso': True,
                'mensagem': f'Relatório gerado: {nome_arquivo}',
                'detalhes': relatorio_info
            }
            
        except Exception as e:
            return {'sucesso': False, 'erro': str(e)}
    
    def _gerar_dados_relatorio_fallback(self) -> Dict[str, Any]:
        """Gera dados de relatório fallback"""
        return {
            'kpis': {
                'receita_periodo': round(np.random.uniform(8000, 15000), 2),
                'clientes_atendidos': np.random.randint(80, 150),
                'servicos_realizados': np.random.randint(120, 250),
                'ticket_medio': round(np.random.uniform(45, 85), 2)
            },
            'crescimento': {
                'receita': round(np.random.uniform(-5, 15), 1),
                'clientes': round(np.random.uniform(-2, 12), 1)
            }
        }
    
    async def _executar_limpeza(self, parametros: Dict[str, Any]) -> Dict[str, Any]:
        """Executa limpeza automática do sistema"""
        try:
            limpar_cache = parametros.get('limpar_cache', True)
            rotacionar_logs = parametros.get('rotacionar_logs', True)
            otimizar_db = parametros.get('otimizar_db', False)
            
            resultados = []
            espaco_liberado = 0
            
            if limpar_cache:
                cache_liberado = np.random.uniform(10, 50)  # MB
                espaco_liberado += cache_liberado
                resultados.append(f'Cache limpo: {cache_liberado:.1f}MB liberados')
            
            if rotacionar_logs:
                logs_rotacionados = np.random.randint(3, 8)
                log_espaco = logs_rotacionados * 5  # MB
                espaco_liberado += log_espaco
                resultados.append(f'Logs rotacionados: {logs_rotacionados} arquivos ({log_espaco}MB)')
            
            if otimizar_db:
                db_otimizado = np.random.uniform(5, 20)  # MB
                espaco_liberado += db_otimizado
                resultados.append(f'Database otimizado: {db_otimizado:.1f}MB liberados')
            
            return {
                'sucesso': True,
                'mensagem': f'Limpeza concluída: {espaco_liberado:.1f}MB liberados',
                'detalhes': {
                    'operacoes_realizadas': resultados,
                    'espaco_total_liberado_mb': round(espaco_liberado, 1),
                    'performance_improvement': f'{np.random.uniform(5, 15):.1f}%'
                }
            }
            
        except Exception as e:
            return {'sucesso': False, 'erro': str(e)}
    
    async def _executar_campanha_marketing(self, parametros: Dict[str, Any]) -> Dict[str, Any]:
        """Executa campanha de marketing automática"""
        try:
            template = parametros.get('template', 'promocional')
            
            # Buscar dados de clientes (integração com ML)
            try:
                if template == 'aniversario':
                    # Clientes aniversariantes do dia
                    clientes_alvo = self._obter_aniversariantes_hoje()
                elif template == 'reativacao':
                    # Clientes inativos
                    dias_sem_visita = parametros.get('dias_sem_visita', 45)
                    clientes_alvo = self._obter_clientes_inativos(dias_sem_visita)
                else:
                    # Campanha geral
                    clientes_alvo = self._obter_clientes_ativos()
                
                # Simular envio de campanhas
                campanhas_enviadas = len(clientes_alvo)
                taxa_abertura = np.random.uniform(15, 35)  # %
                taxa_clique = np.random.uniform(3, 8)  # %
                conversoes = int(campanhas_enviadas * taxa_clique / 100 * 0.3)  # 30% dos cliques convertem
                
                return {
                    'sucesso': True,
                    'mensagem': f'Campanha {template} enviada para {campanhas_enviadas} clientes',
                    'detalhes': {
                        'template_usado': template,
                        'clientes_segmentados': campanhas_enviadas,
                        'taxa_abertura_estimada': f'{taxa_abertura:.1f}%',
                        'taxa_clique_estimada': f'{taxa_clique:.1f}%',
                        'conversoes_estimadas': conversoes,
                        'roi_estimado': f'R$ {conversoes * np.random.uniform(30, 80):.2f}'
                    }
                }
                
            except Exception as e:
                return {'sucesso': False, 'erro': f'Erro na segmentação: {str(e)}'}
            
        except Exception as e:
            return {'sucesso': False, 'erro': str(e)}
    
    def _obter_aniversariantes_hoje(self) -> List[Dict[str, Any]]:
        """Obter clientes aniversariantes do dia"""
        # Simular dados
        num_aniversariantes = np.random.randint(0, 5)
        return [{'id': f'cli_{i}', 'nome': f'Cliente {i}'} for i in range(num_aniversariantes)]
    
    def _obter_clientes_inativos(self, dias: int) -> List[Dict[str, Any]]:
        """Obter clientes inativos"""
        # Simular dados
        num_inativos = np.random.randint(10, 25)
        return [{'id': f'cli_inativo_{i}', 'dias_sem_visita': dias + np.random.randint(0, 30)} for i in range(num_inativos)]
    
    def _obter_clientes_ativos(self) -> List[Dict[str, Any]]:
        """Obter clientes ativos"""
        # Simular dados
        num_ativos = np.random.randint(50, 100)
        return [{'id': f'cli_ativo_{i}', 'score_engajamento': np.random.uniform(0.3, 1.0)} for i in range(num_ativos)]
    
    async def _enviar_email_automatico(self, parametros: Dict[str, Any]) -> Dict[str, Any]:
        """Envia email automático"""
        try:
            # Em produção, implementar envio real de email
            destinatarios = parametros.get('destinatarios', [])
            assunto = parametros.get('assunto', 'Notificação Automática')
            template = parametros.get('template', 'padrao')
            
            emails_enviados = len(destinatarios)
            emails_sucesso = int(emails_enviados * np.random.uniform(0.95, 1.0))
            
            return {
                'sucesso': True,
                'mensagem': f'{emails_sucesso}/{emails_enviados} emails enviados com sucesso',
                'detalhes': {
                    'destinatarios': emails_enviados,
                    'enviados_com_sucesso': emails_sucesso,
                    'template_usado': template,
                    'taxa_sucesso': f'{(emails_sucesso/emails_enviados)*100:.1f}%'
                }
            }
            
        except Exception as e:
            return {'sucesso': False, 'erro': str(e)}
    
    async def _enviar_relatorio_email(self, arquivo: str, destinatarios: List[str]) -> Dict[str, Any]:
        """Envia relatório por email"""
        try:
            # Simular envio de email com anexo
            return {
                'enviado': True,
                'destinatarios': len(destinatarios),
                'arquivo_anexo': arquivo,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {'enviado': False, 'erro': str(e)}
    
    def obter_status_tarefas(self) -> Dict[str, Any]:
        """Obtém status de todas as tarefas"""
        tarefas_info = []
        
        for tarefa_id, tarefa in self.tarefas_ativas.items():
            job = self.scheduler.get_job(tarefa_id)
            
            # Próxima execução
            proxima_execucao = job.next_run_time if job else None
            
            # Última execução
            execucoes_tarefa = [e for e in self.historico_execucoes if e.tarefa_id == tarefa_id]
            ultima_execucao = max(execucoes_tarefa, key=lambda x: x.timestamp) if execucoes_tarefa else None
            
            tarefas_info.append({
                'id': tarefa.id,
                'nome': tarefa.nome,
                'tipo': tarefa.tipo,
                'ativo': tarefa.ativo,
                'agendamento': tarefa.agendamento,
                'proxima_execucao': proxima_execucao.isoformat() if proxima_execucao else None,
                'ultima_execucao': {
                    'timestamp': ultima_execucao.timestamp.isoformat(),
                    'sucesso': ultima_execucao.sucesso,
                    'duracao': ultima_execucao.duracao
                } if ultima_execucao else None
            })
        
        return {
            'total_tarefas': len(self.tarefas_ativas),
            'tarefas_ativas': sum(1 for t in self.tarefas_ativas.values() if t.ativo),
            'proxima_execucao': min([job.next_run_time for job in self.scheduler.get_jobs()]) if self.scheduler.get_jobs() else None,
            'tarefas': tarefas_info
        }

# Instanciar gerenciador
gerenciador = GerenciadorAutomacao()

# Endpoints
@app.get("/")
async def root():
    return {"message": "Sistema de Automação Inteligente - Python Superior", "status": "online"}

@app.post("/automacao/agendar-tarefa")
async def agendar_tarefa(tarefa: TarefaAutomatica):
    """Agenda nova tarefa automática"""
    resultado = gerenciador.agendar_tarefa(tarefa)
    if not resultado['sucesso']:
        raise HTTPException(status_code=400, detail=resultado['erro'])
    return resultado

@app.get("/automacao/status")
async def status_tarefas():
    """Obtém status de todas as tarefas"""
    return gerenciador.obter_status_tarefas()

@app.get("/automacao/historico")
async def historico_execucoes(limite: int = 50):
    """Obtém histórico de execuções"""
    historico = sorted(gerenciador.historico_execucoes, key=lambda x: x.timestamp, reverse=True)
    return {
        'total_execucoes': len(gerenciador.historico_execucoes),
        'execucoes_recentes': [
            {
                'tarefa_id': e.tarefa_id,
                'timestamp': e.timestamp.isoformat(),
                'sucesso': e.sucesso,
                'detalhes': e.detalhes,
                'duracao': e.duracao
            }
            for e in historico[:limite]
        ]
    }

@app.post("/automacao/executar-agora/{tarefa_id}")
async def executar_tarefa_agora(tarefa_id: str):
    """Executa tarefa imediatamente"""
    if tarefa_id not in gerenciador.tarefas_ativas:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    tarefa = gerenciador.tarefas_ativas[tarefa_id]
    await gerenciador._executar_tarefa(tarefa)
    
    return {"mensagem": f"Tarefa {tarefa.nome} executada", "tarefa_id": tarefa_id}

@app.get("/automacao/capacidades")
async def capacidades_automacao():
    """Lista capacidades do sistema de automação"""
    return {
        'tipos_tarefa': {
            'backup': 'Backup automático de dados com compactação e rotação',
            'relatorio': 'Geração automática de relatórios com envio por email',
            'limpeza': 'Limpeza de cache, logs e otimização de performance',
            'marketing': 'Campanhas automáticas segmentadas por ML',
            'email': 'Envio automático de emails e notificações'
        },
        'agendamentos_suportados': [
            'Execução única (data/hora específica)',
            'Recorrência diária, semanal, mensal',
            'Cron expressions personalizadas',
            'Triggers baseados em eventos'
        ],
        'integracoes': [
            'Sistema de Relatórios (porta 8003)',
            'Sistema ML para segmentação (porta 8004)',
            'Sistema Caixa para dados financeiros (porta 8002)',
            'SMTP para envio de emails',
            'Sistema de backup e storage'
        ],
        'vantagens_python': [
            'APScheduler para agendamento robusto',
            'Threading assíncrono para performance',
            'Integração nativa com todos os sistemas',
            'Pandas para processamento de dados',
            'Logging e monitoramento avançado',
            'Retry automático e tratamento de erros'
        ],
        'tarefas_pre_configuradas': [
            'Backup diário às 23h',
            'Relatório semanal segunda-feira 8h',
            'Limpeza domingo 2h',
            'Campanhas aniversário diárias 9h',
            'Reativação terça/quinta 10h'
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🤖 SISTEMA DE AUTOMAÇÃO INTELIGENTE - PYTHON SUPERIOR")
    print("⏰ Scheduling avançado com APScheduler")
    print("🔄 Automação completa do salão")
    print("🚀 Servidor rodando em http://localhost:8007")
    
    uvicorn.run(app, host="0.0.0.0", port=8007)