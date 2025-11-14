// Script de limpeza total do sistema para vendas/testes
// Execute este arquivo no console do navegador para limpar todos os dados simulados

export function limparSistemaCompleto() {
  console.log('🧹 Iniciando limpeza completa do sistema...');
  
  // Limpar localStorage
  const keysToRemove = [
    'agenda_salao_registrations',
    'agenda_salao_licenses',
    'agenda_salao_last_update',
    'agenda_salao_clients',
    'agenda_salao_services',
    'agenda_salao_staff',
    'agenda_salao_appointments',
    'agenda_salao_transactions',
    'agenda_salao_avaliacoes',
    'agenda_salao_pagamentos',
    'agenda_salao_config',
    'agenda_salao_user',
    'agenda_salao_auth'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
  });
  
  // Limpar sessionStorage
  sessionStorage.clear();
  console.log('✅ SessionStorage limpo');
  
  // Limpar IndexedDB (se houver)
  if (typeof indexedDB !== 'undefined') {
    indexedDB.databases().then(databases => {
      databases.forEach(db => {
        if (db.name?.includes('agenda_salao')) {
          indexedDB.deleteDatabase(db.name);
          console.log(`✅ Database removido: ${db.name}`);
        }
      });
    }).catch(err => {
      console.warn('Não foi possível limpar IndexedDB:', err);
    });
  }
  
  console.log('✨ Sistema totalmente limpo!');
  console.log('🔄 Recarregue a página para começar do zero.');
  
  return {
    success: true,
    message: 'Sistema limpo com sucesso! Recarregue a página.',
    clearedItems: keysToRemove.length
  };
}

// Auto-executar se estiver no browser
if (typeof window !== 'undefined') {
  (window as any).limparSistema = limparSistemaCompleto;
  console.log('💡 Execute limparSistema() no console para limpar todos os dados');
}

export default limparSistemaCompleto;
