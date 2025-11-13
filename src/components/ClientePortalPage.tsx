/**
 * Página Pública - Portal do Cliente
 * Permite que clientes vejam horários e façam agendamentos
 */

'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Check, ArrowLeft } from 'lucide-react';

interface Profissional {
  id: string;
  nome: string;
  especialidades: string[];
  foto?: string;
  disponibilidade: {
    diaSemana: number; // 0-6 (domingo-sábado)
    horaInicio: string;
    horaFim: string;
  }[];
}

interface Servico {
  id: string;
  nome: string;
  duracao: number; // em minutos
  preco: number;
  profissionais: string[]; // IDs dos profissionais que fazem
}

interface HorarioDisponivel {
  hora: string;
  profissionalId: string;
  profissionalNome: string;
  disponivel: boolean;
}

interface ClientePortalPageProps {
  clienteId: string;
  clienteNome: string;
}

export default function ClientePortalPage({ clienteId, clienteNome }: ClientePortalPageProps) {
  const [etapa, setEtapa] = useState<'servico' | 'profissional' | 'data' | 'horario' | 'dados' | 'confirmacao'>('servico');
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<HorarioDisponivel | null>(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);
  
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    email: ''
  });

  // Mock data - em produção virá da API
  const servicos: Servico[] = [
    {
      id: '1',
      nome: 'Corte Feminino',
      duracao: 60,
      preco: 80,
      profissionais: ['prof1', 'prof2']
    },
    {
      id: '2',
      nome: 'Corte Masculino',
      duracao: 30,
      preco: 50,
      profissionais: ['prof1', 'prof3']
    },
    {
      id: '3',
      nome: 'Manicure',
      duracao: 45,
      preco: 40,
      profissionais: ['prof2', 'prof4']
    },
    {
      id: '4',
      nome: 'Hidratação',
      duracao: 90,
      preco: 120,
      profissionais: ['prof1', 'prof2']
    }
  ];

  const profissionais: Profissional[] = [
    {
      id: 'prof1',
      nome: 'Maria Silva',
      especialidades: ['Cortes', 'Coloração'],
      disponibilidade: [
        { diaSemana: 1, horaInicio: '09:00', horaFim: '18:00' },
        { diaSemana: 2, horaInicio: '09:00', horaFim: '18:00' },
        { diaSemana: 3, horaInicio: '09:00', horaFim: '18:00' },
        { diaSemana: 4, horaInicio: '09:00', horaFim: '18:00' },
        { diaSemana: 5, horaInicio: '09:00', horaFim: '18:00' },
        { diaSemana: 6, horaInicio: '09:00', horaFim: '14:00' }
      ]
    },
    {
      id: 'prof2',
      nome: 'Ana Santos',
      especialidades: ['Manicure', 'Pedicure'],
      disponibilidade: [
        { diaSemana: 1, horaInicio: '10:00', horaFim: '19:00' },
        { diaSemana: 3, horaInicio: '10:00', horaFim: '19:00' },
        { diaSemana: 5, horaInicio: '10:00', horaFim: '19:00' }
      ]
    },
    {
      id: 'prof3',
      nome: 'João Oliveira',
      especialidades: ['Barbearia'],
      disponibilidade: [
        { diaSemana: 2, horaInicio: '08:00', horaFim: '17:00' },
        { diaSemana: 4, horaInicio: '08:00', horaFim: '17:00' },
        { diaSemana: 6, horaInicio: '08:00', horaFim: '13:00' }
      ]
    },
    {
      id: 'prof4',
      nome: 'Carla Lima',
      especialidades: ['Estética', 'Manicure'],
      disponibilidade: [
        { diaSemana: 1, horaInicio: '13:00', horaFim: '20:00' },
        { diaSemana: 2, horaInicio: '13:00', horaFim: '20:00' },
        { diaSemana: 3, horaInicio: '13:00', horaFim: '20:00' },
        { diaSemana: 4, horaInicio: '13:00', horaFim: '20:00' },
        { diaSemana: 5, horaInicio: '13:00', horaFim: '20:00' }
      ]
    }
  ];

  const profissionaisFiltrados = servicoSelecionado
    ? profissionais.filter(p => servicoSelecionado.profissionais.includes(p.id))
    : [];

  useEffect(() => {
    if (dataSelecionada && profissionalSelecionado && servicoSelecionado) {
      carregarHorariosDisponiveis();
    }
  }, [dataSelecionada, profissionalSelecionado]);

  const carregarHorariosDisponiveis = () => {
    if (!dataSelecionada || !profissionalSelecionado || !servicoSelecionado) return;

    const data = new Date(dataSelecionada + 'T00:00:00');
    const diaSemana = data.getDay();

    // Verificar se profissional trabalha neste dia
    const disponibilidadeDia = profissionalSelecionado.disponibilidade.find(
      d => d.diaSemana === diaSemana
    );

    if (!disponibilidadeDia) {
      setHorariosDisponiveis([]);
      return;
    }

    // Gerar horários disponíveis
    const horarios: HorarioDisponivel[] = [];
    const [horaInicio, minInicio] = disponibilidadeDia.horaInicio.split(':').map(Number);
    const [horaFim, minFim] = disponibilidadeDia.horaFim.split(':').map(Number);

    let hora = horaInicio;
    let min = minInicio;

    while (hora < horaFim || (hora === horaFim && min < minFim)) {
      const horaStr = `${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      
      // Verificar se horário está ocupado (mock - em produção consultar agendamentos)
      const ocupado = Math.random() > 0.7; // 30% de chance de estar ocupado

      horarios.push({
        hora: horaStr,
        profissionalId: profissionalSelecionado.id,
        profissionalNome: profissionalSelecionado.nome,
        disponivel: !ocupado
      });

      // Avançar 30 minutos
      min += 30;
      if (min >= 60) {
        hora += 1;
        min = 0;
      }
    }

    setHorariosDisponiveis(horarios);
  };

  const finalizarAgendamento = () => {
    if (!servicoSelecionado || !profissionalSelecionado || !dataSelecionada || !horarioSelecionado) {
      alert('Preencha todos os campos');
      return;
    }

    if (!dadosCliente.nome || !dadosCliente.telefone) {
      alert('Preencha nome e telefone');
      return;
    }

    // Criar agendamento
    const agendamento = {
      id: Date.now().toString(),
      clienteId: clienteId,
      clienteNome: clienteNome || dadosCliente.nome,
      clienteTelefone: dadosCliente.telefone,
      clienteEmail: dadosCliente.email,
      servicoId: servicoSelecionado.id,
      servicoNome: servicoSelecionado.nome,
      profissionalId: profissionalSelecionado.id,
      profissionalNome: profissionalSelecionado.nome,
      data: dataSelecionada,
      horario: horarioSelecionado.hora,
      duracao: servicoSelecionado.duracao,
      valor: servicoSelecionado.preco,
      status: 'confirmado',
      criadoEm: new Date().toISOString()
    };

    // Salvar no localStorage (em produção: API)
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    setEtapa('confirmacao');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  const voltar = () => {
    switch (etapa) {
      case 'profissional':
        setEtapa('servico');
        setProfissionalSelecionado(null);
        break;
      case 'data':
        setEtapa('profissional');
        setDataSelecionada('');
        break;
      case 'horario':
        setEtapa('data');
        setHorarioSelecionado(null);
        break;
      case 'dados':
        setEtapa('horario');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            ✨ Agende seu Horário
          </h1>
          <p className="text-white/70">Escolha o serviço, profissional e horário ideal para você</p>
        </div>

        {/* Progresso */}
        {etapa !== 'confirmacao' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              {['Serviço', 'Profissional', 'Data', 'Horário', 'Dados'].map((step, index) => {
                const steps = ['servico', 'profissional', 'data', 'horario', 'dados'];
                const currentIndex = steps.indexOf(etapa);
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;

                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isCompleted
                            ? 'bg-green-600 text-white'
                            : isActive
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                      </div>
                      <p className="text-gray-600 text-xs mt-1 hidden md:block">{step}</p>
                    </div>
                    {index < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          {/* Botão Voltar */}
          {etapa !== 'servico' && etapa !== 'confirmacao' && (
            <button
              onClick={voltar}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          )}

          {/* Etapa 1: Selecionar Serviço */}
          {etapa === 'servico' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Escolha o Serviço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicos.map((servico) => (
                  <button
                    key={servico.id}
                    onClick={() => {
                      setServicoSelecionado(servico);
                      setEtapa('profissional');
                    }}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 text-left transition-all shadow-sm hover:shadow-md"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {servico.nome}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {servico.duracao} min
                      </span>
                      <span className="text-purple-600 font-bold">
                        {formatarMoeda(servico.preco)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 2: Selecionar Profissional */}
          {etapa === 'profissional' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha o Profissional</h2>
              <p className="text-gray-600 mb-4">
                Para: <span className="text-purple-600 font-semibold">{servicoSelecionado?.nome}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profissionaisFiltrados.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setProfissionalSelecionado(prof);
                      setEtapa('data');
                    }}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 text-left transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {prof.nome.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{prof.nome}</h3>
                        <p className="text-gray-500 text-sm">
                          {prof.especialidades.join(', ')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 3: Selecionar Data */}
          {etapa === 'data' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha a Data</h2>
              <p className="text-gray-600 mb-4">
                Com: <span className="text-purple-600 font-semibold">{profissionalSelecionado?.nome}</span>
              </p>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={dataSelecionada}
                onChange={(e) => {
                  setDataSelecionada(e.target.value);
                  if (e.target.value) {
                    setEtapa('horario');
                  }
                }}
                className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 text-gray-800 text-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Etapa 4: Selecionar Horário */}
          {etapa === 'horario' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha o Horário</h2>
              <p className="text-gray-600 mb-4">
                {formatarData(dataSelecionada)}
              </p>

              {horariosDisponiveis.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Nenhum horário disponível para esta data
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {horariosDisponiveis.map((horario) => (
                    <button
                      key={horario.hora}
                      disabled={!horario.disponivel}
                      onClick={() => {
                        setHorarioSelecionado(horario);
                        setEtapa('dados');
                      }}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        horario.disponivel
                          ? 'bg-gray-50 hover:bg-purple-600 hover:text-white text-gray-800 border border-gray-200'
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'
                      }`}
                    >
                      {horario.hora}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Etapa 5: Dados do Cliente */}
          {etapa === 'dados' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Seus Dados</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    value={dadosCliente.nome}
                    onChange={(e) =>
                      setDadosCliente({ ...dadosCliente, nome: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-purple-500"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Telefone *</label>
                  <input
                    type="tel"
                    value={dadosCliente.telefone}
                    onChange={(e) =>
                      setDadosCliente({ ...dadosCliente, telefone: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-purple-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">E-mail (opcional)</label>
                  <input
                    type="email"
                    value={dadosCliente.email}
                    onChange={(e) =>
                      setDadosCliente({ ...dadosCliente, email: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-purple-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="text-gray-800 font-semibold mb-3">Resumo do Agendamento</h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold">Serviço:</span> {servicoSelecionado?.nome}
                  </p>
                  <p>
                    <span className="font-semibold">Profissional:</span>{' '}
                    {profissionalSelecionado?.nome}
                  </p>
                  <p>
                    <span className="font-semibold">Data:</span> {formatarData(dataSelecionada)}
                  </p>
                  <p>
                    <span className="font-semibold">Horário:</span> {horarioSelecionado?.hora}
                  </p>
                  <p className="text-purple-600 font-bold text-lg pt-2">
                    Valor: {formatarMoeda(servicoSelecionado?.preco || 0)}
                  </p>
                </div>
              </div>

              <button
                onClick={finalizarAgendamento}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
              >
                Confirmar Agendamento
              </button>
            </div>
          )}

          {/* Etapa 6: Confirmação */}
          {etapa === 'confirmacao' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Agendamento Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Você receberá uma confirmação por WhatsApp em breve
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                <h3 className="text-gray-800 font-semibold mb-3">Detalhes do Agendamento</h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold">Serviço:</span> {servicoSelecionado?.nome}
                  </p>
                  <p>
                    <span className="font-semibold">Profissional:</span>{' '}
                    {profissionalSelecionado?.nome}
                  </p>
                  <p>
                    <span className="font-semibold">Data:</span> {formatarData(dataSelecionada)}
                  </p>
                  <p>
                    <span className="font-semibold">Horário:</span> {horarioSelecionado?.hora}
                  </p>
                  <p className="text-purple-600 font-bold text-lg pt-2">
                    Valor: {formatarMoeda(servicoSelecionado?.preco || 0)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Fazer Novo Agendamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
