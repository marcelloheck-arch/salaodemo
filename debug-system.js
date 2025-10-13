// Script de diagnóstico completo do sistema
// Execute este script no console do browser

console.log('🔧 DIAGNÓSTICO COMPLETO DO SISTEMA');
console.log('=====================================');

// 1. Verificar estado atual do localStorage
console.log('\n📊 ESTADO ATUAL DO LOCALSTORAGE:');
console.log('isAuthenticated:', localStorage.getItem('isAuthenticated'));
console.log('authUser:', localStorage.getItem('authUser'));
console.log('userData:', localStorage.getItem('userData'));
console.log('registrations:', localStorage.getItem('registrations') ? 'Existem' : 'Vazio');
console.log('licenses:', localStorage.getItem('licenses') ? 'Existem' : 'Vazio');

// 2. Função para criar usuário de teste completo
function createTestUser() {
  console.log('\n🧪 CRIANDO USUÁRIO DE TESTE COMPLETO...');
  
  // Limpar tudo primeiro
  localStorage.clear();
  
  // Criar registro
  const testReg = {
    id: 'test-user-' + Date.now(),
    empresa: {
      nomeEmpresa: 'Salão Beauty Test',
      cnpj: '12.345.678/0001-99',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Flores, 123, São Paulo - SP'
    },
    dadosPessoais: {
      nome: 'Maria Silva',
      email: 'maria@beautytest.com',
      telefone: '(11) 98888-8888'
    },
    plano: {
      id: 'professional',
      nome: 'Professional',
      preco: 99.90,
      recursos: ['Agendamentos ilimitados', 'Gestão de clientes', 'Relatórios básicos']
    },
    status: 'approved',
    createdAt: new Date().toISOString()
  };
  
  // Salvar registro
  localStorage.setItem('registrations', JSON.stringify([testReg]));
  
  // Criar licença
  const testLicense = {
    id: 'LIC-' + Date.now(),
    registrationId: testReg.id,
    salonName: testReg.empresa.nomeEmpresa,
    ownerName: testReg.dadosPessoais.nome,
    email: testReg.dadosPessoais.email,
    plan: testReg.plano.nome,
    licenseKey: 'BEAUTY-TEST-2024-FLOW',
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  localStorage.setItem('licenses', JSON.stringify([testLicense]));
  
  console.log('✅ Usuário de teste criado:');
  console.log('   Email:', testReg.dadosPessoais.email);
  console.log('   Licença:', testLicense.licenseKey);
  
  return { registration: testReg, license: testLicense };
}

// 3. Função para testar login
function testLogin(email, licenseKey) {
  console.log(`\n🔐 TESTANDO LOGIN: ${email} / ${licenseKey}`);
  
  // Simular processo de login
  const licenses = JSON.parse(localStorage.getItem('licenses') || '[]');
  const foundLicense = licenses.find(l => l.email === email && l.licenseKey === licenseKey);
  
  if (foundLicense) {
    console.log('✅ Licença encontrada:', foundLicense);
    
    // Simular autenticação
    const authUser = {
      type: 'salon',
      name: foundLicense.ownerName,
      email: foundLicense.email,
      salonName: foundLicense.salonName,
      licenseKey: foundLicense.licenseKey
    };
    
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem('userData', JSON.stringify(authUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('🎉 LOGIN SIMULADO COM SUCESSO!');
    console.log('⚡ Recarregando página...');
    
    setTimeout(() => window.location.reload(), 1000);
    
    return true;
  } else {
    console.log('❌ Licença não encontrada');
    return false;
  }
}

// 4. Disponibilizar funções globalmente
window.createTestUser = createTestUser;
window.testLogin = testLogin;

// 5. Menu de opções
console.log('\n📋 OPÇÕES DISPONÍVEIS:');
console.log('1. createTestUser() - Criar usuário de teste completo');
console.log('2. testLogin("email", "licenseKey") - Testar login específico');
console.log('3. localStorage.clear() - Limpar tudo');
console.log('\n🎯 CREDENCIAIS PADRÃO PARA TESTE:');
console.log('Super Admin: superadmin@agendusalao.com / SuperAdmin@2024');
console.log('Salão Demo: admin@salao.com / admin123');
console.log('\n💡 EXEMPLO DE USO:');
console.log('createTestUser(); // Cria usuário e licença');
console.log('// Depois teste o login na interface ou use:');
console.log('// testLogin("maria@beautytest.com", "BEAUTY-TEST-2024-FLOW");');