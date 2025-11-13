/**
 * Página de Cadastro e Login de Clientes
 */

'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Calendar, Eye, EyeOff } from 'lucide-react';
import ClientePortalPage from './ClientePortalPage';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  dataNascimento?: string;
  cpf?: string;
  endereco?: string;
  observacoes?: string;
  criadoEm: string;
}

export default function ClienteAuthPage() {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [clienteLogado, setClienteLogado] = useState<Cliente | null>(null);
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
    dataNascimento: '',
    cpf: '',
    endereco: '',
    observacoes: ''
  });

  const fazerLogin = () => {
    if (!dadosLogin.email || !dadosLogin.senha) {
      alert('Preencha email e senha');
      return;
    }

    // Buscar cliente no localStorage
    const clientes: Cliente[] = JSON.parse(localStorage.getItem('clientes') || '[]');
    const cliente = clientes.find(
      c => c.email === dadosLogin.email && c.senha === dadosLogin.senha
    );

    if (!cliente) {
      alert('Email ou senha incorretos');
      return;
    }

    setClienteLogado(cliente);
  };

  const fazerCadastro = () => {
    // Validações
    if (!dadosCadastro.nome || !dadosCadastro.email || !dadosCadastro.telefone || !dadosCadastro.senha) {
      alert('Preencha todos os campos obrigatórios (nome, email, telefone e senha)');
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
    const clientes: Cliente[] = JSON.parse(localStorage.getItem('clientes') || '[]');
    if (clientes.some(c => c.email === dadosCadastro.email)) {
      alert('Este email já está cadastrado');
      return;
    }

    // Criar novo cliente
    const novoCliente: Cliente = {
      id: Date.now().toString(),
      nome: dadosCadastro.nome,
      email: dadosCadastro.email,
      telefone: dadosCadastro.telefone,
      senha: dadosCadastro.senha,
      dataNascimento: dadosCadastro.dataNascimento,
      cpf: dadosCadastro.cpf,
      endereco: dadosCadastro.endereco,
      observacoes: dadosCadastro.observacoes,
      criadoEm: new Date().toISOString()
    };

    clientes.push(novoCliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));

    alert('Cadastro realizado com sucesso!');
    setClienteLogado(novoCliente);
  };

  const sair = () => {
    setClienteLogado(null);
    setDadosLogin({ email: '', senha: '' });
  };

  // Se cliente está logado, mostrar portal
  if (clienteLogado) {
    return (
      <div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 mb-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-white/70 text-sm">Bem-vindo(a),</p>
              <p className="text-white font-semibold">{clienteLogado.nome}</p>
            </div>
            <button
              onClick={sair}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
        <ClientePortalPage clienteId={clienteLogado.id} clienteNome={clienteLogado.nome} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">✨ AgendaSalão</h1>
          <p className="text-white/70">Portal do Cliente</p>
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
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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

              <div>
                <label className="block text-white/70 text-sm mb-2">Data de Nascimento (opcional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="date"
                    value={dadosCadastro.dataNascimento}
                    onChange={(e) =>
                      setDadosCadastro({ ...dadosCadastro, dataNascimento: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Endereço (opcional)</label>
                <textarea
                  value={dadosCadastro.endereco}
                  onChange={(e) =>
                    setDadosCadastro({ ...dadosCadastro, endereco: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                  rows={2}
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

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

              <div>
                <label className="block text-white/70 text-sm mb-2">Observações (opcional)</label>
                <textarea
                  value={dadosCadastro.observacoes}
                  onChange={(e) =>
                    setDadosCadastro({ ...dadosCadastro, observacoes: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                  rows={2}
                  placeholder="Preferências, alergias, etc."
                />
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
