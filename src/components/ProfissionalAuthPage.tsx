/**
 * Página de Cadastro e Login de Profissionais
 */

'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Scissors, Eye, EyeOff, Briefcase } from 'lucide-react';
import ProfissionalDashboardPage from '@/components/ProfissionalDashboardPage';

interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  especialidades: string[];
  cpf?: string;
  foto?: string;
  bio?: string;
  disponibilidade: {
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
  }[];
  criadoEm: string;
}

export default function ProfissionalAuthPage() {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [profissionalLogado, setProfissionalLogado] = useState<Profissional | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [dadosLogin, setDadosLogin] = useState({
    email: '',
    senha: ''
  });

  const [dadosCadastro, setDadosCadastro] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    especialidades: [] as string[],
    bio: '',
    disponibilidade: {
      segunda: { ativo: false, inicio: '09:00', fim: '18:00' },
      terca: { ativo: false, inicio: '09:00', fim: '18:00' },
      quarta: { ativo: false, inicio: '09:00', fim: '18:00' },
      quinta: { ativo: false, inicio: '09:00', fim: '18:00' },
      sexta: { ativo: false, inicio: '09:00', fim: '18:00' },
      sabado: { ativo: false, inicio: '09:00', fim: '14:00' },
      domingo: { ativo: false, inicio: '09:00', fim: '14:00' }
    }
  });

  const especialidadesDisponiveis = [
    'Cortes Femininos',
    'Cortes Masculinos',
    'Coloração',
    'Mechas',
    'Manicure',
    'Pedicure',
    'Depilação',
    'Maquiagem',
    'Penteados',
    'Escova',
    'Hidratação',
    'Barbearia',
    'Estética Facial',
    'Design de Sobrancelhas'
  ];

  const toggleEspecialidade = (esp: string) => {
    const especialidades = [...dadosCadastro.especialidades];
    const index = especialidades.indexOf(esp);
    
    if (index > -1) {
      especialidades.splice(index, 1);
    } else {
      especialidades.push(esp);
    }
    
    setDadosCadastro({ ...dadosCadastro, especialidades });
  };

  const fazerLogin = () => {
    if (!dadosLogin.email || !dadosLogin.senha) {
      alert('Preencha email e senha');
      return;
    }

    // Buscar profissional no localStorage
    const profissionais: Profissional[] = JSON.parse(
      localStorage.getItem('profissionais') || '[]'
    );
    const profissional = profissionais.find(
      p => p.email === dadosLogin.email && p.senha === dadosLogin.senha
    );

    if (!profissional) {
      alert('Email ou senha incorretos');
      return;
    }

    setProfissionalLogado(profissional);
  };

  const fazerCadastro = () => {
    // Validações
    if (
      !dadosCadastro.nome ||
      !dadosCadastro.email ||
      !dadosCadastro.telefone ||
      !dadosCadastro.senha
    ) {
      alert('Preencha todos os campos obrigatórios (nome, email, telefone e senha)');
      return;
    }

    if (dadosCadastro.especialidades.length === 0) {
      alert('Selecione pelo menos uma especialidade');
      return;
    }

    if (dadosCadastro.senha !== dadosCadastro.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }

    if (dadosCadastro.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dadosCadastro.email)) {
      alert('Email inválido');
      return;
    }

    // Verificar se email já existe
    const profissionais: Profissional[] = JSON.parse(
      localStorage.getItem('profissionais') || '[]'
    );
    if (profissionais.some(p => p.email === dadosCadastro.email)) {
      alert('Este email já está cadastrado');
      return;
    }

    // Converter disponibilidade para formato correto
    const disponibilidade: { diaSemana: number; horaInicio: string; horaFim: string }[] = [];
    const diasMap: Record<string, number> = {
      domingo: 0,
      segunda: 1,
      terca: 2,
      quarta: 3,
      quinta: 4,
      sexta: 5,
      sabado: 6
    };

    Object.entries(dadosCadastro.disponibilidade).forEach(([dia, config]) => {
      if (config.ativo) {
        disponibilidade.push({
          diaSemana: diasMap[dia],
          horaInicio: config.inicio,
          horaFim: config.fim
        });
      }
    });

    if (disponibilidade.length === 0) {
      alert('Selecione pelo menos um dia de disponibilidade');
      return;
    }

    // Criar novo profissional
    const novoProfissional: Profissional = {
      id: Date.now().toString(),
      nome: dadosCadastro.nome,
      email: dadosCadastro.email,
      telefone: dadosCadastro.telefone,
      senha: dadosCadastro.senha,
      especialidades: dadosCadastro.especialidades,
      cpf: dadosCadastro.cpf,
      bio: dadosCadastro.bio,
      disponibilidade,
      criadoEm: new Date().toISOString()
    };

    profissionais.push(novoProfissional);
    localStorage.setItem('profissionais', JSON.stringify(profissionais));

    alert('Cadastro realizado com sucesso! Aguarde aprovação do administrador.');
    setModo('login');
  };

  const sair = () => {
    setProfissionalLogado(null);
    setDadosLogin({ email: '', senha: '' });
  };

  // Se profissional está logado, mostrar dashboard
  if (profissionalLogado) {
    return (
      <div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 mb-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-white/70 text-sm">Profissional</p>
              <p className="text-white font-semibold">{profissionalLogado.nome}</p>
            </div>
            <button
              onClick={sair}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
        <ProfissionalDashboardPage profissional={profissionalLogado} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💼 AgendaSalão</h1>
          <p className="text-white/70">Portal do Profissional</p>
        </div>

        {/* Card de Login/Cadastro */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setModo('login')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                modo === 'login'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setModo('cadastro')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                modo === 'cadastro'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Formulário de Login */}
          {modo === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    value={dadosLogin.email}
                    onChange={(e) => setDadosLogin({ ...dadosLogin, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={dadosLogin.senha}
                    onChange={(e) => setDadosLogin({ ...dadosLogin, senha: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-3 text-white"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={fazerLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Entrar
              </button>
            </div>
          )}

          {/* Formulário de Cadastro */}
          {modo === 'cadastro' && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="text"
                      value={dadosCadastro.nome}
                      onChange={(e) =>
                        setDadosCadastro({ ...dadosCadastro, nome: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="email"
                      value={dadosCadastro.email}
                      onChange={(e) =>
                        setDadosCadastro({ ...dadosCadastro, email: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Telefone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="tel"
                      value={dadosCadastro.telefone}
                      onChange={(e) =>
                        setDadosCadastro({ ...dadosCadastro, telefone: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">CPF (opcional)</label>
                  <input
                    type="text"
                    value={dadosCadastro.cpf}
                    onChange={(e) =>
                      setDadosCadastro({ ...dadosCadastro, cpf: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Especialidades * (selecione pelo menos uma)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {especialidadesDisponiveis.map((esp) => (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => toggleEspecialidade(esp)}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                        dadosCadastro.especialidades.includes(esp)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {esp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Sobre você (opcional)</label>
                <textarea
                  value={dadosCadastro.bio}
                  onChange={(e) =>
                    setDadosCadastro({ ...dadosCadastro, bio: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                  rows={3}
                  placeholder="Conte um pouco sobre sua experiência..."
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-3">Disponibilidade * (marque os dias que trabalha)</label>
                <div className="space-y-3">
                  {Object.entries(dadosCadastro.disponibilidade).map(([dia, config]) => (
                    <div key={dia} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <label className="flex items-center gap-2 min-w-[100px]">
                          <input
                            type="checkbox"
                            checked={config.ativo}
                            onChange={(e) =>
                              setDadosCadastro({
                                ...dadosCadastro,
                                disponibilidade: {
                                  ...dadosCadastro.disponibilidade,
                                  [dia]: { ...config, ativo: e.target.checked }
                                }
                              })
                            }
                            className="w-5 h-5"
                          />
                          <span className="text-white capitalize">{dia}</span>
                        </label>

                        {config.ativo && (
                          <>
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={config.inicio}
                                onChange={(e) =>
                                  setDadosCadastro({
                                    ...dadosCadastro,
                                    disponibilidade: {
                                      ...dadosCadastro.disponibilidade,
                                      [dia]: { ...config, inicio: e.target.value }
                                    }
                                  })
                                }
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                              />
                              <span className="text-white/50">até</span>
                              <input
                                type="time"
                                value={config.fim}
                                onChange={(e) =>
                                  setDadosCadastro({
                                    ...dadosCadastro,
                                    disponibilidade: {
                                      ...dadosCadastro.disponibilidade,
                                      [dia]: { ...config, fim: e.target.value }
                                    }
                                  })
                                }
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={dadosCadastro.senha}
                      onChange={(e) =>
                        setDadosCadastro({ ...dadosCadastro, senha: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-3 text-white"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Confirmar Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={dadosCadastro.confirmarSenha}
                      onChange={(e) =>
                        setDadosCadastro({ ...dadosCadastro, confirmarSenha: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white"
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={fazerCadastro}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
