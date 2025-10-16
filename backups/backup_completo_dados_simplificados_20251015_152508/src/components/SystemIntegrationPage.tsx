import { useState, useEffect } from 'react';
import DashboardPython from './DashboardPython';

interface MLRecomendacao {
  servico_id: string;
  nome: string;
  categoria: string;
  preco: number;
  score_recomendacao: number;
  confianca: string;
}

interface SegmentoCliente {
  quantidade_clientes: number;
  perfil: {
    idade_media: number;
    gasto_medio: number;
    frequencia_media: number;
    valor_total_medio: number;
    sexo_predominante: string;
    renda_predominante: string;
  };
  caracteristicas: string[];
  recomendacoes_marketing: string[];
}

interface ImagemAnalise {
  dimensoes: {
    largura: number;
    altura: number;
    formato: string;
    tamanho_bytes: number;
  };
  qualidade?: {
    qualidade_geral: {
      score: number;
      categoria: string;
    };
    recomendacoes: string[];
  };
  cores?: {
    cores_dominantes: Array<{
      hex: string;
      porcentagem: number;
      nome_aproximado: string;
    }>;
  };
  faces?: {
    quantidade: number;
    recomendacoes: string[];
  };
}

export default function SystemIntegrationPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recomendacoesML, setRecomendacoesML] = useState<MLRecomendacao[]>([]);
  const [segmentosClientes, setSegmentosClientes] = useState<Record<string, SegmentoCliente>>({});
  const [imagemAnalise, setImagemAnalise] = useState<ImagemAnalise | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Funções de integração com ML
  const buscarRecomendacoesML = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8004/ml/recomendacoes/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: 'cli_001',
          tipo: 'servico',
          limite: 5
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecomendacoesML(data.recomendacoes || []);
      }
    } catch (error) {
      console.error('Erro ao buscar recomendações ML:', error);
    }
    setLoading(false);
  };

  const buscarSegmentacao = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8004/ml/segmentacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criterios: ['valor', 'frequencia', 'preferencias'],
          num_segmentos: 4
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSegmentosClientes(data.segmentacao || {});
      }
    } catch (error) {
      console.error('Erro ao buscar segmentação:', error);
    }
    setLoading(false);
  };

  // Funções de processamento de imagens
  const analisarImagem = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('http://localhost:8005/imagens/analisar', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setImagemAnalise(data.analise || null);
      }
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
    }
    setLoading(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagemAnalise(null);
    }
  };

  const tabs = [
    { id: 'dashboard', label: '🐍 Dashboard Python', icon: '📊' },
    { id: 'ml', label: '🤖 Machine Learning', icon: '🧠' },
    { id: 'images', label: '🖼️ Proc. Imagens', icon: '📸' },
    { id: 'data', label: '📊 Big Data', icon: '🗄️' },
    { id: 'automation', label: '⏰ Automação', icon: '🔄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🔗 Integração Frontend ↔ Python Ecosystem
          </h1>
          <p className="text-purple-200">
            Demonstração em tempo real da superioridade do Python em áreas específicas
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          {activeTab === 'dashboard' && (
            <DashboardPython />
          )}

          {activeTab === 'ml' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                🤖 Machine Learning & Recomendações
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recomendações */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      🎯 Recomendações Inteligentes
                    </h3>
                    <button
                      onClick={buscarRecomendacoesML}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                    >
                      {loading ? '🔄' : '🚀'} Gerar Recomendações
                    </button>
                  </div>
                  
                  {recomendacoesML.length > 0 ? (
                    <div className="space-y-3">
                      {recomendacoesML.map((rec, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-white">{rec.nome}</h4>
                              <p className="text-purple-200 text-sm">{rec.categoria}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-bold">R$ {rec.preco}</p>
                              <p className={`text-xs ${
                                rec.confianca === 'alta' ? 'text-green-400' : 
                                rec.confianca === 'media' ? 'text-yellow-400' : 'text-orange-400'
                              }`}>
                                {rec.confianca} confiança
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${(rec.score_recomendacao / 20) * 100}%` }}
                            />
                          </div>
                          <p className="text-purple-100 text-xs mt-1">
                            Score: {rec.score_recomendacao.toFixed(1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-purple-300">
                      <p>🤖 Clique para gerar recomendações com IA</p>
                    </div>
                  )}
                </div>

                {/* Segmentação */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      🎭 Segmentação de Clientes
                    </h3>
                    <button
                      onClick={buscarSegmentacao}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                    >
                      {loading ? '🔄' : '🧮'} Executar ML
                    </button>
                  </div>
                  
                  {Object.keys(segmentosClientes).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(segmentosClientes).map(([segmento, dados], index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-bold text-white mb-2">
                            {segmento.replace('_', ' ').toUpperCase()}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-purple-200">Clientes: {dados.quantidade_clientes}</p>
                              <p className="text-purple-200">Idade média: {dados.perfil.idade_media} anos</p>
                              <p className="text-purple-200">Gasto médio: R$ {dados.perfil.gasto_medio.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-purple-200">Frequência: {dados.perfil.frequencia_media.toFixed(1)}/mês</p>
                              <p className="text-purple-200">Sexo: {dados.perfil.sexo_predominante}</p>
                              <p className="text-purple-200">Renda: {dados.perfil.renda_predominante}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-purple-300 mb-1">Características:</p>
                            <div className="flex flex-wrap gap-1">
                              {dados.caracteristicas.map((car, i) => (
                                <span key={i} className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                  {car}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-purple-300">
                      <p>🎭 Clique para segmentar clientes com K-means</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                🖼️ Processamento Avançado de Imagens
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload e Controles */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">
                    📤 Upload de Imagem
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-purple-400 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <div className="text-4xl">📁</div>
                        <p className="text-white">
                          {selectedFile ? selectedFile.name : 'Clique para selecionar imagem'}
                        </p>
                        <p className="text-purple-300 text-sm">
                          Suporta: JPG, PNG, BMP, TIFF
                        </p>
                      </label>
                    </div>
                    
                    <button
                      onClick={analisarImagem}
                      disabled={!selectedFile || loading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
                    >
                      {loading ? '🔄 Processando...' : '🔬 Analisar com OpenCV'}
                    </button>
                  </div>
                </div>

                {/* Resultados da Análise */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">
                    📊 Análise de Imagem
                  </h3>
                  
                  {imagemAnalise ? (
                    <div className="space-y-4">
                      {/* Informações básicas */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-bold text-purple-300 mb-2">📐 Dimensões</h4>
                        <p className="text-white text-sm">
                          {imagemAnalise.dimensoes.largura} x {imagemAnalise.dimensoes.altura} px
                        </p>
                        <p className="text-purple-200 text-sm">
                          Formato: {imagemAnalise.dimensoes.formato} • 
                          Tamanho: {(imagemAnalise.dimensoes.tamanho_bytes / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      {/* Qualidade */}
                      {imagemAnalise.qualidade && (
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-bold text-green-300 mb-2">⭐ Qualidade</h4>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex-1 bg-gray-700 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full"
                                style={{ width: `${imagemAnalise.qualidade.qualidade_geral.score}%` }}
                              />
                            </div>
                            <span className="text-white font-bold">
                              {imagemAnalise.qualidade.qualidade_geral.score.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-purple-200 text-sm mb-2">
                            Categoria: {imagemAnalise.qualidade.qualidade_geral.categoria}
                          </p>
                          <div className="space-y-1">
                            {imagemAnalise.qualidade.recomendacoes.map((rec, i) => (
                              <p key={i} className="text-yellow-300 text-xs">• {rec}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cores */}
                      {imagemAnalise.cores && (
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-bold text-pink-300 mb-2">🎨 Cores Dominantes</h4>
                          <div className="space-y-2">
                            {imagemAnalise.cores.cores_dominantes.slice(0, 3).map((cor, i) => (
                              <div key={i} className="flex items-center space-x-3">
                                <div
                                  className="w-6 h-6 rounded-full border border-white/30"
                                  style={{ backgroundColor: cor.hex }}
                                />
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">
                                    {cor.nome_aproximado}
                                  </p>
                                  <p className="text-purple-200 text-xs">
                                    {cor.hex} • {cor.porcentagem.toFixed(1)}%
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Faces */}
                      {imagemAnalise.faces && (
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-bold text-blue-300 mb-2">👤 Detecção de Faces</h4>
                          <p className="text-white mb-2">
                            {imagemAnalise.faces.quantidade} face(s) detectada(s)
                          </p>
                          <div className="space-y-1">
                            {imagemAnalise.faces.recomendacoes.map((rec, i) => (
                              <p key={i} className="text-blue-200 text-xs">• {rec}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-purple-300">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p>Selecione uma imagem para análise avançada</p>
                      <p className="text-sm mt-2">
                        OpenCV • Face Recognition • Análise de cores • Qualidade
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                📊 Big Data & Processamento
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">🗄️ Pandas Power</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Processamento:</span>
                      <span className="text-green-400">10x mais rápido</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Memória:</span>
                      <span className="text-blue-400">50% menos uso</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Operações:</span>
                      <span className="text-yellow-400">Vetorizadas</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">🧮 NumPy Speed</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Cálculos:</span>
                      <span className="text-green-400">C optimized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Arrays:</span>
                      <span className="text-blue-400">N-dimensionais</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Performance:</span>
                      <span className="text-yellow-400">100x JS</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">🔬 SciPy Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Testes:</span>
                      <span className="text-green-400">Estatísticos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Algoritmos:</span>
                      <span className="text-blue-400">Científicos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Precisão:</span>
                      <span className="text-yellow-400">Acadêmica</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">
                  🚀 Capacidades Python vs JavaScript
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-green-400 mb-3">✅ Python Superior Em:</h4>
                    <ul className="space-y-2 text-sm text-purple-100">
                      <li>• Manipulação de DataFrames (Pandas)</li>
                      <li>• Operações matriciais (NumPy)</li>
                      <li>• Análise estatística (SciPy)</li>
                      <li>• Machine Learning (Scikit-learn)</li>
                      <li>• Processamento de imagens (OpenCV)</li>
                      <li>• Big Data (Dask, Vaex)</li>
                      <li>• Científico/Matemático</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-400 mb-3">⚡ JavaScript Superior Em:</h4>
                    <ul className="space-y-2 text-sm text-blue-100">
                      <li>• Interfaces de usuário (React)</li>
                      <li>• Interatividade web</li>
                      <li>• Real-time (WebSockets)</li>
                      <li>• Animações (CSS/JS)</li>
                      <li>• DOM manipulation</li>
                      <li>• Event handling</li>
                      <li>• Frontend performance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                ⏰ Sistema de Automação Inteligente
              </h2>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">
                  🤖 Tarefas Automáticas Configuradas
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    {
                      nome: 'Backup Diário',
                      horario: 'Todo dia 23:00',
                      status: 'Ativo',
                      proximo: 'Hoje 23:00',
                      icon: '💾'
                    },
                    {
                      nome: 'Relatório Semanal',
                      horario: 'Seg-Sex 08:00',
                      status: 'Ativo',
                      proximo: 'Segunda 08:00',
                      icon: '📊'
                    },
                    {
                      nome: 'Limpeza Cache',
                      horario: 'Domingo 02:00',
                      status: 'Ativo',
                      proximo: 'Dom 02:00',
                      icon: '🧹'
                    },
                    {
                      nome: 'Campanhas Aniversário',
                      horario: 'Todo dia 09:00',
                      status: 'Ativo',
                      proximo: 'Amanhã 09:00',
                      icon: '🎉'
                    },
                    {
                      nome: 'Reativação Clientes',
                      horario: 'Ter/Qui 10:00',
                      status: 'Ativo',
                      proximo: 'Terça 10:00',
                      icon: '📧'
                    },
                    {
                      nome: 'Análise ML',
                      horario: 'Todo dia 06:00',
                      status: 'Ativo',
                      proximo: 'Amanhã 06:00',
                      icon: '🧠'
                    }
                  ].map((tarefa, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{tarefa.icon}</span>
                          <div>
                            <h4 className="font-bold text-white">{tarefa.nome}</h4>
                            <p className="text-purple-200 text-sm">{tarefa.horario}</p>
                          </div>
                        </div>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                          {tarefa.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">
                          Próximo: {tarefa.proximo}
                        </span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-400/30">
                  <h4 className="font-bold text-white mb-2">🚀 Vantagens da Automação Python:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-100">
                    <div>
                      <p>• APScheduler para agendamento robusto</p>
                      <p>• Threading assíncrono para performance</p>
                      <p>• Integração nativa com todos os sistemas</p>
                    </div>
                    <div>
                      <p>• Retry automático e tratamento de erros</p>
                      <p>• Logging e monitoramento avançado</p>
                      <p>• Execução em background sem interferência</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}