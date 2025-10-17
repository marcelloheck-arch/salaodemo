'use client';

import React, { useState, useMemo } from 'react';
import { Star, MessageCircle, ThumbsUp, Eye, Filter, Search, Calendar, User, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Avaliacao, EstatisticasAvaliacoes, FiltroAvaliacoes, AVALIACOES_MOCK, SERVICOS_MOCK, FUNCIONARIOS_MOCK } from '@/types/avaliacoes';

export default function AvaliacoesPage() {
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'avaliacoes' | 'responder' | 'configuracoes'>('visao-geral');
  const [avaliacoes] = useState<Avaliacao[]>(AVALIACOES_MOCK);
  const [filtros, setFiltros] = useState<FiltroAvaliacoes>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Calcular estatísticas
  const estatisticas = useMemo((): EstatisticasAvaliacoes => {
    const total = avaliacoes.length;
    const somaNotas = avaliacoes.reduce((sum, av) => sum + av.nota, 0);
    const media = total > 0 ? somaNotas / total : 0;

    const distribuicao = avaliacoes.reduce((acc, av) => {
      acc[av.nota] = (acc[av.nota] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const recomendacoes = avaliacoes.filter(av => av.recomenda).length;
    const percentualRecomendacao = total > 0 ? (recomendacoes / total) * 100 : 0;

    // Calcular médias por aspecto
    const aspectos = avaliacoes.reduce((acc, av) => {
      av.aspectos.forEach(asp => {
        if (!acc[asp.aspecto]) {
          acc[asp.aspecto] = { total: 0, soma: 0 };
        }
        acc[asp.aspecto].total++;
        acc[asp.aspecto].soma += asp.nota;
      });
      return acc;
    }, {} as Record<string, { total: number; soma: number }>);

    const aspectosFinais = Object.entries(aspectos).reduce((acc, [key, value]) => {
      acc[key as keyof typeof acc] = {
        media: value.total > 0 ? value.soma / value.total : 0,
        total: value.total
      };
      return acc;
    }, {} as any);

    return {
      mediaGeral: media,
      totalAvaliacoes: total,
      distribuicaoNotas: distribuicao,
      aspectos: aspectosFinais,
      tendencia: 'subindo', // Simulado
      avaliacoesRecentes: avaliacoes.filter(av => 
        new Date(av.dataAvaliacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      recomendacao: percentualRecomendacao
    };
  }, [avaliacoes]);

  // Filtrar avaliações
  const avaliacoesFiltradas = useMemo(() => {
    return avaliacoes.filter(av => {
      // Filtro por termo de busca
      if (searchTerm) {
        const termo = searchTerm.toLowerCase();
        if (!av.clienteNome.toLowerCase().includes(termo) &&
            !av.comentario.toLowerCase().includes(termo) &&
            !av.servicoNome.toLowerCase().includes(termo)) {
          return false;
        }
      }

      // Filtro por nota
      if (filtros.nota?.length && !filtros.nota.includes(av.nota)) {
        return false;
      }

      // Filtro por serviço
      if (filtros.servico?.length && !filtros.servico.includes(av.servicoId)) {
        return false;
      }

      // Filtro por funcionário
      if (filtros.funcionario?.length && !filtros.funcionario.includes(av.funcionarioId)) {
        return false;
      }

      // Filtro por status
      if (filtros.status?.length && !filtros.status.includes(av.status)) {
        return false;
      }

      return true;
    });
  }, [avaliacoes, searchTerm, filtros]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">⭐ Avaliações dos Clientes</h2>
            <p className="text-gray-600">Gerencie feedback e melhore a experiência do cliente</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
              <div className="text-2xl font-bold text-gray-900">{estatisticas.mediaGeral.toFixed(1)}</div>
              <div className="flex justify-center mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i <= estatisticas.mediaGeral ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                  />
                ))}
              </div>
              <div className="text-gray-500 text-sm">{estatisticas.totalAvaliacoes} avaliações</div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Média Geral</p>
                <p className="text-2xl font-semibold text-gray-900">{estatisticas.mediaGeral.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Avaliações</p>
                <p className="text-2xl font-semibold text-gray-900">{estatisticas.totalAvaliacoes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recomendação</p>
                <p className="text-2xl font-semibold text-gray-900">{estatisticas.recomendacao.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">5 Estrelas</p>
                <p className="text-2xl font-semibold text-gray-900">{(estatisticas.distribuicaoNotas[5] || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b">
          {[
            { key: 'visao-geral', label: 'Visão Geral', icon: '📊' },
            { key: 'avaliacoes', label: 'Todas as Avaliações', icon: '💬' },
            { key: 'responder', label: 'Pendentes Resposta', icon: '✉️' },
            { key: 'configuracoes', label: 'Configurações', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-center transition-all ${
                activeTab === tab.key
                  ? 'border-b-2 border-slate-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="font-medium text-sm mt-1">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'visao-geral' && (
        <VisaoGeralTab estatisticas={estatisticas} avaliacoes={avaliacoes} />
      )}

      {activeTab === 'avaliacoes' && (
        <TodasAvaliacoesTab 
          avaliacoes={avaliacoesFiltradas}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filtros={filtros}
          setFiltros={setFiltros}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      )}

      {activeTab === 'responder' && (
        <ResponderTab avaliacoes={avaliacoes.filter(av => !av.resposta)} />
      )}

      {activeTab === 'configuracoes' && (
        <ConfiguracoesTab />
      )}
    </div>
  );
}

// Componente Visão Geral
function VisaoGeralTab({ estatisticas, avaliacoes }: { estatisticas: EstatisticasAvaliacoes; avaliacoes: Avaliacao[] }) {
  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subindo': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'descendo': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Média Geral</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.mediaGeral.toFixed(1)}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              {getTendenciaIcon(estatisticas.tendencia)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Avaliações</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.totalAvaliacoes}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Recomendação</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.recomendacao.toFixed(0)}%</p>
            </div>
            <Award className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.avaliacoesRecentes}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Distribuição de Notas */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Distribuição de Notas</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(nota => {
              const quantidade = estatisticas.distribuicaoNotas[nota] || 0;
              const percentual = estatisticas.totalAvaliacoes > 0 ? (quantidade / estatisticas.totalAvaliacoes) * 100 : 0;
              
              return (
                <div key={nota} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-900 font-medium">{nota}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-slate-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-sm w-12 text-right">{quantidade}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Avaliações por Aspecto */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Avaliação por Aspecto</h3>
          <div className="space-y-3">
            {Object.entries(estatisticas.aspectos).map(([aspecto, dados]) => {
              const aspectoNomes: Record<string, string> = {
                qualidade: 'Qualidade',
                atendimento: 'Atendimento',
                limpeza: 'Limpeza',
                pontualidade: 'Pontualidade',
                preco: 'Preço',
                ambiente: 'Ambiente'
              };

              return (
                <div key={aspecto} className="flex items-center justify-between">
                  <span className="text-gray-900">{aspectoNomes[aspecto] || aspecto}</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i <= dados.media ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">({dados.total})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Avaliações Recentes */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Avaliações Recentes</h3>
        <div className="space-y-4">
          {avaliacoes.slice(0, 3).map(avaliacao => (
            <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente Todas as Avaliações
function TodasAvaliacoesTab({ 
  avaliacoes, 
  searchTerm, 
  setSearchTerm, 
  filtros, 
  setFiltros, 
  showFilters, 
  setShowFilters 
}: {
  avaliacoes: Avaliacao[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filtros: FiltroAvaliacoes;
  setFiltros: (filtros: FiltroAvaliacoes) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Barra de Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, comentário ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg border transition-all ${
              showFilters 
                ? 'bg-blue-100 border-blue-300 text-blue-700' 
                : 'bg-gray-100 border-gray-300 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Nota</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(nota => (
                  <button
                    key={nota}
                    onClick={() => {
                      const notas = filtros.nota || [];
                      if (notas.includes(nota)) {
                        setFiltros({ ...filtros, nota: notas.filter(n => n !== nota) });
                      } else {
                        setFiltros({ ...filtros, nota: [...notas, nota] });
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      filtros.nota?.includes(nota)
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-300'
                    }`}
                  >
                    {nota}⭐
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Serviço</label>
              <select
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                onChange={(e) => {
                  const servicos = filtros.servico || [];
                  if (e.target.value && !servicos.includes(e.target.value)) {
                    setFiltros({ ...filtros, servico: [...servicos, e.target.value] });
                  }
                }}
              >
                <option value="">Selecionar serviço</option>
                {SERVICOS_MOCK.map(servico => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
              <select
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                onChange={(e) => {
                  if (e.target.value) {
                    setFiltros({ ...filtros, status: [e.target.value as any] });
                  } else {
                    setFiltros({ ...filtros, status: undefined });
                  }
                }}
              >
                <option value="">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="respondida">Respondida</option>
                <option value="oculta">Oculta</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {avaliacoes.length > 0 ? (
          avaliacoes.map(avaliacao => (
            <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma avaliação encontrada com os filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Responder Avaliações
function ResponderTab({ avaliacoes }: { avaliacoes: Avaliacao[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Avaliações Pendentes de Resposta ({avaliacoes.length})
        </h3>
        {avaliacoes.length > 0 ? (
          <div className="space-y-4">
            {avaliacoes.map(avaliacao => (
              <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} showResponseForm />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Todas as avaliações foram respondidas! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Configurações
function ConfiguracoesTab() {
  const [config, setConfig] = useState({
    habilitarAvaliacoes: true,
    avaliacaoObrigatoria: false,
    permitirFotos: true,
    moderacaoAtiva: true,
    emailNotificacao: true,
    exibirNoSite: true,
    lembreteHabilitado: true,
    tempoLembrete: 24
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Configurações de Avaliações</h3>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.habilitarAvaliacoes}
                onChange={(e) => setConfig({...config, habilitarAvaliacoes: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-900">Habilitar sistema de avaliações</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.avaliacaoObrigatoria}
                onChange={(e) => setConfig({...config, avaliacaoObrigatoria: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-900">Avaliação obrigatória</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.permitirFotos}
                onChange={(e) => setConfig({...config, permitirFotos: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-900">Permitir fotos nas avaliações</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.moderacaoAtiva}
                onChange={(e) => setConfig({...config, moderacaoAtiva: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-900">Moderação ativa</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.emailNotificacao}
                onChange={(e) => setConfig({...config, emailNotificacao: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-900">Notificações por email</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.exibirNoSite}
                onChange={(e) => setConfig({...config, exibirNoSite: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-900">Exibir no site público</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Lembrete de avaliação (horas após o serviço)
          </label>
          <input
            type="number"
            value={config.tempoLembrete}
            onChange={(e) => setConfig({...config, tempoLembrete: parseInt(e.target.value)})}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            min="1"
            max="168"
          />
        </div>

        <button className="w-full bg-gradient-to-r from-slate-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-slate-700 hover:to-blue-700 transition-all">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}

// Componente Card de Avaliação
function AvaliacaoCard({ avaliacao, compact = false, showResponseForm = false }: { 
  avaliacao: Avaliacao; 
  compact?: boolean; 
  showResponseForm?: boolean;
}) {
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState('');

  const handleSubmitResponse = () => {
    console.log('Resposta enviada:', responseText);
    setShowResponse(false);
    setResponseText('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {avaliacao.clienteNome.charAt(0)}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-gray-900 font-semibold">{avaliacao.clienteNome}</h4>
              <p className="text-gray-500 text-sm">{avaliacao.servicoNome} • {avaliacao.funcionarioNome}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i <= avaliacao.nota ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                {new Date(avaliacao.dataAvaliacao).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-gray-900 mb-4">{avaliacao.comentario}</p>

          {!compact && (
            <>
              {/* Aspectos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {avaliacao.aspectos.map(aspecto => (
                  <div key={aspecto.aspecto} className="text-center">
                    <div className="text-gray-500 text-xs mb-1 capitalize">{aspecto.aspecto}</div>
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i <= aspecto.nota ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Estatísticas */}
              <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{avaliacao.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{avaliacao.visualizacoes}</span>
                </div>
                {avaliacao.recomenda && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    Recomenda
                  </span>
                )}
              </div>
            </>
          )}

          {/* Resposta existente */}
          {avaliacao.resposta && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">{avaliacao.resposta.autorNome}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(avaliacao.resposta.dataResposta).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-900">{avaliacao.resposta.texto}</p>
            </div>
          )}

          {/* Formulário de resposta */}
          {showResponseForm && !avaliacao.resposta && (
            <div className="mt-4">
              {!showResponse ? (
                <button
                  onClick={() => setShowResponse(true)}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all"
                >
                  💬 Responder Avaliação
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Digite sua resposta..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSubmitResponse}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all"
                    >
                      Enviar Resposta
                    </button>
                    <button
                      onClick={() => {
                        setShowResponse(false);
                        setResponseText('');
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
