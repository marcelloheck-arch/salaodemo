/**
 * WhatsApp Real Connection Component
 * Conexão real com WhatsApp via whatsapp-web.js
 */

'use client';
import React, { useState, useEffect } from 'react';
import { Smartphone, Power, QrCode, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import QRCodeReact from 'qrcode';

interface WhatsAppRealProps {
  onMessageReceived?: (from: string, message: string) => void;
  onConnected?: (phoneNumber: string) => void;
  onDisconnected?: () => void;
}

export default function WhatsAppReal({
  onMessageReceived,
  onConnected,
  onDisconnected
}: WhatsAppRealProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Clique em "Conectar" para iniciar');

  /**
   * Verificar status da conexão
   */
  const checkStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp?action=status');
      const data = await response.json();

      console.log('📊 Status recebido:', data);

      setIsConnected(data.connected);
      setPhoneNumber(data.phoneNumber || null);

      if (data.qrCode && !data.connected) {
        console.log('📱 QR Code recebido, tamanho:', data.qrCode.length);
        // O WPPConnect retorna base64 puro, adicionar prefixo
        const qrDataUrl = data.qrCode.startsWith('data:image')
          ? data.qrCode
          : `data:image/png;base64,${data.qrCode}`;
        
        setQrCodeDataUrl(qrDataUrl);
        setStatusMessage('Escaneie o QR Code com seu WhatsApp');
        setIsConnecting(false);
      } else if (data.connected) {
        setQrCodeDataUrl(null);
        setStatusMessage(`Conectado: ${data.phoneNumber || 'Número desconhecido'}`);
        setIsConnecting(false);
        
        if (onConnected && data.phoneNumber) {
          onConnected(data.phoneNumber);
        }
      }
    } catch (err: any) {
      console.error('Erro ao verificar status:', err);
      setError(err.message);
    }
  };

  /**
   * Conectar WhatsApp
   */
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    setStatusMessage('Conectando ao WhatsApp...');

    try {
      const response = await fetch('/api/whatsapp?action=connect');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Iniciar polling do status
      const intervalId = setInterval(checkStatus, 2000);

      // Limpar intervalo após 2 minutos
      setTimeout(() => clearInterval(intervalId), 120000);

      setIsConnecting(false);
    } catch (err: any) {
      console.error('Erro ao conectar:', err);
      setError(err.message);
      setStatusMessage('Erro ao conectar');
      setIsConnecting(false);
    }
  };

  /**
   * Desconectar WhatsApp
   */
  const handleDisconnect = async () => {
    try {
      setStatusMessage('Desconectando...');
      await fetch('/api/whatsapp?action=disconnect');
      
      setIsConnected(false);
      setQrCodeDataUrl(null);
      setPhoneNumber(null);
      setStatusMessage('Desconectado');

      if (onDisconnected) {
        onDisconnected();
      }
    } catch (err: any) {
      console.error('Erro ao desconectar:', err);
      setError(err.message);
    }
  };

  /**
   * Enviar mensagem
   */
  const sendMessage = async (to: string, message: string) => {
    if (!isConnected) {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send',
          to,
          message
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      throw err;
    }
  };

  // Expor função sendMessage para componente pai
  useEffect(() => {
    if (isConnected && typeof window !== 'undefined') {
      (window as any).whatsappSendMessage = sendMessage;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).whatsappSendMessage;
      }
    };
  }, [isConnected]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isConnected ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Smartphone className={`w-6 h-6 ${
              isConnected ? 'text-green-600' : 'text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Conexão WhatsApp Real
            </h3>
            <p className="text-sm text-gray-600">{statusMessage}</p>
          </div>
        </div>

        {isConnected ? (
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Power className="w-4 h-4" />
            Desconectar
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Conectar
              </>
            )}
          </button>
        )}
      </div>

      {/* Status Visual */}
      <div className="mb-4">
        {isConnected && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">
              Conectado: {phoneNumber || 'Número desconhecido'}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {isConnecting && !qrCodeDataUrl && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-blue-700">Iniciando conexão...</span>
          </div>
        )}
      </div>

      {/* QR Code */}
      {qrCodeDataUrl && !isConnected && (
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl inline-block">
            <div className="bg-white p-4 rounded-lg">
              <img
                src={qrCodeDataUrl}
                alt="QR Code WhatsApp"
                className="w-64 h-64 mx-auto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-800">Como conectar:</h4>
            <ol className="text-left text-sm text-gray-600 space-y-2 max-w-md mx-auto">
              <li>1. Abra o WhatsApp no seu celular</li>
              <li>2. Toque em <strong>Menu</strong> ou <strong>Configurações</strong></li>
              <li>3. Selecione <strong>Aparelhos conectados</strong></li>
              <li>4. Toque em <strong>Conectar um aparelho</strong></li>
              <li>5. Aponte a câmera para este QR Code</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 justify-center text-yellow-600 text-sm">
            <QrCode className="w-4 h-4" />
            QR Code expira em 60 segundos
          </div>
        </div>
      )}

      {/* Informações quando conectado */}
      {isConnected && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-gray-700">✅ Tudo pronto!</h4>
          <p className="text-sm text-gray-600">
            Seu WhatsApp está conectado e pronto para receber e enviar mensagens automaticamente.
          </p>
          <p className="text-xs text-gray-500">
            💡 As mensagens recebidas serão processadas pela IA automaticamente.
          </p>
        </div>
      )}
    </div>
  );
}
