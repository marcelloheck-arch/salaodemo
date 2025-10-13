// Script para testar credenciais do sistema
// Execute este script no console do browser

console.log('🔍 TESTANDO CREDENCIAIS DO SISTEMA');

// Limpar localStorage primeiro
localStorage.clear();
console.log('✅ LocalStorage limpo');

// Testar diferentes tipos de login
const testCredentials = [
  {
    name: 'Super Admin',
    email: 'superadmin@agendusalao.com',
    password: 'SuperAdmin@2024',
    type: 'superadmin'
  },
  {
    name: 'Admin Salão Demo',
    email: 'admin@salao.com',
    password: 'admin123',
    type: 'salon'
  },
  {
    name: 'Admin com Licença',
    email: 'admin@salao.com',
    password: 'admin123',
    licenseKey: 'TEST-1234-ABCD-5678',
    type: 'salon'
  }
];

console.log('📋 CREDENCIAIS DISPONÍVEIS:');
testCredentials.forEach((cred, index) => {
  console.log(`${index + 1}. ${cred.name}:`);
  console.log(`   Email: ${cred.email}`);
  console.log(`   Senha: ${cred.password}`);
  if (cred.licenseKey) {
    console.log(`   Licença: ${cred.licenseKey}`);
  }
  console.log(`   Tipo: ${cred.type}`);
  console.log('');
});

console.log('🎯 Para testar, use as credenciais acima na tela de login');
console.log('🚀 Navegue para http://localhost:3004 para começar');