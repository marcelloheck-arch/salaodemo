'use client';

import React, { useState } from 'react';
import { Star, Camera, Send, CheckCircle } from 'lucide-react';
import { SERVICOS_MOCK, FUNCIONARIOS_MOCK } from '@/types/avaliacoes';

interface AvaliacaoPublicaFormProps {
  agendamentoId?: string;
  servicoId?: string;
  funcionarioId?: string;
  clienteNome?: string;
  clienteEmail?: string;
  onSubmit?: (avaliacao: any) => void;
}

export default function AvaliacaoPublicaForm({
  agendamentoId,
  servicoId,
  funcionarioId,
  clienteNome,
  clienteEmail,
  onSubmit
}: AvaliacaoPublicaFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: clienteNome || '',
    email: clienteEmail || '',
    servicoId: servicoId || '',
    funcionarioId: funcionarioId || '',
    nota: 0,
    comentario: '',
    aspectos: {
      qualidade: 0,
      atendimento: 0,
      limpeza: 0,
      pontualidade: 0,
      preco: 0,
      ambiente: 0
    },
    recomenda: true,
    fotos: [] as string[]
  });

  const aspectos = [
    { key: 'qualidade', label: 'Qualidade do Serviço', icon: '✨' },
    { key: 'atendimento', label: 'Atendimento', icon: '👥' },
    { key: 'limpeza', label: 'Limpeza', icon: '🧼' },
    { key: 'pontualidade', label: 'Pontualidade', icon: '⏰' },
    { key: 'preco', label: 'Preço Justo', icon: '💰' },
    { key: 'ambiente', label: 'Ambiente', icon: '🏢' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.nota === 0) {
      alert('Por favor, selecione uma nota geral');
      return;
    }

    const avaliacao = {
      id: `av_${Date.now()}`,
      clienteId: `cliente_${Date.now()}`,
      clienteNome: formData.nome,
      clienteEmail: formData.email,
      servicoId: formData.servicoId,
      servicoNome: SERVICOS_MOCK.find(s => s.id === formData.servicoId)?.nome || 'Serviço',
      funcionarioId: formData.funcionarioId,
      funcionarioNome: FUNCIONARIOS_MOCK.find(f => f.id === formData.funcionarioId)?.nome || 'Funcionário',
      agendamentoId: agendamentoId || `ag_${Date.now()}`,
      nota: formData.nota,
      comentario: formData.comentario,
      dataAvaliacao: new Date(),
      dataServico: new Date(),
      status: 'ativa',
      aspectos: Object.entries(formData.aspectos).map(([aspecto, nota]) => ({
        aspecto: aspecto as any,
        nota: nota as number
      })).filter(a => a.nota > 0),
      recomenda: formData.recomenda,
      verificada: false,
      likes: 0,
      dislikes: 0,
      visualizacoes: 0,
      fotos: formData.fotos
    };

    console.log('🌟 Nova avaliação enviada:', avaliacao);
    
    if (onSubmit) {
      onSubmit(avaliacao);
    }
    
    setSubmitted(true);
  };

  const renderStars = (currentRating: number, onRate: (rating: number) => void, size = 'w-8 h-8') => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            onClick={() => onRate(rating)}
            className={`${size} transition-all hover:scale-110 ${
              rating <= currentRating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-400 hover:text-yellow-300'
            }`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Obrigado pela sua avaliação! 🌟</h2>
          <p className="text-white/80 mb-6">
            Sua opinião é muito importante para nós e nos ajuda a melhorar constantemente nossos serviços.
          </p>
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <p className="text-white/90 text-sm">
              ✅ Avaliação registrada com sucesso<br />
              📧 Você receberá uma confirmação por email<br />
              🎁 Ganhe desconto na próxima visita!
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Voltar ao Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ⭐ Avalie sua Experiência
          </h1>
          <p className="text-white/80">
            Sua opinião é fundamental para continuarmos melhorando
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Seu Nome *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Serviço e Funcionário */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Serviço Realizado *
              </label>
              <select
                required
                value={formData.servicoId}
                onChange={(e) => setFormData({...formData, servicoId: e.target.value})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Selecione o serviço</option>
                {SERVICOS_MOCK.map(servico => (
                  <option key={servico.id} value={servico.id} className="text-black">
                    {servico.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Profissional *
              </label>
              <select
                required
                value={formData.funcionarioId}
                onChange={(e) => setFormData({...formData, funcionarioId: e.target.value})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Selecione o profissional</option>
                {FUNCIONARIOS_MOCK.map(funcionario => (
                  <option key={funcionario.id} value={funcionario.id} className="text-black">
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nota Geral */}
          <div className="text-center">
            <label className="block text-white/90 text-sm font-medium mb-4">
              Como você avalia sua experiência geral? *
            </label>
            {renderStars(formData.nota, (nota) => setFormData({...formData, nota}))}
            <p className="text-white/70 text-sm mt-2">
              {formData.nota === 0 && 'Clique nas estrelas para avaliar'}
              {formData.nota === 1 && 'Muito insatisfeito 😞'}
              {formData.nota === 2 && 'Insatisfeito 😐'}
              {formData.nota === 3 && 'Neutro 😊'}
              {formData.nota === 4 && 'Satisfeito 😄'}
              {formData.nota === 5 && 'Muito satisfeito! 🤩'}
            </p>
          </div>

          {/* Avaliação por Aspectos */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-4">
              Avalie aspectos específicos (opcional)
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {aspectos.map(aspecto => (
                <div key={aspecto.key} className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{aspecto.icon}</span>
                      <span className="text-white text-sm">{aspecto.label}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {renderStars(
                      formData.aspectos[aspecto.key as keyof typeof formData.aspectos],
                      (nota) => setFormData({
                        ...formData,
                        aspectos: {
                          ...formData.aspectos,
                          [aspecto.key]: nota
                        }
                      }),
                      'w-5 h-5'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Conte-nos mais sobre sua experiência
            </label>
            <textarea
              value={formData.comentario}
              onChange={(e) => setFormData({...formData, comentario: e.target.value})}
              rows={4}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="O que mais gostou? O que podemos melhorar? Detalhe sua experiência..."
            />
          </div>

          {/* Recomendação */}
          <div className="bg-white/20 rounded-lg p-4">
            <label className="block text-white/90 text-sm font-medium mb-3">
              Você recomendaria nossos serviços?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="recomenda"
                  checked={formData.recomenda === true}
                  onChange={() => setFormData({...formData, recomenda: true})}
                  className="text-purple-600"
                />
                <span className="text-white">✅ Sim, recomendo!</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="recomenda"
                  checked={formData.recomenda === false}
                  onChange={() => setFormData({...formData, recomenda: false})}
                  className="text-purple-600"
                />
                <span className="text-white">❌ Não recomendaria</span>
              </label>
            </div>
          </div>

          {/* Upload de Fotos */}
          <div className="bg-white/20 rounded-lg p-4">
            <label className="block text-white/90 text-sm font-medium mb-3">
              Adicione fotos (opcional)
            </label>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-white/50 mx-auto mb-2" />
              <p className="text-white/70 text-sm">
                Arraste fotos aqui ou clique para selecionar
              </p>
              <p className="text-white/50 text-xs mt-1">
                PNG, JPG até 5MB cada
              </p>
            </div>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Enviar Avaliação</span>
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-white/60 text-xs">
            Sua avaliação será publicada após análise. Obrigado pela confiança! 💜
          </p>
        </div>
      </div>
    </div>
  );
}