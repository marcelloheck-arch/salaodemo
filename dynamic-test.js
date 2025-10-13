// Script de teste com dados dinâmicos do usuário
// Execute este script no console do browser

console.log('🧪 TESTE DE DADOS DINÂMICOS DO USUÁRIO');
console.log('==========================================');

// Função para criar usuário de teste com dados específicos
function createDynamicTestUser(name, email, salonName, licenseKey) {
  console.log(`\n👤 CRIANDO USUÁRIO: ${name}`);
  
  // Limpar localStorage
  localStorage.clear();
  
  // Criar registro completo
  const testReg = {
    id: 'user-' + Date.now(),
    empresa: {
      nomeEmpresa: salonName,
      cnpj: '12.345.678/0001-99',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Flores, 123, São Paulo - SP'
    },
    dadosPessoais: {
      nome: name,
      email: email,
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
  
  // Criar licença
  const testLicense = {
    id: 'LIC-' + Date.now(),
    registrationId: testReg.id,
    salonName: salonName,
    ownerName: name,
    email: email,
    plan: testReg.plano.nome,
    licenseKey: licenseKey,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  // Salvar dados
  localStorage.setItem('registrations', JSON.stringify([testReg]));
  localStorage.setItem('licenses', JSON.stringify([testLicense]));
  
  console.log('✅ Dados salvos:');
  console.log('   Nome:', name);
  console.log('   Email:', email);
  console.log('   Salão:', salonName);
  console.log('   Licença:', licenseKey);
  
  return { registration: testReg, license: testLicense };
}

// Função para fazer login dinâmico
function loginUser(email, licenseKey) {
  console.log(`\n🔐 FAZENDO LOGIN: ${email}`);
  
  const licenses = JSON.parse(localStorage.getItem('licenses') || '[]');
  const foundLicense = licenses.find(l => l.email === email && l.licenseKey === licenseKey);
  
  if (foundLicense) {
    // Criar dados de autenticação
    const authUser = {
      type: 'salon',
      name: foundLicense.ownerName,
      email: foundLicense.email,
      salonName: foundLicense.salonName,
      licenseKey: foundLicense.licenseKey
    };
    
    // Salvar autenticação
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem('userData', JSON.stringify(authUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('🎉 LOGIN REALIZADO COM SUCESSO!');
    console.log('📊 Dados do usuário logado:', authUser);
    
    // Recarregar página
    setTimeout(() => window.location.reload(), 1000);
    return true;
  } else {
    console.log('❌ Credenciais inválidas');
    return false;
  }
}

// Criar usuários de teste predefinidos
const testUsers = [
  {
    name: 'Maria Fernanda Silva',
    email: 'maria@belezatotal.com',
    salonName: 'Beleza Total Studio',
    licenseKey: 'BELEZA-2024-STUDIO'
  },
  {
    name: 'Ana Carolina Santos',
    email: 'ana@glamourhair.com',
    salonName: 'Glamour Hair Design',
    licenseKey: 'GLAMOUR-2024-HAIR'
  },
  {
    name: 'Juliana Costa Lima',
    email: 'juliana@espacobem.com',
    salonName: 'Espaço Bem Estar',
    licenseKey: 'ESPACO-2024-BEM'
  }
];

// Disponibilizar funções globalmente
window.createDynamicTestUser = createDynamicTestUser;
window.loginUser = loginUser;
window.testUsers = testUsers;

console.log('\n📋 USUÁRIOS DE TESTE DISPONÍVEIS:');
testUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.name}`);
  console.log(`   Salão: ${user.salonName}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Licença: ${user.licenseKey}`);
  console.log('');
});

console.log('🎯 COMANDOS DISPONÍVEIS:');
console.log('createDynamicTestUser("Nome", "email@domain.com", "Nome do Salão", "LICENCA-KEY")');
console.log('loginUser("email@domain.com", "LICENCA-KEY")');
console.log('\n💡 EXEMPLO RÁPIDO:');
console.log('// Criar usuário Maria:');
console.log('createDynamicTestUser(testUsers[0].name, testUsers[0].email, testUsers[0].salonName, testUsers[0].licenseKey);');
console.log('// Login da Maria:');
console.log('loginUser(testUsers[0].email, testUsers[0].licenseKey);');