// Script de teste para verificar o fluxo de usuário completo
// Execute este script no console do browser

console.log('🧪 INICIANDO TESTE DO FLUXO DE USUÁRIO');

// 1. Limpar localStorage
localStorage.clear();
console.log('✅ LocalStorage limpo');

// 2. Simular registro de usuário
const testRegistration = {
  id: 'test-user-' + Date.now(),
  empresa: {
    nomeEmpresa: 'Salão Teste',
    cnpj: '12.345.678/0001-99',
    telefone: '(11) 99999-9999',
    endereco: 'Rua Teste, 123'
  },
  dadosPessoais: {
    nome: 'João Teste',
    email: 'joao@salaoteste.com',
    telefone: '(11) 98888-8888'
  },
  plano: {
    id: 'professional',
    nome: 'Professional',
    preco: 99.90,
    recursos: ['Agendamentos ilimitados', 'Gestão de clientes', 'Relatórios básicos']
  },
  status: 'approved', // Aprovado para teste
  createdAt: new Date().toISOString()
};

// 3. Salvar registro no localStorage
const existingRegistrations = JSON.parse(localStorage.getItem('registrations') || '[]');
existingRegistrations.push(testRegistration);
localStorage.setItem('registrations', JSON.stringify(existingRegistrations));
console.log('✅ Usuário de teste registrado:', testRegistration);

// 4. Criar licença para o usuário
const testLicense = {
  id: 'LIC-' + Date.now(),
  registrationId: testRegistration.id,
  salonName: testRegistration.empresa.nomeEmpresa,
  ownerName: testRegistration.dadosPessoais.nome,
  email: testRegistration.dadosPessoais.email,
  plan: testRegistration.plano.nome,
  licenseKey: 'TEST-FLOW-2024-ABCD',
  status: 'active',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 ano
};

const existingLicenses = JSON.parse(localStorage.getItem('licenses') || '[]');
existingLicenses.push(testLicense);
localStorage.setItem('licenses', JSON.stringify(existingLicenses));
console.log('✅ Licença criada para o usuário:', testLicense);

// 5. Recarregar página para testar
console.log('🔄 Dados de teste criados. Agora teste o login com:');
console.log('Email: joao@salaoteste.com');
console.log('Licença: TEST-FLOW-2024-ABCD');
console.log('🚀 Recarregando página...');

setTimeout(() => {
  window.location.reload();
}, 2000);