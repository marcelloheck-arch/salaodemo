/**
 * Página Inicial Pública - Landing Page
 * Porta de entrada para Clientes, Profissionais e Administração
 */

'use client';
import React, { useState } from 'react';
import { User, Scissors, Shield, Calendar, Phone, MapPin, Clock, Star, QrCode, Share2 } from 'lucide-react';

interface PublicLandingPageProps {
  onNavigateToCliente: () => void;
  onNavigateToProfissional: () => void;
  onNavigateToAdmin: () => void;
}

export default function PublicLandingPage({
  onNavigateToCliente,
  onNavigateToProfissional,
  onNavigateToAdmin
}: PublicLandingPageProps) {
  const [showQRCodes, setShowQRCodes] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // URLs dos portais (ajustar conforme domínio real)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const portalLinks = {
    cliente: `${baseUrl}/cliente`,
    profissional: `${baseUrl}/profissional`,
    admin: `${baseUrl}/admin`
  };

  const handleCopyLink = (tipo: 'cliente' | 'profissional' | 'admin') => {
    const link = portalLinks[tipo];
    navigator.clipboard.writeText(link);
    setCopiedLink(tipo);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Dados do salão (podem vir de configurações)
  const salaoInfo = {
    nome: "Salão de Beleza Exemplo",
    telefone: "(11) 98765-4321",
    endereco: "Rua Exemplo, 123 - Centro, São Paulo - SP",
    horario: "Seg-Sex: 09:00-19:00 | Sáb: 09:00-18:00",
    avaliacoes: 4.8,
    totalAvaliacoes: 127
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header com Info do Salão */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {salaoInfo.nome}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-semibold">{salaoInfo.avaliacoes}</span>
                </div>
                <span className="text-sm text-gray-600">({salaoInfo.totalAvaliacoes} avaliações)</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowQRCodes(!showQRCodes)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <QrCode className="w-5 h-5" />
              <span className="hidden sm:inline">QR Codes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Bem-vindo ao nosso espaço! 💇‍♀️✨
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Agende seus serviços de forma rápida e prática. 
            Escolha sua opção de acesso abaixo:
          </p>
        </div>

        {/* Botões Principais de Acesso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Portal Cliente */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Sou Cliente</h3>
                <p className="text-gray-600">
                  Agende seus serviços, veja horários disponíveis e gerencie seus agendamentos
                </p>
                <button
                  onClick={onNavigateToCliente}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Acessar Portal
                </button>
                <button
                  onClick={() => handleCopyLink('cliente')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink === 'cliente' ? '✓ Link copiado!' : 'Copiar link'}
                </button>
              </div>
            </div>
          </div>

          {/* Portal Profissional */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <Scissors className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Sou Profissional</h3>
                <p className="text-gray-600">
                  Acesse sua agenda, veja seus agendamentos e gerencie seu dia de trabalho
                </p>
                <button
                  onClick={onNavigateToProfissional}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Acessar Dashboard
                </button>
                <button
                  onClick={() => handleCopyLink('profissional')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink === 'profissional' ? '✓ Link copiado!' : 'Copiar link'}
                </button>
              </div>
            </div>
          </div>

          {/* Portal Admin */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Administração</h3>
                <p className="text-gray-600">
                  Área restrita para gestão do salão, configurações e relatórios
                </p>
                <button
                  onClick={onNavigateToAdmin}
                  className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login Admin
                </button>
                <button
                  onClick={() => handleCopyLink('admin')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink === 'admin' ? '✓ Link copiado!' : 'Copiar link'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Codes Modal */}
        {showQRCodes && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">QR Codes dos Portais</h3>
                <button
                  onClick={() => setShowQRCodes(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* QR Code Cliente */}
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                    <div className="bg-white p-4 rounded-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(portalLinks.cliente)}`}
                        alt="QR Code Portal Cliente"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Portal Cliente</h4>
                    <p className="text-sm text-gray-600">Agendamento online</p>
                  </div>
                </div>

                {/* QR Code Profissional */}
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl">
                    <div className="bg-white p-4 rounded-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(portalLinks.profissional)}`}
                        alt="QR Code Portal Profissional"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Portal Profissional</h4>
                    <p className="text-sm text-gray-600">Área do colaborador</p>
                  </div>
                </div>

                {/* QR Code Admin */}
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-xl">
                    <div className="bg-white p-4 rounded-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(portalLinks.admin)}`}
                        alt="QR Code Portal Admin"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">Portal Admin</h4>
                    <p className="text-sm text-gray-600">Gestão do salão</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  💡 <strong>Dica:</strong> Imprima esses QR Codes e cole no seu estabelecimento, 
                  ou compartilhe via WhatsApp para facilitar o acesso!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informações do Salão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
            <Phone className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-semibold text-gray-800">{salaoInfo.telefone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
            <MapPin className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Endereço</p>
              <p className="font-semibold text-gray-800 text-sm">{salaoInfo.endereco}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
            <Clock className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Horário</p>
              <p className="font-semibold text-gray-800 text-sm">{salaoInfo.horario}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2025 {salaoInfo.nome}. Sistema de Gerenciamento AgendaSalão.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
