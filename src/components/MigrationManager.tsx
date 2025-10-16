'use client';

import React, { useState, useEffect } from 'react';
import { Database, Upload, Download, CheckCircle, AlertTriangle, RotateCcw, HardDrive, Cloud, ArrowRight } from 'lucide-react';
import MigrationService, { MigrationProgress } from '@/services/MigrationService';

const MigrationManager: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'not-started' | 'in-progress' | 'completed' | 'error'>('not-started');
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [isMigrationCompleted, setIsMigrationCompleted] = useState(false);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);
  const [localDataStats, setLocalDataStats] = useState({
    clientes: 0,
    agendamentos: 0,
    servicos: 0,
    saloes: 0,
    transacoes: 0
  });

  useEffect(() => {
    checkMigrationStatus();
    loadLocalDataStats();
  }, []);

  const checkMigrationStatus = () => {
    const completed = MigrationService.isMigrationCompleted();
    const usingSupabase = MigrationService.shouldUseSupabase();
    
    setIsMigrationCompleted(completed);
    setIsUsingSupabase(usingSupabase);
    
    if (completed) {
      setMigrationStatus('completed');
    }
  };

  const loadLocalDataStats = () => {
    try {
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const transacoes = JSON.parse(localStorage.getItem('transacoes') || '[]');

      setLocalDataStats({
        clientes: clientes.length,
        agendamentos: agendamentos.length,
        servicos: servicos.length,
        saloes: saloes.length,
        transacoes: transacoes.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleMigration = async () => {
    setMigrationStatus('in-progress');
    
    const migrationService = new MigrationService((progressData) => {
      setProgress(progressData);
    });

    try {
      const result = await migrationService.executeMigration();
      
      if (result.success) {
        setMigrationStatus('completed');
        setIsMigrationCompleted(true);
        setIsUsingSupabase(true);
      } else {
        setMigrationStatus('error');
        console.error('Erros na migração:', result.errors);
      }
    } catch (error) {
      setMigrationStatus('error');
      console.error('Erro na migração:', error);
    }
  };

  const handleRollback = async () => {
    if (!confirm('Tem certeza que deseja reverter para o localStorage? Isso irá descartar a sincronização com Supabase.')) {
      return;
    }

    const migrationService = new MigrationService();
    const result = await migrationService.rollbackMigration();
    
    if (result.success) {
      setIsMigrationCompleted(false);
      setIsUsingSupabase(false);
      setMigrationStatus('not-started');
      alert('Rollback realizado com sucesso!');
      window.location.reload();
    } else {
      alert('Erro no rollback: ' + result.errors.join(', '));
    }
  };

  const handleSync = async () => {
    const migrationService = new MigrationService();
    const result = await migrationService.syncWithSupabase();
    
    if (result.success) {
      alert('Sincronização realizada com sucesso!');
      loadLocalDataStats();
    } else {
      alert('Erro na sincronização: ' + result.errors.join(', '));
    }
  };

  const getStepIcon = (step: string, currentStep: string) => {
    if (progress && progress.step === step) {
      return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
    } else if (progress && getStepOrder(step) < getStepOrder(progress.step)) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else {
      return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStepOrder = (step: string): number => {
    const steps = ['backup', 'upload', 'verify', 'cleanup', 'complete'];
    return steps.indexOf(step);
  };

  const getTotalItems = () => {
    return Object.values(localDataStats).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Migração para Supabase</h2>
          <p className="text-gray-600">Migre seus dados do localStorage para banco de dados na nuvem</p>
        </div>
      </div>

      {/* Status Atual */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Atual do Sistema</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              !isUsingSupabase ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <HardDrive className={`w-6 h-6 ${
                !isUsingSupabase ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Armazenamento Local</h4>
              <p className="text-sm text-gray-600">
                {!isUsingSupabase ? '✅ Ativo' : '⚪ Backup apenas'} • {getTotalItems()} registros
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isUsingSupabase ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Cloud className={`w-6 h-6 ${
                isUsingSupabase ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Supabase (Nuvem)</h4>
              <p className="text-sm text-gray-600">
                {isUsingSupabase ? '✅ Ativo e Sincronizado' : '❌ Não configurado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dados Locais */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados Disponíveis para Migração</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(localDataStats).map(([type, count]) => (
            <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{type}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Sobre a Migração</h4>
              <p className="text-sm text-blue-700 mt-1">
                A migração transfere todos os seus dados para o Supabase (PostgreSQL), mantendo um backup local por segurança. 
                Após a migração, o sistema funcionará com sincronização automática e backup na nuvem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progresso da Migração */}
      {migrationStatus === 'in-progress' && progress && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Progresso da Migração</h3>
          
          <div className="space-y-4">
            {/* Barra de Progresso */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{progress.message}</span>
                <span>{progress.processedItems}/{progress.totalItems}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>

            {/* Etapas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { id: 'backup', label: 'Backup' },
                { id: 'upload', label: 'Upload' },
                { id: 'verify', label: 'Verificação' },
                { id: 'cleanup', label: 'Configuração' },
                { id: 'complete', label: 'Finalização' }
              ].map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                  {getStepIcon(step.id, progress.step)}
                  <span className={`text-sm ${
                    progress.step === step.id ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Erros */}
            {progress.errors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Avisos durante a migração:</h4>
                    <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                      {progress.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Disponíveis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Iniciar Migração */}
          {!isMigrationCompleted && migrationStatus !== 'in-progress' && (
            <button
              onClick={handleMigration}
              disabled={getTotalItems() === 0}
              className="flex items-center gap-3 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">Iniciar Migração</h4>
                <p className="text-sm text-gray-600">Migrar dados para Supabase</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 ml-auto" />
            </button>
          )}

          {/* Sincronizar */}
          {isMigrationCompleted && (
            <button
              onClick={handleSync}
              className="flex items-center gap-3 p-4 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">Sincronizar</h4>
                <p className="text-sm text-gray-600">Atualizar dados locais</p>
              </div>
            </button>
          )}

          {/* Rollback */}
          {isMigrationCompleted && (
            <button
              onClick={handleRollback}
              className="flex items-center gap-3 p-4 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">Reverter</h4>
                <p className="text-sm text-gray-600">Voltar para localStorage</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Status Final */}
      {migrationStatus === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Migração Concluída com Sucesso!</h3>
              <p className="text-green-700 mt-1">
                Seus dados foram migrados para o Supabase e estão sincronizados. O sistema agora opera com backup na nuvem 
                e sincronização automática. Seus dados locais foram preservados como backup de segurança.
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="font-bold text-green-800">✅ Backup</p>
                  <p className="text-sm text-green-600">Dados preservados</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="font-bold text-green-800">☁️ Nuvem</p>
                  <p className="text-sm text-green-600">Sincronizado</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="font-bold text-green-800">🔄 Tempo Real</p>
                  <p className="text-sm text-green-600">Atualizações automáticas</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="font-bold text-green-800">🛡️ Segurança</p>
                  <p className="text-sm text-green-600">Dados protegidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status de Erro */}
      {migrationStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Erro na Migração</h3>
              <p className="text-red-700 mt-1">
                Ocorreu um erro durante a migração. Seus dados locais estão seguros. 
                Tente novamente ou entre em contato com o suporte.
              </p>
              {progress?.errors && progress.errors.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-red-800">Detalhes dos erros:</h4>
                  <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                    {progress.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MigrationManager;