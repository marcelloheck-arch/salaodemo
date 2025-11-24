/**
 * SalaoGerent - Demonstração Interativa
 * Sistema de Gerenciamento para Salões de Beleza
 * 
 * Este arquivo contém toda a lógica da aplicação demo
 * Todas as funcionalidades são simuladas para fins demonstrativos
 */

// =============================================================================
// DADOS MOCKADOS PARA DEMONSTRAÇÃO
// =============================================================================

let demoData = {
    // Usuário logado
    currentUser: null,
    
    // Agendamentos
    agendamentos: [
        {
            id: 1,
            clienteNome: "Maria Silva",
            clienteTelefone: "(11) 99999-1111",
            clienteEmail: "maria@email.com",
            servico: "Corte + Escova",
            profissional: "Ana Costa",
            data: "2024-11-21",
            horario: "09:00",
            duracao: 90,
            valor: 85.00,
            status: "agendado"
        },
        {
            id: 2,
            clienteNome: "João Santos",
            clienteTelefone: "(11) 99999-2222",
            clienteEmail: "joao@email.com",
            servico: "Corte Masculino",
            profissional: "Carlos Mendes",
            data: "2024-11-21",
            horario: "10:30",
            duracao: 30,
            valor: 35.00,
            status: "confirmado"
        },
        {
            id: 3,
            clienteNome: "Ana Paula",
            clienteTelefone: "(11) 99999-3333",
            clienteEmail: "ana@email.com",
            servico: "Manicure + Pedicure",
            profissional: "Lucia Fernandes",
            data: "2024-11-21",
            horario: "14:00",
            duracao: 60,
            valor: 45.00,
            status: "em-andamento"
        },
        {
            id: 4,
            clienteNome: "Pedro Oliveira",
            clienteTelefone: "(11) 99999-4444",
            clienteEmail: "pedro@email.com",
            servico: "Barba + Bigode",
            profissional: "Carlos Mendes",
            data: "2024-11-20",
            horario: "16:00",
            duracao: 45,
            valor: 25.00,
            status: "concluido"
        }
    ],
    
    // Clientes
    clientes: [
        {
            id: 1,
            nome: "Maria Silva",
            telefone: "(11) 99999-1111",
            email: "maria@email.com",
            nascimento: "1985-03-15",
            endereco: {
                rua: "Rua das Flores, 123",
                bairro: "Centro",
                cidade: "São Paulo"
            },
            preferencias: ["Cortes modernos", "Coloração"],
            observacoes: "Cabelo sensível a produtos químicos",
            totalGasto: 420.00,
            totalVisitas: 8,
            ultimaVisita: "2024-10-15",
            status: "ativo",
            vip: false
        },
        {
            id: 2,
            nome: "João Santos",
            telefone: "(11) 99999-2222",
            email: "joao@email.com",
            nascimento: "1990-07-22",
            endereco: {
                rua: "Av. Paulista, 456",
                bairro: "Bela Vista",
                cidade: "São Paulo"
            },
            preferencias: ["Cortes clássicos"],
            observacoes: "Cliente pontual",
            totalGasto: 280.00,
            totalVisitas: 12,
            ultimaVisita: "2024-11-10",
            status: "ativo",
            vip: true
        },
        {
            id: 3,
            nome: "Ana Paula",
            telefone: "(11) 99999-3333",
            email: "ana@email.com",
            nascimento: "1988-12-05",
            endereco: {
                rua: "Rua Augusta, 789",
                bairro: "Jardins",
                cidade: "São Paulo"
            },
            preferencias: ["Unhas artísticas", "Tratamentos"],
            observacoes: "Alérgica a esmalte vermelho",
            totalGasto: 650.00,
            totalVisitas: 15,
            ultimaVisita: "2024-11-18",
            status: "ativo",
            vip: true
        }
    ],
    
    // Profissionais
    profissionais: [
        {
            id: 1,
            nome: "Ana Costa",
            telefone: "(11) 98888-1111",
            email: "ana@salao.com",
            especialidades: ["Cortes", "Coloração", "Tratamentos"],
            comissao: 40,
            horarioTrabalho: {
                segunda: { inicio: "09:00", fim: "18:00" },
                terca: { inicio: "09:00", fim: "18:00" },
                quarta: { inicio: "09:00", fim: "18:00" },
                quinta: { inicio: "09:00", fim: "18:00" },
                sexta: { inicio: "09:00", fim: "18:00" },
                sabado: { inicio: "08:00", fim: "16:00" },
                domingo: null
            },
            status: "ativo"
        },
        {
            id: 2,
            nome: "Carlos Mendes",
            telefone: "(11) 98888-2222",
            email: "carlos@salao.com",
            especialidades: ["Cortes Masculinos", "Barba", "Bigode"],
            comissao: 35,
            horarioTrabalho: {
                segunda: { inicio: "10:00", fim: "19:00" },
                terca: { inicio: "10:00", fim: "19:00" },
                quarta: { inicio: "10:00", fim: "19:00" },
                quinta: { inicio: "10:00", fim: "19:00" },
                sexta: { inicio: "10:00", fim: "19:00" },
                sabado: { inicio: "09:00", fim: "17:00" },
                domingo: null
            },
            status: "ativo"
        },
        {
            id: 3,
            nome: "Lucia Fernandes",
            telefone: "(11) 98888-3333",
            email: "lucia@salao.com",
            especialidades: ["Manicure", "Pedicure", "Unhas Artísticas"],
            comissao: 45,
            horarioTrabalho: {
                segunda: { inicio: "09:00", fim: "18:00" },
                terca: { inicio: "09:00", fim: "18:00" },
                quarta: { inicio: "09:00", fim: "18:00" },
                quinta: { inicio: "09:00", fim: "18:00" },
                sexta: { inicio: "09:00", fim: "18:00" },
                sabado: { inicio: "08:00", fim: "14:00" },
                domingo: null
            },
            status: "ativo"
        }
    ],
    
    // Serviços
    servicos: [
        {
            id: 1,
            nome: "Corte Feminino",
            categoria: "Cabelo",
            duracao: 45,
            preco: 60.00,
            profissionaisAptos: [1],
            descricao: "Corte personalizado conforme rosto e estilo",
            ativo: true
        },
        {
            id: 2,
            nome: "Corte + Escova",
            categoria: "Cabelo",
            duracao: 90,
            preco: 85.00,
            profissionaisAptos: [1],
            descricao: "Corte + finalização com escova",
            ativo: true
        },
        {
            id: 3,
            nome: "Coloração",
            categoria: "Cabelo",
            duracao: 120,
            preco: 150.00,
            profissionaisAptos: [1],
            descricao: "Coloração completa com produtos de qualidade",
            ativo: true
        },
        {
            id: 4,
            nome: "Corte Masculino",
            categoria: "Cabelo",
            duracao: 30,
            preco: 35.00,
            profissionaisAptos: [2],
            descricao: "Corte tradicional ou moderno",
            ativo: true
        },
        {
            id: 5,
            nome: "Barba + Bigode",
            categoria: "Cabelo",
            duracao: 45,
            preco: 25.00,
            profissionaisAptos: [2],
            descricao: "Aparar e modelar barba e bigode",
            ativo: true
        },
        {
            id: 6,
            nome: "Manicure",
            categoria: "Unhas",
            duracao: 30,
            preco: 25.00,
            profissionaisAptos: [3],
            descricao: "Cuidados com as unhas das mãos",
            ativo: true
        },
        {
            id: 7,
            nome: "Pedicure",
            categoria: "Unhas",
            duracao: 45,
            preco: 35.00,
            profissionaisAptos: [3],
            descricao: "Cuidados com as unhas dos pés",
            ativo: true
        },
        {
            id: 8,
            nome: "Manicure + Pedicure",
            categoria: "Unhas",
            duracao: 60,
            preco: 45.00,
            profissionaisAptos: [3],
            descricao: "Pacote completo de cuidados com unhas",
            ativo: true
        }
    ],
    
    // Transações financeiras
    transacoes: [
        { id: 1, data: "2024-11-20", tipo: "receita", valor: 85.00, descricao: "Agendamento - Maria Silva", categoria: "Serviços" },
        { id: 2, data: "2024-11-20", tipo: "receita", valor: 35.00, descricao: "Agendamento - João Santos", categoria: "Serviços" },
        { id: 3, data: "2024-11-20", tipo: "receita", valor: 25.00, descricao: "Agendamento - Pedro Oliveira", categoria: "Serviços" },
        { id: 4, data: "2024-11-19", tipo: "despesa", valor: 250.00, descricao: "Compra de produtos", categoria: "Produtos" },
        { id: 5, data: "2024-11-19", tipo: "receita", valor: 150.00, descricao: "Coloração - Cliente", categoria: "Serviços" },
        { id: 6, data: "2024-11-18", tipo: "receita", valor: 45.00, descricao: "Manicure + Pedicure", categoria: "Serviços" },
        { id: 7, data: "2024-11-18", tipo: "despesa", valor: 120.00, descricao: "Material de limpeza", categoria: "Manutenção" }
    ]
};

// =============================================================================
// ESTADO DA APLICAÇÃO
// =============================================================================

let appState = {
    currentPage: 'dashboard',
    sidebarOpen: false,
    userMenuOpen: false,
    modalsOpen: [],
    currentModal: null
};

// =============================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 SalaoGerent Demo - Iniciando...');
    
    // Simular loading
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        
        // Inicializar icons do Lucide
        lucide.createIcons();
        
        showToast('Bem-vindo ao SalaoGerent Demo!', 'success');
    }, 2000);
    
    // Event listeners
    setupEventListeners();
});

// =============================================================================
// GERENCIAMENTO DE EVENTOS
// =============================================================================

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Sidebar toggle para mobile
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#sidebar') && !e.target.closest('#mobile-menu-btn')) {
            if (window.innerWidth < 768) {
                closeSidebar();
            }
        }
    });
    
    // User menu toggle
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#user-menu') && !e.target.closest('[onclick="toggleUserMenu()"]')) {
            closeUserMenu();
        }
    });
}

// =============================================================================
// AUTENTICAÇÃO
// =============================================================================

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simular validação (qualquer credencial funciona)
    if (email && password) {
        showToast('Autenticando...', 'info');
        
        // Simular delay de autenticação
        setTimeout(() => {
            demoData.currentUser = {
                id: 1,
                nome: email.includes('admin') ? 'Admin Sistema' : 'Usuário Demo',
                email: email,
                tipo: email.includes('admin') ? 'admin' : 'usuario'
            };
            
            showDashboard();
            showToast('Login realizado com sucesso!', 'success');
        }, 1500);
    } else {
        showToast('Por favor, preencha todos os campos', 'error');
    }
}

function quickLogin(tipo) {
    const credentials = {
        admin: { email: 'admin@salao.com', password: 'admin123' },
        profissional: { email: 'profissional@salao.com', password: 'prof123' },
        cliente: { email: 'cliente@salao.com', password: 'cliente123' }
    };
    
    const cred = credentials[tipo];
    document.getElementById('email').value = cred.email;
    document.getElementById('password').value = cred.password;
    
    showToast(`Credenciais de ${tipo} preenchidas!`, 'info');
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        passwordInput.type = 'password';
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    
    lucide.createIcons();
}

function logout() {
    showToast('Saindo do sistema...', 'info');
    
    setTimeout(() => {
        demoData.currentUser = null;
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
        
        // Reset form
        document.getElementById('email').value = 'admin@salao.com';
        document.getElementById('password').value = 'demo123';
        
        showToast('Logout realizado com sucesso!', 'success');
    }, 1000);
}

// =============================================================================
// NAVEGAÇÃO
// =============================================================================

function showDashboard() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Atualizar info do usuário
    document.getElementById('user-name').textContent = demoData.currentUser.nome;
    document.getElementById('user-role').textContent = demoData.currentUser.tipo === 'admin' ? 'Administrador' : 'Usuário';
    
    // Carregar dashboard
    navigateTo('dashboard');
}

function navigateTo(page) {
    // Atualizar estado
    appState.currentPage = page;
    
    // Atualizar menu ativo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'bg-purple-600', 'text-white');
        item.classList.add('text-gray-500');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active', 'bg-purple-600', 'text-white');
            item.classList.remove('text-gray-500');
        }
    });
    
    // Atualizar título da página
    const pageInfo = getPageInfo(page);
    document.getElementById('page-title').textContent = pageInfo.title;
    document.getElementById('page-subtitle').textContent = pageInfo.subtitle;
    
    // Carregar conteúdo da página
    loadPageContent(page);
    
    // Fechar sidebar no mobile
    if (window.innerWidth < 768) {
        closeSidebar();
    }
}

function getPageInfo(page) {
    const pages = {
        dashboard: { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
        agendamentos: { title: 'Agendamentos', subtitle: 'Gerencie os agendamentos do salão' },
        clientes: { title: 'Clientes', subtitle: 'Cadastro e gestão de clientes' },
        profissionais: { title: 'Profissionais', subtitle: 'Equipe e especialidades' },
        servicos: { title: 'Serviços', subtitle: 'Catálogo de serviços oferecidos' },
        financeiro: { title: 'Financeiro', subtitle: 'Controle de receitas e despesas' },
        relatorios: { title: 'Relatórios', subtitle: 'Análises e estatísticas' },
        configuracoes: { title: 'Configurações', subtitle: 'Configurações do sistema' }
    };
    
    return pages[page] || { title: 'Página', subtitle: 'Carregando...' };
}

// =============================================================================
// CARREGAMENTO DE CONTEÚDO
// =============================================================================

function loadPageContent(page) {
    const contentContainer = document.getElementById('main-content');
    
    // Animação de saída
    contentContainer.style.opacity = '0';
    
    setTimeout(() => {
        // Carregar novo conteúdo
        switch (page) {
            case 'dashboard':
                contentContainer.innerHTML = renderDashboard();
                break;
            case 'agendamentos':
                contentContainer.innerHTML = renderAgendamentos();
                break;
            case 'clientes':
                contentContainer.innerHTML = renderClientes();
                break;
            case 'profissionais':
                contentContainer.innerHTML = renderProfissionais();
                break;
            case 'servicos':
                contentContainer.innerHTML = renderServicos();
                break;
            case 'financeiro':
                contentContainer.innerHTML = renderFinanceiro();
                break;
            case 'relatorios':
                contentContainer.innerHTML = renderRelatorios();
                break;
            case 'configuracoes':
                contentContainer.innerHTML = renderConfiguracoes();
                break;
            default:
                contentContainer.innerHTML = '<div class="text-center text-gray-900">Página não encontrada</div>';
        }
        
        // Animação de entrada
        contentContainer.style.opacity = '1';
        
        // Reinicializar icons
        lucide.createIcons();
        
        // Inicializar gráficos se necessário
        initializeCharts();
    }, 150);
}

// =============================================================================
// RENDERIZAÇÃO DAS PÁGINAS
// =============================================================================

function renderDashboard() {
    // Calcular estatísticas
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = demoData.agendamentos.filter(a => a.data === hoje);
    const totalClientes = demoData.clientes.length;
    const clientesVip = demoData.clientes.filter(c => c.vip).length;
    const receitaMes = demoData.transacoes
        .filter(t => t.tipo === 'receita' && t.data.startsWith('2024-11'))
        .reduce((sum, t) => sum + t.valor, 0);
    
    return `
        <div class="space-y-6">
            <!-- Estatísticas Principais -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Agendamentos Hoje -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Agendamentos Hoje</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">${agendamentosHoje.length}</p>
                            <p class="text-green-400 text-xs mt-1">
                                <i data-lucide="trending-up" class="w-3 h-3 inline mr-1"></i>
                                +12% vs ontem
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <i data-lucide="calendar" class="w-6 h-6 text-blue-400"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Total de Clientes -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Total de Clientes</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">${totalClientes}</p>
                            <p class="text-purple-400 text-xs mt-1">
                                <i data-lucide="users" class="w-3 h-3 inline mr-1"></i>
                                ${clientesVip} VIP
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <i data-lucide="users" class="w-6 h-6 text-purple-400"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Receita do Mês -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Receita do Mês</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">R$ ${receitaMes.toFixed(2)}</p>
                            <p class="text-green-400 text-xs mt-1">
                                <i data-lucide="trending-up" class="w-3 h-3 inline mr-1"></i>
                                +8% vs mês anterior
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <i data-lucide="dollar-sign" class="w-6 h-6 text-green-400"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Profissionais Ativos -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Profissionais</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">${demoData.profissionais.filter(p => p.status === 'ativo').length}</p>
                            <p class="text-blue-400 text-xs mt-1">
                                <i data-lucide="user-check" class="w-3 h-3 inline mr-1"></i>
                                Todos ativos
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <i data-lucide="user-check" class="w-6 h-6 text-blue-400"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Gráficos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Gráfico de Receitas -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Receitas dos Últimos 7 Dias</h3>
                    <canvas id="revenueChart" width="400" height="200"></canvas>
                </div>
                
                <!-- Gráfico de Serviços -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Serviços Mais Realizados</h3>
                    <canvas id="servicesChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <!-- Agendamentos de Hoje -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-gray-900">Agendamentos de Hoje</h3>
                    <button onclick="navigateTo('agendamentos')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-lg text-sm transition-colors">
                        Ver Todos
                    </button>
                </div>
                
                <div class="space-y-4">
                    ${agendamentosHoje.length > 0 ? agendamentosHoje.map(agendamento => `
                        <div class="bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-gray-900 font-bold">
                                    ${agendamento.clienteNome.charAt(0)}
                                </div>
                                <div>
                                    <p class="text-gray-900 font-medium">${agendamento.clienteNome}</p>
                                    <p class="text-white/70 text-sm">${agendamento.servico} • ${agendamento.profissional}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-gray-900 font-medium">${agendamento.horario}</p>
                                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agendamento.status)}">
                                    ${getStatusText(agendamento.status)}
                                </span>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="text-center py-8">
                            <i data-lucide="calendar-x" class="w-16 h-16 text-white/30 mx-auto mb-4"></i>
                            <p class="text-white/70">Nenhum agendamento para hoje</p>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- Ações Rápidas -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button onclick="openModal('novoAgendamento')" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:bg-white/20 transition-colors">
                    <i data-lucide="plus" class="w-8 h-8 text-purple-400 mx-auto mb-2"></i>
                    <p class="text-gray-900 font-medium">Novo Agendamento</p>
                </button>
                
                <button onclick="openModal('novoCliente')" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:bg-white/20 transition-colors">
                    <i data-lucide="user-plus" class="w-8 h-8 text-blue-400 mx-auto mb-2"></i>
                    <p class="text-gray-900 font-medium">Cadastrar Cliente</p>
                </button>
                
                <button onclick="navigateTo('financeiro')" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:bg-white/20 transition-colors">
                    <i data-lucide="calculator" class="w-8 h-8 text-green-400 mx-auto mb-2"></i>
                    <p class="text-gray-900 font-medium">Fluxo de Caixa</p>
                </button>
                
                <button onclick="navigateTo('relatorios')" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:bg-white/20 transition-colors">
                    <i data-lucide="bar-chart-3" class="w-8 h-8 text-blue-400 mx-auto mb-2"></i>
                    <p class="text-gray-900 font-medium">Relatórios</p>
                </button>
            </div>
        </div>
    `;
}

function renderAgendamentos() {
    return `
        <div class="space-y-6">
            <!-- Header com filtros -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Agendamentos</h2>
                        <p class="text-white/70 text-sm">Gerencie todos os agendamentos</p>
                    </div>
                    
                    <button onclick="openModal('novoAgendamento')" class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-gray-900 rounded-lg font-medium transition-all">
                        <i data-lucide="plus" class="w-4 h-4 inline mr-2"></i>
                        Novo Agendamento
                    </button>
                </div>
                
                <!-- Filtros -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Data</label>
                        <input type="date" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Profissional</label>
                        <select class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option value="">Todos</option>
                            ${demoData.profissionais.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Status</label>
                        <select class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option value="">Todos</option>
                            <option value="agendado">Agendado</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-white/70 text-sm mb-2">Buscar Cliente</label>
                        <div class="relative">
                            <input type="text" placeholder="Nome do cliente..." class="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-white/50"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Lista de Agendamentos -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-white/5">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Cliente</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Serviço</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Profissional</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Data/Hora</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Valor</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/10">
                            ${demoData.agendamentos.map(agendamento => `
                                <tr class="hover:bg-white/5">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-gray-900 text-sm font-bold mr-3">
                                                ${agendamento.clienteNome.charAt(0)}
                                            </div>
                                            <div>
                                                <div class="text-gray-900 font-medium">${agendamento.clienteNome}</div>
                                                <div class="text-white/70 text-sm">${agendamento.clienteTelefone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-gray-900 font-medium">${agendamento.servico}</div>
                                        <div class="text-white/70 text-sm">${agendamento.duracao} min</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${agendamento.profissional}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-gray-900">${formatDate(agendamento.data)}</div>
                                        <div class="text-white/70 text-sm">${agendamento.horario}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">R$ ${agendamento.valor.toFixed(2)}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agendamento.status)}">
                                            ${getStatusText(agendamento.status)}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <div class="flex space-x-2">
                                            <button onclick="editAgendamento(${agendamento.id})" class="text-blue-400 hover:text-blue-300">
                                                <i data-lucide="edit-2" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="deleteAgendamento(${agendamento.id})" class="text-red-400 hover:text-red-300">
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

function renderClientes() {
    return `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Clientes</h2>
                        <p class="text-white/70 text-sm">Gerencie sua base de clientes</p>
                    </div>
                    
                    <button onclick="openModal('novoCliente')" class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-gray-900 rounded-lg font-medium transition-all">
                        <i data-lucide="user-plus" class="w-4 h-4 inline mr-2"></i>
                        Novo Cliente
                    </button>
                </div>
                
                <!-- Busca e Filtros -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                        <div class="relative">
                            <input type="text" placeholder="Buscar por nome, telefone ou email..." class="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-white/50"></i>
                        </div>
                    </div>
                    
                    <div>
                        <select class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option value="">Todos os clientes</option>
                            <option value="ativo">Ativos</option>
                            <option value="vip">VIP</option>
                            <option value="inativo">Inativos</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Total de Clientes</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">${demoData.clientes.length}</p>
                        </div>
                        <i data-lucide="users" class="w-8 h-8 text-blue-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Clientes VIP</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">${demoData.clientes.filter(c => c.vip).length}</p>
                        </div>
                        <i data-lucide="crown" class="w-8 h-8 text-yellow-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-white/70 text-sm">Novos Este Mês</p>
                            <p class="text-2xl font-bold text-gray-900 mt-1">8</p>
                        </div>
                        <i data-lucide="user-plus" class="w-8 h-8 text-green-400"></i>
                    </div>
                </div>
            </div>
            
            <!-- Lista de Clientes -->
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                ${demoData.clientes.map(cliente => `
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 card-hover">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg">
                                    ${cliente.nome.charAt(0)}
                                </div>
                                <div>
                                    <h3 class="text-gray-900 font-semibold">${cliente.nome}</h3>
                                    <div class="flex items-center space-x-2 mt-1">
                                        ${cliente.vip ? '<span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full"><i data-lucide="crown" class="w-3 h-3 mr-1"></i>VIP</span>' : ''}
                                        <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">${cliente.status}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex space-x-2">
                                <button onclick="editCliente(${cliente.id})" class="p-2 text-white/70 hover:text-gray-900 hover:bg-white/10 rounded-lg transition-all">
                                    <i data-lucide="edit-2" class="w-4 h-4"></i>
                                </button>
                                <button onclick="deleteCliente(${cliente.id})" class="p-2 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="space-y-3">
                            <div class="flex items-center text-white/70 text-sm">
                                <i data-lucide="phone" class="w-4 h-4 mr-2"></i>
                                ${cliente.telefone}
                            </div>
                            
                            <div class="flex items-center text-white/70 text-sm">
                                <i data-lucide="mail" class="w-4 h-4 mr-2"></i>
                                ${cliente.email}
                            </div>
                            
                            <div class="flex items-center text-white/70 text-sm">
                                <i data-lucide="map-pin" class="w-4 h-4 mr-2"></i>
                                ${cliente.endereco.bairro}, ${cliente.endereco.cidade}
                            </div>
                        </div>
                        
                        <div class="mt-4 pt-4 border-t border-white/10">
                            <div class="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p class="text-gray-900 font-semibold">R$ ${cliente.totalGasto.toFixed(2)}</p>
                                    <p class="text-white/70 text-xs">Total Gasto</p>
                                </div>
                                <div>
                                    <p class="text-gray-900 font-semibold">${cliente.totalVisitas}</p>
                                    <p class="text-white/70 text-xs">Visitas</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <button onclick="viewClienteDetalhes(${cliente.id})" class="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-900 rounded-lg text-sm transition-all">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Continuação das páginas será criada no próximo arquivo...

// =============================================================================
// UTILITÁRIOS
// =============================================================================

function getStatusColor(status) {
    const colors = {
        'agendado': 'bg-blue-500/20 text-blue-400',
        'confirmado': 'bg-green-500/20 text-green-400',
        'em-andamento': 'bg-yellow-500/20 text-yellow-400',
        'concluido': 'bg-purple-500/20 text-purple-400',
        'cancelado': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
}

function getStatusText(status) {
    const texts = {
        'agendado': 'Agendado',
        'confirmado': 'Confirmado',
        'em-andamento': 'Em Andamento',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
    };
    return texts[status] || 'Desconhecido';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// =============================================================================
// CONTROLES UI
// =============================================================================

function hideDemoNotice() {
    document.getElementById('demo-notice').style.display = 'none';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    appState.sidebarOpen = !appState.sidebarOpen;
    
    if (appState.sidebarOpen) {
        sidebar.classList.add('open');
    } else {
        sidebar.classList.remove('open');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    appState.sidebarOpen = false;
    sidebar.classList.remove('open');
}

function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    appState.userMenuOpen = !appState.userMenuOpen;
    
    if (appState.userMenuOpen) {
        userMenu.classList.remove('hidden');
    } else {
        userMenu.classList.add('hidden');
    }
}

function closeUserMenu() {
    const userMenu = document.getElementById('user-menu');
    appState.userMenuOpen = false;
    userMenu.classList.add('hidden');
}

// =============================================================================
// SISTEMA DE TOAST
// =============================================================================

function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-500 text-gray-900',
        error: 'bg-red-500 text-gray-900',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-gray-900'
    };
    
    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    toast.className = `flex items-center space-x-3 ${colors[type]} px-4 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <i data-lucide="${icons[type]}" class="w-5 h-5"></i>
        <span>${message}</span>
        <button onclick="removeToast(this.parentElement)" class="ml-auto">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Inicializar ícone
    lucide.createIcons();
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remover
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

function removeToast(toastElement) {
    toastElement.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
        }
    }, 300);
}

// =============================================================================
// SISTEMA DE MODAIS
// =============================================================================

function openModal(modalType, data = null) {
    // Implementar modais específicos
    showToast(`Modal "${modalType}" será implementado em breve`, 'info');
}

// =============================================================================
// INICIALIZAÇÃO DE GRÁFICOS
// =============================================================================

function initializeCharts() {
    if (appState.currentPage === 'dashboard') {
        setTimeout(() => {
            initRevenueChart();
            initServicesChart();
        }, 300);
    } else if (appState.currentPage === 'financeiro') {
        setTimeout(() => {
            initFinanceChart();
            initExpenseChart();
        }, 300);
    } else if (appState.currentPage === 'relatorios') {
        setTimeout(() => {
            initRevenueEvolutionChart();
            initProfessionalPerformanceChart();
        }, 300);
    }
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['15/11', '16/11', '17/11', '18/11', '19/11', '20/11', '21/11'],
            datasets: [{
                label: 'Receita Diária',
                data: [320, 450, 380, 520, 410, 380, 470],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function initServicesChart() {
    const ctx = document.getElementById('servicesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cortes', 'Coloração', 'Manicure', 'Barba', 'Outros'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#8B5CF6',
                    '#6366f1',
                    '#10B981',
                    '#F59E0B',
                    '#6B7280'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

function initFinanceChart() {
    const ctx = document.getElementById('financeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Receitas',
                    data: [3200, 4500, 3800, 5200, 4100, 3800, 4700],
                    backgroundColor: '#10B981',
                    borderWidth: 0
                },
                {
                    label: 'Despesas',
                    data: [1800, 2100, 1900, 2300, 2000, 1700, 2200],
                    backgroundColor: '#EF4444',
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function initExpenseChart() {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Produtos', 'Manutenção', 'Salários', 'Aluguel', 'Outros'],
            datasets: [{
                data: [40, 15, 30, 10, 5],
                backgroundColor: [
                    '#EF4444',
                    '#F59E0B',
                    '#6B7280',
                    '#8B5CF6',
                    '#6366f1'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

function initRevenueEvolutionChart() {
    const ctx = document.getElementById('revenueEvolutionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'],
            datasets: [{
                label: 'Receita Mensal',
                data: [3200, 4500, 3800, 5200, 4100, 3800, 4700, 5100, 4300, 4800, 5200],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function initProfessionalPerformanceChart() {
    const ctx = document.getElementById('professionalPerformanceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ana Costa', 'Carlos Mendes', 'Lucia Fernandes'],
            datasets: [{
                label: 'Atendimentos',
                data: [65, 45, 38],
                backgroundColor: [
                    '#8B5CF6',
                    '#6366f1',
                    '#10B981'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// =============================================================================
// AÇÕES DOS ELEMENTOS
// =============================================================================

function editAgendamento(id) {
    showToast(`Editando agendamento #${id}`, 'info');
    // Implementar edição
}

function deleteAgendamento(id) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        // Remover da array
        const index = demoData.agendamentos.findIndex(a => a.id === id);
        if (index !== -1) {
            demoData.agendamentos.splice(index, 1);
            // Recarregar página
            loadPageContent(appState.currentPage);
            showToast('Agendamento cancelado com sucesso!', 'success');
        }
    }
}

function editCliente(id) {
    showToast(`Editando cliente #${id}`, 'info');
    // Implementar edição
}

function deleteCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        const index = demoData.clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            demoData.clientes.splice(index, 1);
            loadPageContent(appState.currentPage);
            showToast('Cliente excluído com sucesso!', 'success');
        }
    }
}

function viewClienteDetalhes(id) {
    showToast(`Visualizando detalhes do cliente #${id}`, 'info');
    // Implementar visualização de detalhes
}

console.log('🚀 SalaoGerent Demo Script Loaded!');
