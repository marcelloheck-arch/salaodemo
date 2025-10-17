'use client';

import React, { useState } from 'react';
import { Star, TrendingUp, MessageCircle, Award, Eye, ThumbsUp } from 'lucide-react';
import { Avaliacao, AVALIACOES_MOCK } from '@/types/avaliacoes';

interface AvaliacoesWidgetProps {
  onNavigateToAvaliacoes?: () => void;
}

export default function AvaliacoesWidget({ onNavigateToAvaliacoes }: AvaliacoesWidgetProps) {
  const [avaliacoes] = useState<Avaliacao[]>(AVALIACOES_MOCK);

  // Calcular estatísticas
  const mediaGeral = avaliacoes.length > 0 
    ? avaliacoes.reduce((sum, av) => sum + av.nota, 0) / avaliacoes.length 
    : 0;

  const totalAvaliacoes = avaliacoes.length;
  
  const avaliacoesRecentes = avaliacoes
    .filter(av => new Date(av.dataAvaliacao) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .length;

  const percentualRecomendacao = avaliacoes.length > 0
    ? (avaliacoes.filter(av => av.recomenda).length / avaliacoes.length) * 100
    : 0;

  const avaliacoesSemResposta = avaliacoes.filter(av => !av.resposta).length;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">⭐ Avaliações</h3>
          <p className="text-white/70 text-sm">Feedback dos clientes</p>
        </div>
        <button
          onClick={onNavigateToAvaliacoes}
          className="text-purple-300 hover:text-purple-200 text-sm"
        >
          Ver todas →
        </button>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Média Geral</p>
              <p className="text-2xl font-bold text-white">{mediaGeral.toFixed(1)}</p>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <TrendingUp className="w-4 h-4 text-green-400 ml-1" />
            </div>
          </div>
        </div>

        <div className="bg-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{totalAvaliacoes}</p>
            </div>
            <MessageCircle className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Recomendação</p>
              <p className="text-2xl font-bold text-white">{percentualRecomendacao.toFixed(0)}%</p>
            </div>
            <Award className="w-6 h-6 text-green-400" />
          </div>
        </div>

        <div className="bg-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Sem Resposta</p>
              <p className="text-2xl font-bold text-white">{avaliacoesSemResposta}</p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              avaliacoesSemResposta > 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
              !
            </div>
          </div>
        </div>
      </div>

      {/* Distribuição de Estrelas */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Distribuição de Notas</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(nota => {
            const quantidade = avaliacoes.filter(av => av.nota === nota).length;
            const percentual = totalAvaliacoes > 0 ? (quantidade / totalAvaliacoes) * 100 : 0;
            
            return (
              <div key={nota} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-8">
                  <span className="text-white text-sm">{nota}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-slate-600 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentual}%` }}
                  />
                </div>
                <span className="text-white/70 text-sm w-6 text-right">{quantidade}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avaliações Recentes */}
      <div>
        <h4 className="text-white font-semibold mb-3">Avaliações Recentes</h4>
        <div className="space-y-3">
          {avaliacoes.slice(0, 2).map(avaliacao => (
            <div key={avaliacao.id} className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {avaliacao.clienteNome.charAt(0)}
                  </div>
                  <span className="text-white text-sm font-medium">{avaliacao.clienteNome}</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i <= avaliacao.nota ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-white/80 text-sm line-clamp-2">{avaliacao.comentario}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white/60 text-xs">{avaliacao.servicoNome}</span>
                <div className="flex items-center space-x-2 text-white/60 text-xs">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{avaliacao.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{avaliacao.visualizacoes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      {avaliacoesSemResposta > 0 && (
        <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-200 text-sm font-medium">
              {avaliacoesSemResposta} avaliação{avaliacoesSemResposta > 1 ? 'ões' : ''} pendente{avaliacoesSemResposta > 1 ? 's' : ''} de resposta
            </span>
          </div>
        </div>
      )}

      {avaliacoesRecentes > 0 && (
        <div className="mt-2 bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-blue-200 text-sm">
              {avaliacoesRecentes} nova{avaliacoesRecentes > 1 ? 's' : ''} avaliação{avaliacoesRecentes > 1 ? 'ões' : ''} esta semana
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
