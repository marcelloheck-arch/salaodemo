// Script de teste para verificar o sistema de login
// Execute no console do navegador (F12)

console.log('🧪 INICIANDO TESTE COMPLETO DO SISTEMA DE LOGIN');

// Função para limpar localStorage
function clearAll() {
    localStorage.removeItem('userData');
    localStorage.removeItem('authUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('agenda_salao_registrations');
    localStorage.removeItem('agenda_salao_licenses');
    console.log('🧹 localStorage limpo');
}

// Função para criar usuário de teste
function createTestUser(userData) {
    const registrations = JSON.parse(localStorage.getItem('agenda_salao_registrations') || '[]');
    const licenses = JSON.parse(localStorage.getItem('agenda_salao_licenses') || '[]');
    
    // Criar registro
    const newRegistration = {
        id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        nomeEmpresa: userData.empresa,
        cnpj: userData.cnpj,
        endereco: userData.endereco,
        cidade: userData.cidade,
        estado: userData.estado,
        planoSelecionado: userData.plano,
        status: 'aprovado',
        dataCadastro: new Date()
    };
    
    // Gerar chave única
    const prefixes = ['SLN', 'BEL', 'SAL', 'PRO', 'LIC'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const year = new Date().getFullYear();
    const generateSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const chaveAtivacao = `${prefix}-${year}-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
    
    // Criar licença
    const newLicense = {
        id: `lic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chaveAtivacao: chaveAtivacao,
        userId: newRegistration.id,
        planoId: userData.plano,
        status: 'ativa',
        dataAtivacao: new Date().toISOString(),
        dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        renovacaoAutomatica: true,
        recursosAtivos: ['dashboard', 'agendamentos', 'clientes', 'servicos'],
        clientData: {
            name: userData.nome,
            email: userData.email,
            phone: userData.telefone,
            company: userData.empresa,
            cnpj: userData.cnpj,
            address: userData.endereco,
            city: userData.cidade,
            state: userData.estado
        }
    };
    
    // Salvar no localStorage
    registrations.push(newRegistration);
    licenses.push(newLicense);
    localStorage.setItem('agenda_salao_registrations', JSON.stringify(registrations));
    localStorage.setItem('agenda_salao_licenses', JSON.stringify(licenses));
    
    return { registration: newRegistration, license: newLicense };
}

// Função para simular login
function simulateLogin(email, chaveAtivacao) {
    console.log(`🔐 Simulando login para: ${email} com chave: ${chaveAtivacao}`);
    
    const licenses = JSON.parse(localStorage.getItem('agenda_salao_licenses') || '[]');
    const validLicense = licenses.find(license => 
        license.chaveAtivacao === chaveAtivacao && 
        license.status === 'ativa'
    );
    
    if (validLicense) {
        const userData = {
            type: 'salon',
            name: `${validLicense.clientData.name} - ${validLicense.clientData.company}`,
            email: email,
            salonName: validLicense.clientData.company,
            licenseKey: chaveAtivacao,
        };
        
        // Simular salvamento no localStorage como o sistema faz
        localStorage.removeItem('userData');
        localStorage.removeItem('authUser');
        localStorage.removeItem('isAuthenticated');
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('✅ Login simulado com sucesso:', userData);
        return { success: true, userData };
    } else {
        console.log('❌ Licença não encontrada ou inativa');
        return { success: false, error: 'Licença inválida' };
    }
}

// Criar usuários de teste
console.log('\n📝 CRIANDO USUÁRIOS DE TESTE...');

const usuarios = [
    {
        nome: 'João Silva',
        email: 'joao.silva@teste.com',
        telefone: '(11) 99999-1111',
        empresa: 'Salão Elegante',
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        plano: 'professional'
    },
    {
        nome: 'Maria Santos',
        email: 'maria.santos@teste.com',
        telefone: '(11) 99999-2222',
        empresa: 'Beauty Center',
        cnpj: '98.765.432/0001-10',
        endereco: 'Av. Principal, 456',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        plano: 'premium'
    },
    {
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@teste.com',
        telefone: '(11) 99999-3333',
        empresa: 'Studio Hair',
        cnpj: '11.222.333/0001-44',
        endereco: 'Rua do Corte, 789',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        plano: 'starter'
    }
];

// Limpar e criar usuários
clearAll();

const usuariosCriados = [];
usuarios.forEach((userData, index) => {
    console.log(`\n👤 Criando usuário ${index + 1}: ${userData.nome}`);
    const result = createTestUser(userData);
    usuariosCriados.push({
        ...userData,
        chave: result.license.chaveAtivacao
    });
    console.log(`✅ Usuário criado - Email: ${userData.email}, Chave: ${result.license.chaveAtivacao}`);
});

// Testar logins
console.log('\n🧪 TESTANDO LOGINS...');
usuariosCriados.forEach((usuario, index) => {
    console.log(`\n🔑 Teste ${index + 1}: ${usuario.nome}`);
    const loginResult = simulateLogin(usuario.email, usuario.chave);
    
    if (loginResult.success) {
        console.log(`✅ Login OK para ${usuario.nome}`);
        console.log(`📊 Dados salvos:`, loginResult.userData);
        
        // Verificar se seria direcionado corretamente
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        const userType = authUser.type === 'superadmin' || authUser.type === 'super_admin' ? 'super_admin' : 'salon_admin';
        
        if (userType === 'super_admin') {
            console.log(`🔧 ${usuario.nome} seria direcionado para: PAINEL ADMINISTRATIVO`);
        } else {
            console.log(`🏪 ${usuario.nome} seria direcionado para: DASHBOARD DO SALÃO`);
        }
    } else {
        console.log(`❌ Login FALHOU para ${usuario.nome}: ${loginResult.error}`);
    }
});

// Mostrar resumo
console.log('\n📋 RESUMO DOS USUÁRIOS CRIADOS:');
usuariosCriados.forEach((usuario, index) => {
    console.log(`${index + 1}. ${usuario.nome} (${usuario.empresa})`);
    console.log(`   📧 Email: ${usuario.email}`);
    console.log(`   🔑 Chave: ${usuario.chave}`);
    console.log(`   💰 Plano: ${usuario.plano}`);
    console.log('');
});

// Testar login do Super Admin
console.log('\n🔧 TESTANDO LOGIN SUPER ADMIN...');
localStorage.removeItem('userData');
localStorage.removeItem('authUser'); 
localStorage.removeItem('isAuthenticated');

const superAdminData = {
    type: 'superadmin',
    name: 'Super Administrador',
    email: 'superadmin@agendusalao.com'
};

localStorage.setItem('userData', JSON.stringify(superAdminData));
localStorage.setItem('authUser', JSON.stringify(superAdminData));
localStorage.setItem('isAuthenticated', 'true');

console.log('✅ Super Admin login simulado');
console.log('🔧 Super Admin seria direcionado para: PAINEL ADMINISTRATIVO COMPLETO');

console.log('\n🎉 TESTE COMPLETO FINALIZADO!');
console.log('Recarregue a página para ver o resultado do último login (Super Admin)');