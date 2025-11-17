"use client";

/**
 * SISTEMA DE LIMPEZA COMPLETA
 * ============================
 * 
 * Remove TODOS os dados fictícios e cadastros de teste do sistema
 * Deixa o sistema limpo para uso em produção
 */

import React, { useState } from 'react';
import { Trash2, AlertTriangle, CheckCircle, Database, RefreshCw } from 'lucide-react';

export default function SystemCleanup() {
  const [isClearing, setIsClearing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getAllLocalStorageKeys = (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  };

  const clearAllData = () => {
    setIsClearing(true);
    
    // Lista de todas as chaves do localStorage usadas no sistema
    const keysToRemove = [
      // Dados do sistema
      'agendamentos',
      'clientes',
      'servicos',
      'profissionais',
      'funcionarios',
      'produtos',
      'caixa_transactions',
      'config_horarios',
      'config_funcionamento',
      
      // Dados de usuários/sessão (mantém apenas configurações essenciais)
      'agenda_salao_user',
      'agenda_salao_config',
      
      // Dados temporários
      'lastAgendamento',
      'tempData',
      'cache',
    ];

    console.log('🧹 INICIANDO LIMPEZA COMPLETA DO SISTEMA');
    console.log('📋 Chaves antes da limpeza:', getAllLocalStorageKeys());

    // Remover todas as chaves identificadas
    let removedCount = 0;
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        removedCount++;
        console.log(`✅ Removido: ${key}`);
      }
    });

    // Limpar também sessionStorage (sessões ativas)
    const sessionKeys = ['authSession', 'authUser', 'userData', 'isAuthenticated'];
    sessionKeys.forEach(key => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        console.log(`✅ Sessão removida: ${key}`);
      }
    });

    console.log(`✅ LIMPEZA CONCLUÍDA: ${removedCount} chaves removidas`);
    console.log('📋 Chaves após a limpeza:', getAllLocalStorageKeys());

    setTimeout(() => {
      setIsClearing(false);
      setCleared(true);
      setShowConfirmation(false);
    }, 1500);
  };

  const reloadSystem = () => {
    console.log('🔄 Recarregando sistema...');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🧹 Limpeza Completa do Sistema
              </h1>
              <p className="text-gray-600 mt-1">
                Remover todos os dados fictícios e cadastros de teste
              </p>
            </div>
          </div>
        </div>

        {/* Aviso de Alerta */}
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-2">
                ⚠️ ATENÇÃO - Operação Irreversível
              </h2>
              <p className="text-red-800 mb-4">
                Esta ação irá remover permanentemente TODOS os dados do sistema:
              </p>
              <ul className="space-y-2 text-red-800">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>Todos os agendamentos</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>Todos os clientes cadastrados</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>Todos os serviços e produtos</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>Todos os profissionais/funcionários</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>Todas as transações do caixa</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>Configurações de horários e funcionamento</span>
                </li>
              </ul>
              <p className="text-red-900 font-bold mt-4">
                ⚠️ Após a limpeza, o sistema voltará para o estado inicial limpo
              </p>
            </div>
          </div>
        </div>

        {/* Área de Confirmação */}
        {!cleared && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {!showConfirmation ? (
              <div className="text-center">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Trash2 className="w-6 h-6 inline mr-2" />
                  Iniciar Limpeza Completa
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    Você tem certeza absoluta?
                  </p>
                  <p className="text-gray-600 mb-6">
                    Esta operação não pode ser desfeita. Todos os dados serão permanentemente removidos.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isClearing}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    ❌ Cancelar
                  </button>
                  <button
                    onClick={clearAllData}
                    disabled={isClearing}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearing ? (
                      <>
                        <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                        Limpando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5 inline mr-2" />
                        ✅ SIM, Limpar Tudo
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensagem de Sucesso */}
        {cleared && (
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              ✅ Limpeza Concluída com Sucesso!
            </h2>
            <p className="text-green-800 mb-6">
              Todos os dados fictícios foram removidos. O sistema está pronto para uso em produção.
            </p>
            <button
              onClick={reloadSystem}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RefreshCw className="w-6 h-6 inline mr-2" />
              🔄 Recarregar Sistema
            </button>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5" />
            ℹ️ O que acontece após a limpeza?
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Você será deslogado automaticamente (precisará fazer login novamente)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Todos os menus estarão vazios (sem clientes, serviços, agendamentos, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Você poderá começar a cadastrar dados reais do seu salão</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>O sistema manterá todas as funcionalidades intactas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
