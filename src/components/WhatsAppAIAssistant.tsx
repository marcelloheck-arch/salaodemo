/**
 * Assistente Virtual WhatsApp com IA
 * Conecta via QR Code e usa IA para entender mensagens e agendar automaticamente
 */

'use client';
import React, { useState, useEffect } from 'react';
import { MessageCircle, Zap, User, Calendar, Clock, CheckCircle, Send, QrCode } from 'lucide-react';
import WhatsAppReal from './WhatsAppReal';

interface Mensagem {
  id: string;
  remetente: string;
  conteudo: string;
  timestamp: string;
  tipo: 'recebida' | 'enviada';
  processada?: boolean;
  intencao?: string;
}

interface AgendamentoIA {
  clienteNome: string;
  clienteTelefone: string;
  servicoSolicitado: string;
  dataSugerida?: string;
  horarioSugerido?: string;
  confianca: number;
  status: 'pendente' | 'confirmado' | 'cancelado';
}

export default function WhatsAppAIAssistant() {
  const [conectado, setConectado] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [agendamentosIA, setAgendamentosIA] = useState<AgendamentoIA[]>([]);
  const [respostaAutomatica, setRespostaAutomatica] = useState(true);
  const [configuracoes, setConfiguracoes] = useState({
    nomeEstabelecimento: 'Salão Exemplo',
    mensagemBoasVindas: 'Olá! 👋 Sou a assistente virtual. Como posso ajudar você hoje?',
    horarioAtendimento: {
      inicio: '09:00',
      fim: '18:00',
      diasSemana: [1, 2, 3, 4, 5, 6] // Segunda a Sábado
    }
  });

  useEffect(() => {
    // Simular conexão WhatsApp Web (em produção usar biblioteca real)
    carregarMensagens();
  }, []);

  const carregarMensagens = () => {
    const mensagensSalvas = localStorage.getItem('whatsapp-mensagens');
    if (mensagensSalvas) {
      setMensagens(JSON.parse(mensagensSalvas));
    }
  };

  const conectarWhatsApp = () => {
    // Simular geração de QR Code
    // Em produção: usar whatsapp-web.js ou baileys
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('SIMULACAO-WHATSAPP-' + Date.now())}`);
    
    // Simular conexão após 3 segundos
    setTimeout(() => {
      setConectado(true);
      setQrCode('');
    }, 3000);
  };

  /**
   * IA para extrair intenção da mensagem
   */
  const analisarMensagemIA = (mensagem: string): {
    intencao: string;
    dados: any;
    confianca: number;
  } => {
    const msg = mensagem.toLowerCase();
    
    // Padrões de agendamento
    const padroes = {
      agendamento: [
        /quero agendar/i,
        /gostaria de marcar/i,
        /preciso marcar/i,
        /queria um horário/i,
        /tem vaga/i,
        /disponibilidade/i
      ],
      cancelamento: [
        /cancelar/i,
        /desmarcar/i,
        /não vou conseguir/i
      ],
      informacao: [
        /quanto custa/i,
        /qual o preço/i,
        /valor/i,
        /endereço/i,
        /onde fica/i,
        /horário de funcionamento/i
      ]
    };

    // Detectar intenção
    let intencao = 'geral';
    let confianca = 0;

    if (padroes.agendamento.some(p => p.test(msg))) {
      intencao = 'agendamento';
      confianca = 0.9;
    } else if (padroes.cancelamento.some(p => p.test(msg))) {
      intencao = 'cancelamento';
      confianca = 0.85;
    } else if (padroes.informacao.some(p => p.test(msg))) {
      intencao = 'informacao';
      confianca = 0.8;
    }

    // Extrair dados específicos
    const dados: any = {};

    // Extrair serviços mencionados
    const servicos = ['corte', 'manicure', 'pedicure', 'escova', 'coloração', 'hidratação', 'barba', 'sobrancelha'];
    servicos.forEach(servico => {
      if (msg.includes(servico)) {
        dados.servico = servico;
        confianca += 0.1;
      }
    });

    // Extrair datas (regex simplificado)
    const dataRegex = /(\d{1,2})[\/\-](\d{1,2})/;
    const matchData = msg.match(dataRegex);
    if (matchData) {
      dados.dia = matchData[1];
      dados.mes = matchData[2];
      confianca += 0.1;
    }

    // Extrair horários
    const horarioRegex = /(\d{1,2}):?(\d{2})?h?/;
    const matchHorario = msg.match(horarioRegex);
    if (matchHorario) {
      dados.hora = matchHorario[1];
      dados.minuto = matchHorario[2] || '00';
      confianca += 0.1;
    }

    // Detectar dias da semana
    const diasSemana: Record<string, number> = {
      'segunda': 1, 'seg': 1,
      'terça': 2, 'terca': 2, 'ter': 2,
      'quarta': 3, 'qua': 3,
      'quinta': 4, 'qui': 4,
      'sexta': 5, 'sex': 5,
      'sábado': 6, 'sabado': 6, 'sab': 6,
      'domingo': 0, 'dom': 0
    };

    Object.entries(diasSemana).forEach(([dia, num]) => {
      if (msg.includes(dia)) {
        dados.diaSemana = num;
        dados.diaSemanaTexto = dia;
        confianca += 0.1;
      }
    });

    return { intencao, dados, confianca };
  };

  /**
   * Gerar resposta automática inteligente
   */
  const gerarRespostaIA = (analise: any, remetente: string, mensagemOriginal: string): string => {
    const { intencao, dados, confianca } = analise;
    const msg = mensagemOriginal.toLowerCase();

    switch (intencao) {
      case 'agendamento':
        if (dados.servico && (dados.dia || dados.diaSemana)) {
          // Tem informações suficientes
          return `Perfeito! Vou agendar um ${dados.servico} para você ${
            dados.dia ? `no dia ${dados.dia}/${dados.mes}` : dados.diaSemanaTexto
          }${dados.hora ? ` às ${dados.hora}:${dados.minuto}` : ''}.\n\n` +
            `Por favor, me confirme:\n` +
            `✅ Nome completo\n` +
            `✅ ${dados.hora ? 'Confirma' : 'Qual'} o horário ${dados.hora ? dados.hora + ':' + dados.minuto : 'preferido'}?\n\n` +
            `Responda "SIM" para confirmar ou sugira outro horário!`;
        } else if (dados.servico) {
          // Tem serviço mas falta data
          return `Legal! Você quer agendar ${dados.servico}! 💇‍♀️\n\n` +
            `Para qual dia você gostaria? Pode ser:\n` +
            `• Uma data (ex: 15/11)\n` +
            `• Um dia da semana (ex: segunda-feira)\n\n` +
            `Nosso horário: ${configuracoes.horarioAtendimento.inicio} às ${configuracoes.horarioAtendimento.fim}`;
        } else {
          // Quer agendar mas não disse o que
          return `Ótimo! Vou te ajudar a agendar! 😊\n\n` +
            `Temos os seguintes serviços:\n` +
            `💇 Cortes\n` +
            `💅 Manicure/Pedicure\n` +
            `✨ Escova\n` +
            `🎨 Coloração\n` +
            `💆 Hidratação\n\n` +
            `Qual você gostaria?`;
        }

      case 'cancelamento':
        return `Entendi que você precisa cancelar.\n\n` +
          `Para eu localizar seu agendamento, me informe:\n` +
          `📱 Seu telefone ou nome\n` +
          `📅 A data do agendamento\n\n` +
          `Ou digite o número do agendamento se você tiver.`;

      case 'informacao':
        if (msg.includes('preço') || msg.includes('valor') || msg.includes('quanto')) {
          return `💰 Nossos principais serviços:\n\n` +
            `Corte Feminino: R$ 80,00\n` +
            `Corte Masculino: R$ 50,00\n` +
            `Manicure: R$ 40,00\n` +
            `Pedicure: R$ 45,00\n` +
            `Escova: R$ 60,00\n` +
            `Coloração: a partir de R$ 150,00\n\n` +
            `Quer agendar algum? 😊`;
        } else if (msg.includes('endereço') || msg.includes('onde')) {
          return `📍 Nosso endereço:\n` +
            `Rua Exemplo, 123 - Centro\n` +
            `São Paulo - SP\n\n` +
            `🕐 Horário de funcionamento:\n` +
            `Segunda a Sexta: 09:00 às 19:00\n` +
            `Sábado: 09:00 às 18:00\n\n` +
            `Precisa de algo mais?`;
        } else {
          return `${configuracoes.mensagemBoasVindas}\n\n` +
            `🏪 ${configuracoes.nomeEstabelecimento}\n\n` +
            `Posso te ajudar com:\n` +
            `📅 Agendamentos\n` +
            `💰 Preços\n` +
            `📍 Localização\n` +
            `⏰ Horários\n\n` +
            `O que você precisa?`;
        }

      default:
        return `Olá! 👋\n\n` +
          `Estou aqui para ajudar! Você pode:\n\n` +
          `📅 Agendar um horário\n` +
          `❌ Cancelar agendamento\n` +
          `ℹ️ Pedir informações\n\n` +
          `Como posso te ajudar?`;
    }
  };

  /**
   * Processar mensagem recebida
   */
  const processarMensagem = (mensagem: Mensagem) => {
    if (!respostaAutomatica) return;

    const analise = analisarMensagemIA(mensagem.conteudo);
    
    // Atualizar mensagem com análise
    const mensagensAtualizadas = mensagens.map(m =>
      m.id === mensagem.id
        ? { ...m, processada: true, intencao: analise.intencao }
        : m
    );
    setMensagens(mensagensAtualizadas);

    // Se for tentativa de agendamento com alta confiança, criar registro
    if (analise.intencao === 'agendamento' && analise.confianca > 0.7) {
      const novoAgendamento: AgendamentoIA = {
        clienteNome: mensagem.remetente,
        clienteTelefone: mensagem.remetente, // Em produção, pegar número real
        servicoSolicitado: analise.dados.servico || 'Não especificado',
        dataSugerida: analise.dados.dia ? `2025-11-${analise.dados.dia}` : undefined,
        horarioSugerido: analise.dados.hora ? `${analise.dados.hora}:${analise.dados.minuto}` : undefined,
        confianca: analise.confianca,
        status: 'pendente'
      };
      setAgendamentosIA(prev => [...prev, novoAgendamento]);
    }

    // Gerar e enviar resposta automática
    setTimeout(() => {
      const resposta = gerarRespostaIA(analise, mensagem.remetente, mensagem.conteudo);
      enviarMensagem(mensagem.remetente, resposta);
    }, 1000);
  };

  /**
   * Enviar mensagem via WhatsApp REAL
   */
  const enviarMensagem = async (destinatario: string, conteudo: string) => {
    try {
      // Enviar via API WhatsApp Real
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send',
          to: destinatario,
          message: conteudo
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error('❌ Erro ao enviar mensagem:', data.error);
        return;
      }

      console.log('✅ Mensagem enviada com sucesso');

      // Adicionar à lista local
      const novaMensagem: Mensagem = {
        id: Date.now().toString(),
        remetente: configuracoes.nomeEstabelecimento,
        conteudo,
        timestamp: new Date().toISOString(),
        tipo: 'enviada',
        processada: true
      };

      const novasMensagens = [...mensagens, novaMensagem];
      setMensagens(novasMensagens);
      localStorage.setItem('whatsapp-mensagens', JSON.stringify(novasMensagens));
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
    }
  };

  /**
   * Simular recebimento de mensagem (para testes)
   */
  const simularMensagemRecebida = (conteudo: string) => {
    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      remetente: 'Cliente Teste',
      conteudo,
      timestamp: new Date().toISOString(),
      tipo: 'recebida',
      processada: false
    };

    const novasMensagens = [...mensagens, novaMensagem];
    setMensagens(novasMensagens);
    localStorage.setItem('whatsapp-mensagens', JSON.stringify(novasMensagens));

    // Processar automaticamente se ativado
    if (respostaAutomatica) {
      setTimeout(() => processarMensagem(novaMensagem), 500);
    }
  };

  const confirmarAgendamento = (index: number) => {
    const agendamento = agendamentosIA[index];
    
    // Criar agendamento real no sistema
    const novoAgendamento = {
      id: Date.now().toString(),
      clienteNome: agendamento.clienteNome,
      clienteTelefone: agendamento.clienteTelefone,
      servicoNome: agendamento.servicoSolicitado,
      data: agendamento.dataSugerida || new Date().toISOString().split('T')[0],
      horario: agendamento.horarioSugerido || '10:00',
      status: 'confirmado',
      criadoEm: new Date().toISOString()
    };

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    // Atualizar status
    const agendamentosAtualizados = [...agendamentosIA];
    agendamentosAtualizados[index].status = 'confirmado';
    setAgendamentosIA(agendamentosAtualizados);

    // Enviar confirmação
    enviarMensagem(
      agendamento.clienteTelefone,
      `✅ Agendamento confirmado!\n\n` +
      `📅 Data: ${agendamento.dataSugerida}\n` +
      `🕐 Horário: ${agendamento.horarioSugerido}\n` +
      `✨ Serviço: ${agendamento.servicoSolicitado}\n\n` +
      `Te esperamos! Qualquer dúvida, é só chamar! 😊`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🤖 Assistente WhatsApp com IA
              </h1>
              <p className="text-white/70">
                Conecte via QR Code e deixe a IA agendar automaticamente
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  conectado
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${conectado ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                {conectado ? 'Conectado' : 'Desconectado'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Conexão e Configurações */}
          <div className="space-y-6">
            {/* Conexão WhatsApp REAL */}
            <WhatsAppReal
              onMessageReceived={(from, message) => {
                console.log('📨 Mensagem recebida do WhatsApp:', from, message);
                
                // Criar mensagem no formato do sistema
                const novaMensagem: Mensagem = {
                  id: Date.now().toString(),
                  remetente: from,
                  conteudo: message,
                  timestamp: new Date().toISOString(),
                  tipo: 'recebida',
                  processada: false
                };
                
                // Adicionar à lista de mensagens
                setMensagens(prev => {
                  const updated = [...prev, novaMensagem];
                  localStorage.setItem('whatsapp-mensagens', JSON.stringify(updated));
                  return updated;
                });
                
                // Processar mensagem com IA
                processarMensagem(novaMensagem);
              }}
              onConnected={(phoneNumber) => {
                console.log('✅ WhatsApp conectado:', phoneNumber);
                setConectado(true);
              }}
              onDisconnected={() => {
                console.log('❌ WhatsApp desconectado');
                setConectado(false);
              }}
            />

            {/* Configurações */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Configurações IA
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={respostaAutomatica}
                      onChange={(e) => setRespostaAutomatica(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span>Resposta Automática</span>
                  </label>
                  <p className="text-white/60 text-sm ml-7">
                    IA responde automaticamente
                  </p>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Nome do Estabelecimento</label>
                  <input
                    type="text"
                    value={configuracoes.nomeEstabelecimento}
                    onChange={(e) =>
                      setConfiguracoes({ ...configuracoes, nomeEstabelecimento: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Testes Rápidos */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🧪 Testes Rápidos</h2>
              <div className="space-y-2">
                {[
                  'Quero agendar um corte para amanhã às 14h',
                  'Quanto custa manicure?',
                  'Tem vaga na sexta-feira?',
                  'Preciso cancelar meu agendamento',
                  'Onde fica o salão?'
                ].map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => simularMensagemRecebida(msg)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white text-left px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna do Meio - Chat */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">💬 Conversas</h2>
            
            <div className="space-y-3 mb-4 max-h-[600px] overflow-y-auto">
              {mensagens.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">Nenhuma mensagem ainda</p>
                  <p className="text-white/50 text-sm">Use os testes rápidos ao lado</p>
                </div>
              ) : (
                mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${
                      msg.tipo === 'recebida'
                        ? 'bg-white/10 ml-0 mr-12'
                        : 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 ml-12 mr-0'
                    } rounded-2xl p-4 border border-white/20`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 text-sm font-semibold">
                        {msg.tipo === 'recebida' ? msg.remetente : configuracoes.nomeEstabelecimento}
                      </span>
                      <span className="text-white/50 text-xs ml-auto">
                        {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-white whitespace-pre-wrap">{msg.conteudo}</p>
                    {msg.intencao && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <span className="text-white/60 text-xs">
                          🤖 IA detectou: {msg.intencao}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Coluna Direita - Agendamentos Detectados */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              📅 Agendamentos Detectados pela IA
            </h2>

            {agendamentosIA.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">Nenhum agendamento detectado</p>
                <p className="text-white/50 text-sm">A IA identificará automaticamente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agendamentosIA.map((agendamento, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-4 border ${
                      agendamento.status === 'confirmado'
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-white/5 border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{agendamento.clienteNome}</h3>
                        <p className="text-white/70 text-sm">{agendamento.clienteTelefone}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-xs mb-1">Confiança:</div>
                        <div className="text-white font-bold">
                          {(agendamento.confianca * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Zap className="w-4 h-4" />
                        <span>{agendamento.servicoSolicitado}</span>
                      </div>
                      {agendamento.dataSugerida && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(agendamento.dataSugerida).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                      {agendamento.horarioSugerido && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span>{agendamento.horarioSugerido}</span>
                        </div>
                      )}
                    </div>

                    {agendamento.status === 'pendente' && (
                      <button
                        onClick={() => confirmarAgendamento(index)}
                        className="w-full mt-3 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Confirmar Agendamento
                      </button>
                    )}

                    {agendamento.status === 'confirmado' && (
                      <div className="mt-3 bg-green-600/30 text-green-200 px-4 py-2 rounded-lg text-center font-semibold">
                        ✅ Confirmado
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
