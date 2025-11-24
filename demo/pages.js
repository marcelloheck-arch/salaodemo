/**
 * SalaoGerent Demo - Páginas Complementares
 * 
 * Este arquivo contém as renderizações das páginas restantes:
 * - Profissionais
 * - Serviços 
 * - Financeiro
 * - Relatórios
 * - Configurações
 */

// =============================================================================
// RENDERIZAÇÃO - PROFISSIONAIS
// =============================================================================

function renderProfissionais() {
    return `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Profissionais</h2>
                        <p class="text-white/70 text-sm">Gerencie sua equipe e especialidades</p>
                    </div>
                    
                    <button onclick="openModal('novoProfissional')" class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-gray-900 rounded-lg font-medium transition-all">
                        <i data-lucide="user-plus" class="w-4 h-4 inline mr-2"></i>
                        Novo Profissional
                    </button>
                </div>
            </div>
            
            <!-- Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Total</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">${demoData.profissionais.length}</p>
                        </div>
                        <i data-lucide="users" class="w-8 h-8 text-blue-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Ativos</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">${demoData.profissionais.filter(p => p.status === 'ativo').length}</p>
                        </div>
                        <i data-lucide="user-check" class="w-8 h-8 text-green-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Especialidades</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">8</p>
                        </div>
                        <i data-lucide="scissors" class="w-8 h-8 text-purple-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Comissão Média</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">40%</p>
                        </div>
                        <i data-lucide="percent" class="w-8 h-8 text-blue-400"></i>
                    </div>
                </div>
            </div>
            
            <!-- Lista de Profissionais -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${demoData.profissionais.map(profissional => `
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 card-hover">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-4">
                                <div class="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl">
                                    ${profissional.nome.charAt(0)}
                                </div>
                                <div>
                                    <h3 class="text-gray-900 font-semibold text-lg">${profissional.nome}</h3>
                                    <p class="text-white/70 text-sm">${profissional.email}</p>
                                    <p class="text-white/70 text-sm">${profissional.telefone}</p>
                                </div>
                            </div>
                            
                            <div class="flex space-x-2">
                                <button onclick="editProfissional(${profissional.id})" class="p-2 text-white/70 hover:text-gray-900 hover:bg-white/10 rounded-lg transition-all">
                                    <i data-lucide="edit-2" class="w-4 h-4"></i>
                                </button>
                                <button onclick="viewProfissionalAgenda(${profissional.id})" class="p-2 text-white/70 hover:text-gray-900 hover:bg-white/10 rounded-lg transition-all">
                                    <i data-lucide="calendar" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Especialidades -->
                        <div class="mb-4">
                            <p class="text-white/70 text-sm mb-2">Especialidades:</p>
                            <div class="flex flex-wrap gap-2">
                                ${profissional.especialidades.map(esp => `
                                    <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                                        ${esp}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Horário de Trabalho -->
                        <div class="mb-4">
                            <p class="text-white/70 text-sm mb-2">Horário de Trabalho:</p>
                            <div class="grid grid-cols-2 gap-2 text-xs">
                                ${Object.entries(profissional.horarioTrabalho).map(([dia, horario]) => `
                                    <div class="flex justify-between text-white/60">
                                        <span>${dia.charAt(0).toUpperCase() + dia.slice(1)}:</span>
                                        <span>${horario ? `${horario.inicio} - ${horario.fim}` : 'Folga'}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Comissão -->
                        <div class="flex items-center justify-between pt-4 border-t border-white/10">
                            <div>
                                <p class="text-white/70 text-sm">Comissão</p>
                                <p class="text-gray-900 font-semibold">${profissional.comissao}%</p>
                            </div>
                            <div>
                                <span class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${profissional.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                                    ${profissional.status === 'ativo' ? '● Ativo' : '● Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// =============================================================================
// RENDERIZAÇÃO - SERVIÇOS
// =============================================================================

function renderServicos() {
    const categorias = [...new Set(demoData.servicos.map(s => s.categoria))];
    
    return `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Serviços</h2>
                        <p class="text-white/70 text-sm">Gerencie o catálogo de serviços</p>
                    </div>
                    
                    <button onclick="openModal('novoServico')" class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-gray-900 rounded-lg font-medium transition-all">
                        <i data-lucide="plus" class="w-4 h-4 inline mr-2"></i>
                        Novo Serviço
                    </button>
                </div>
                
                <!-- Filtros -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <select class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option value="">Todas as categorias</option>
                            ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <select class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option value="">Todos os status</option>
                            <option value="ativo">Ativos</option>
                            <option value="inativo">Inativos</option>
                        </select>
                    </div>
                    
                    <div>
                        <div class="relative">
                            <input type="text" placeholder="Buscar serviço..." class="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-white/50"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Total de Serviços</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">${demoData.servicos.length}</p>
                        </div>
                        <i data-lucide="scissors" class="w-8 h-8 text-blue-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Ativos</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">${demoData.servicos.filter(s => s.ativo).length}</p>
                        </div>
                        <i data-lucide="check-circle" class="w-8 h-8 text-green-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Categorias</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">${categorias.length}</p>
                        </div>
                        <i data-lucide="tag" class="w-8 h-8 text-purple-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Preço Médio</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">R$ ${(demoData.servicos.reduce((sum, s) => sum + s.preco, 0) / demoData.servicos.length).toFixed(0)}</p>
                        </div>
                        <i data-lucide="dollar-sign" class="w-8 h-8 text-blue-400"></i>
                    </div>
                </div>
            </div>
            
            <!-- Lista de Serviços por Categoria -->
            ${categorias.map(categoria => {
                const servicosCategoria = demoData.servicos.filter(s => s.categoria === categoria);
                return `
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i data-lucide="tag" class="w-5 h-5 mr-2 text-purple-400"></i>
                            ${categoria}
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${servicosCategoria.map(servico => `
                                <div class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                    <div class="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 class="text-gray-900 font-semibold">${servico.nome}</h4>
                                            <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${servico.ativo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} mt-1">
                                                ${servico.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                        
                                        <div class="flex space-x-1">
                                            <button onclick="editServico(${servico.id})" class="p-1 text-white/70 hover:text-gray-900 hover:bg-white/10 rounded transition-all">
                                                <i data-lucide="edit-2" class="w-3 h-3"></i>
                                            </button>
                                            <button onclick="deleteServico(${servico.id})" class="p-1 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded transition-all">
                                                <i data-lucide="trash-2" class="w-3 h-3"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p class="text-white/70 text-sm mb-3">${servico.descricao}</p>
                                    
                                    <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div>
                                            <p class="text-white/60">Duração:</p>
                                            <p class="text-gray-900 font-medium">${servico.duracao} min</p>
                                        </div>
                                        <div>
                                            <p class="text-white/60">Preço:</p>
                                            <p class="text-gray-900 font-medium">R$ ${servico.preco.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p class="text-white/60 text-xs mb-1">Profissionais:</p>
                                        <div class="flex flex-wrap gap-1">
                                            ${servico.profissionaisAptos.map(profId => {
                                                const prof = demoData.profissionais.find(p => p.id === profId);
                                                return `<span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">${prof ? prof.nome : 'N/A'}</span>`;
                                            }).join('')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// =============================================================================
// RENDERIZAÇÃO - FINANCEIRO
// =============================================================================

function renderFinanceiro() {
    const receitaTotal = demoData.transacoes.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0);
    const despesaTotal = demoData.transacoes.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);
    const saldoTotal = receitaTotal - despesaTotal;
    
    return `
        <div class="space-y-6">
            <!-- Cards de Resumo -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Receitas</p>
                            <p class="text-2xl font-bold text-green-400 mt-1">R$ ${receitaTotal.toFixed(2)}</p>
                            <p class="text-green-300/70 text-xs mt-1">
                                <i data-lucide="trending-up" class="w-3 h-3 inline mr-1"></i>
                                +12% vs mês anterior
                            </p>
                        </div>
                        <i data-lucide="trending-up" class="w-8 h-8 text-green-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Despesas</p>
                            <p class="text-2xl font-bold text-red-400 mt-1">R$ ${despesaTotal.toFixed(2)}</p>
                            <p class="text-red-300/70 text-xs mt-1">
                                <i data-lucide="trending-down" class="w-3 h-3 inline mr-1"></i>
                                -5% vs mês anterior
                            </p>
                        </div>
                        <i data-lucide="trending-down" class="w-8 h-8 text-red-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Saldo</p>
                            <p class="text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-400' : 'text-red-400'} mt-1">R$ ${saldoTotal.toFixed(2)}</p>
                            <p class="text-white/70 text-xs mt-1">Resultado do período</p>
                        </div>
                        <i data-lucide="wallet" class="w-8 h-8 ${saldoTotal >= 0 ? 'text-green-400' : 'text-red-400'}"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Ticket Médio</p>
                            <p class="text-2xl font-bold text-purple-400 mt-1">R$ ${(receitaTotal / demoData.agendamentos.filter(a => a.status === 'concluido').length || 0).toFixed(2)}</p>
                            <p class="text-purple-300/70 text-xs mt-1">Por atendimento</p>
                        </div>
                        <i data-lucide="calculator" class="w-8 h-8 text-purple-400"></i>
                    </div>
                </div>
            </div>
            
            <!-- Gráficos Financeiros -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Receitas vs Despesas</h3>
                    <canvas id="financeChart" width="400" height="200"></canvas>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Categorias de Despesas</h3>
                    <canvas id="expenseChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <!-- Fluxo de Caixa -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-gray-900">Fluxo de Caixa</h3>
                    <div class="flex space-x-2">
                        <button onclick="openModal('novaReceita')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-gray-900 rounded-lg text-sm transition-colors">
                            <i data-lucide="plus" class="w-4 h-4 inline mr-1"></i>
                            Receita
                        </button>
                        <button onclick="openModal('novaDespesa')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-gray-900 rounded-lg text-sm transition-colors">
                            <i data-lucide="minus" class="w-4 h-4 inline mr-1"></i>
                            Despesa
                        </button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-white/5">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Data</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Tipo</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Descrição</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Categoria</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Valor</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/10">
                            ${demoData.transacoes.sort((a, b) => new Date(b.data) - new Date(a.data)).map(transacao => `
                                <tr class="hover:bg-white/5">
                                    <td class="px-4 py-3 text-gray-900 text-sm">${formatDate(transacao.data)}</td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${transacao.tipo === 'receita' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                                            <i data-lucide="${transacao.tipo === 'receita' ? 'arrow-up' : 'arrow-down'}" class="w-3 h-3 mr-1"></i>
                                            ${transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-gray-900 text-sm">${transacao.descricao}</td>
                                    <td class="px-4 py-3 text-white/70 text-sm">${transacao.categoria}</td>
                                    <td class="px-4 py-3 text-gray-900 font-medium ${transacao.tipo === 'receita' ? 'text-green-400' : 'text-red-400'}">
                                        ${transacao.tipo === 'receita' ? '+' : '-'} R$ ${transacao.valor.toFixed(2)}
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex space-x-2">
                                            <button onclick="editTransacao(${transacao.id})" class="text-blue-400 hover:text-blue-300">
                                                <i data-lucide="edit-2" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="deleteTransacao(${transacao.id})" class="text-red-400 hover:text-red-300">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// =============================================================================
// RENDERIZAÇÃO - RELATÓRIOS
// =============================================================================

function renderRelatorios() {
    return `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-2">Relatórios e Analytics</h2>
                <p class="text-white/70 text-sm">Análises detalhadas do seu negócio</p>
            </div>
            
            <!-- Filtros de Período -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Período</label>
                        <select class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option value="hoje">Hoje</option>
                            <option value="semana">Esta Semana</option>
                            <option value="mes" selected>Este Mês</option>
                            <option value="ano">Este Ano</option>
                            <option value="personalizado">Personalizado</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Data Inicial</label>
                        <input type="date" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400" value="2024-11-01">
                    </div>
                    
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Data Final</label>
                        <input type="date" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400" value="2024-11-30">
                    </div>
                    
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Ação</label>
                        <button onclick="generateReport()" class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-lg transition-colors">
                            <i data-lucide="bar-chart" class="w-4 h-4 inline mr-2"></i>
                            Gerar Relatório
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- KPIs Principais -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Faturamento</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">R$ 8.450</p>
                            <p class="text-green-400 text-xs mt-1">↗ +15% vs mês anterior</p>
                        </div>
                        <i data-lucide="dollar-sign" class="w-8 h-8 text-green-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Atendimentos</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">156</p>
                            <p class="text-blue-400 text-xs mt-1">↗ +8% vs mês anterior</p>
                        </div>
                        <i data-lucide="calendar-check" class="w-8 h-8 text-blue-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Novos Clientes</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">23</p>
                            <p class="text-purple-400 text-xs mt-1">↗ +12% vs mês anterior</p>
                        </div>
                        <i data-lucide="user-plus" class="w-8 h-8 text-purple-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Taxa de Ocupação</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">78%</p>
                            <p class="text-orange-400 text-xs mt-1">↗ +3% vs mês anterior</p>
                        </div>
                        <i data-lucide="target" class="w-8 h-8 text-orange-400"></i>
                    </div>
                </div>
            </div>
            
            <!-- Gráficos de Analytics -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Evolução de Receita</h3>
                    <canvas id="revenueEvolutionChart" width="400" height="200"></canvas>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Performance por Profissional</h3>
                    <canvas id="professionalPerformanceChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <!-- Ranking de Serviços -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-6">Ranking de Serviços</h3>
                <div class="space-y-4">
                    ${[
                        { nome: 'Corte + Escova', quantidade: 45, receita: 3825, crescimento: 12 },
                        { nome: 'Coloração', quantidade: 28, receita: 4200, crescimento: 8 },
                        { nome: 'Manicure + Pedicure', quantidade: 38, receita: 1710, crescimento: 15 },
                        { nome: 'Corte Masculino', quantidade: 52, receita: 1820, crescimento: -3 },
                        { nome: 'Barba + Bigode', quantidade: 31, receita: 775, crescimento: 5 }
                    ].map((servico, index) => `
                        <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div class="flex items-center space-x-4">
                                <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                                    ${index + 1}
                                </div>
                                <div>
                                    <h4 class="text-gray-900 font-medium">${servico.nome}</h4>
                                    <p class="text-white/70 text-sm">${servico.quantidade} atendimentos</p>
                                </div>
                            </div>
                            
                            <div class="text-right">
                                <p class="text-gray-900 font-bold">R$ ${servico.receita.toFixed(2)}</p>
                                <p class="text-sm ${servico.crescimento >= 0 ? 'text-green-400' : 'text-red-400'}">
                                    ${servico.crescimento >= 0 ? '↗' : '↘'} ${servico.crescimento}%
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Ações de Relatório -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onclick="exportReport('pdf')" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:bg-white/20 transition-colors">
                    <i data-lucide="file-text" class="w-8 h-8 text-red-400 mx-auto mb-2"></i>
                    <p class="text-gray-900 font-medium">Exportar PDF</p>
                    <p class="text-white/70 text-sm">Relatório completo em PDF</p>
                </button>
                
                <button onclick="exportReport('excel')" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:bg-white/20 transition-colors">
                    <i data-lucide="table" class="w-8 h-8 text-green-400 mx-auto mb-2"></i>
                    <p class="text-gray-900 font-medium">Exportar Excel</p>
                    <p class="text-white/70 text-sm">Dados para análise</p>
                </button>
                
                <button onclick="scheduleReport()" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:bg-white/20 transition-colors">
                    <i data-lucide="clock" class="w-8 h-8 text-blue-400 mx-auto mb-2"></i>
                    <p class="text-gray-900 font-medium">Agendar Relatório</p>
                    <p class="text-white/70 text-sm">Envio automático por email</p>
                </button>
            </div>
        </div>
    `;
}

// =============================================================================
// RENDERIZAÇÃO - CONFIGURAÇÕES
// =============================================================================

function renderConfiguracoes() {
    return `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-2">Configurações</h2>
                <p class="text-white/70 text-sm">Personalize o sistema conforme suas necessidades</p>
            </div>
            
            <!-- Abas de Configuração -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <!-- Tab Headers -->
                <div class="flex border-b border-white/10">
                    <button onclick="switchConfigTab('geral')" class="config-tab px-6 py-3 text-gray-900 font-medium border-b-2 border-purple-600 bg-white/10" data-tab="geral">
                        Geral
                    </button>
                    <button onclick="switchConfigTab('funcionamento')" class="config-tab px-6 py-3 text-white/70 hover:text-gray-900 transition-colors" data-tab="funcionamento">
                        Funcionamento
                    </button>
                    <button onclick="switchConfigTab('notificacoes')" class="config-tab px-6 py-3 text-white/70 hover:text-gray-900 transition-colors" data-tab="notificacoes">
                        Notificações
                    </button>
                    <button onclick="switchConfigTab('integracao')" class="config-tab px-6 py-3 text-white/70 hover:text-gray-900 transition-colors" data-tab="integracao">
                        Integração
                    </button>
                    <button onclick="switchConfigTab('backup')" class="config-tab px-6 py-3 text-white/70 hover:text-gray-900 transition-colors" data-tab="backup">
                        Backup
                    </button>
                </div>
                
                <!-- Tab Content -->
                <div class="p-6">
                    <!-- Configurações Gerais -->
                    <div id="config-geral" class="config-content">
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações do Salão</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-white/70 text-sm mb-2">Nome do Salão</label>
                                        <input type="text" value="Salão Beleza & Arte" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                                    </div>
                                    <div>
                                        <label class="block text-white/70 text-sm mb-2">CNPJ</label>
                                        <input type="text" value="12.345.678/0001-90" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                                    </div>
                                    <div>
                                        <label class="block text-white/70 text-sm mb-2">Telefone</label>
                                        <input type="text" value="(11) 3456-7890" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                                    </div>
                                    <div>
                                        <label class="block text-white/70 text-sm mb-2">Email</label>
                                        <input type="email" value="contato@salao.com" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-white/70 text-sm mb-2">Endereço</label>
                                        <input type="text" value="Rua das Flores, 123 - Centro - São Paulo/SP" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Preferências do Sistema</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-gray-900 font-medium">Tema Escuro</p>
                                            <p class="text-white/70 text-sm">Usar interface escura por padrão</p>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" class="sr-only peer" checked>
                                            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-gray-900 font-medium">Sons de Notificação</p>
                                            <p class="text-white/70 text-sm">Reproduzir sons para alertas</p>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" class="sr-only peer" checked>
                                            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-gray-900 font-medium">Confirmação de Exclusão</p>
                                            <p class="text-white/70 text-sm">Pedir confirmação antes de excluir itens</p>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" class="sr-only peer" checked>
                                            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Outras abas serão mostradas/escondidas via JavaScript -->
                    <div id="config-funcionamento" class="config-content hidden">
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Horário de Funcionamento</h3>
                            <!-- Conteúdo da aba funcionamento -->
                            <div class="text-white/70">
                                <p>Configurações de horário de funcionamento serão implementadas aqui...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="config-notificacoes" class="config-content hidden">
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificação</h3>
                            <!-- Conteúdo da aba notificações -->
                            <div class="text-white/70">
                                <p>Configurações de notificações serão implementadas aqui...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="config-integracao" class="config-content hidden">
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Integrações</h3>
                            <!-- Conteúdo da aba integração -->
                            <div class="text-white/70">
                                <p>Configurações de integrações serão implementadas aqui...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="config-backup" class="config-content hidden">
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Backup e Restauração</h3>
                            <!-- Conteúdo da aba backup -->
                            <div class="text-white/70">
                                <p>Configurações de backup serão implementadas aqui...</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Botão Salvar -->
                <div class="p-6 border-t border-white/10">
                    <button onclick="saveConfiguracoes()" class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-gray-900 rounded-lg font-medium transition-all">
                        <i data-lucide="save" class="w-4 h-4 inline mr-2"></i>
                        Salvar Configurações
                    </button>
                </div>
            </div>
        </div>
    `;
}

// =============================================================================
// FUNÇÕES AUXILIARES PARA AS PÁGINAS
// =============================================================================

function switchConfigTab(tabName) {
    // Remover classe ativa de todas as abas
    document.querySelectorAll('.config-tab').forEach(tab => {
        tab.classList.remove('border-purple-600', 'bg-white/10');
        tab.classList.add('text-white/70');
    });
    
    // Esconder todo o conteúdo
    document.querySelectorAll('.config-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Ativar aba clicada
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('border-purple-600', 'bg-white/10');
        activeTab.classList.remove('text-white/70');
    }
    
    // Mostrar conteúdo da aba
    const content = document.getElementById(`config-${tabName}`);
    if (content) {
        content.classList.remove('hidden');
    }
}

function editProfissional(id) {
    showToast(`Editando profissional #${id}`, 'info');
}

function viewProfissionalAgenda(id) {
    showToast(`Visualizando agenda do profissional #${id}`, 'info');
}

function editServico(id) {
    showToast(`Editando serviço #${id}`, 'info');
}

function deleteServico(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        const index = demoData.servicos.findIndex(s => s.id === id);
        if (index !== -1) {
            demoData.servicos.splice(index, 1);
            loadPageContent(appState.currentPage);
            showToast('Serviço excluído com sucesso!', 'success');
        }
    }
}

function editTransacao(id) {
    showToast(`Editando transação #${id}`, 'info');
}

function deleteTransacao(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        const index = demoData.transacoes.findIndex(t => t.id === id);
        if (index !== -1) {
            demoData.transacoes.splice(index, 1);
            loadPageContent(appState.currentPage);
            showToast('Transação excluída com sucesso!', 'success');
        }
    }
}

function generateReport() {
    showToast('Gerando relatório...', 'info');
    // Simular geração de relatório
    setTimeout(() => {
        showToast('Relatório gerado com sucesso!', 'success');
    }, 2000);
}

function exportReport(format) {
    showToast(`Exportando relatório em formato ${format.toUpperCase()}...`, 'info');
    // Simular exportação
    setTimeout(() => {
        showToast(`Relatório ${format.toUpperCase()} exportado com sucesso!`, 'success');
    }, 1500);
}

function scheduleReport() {
    showToast('Configurando agendamento de relatório...', 'info');
    // Implementar modal de agendamento
}

function saveConfiguracoes() {
    showToast('Salvando configurações...', 'info');
    // Simular salvamento
    setTimeout(() => {
        showToast('Configurações salvas com sucesso!', 'success');
    }, 1000);
}

console.log('📊 SalaoGerent Demo - Páginas Complementares Loaded!');
