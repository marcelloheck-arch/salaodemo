import { useState, useEffect } from 'react';

interface PythonSystemStatus {
  sistema: string;
  porta: number;
  status: 'online' | 'offline' | 'loading';
  resposta_ms?: number;
  ultima_verificacao: string;
}

interface DashboardPythonProps {
  className?: string;
}

export default function DashboardPython({ className = '' }: DashboardPythonProps) {
  const [sistemas, setSistemas] = useState<PythonSystemStatus[]>([
    { sistema: 'Caixa', porta: 8002, status: 'loading', ultima_verificacao: '' },
    { sistema: 'Analytics', porta: 8000, status: 'loading', ultima_verificacao: '' },
    { sistema: 'Relatórios', porta: 8003, status: 'loading', ultima_verificacao: '' },
    { sistema: 'Machine Learning', porta: 8004, status: 'loading', ultima_verificacao: '' },
    { sistema: 'Processamento Imagens', porta: 8005, status: 'loading', ultima_verificacao: '' },
    { sistema: 'Big Data', porta: 8006, status: 'loading', ultima_verificacao: '' },
    { sistema: 'Automação', porta: 8007, status: 'loading', ultima_verificacao: '' },
  ]);

  const [estatisticasGerais, setEstatisticasGerais] = useState({
    sistemas_online: 0,
    total_sistemas: 7,
    uptime_medio: '0%',
    ultimo_backup: 'Nunca',
    tarefas_agendadas: 0
  });

  const verificarStatus = async (sistema: PythonSystemStatus) => {
    const inicio = Date.now();
    try {
      const response = await fetch(`http://localhost:${sistema.porta}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      const fim = Date.now();
      const resposta_ms = fim - inicio;
      
      return {
        ...sistema,
        status: response.ok ? 'online' : 'offline',
        resposta_ms,
        ultima_verificacao: new Date().toLocaleTimeString()
      } as PythonSystemStatus;
    } catch (error) {
      return {
        ...sistema,
        status: 'offline',
        ultima_verificacao: new Date().toLocaleTimeString()
      } as PythonSystemStatus;
    }
  };

  const verificarTodosSistemas = async () => {
    const promessas = sistemas.map(sistema => verificarStatus(sistema));
    const resultados = await Promise.all(promessas);
    setSistemas(resultados);

    // Atualizar estatísticas
    const online = resultados.filter(s => s.status === 'online').length;
    const uptime = ((online / resultados.length) * 100).toFixed(1);
    
    setEstatisticasGerais(prev => ({
      ...prev,
      sistemas_online: online,
      uptime_medio: `${uptime}%`
    }));
  };

  const obterEstatisticasAvancadas = async () => {
    try {
      // Buscar estatísticas de automação
      const automacaoResponse = await fetch('http://localhost:8007/automacao/status');
      if (automacaoResponse.ok) {
        const automacaoData = await automacaoResponse.json();
        setEstatisticasGerais(prev => ({
          ...prev,
          tarefas_agendadas: automacaoData.total_tarefas || 0
        }));
      }
    } catch (error) {
      console.log('Erro ao buscar estatísticas avançadas:', error);
    }
  };

  useEffect(() => {
    verificarTodosSistemas();
    obterEstatisticasAvancadas();
    
    // Verificar status a cada 30 segundos
    const intervalo = setInterval(() => {
      verificarTodosSistemas();
      obterEstatisticasAvancadas();
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'loading': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'loading': return '🟡';
      default: return '⚪';
    }
  };

  const abrirSistema = (porta: number) => {
    window.open(`http://localhost:${porta}`, '_blank');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🐍 Ecossistema Python
          </h2>
          <p className="text-purple-200">
            Monitoramento em tempo real dos sistemas Python
          </p>
        </div>
        <button
          onClick={verificarTodosSistemas}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          🔄 Atualizar Status
        </button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Sistemas Online</p>
              <p className="text-2xl font-bold text-white">
                {estatisticasGerais.sistemas_online}/{estatisticasGerais.total_sistemas}
              </p>
            </div>
            <div className="text-2xl">🚀</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Uptime Médio</p>
              <p className="text-2xl font-bold text-green-400">
                {estatisticasGerais.uptime_medio}
              </p>
            </div>
            <div className="text-2xl">⚡</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Tarefas Agendadas</p>
              <p className="text-2xl font-bold text-blue-400">
                {estatisticasGerais.tarefas_agendadas}
              </p>
            </div>
            <div className="text-2xl">⏰</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Último Backup</p>
              <p className="text-lg font-bold text-yellow-400">
                Hoje 23:00
              </p>
            </div>
            <div className="text-2xl">💾</div>
          </div>
        </div>
      </div>

      {/* Lista de Sistemas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sistemas.map((sistema, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer"
            onClick={() => sistema.status === 'online' && abrirSistema(sistema.porta)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(sistema.status)}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {sistema.sistema}
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Porta {sistema.porta}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${getStatusColor(sistema.status)}`}>
                  {sistema.status.toUpperCase()}
                </p>
                {sistema.resposta_ms && (
                  <p className="text-gray-300 text-xs">
                    {sistema.resposta_ms}ms
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-purple-200 text-sm">
                Última verificação: {sistema.ultima_verificacao}
              </span>
              {sistema.status === 'online' && (
                <span className="text-green-400 text-sm font-medium">
                  🔗 Clique para abrir
                </span>
              )}
            </div>

            {/* Barra de status */}
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  sistema.status === 'online' 
                    ? 'bg-green-500 w-full' 
                    : sistema.status === 'loading' 
                      ? 'bg-yellow-500 w-1/2' 
                      : 'bg-red-500 w-1/4'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Vantagens Python */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          🐍 Por que Python é Superior
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-purple-300 mb-2">🧮 Cálculos Complexos</h4>
            <p className="text-purple-100 text-sm">
              NumPy e Pandas para operações matemáticas avançadas
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-blue-300 mb-2">🤖 Machine Learning</h4>
            <p className="text-blue-100 text-sm">
              Scikit-learn para recomendações e segmentação
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-green-300 mb-2">🖼️ Processamento Imagens</h4>
            <p className="text-green-100 text-sm">
              OpenCV e Face Recognition para análise avançada
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-yellow-300 mb-2">📊 Big Data</h4>
            <p className="text-yellow-100 text-sm">
              Processamento eficiente de grandes volumes
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-pink-300 mb-2">⏰ Automação</h4>
            <p className="text-pink-100 text-sm">
              APScheduler para tarefas complexas agendadas
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-bold text-indigo-300 mb-2">🔬 Análise Estatística</h4>
            <p className="text-indigo-100 text-sm">
              SciPy para testes e análises avançadas
            </p>
          </div>
        </div>
      </div>

      {/* Integração Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">
          🔄 Status da Integração Frontend ↔ Python
        </h3>
        <div className="space-y-3">
          {sistemas.filter(s => s.status === 'online').map((sistema, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <span className="text-white">
                Frontend → {sistema.sistema} (:{sistema.porta})
              </span>
              <span className="text-green-400 font-bold flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Conectado
              </span>
            </div>
          ))}
          {sistemas.filter(s => s.status !== 'online').length > 0 && (
            <div className="text-yellow-400 text-sm mt-2">
              ⚠️ {sistemas.filter(s => s.status !== 'online').length} sistema(s) offline - algumas funcionalidades podem estar limitadas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}