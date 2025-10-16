"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Star,
  Edit,
  Trash2,
  MoreVertical,
  User,
  MapPin,
  Clock,
  TrendingUp,
  Gift,
  Heart,
  X,
  Check,
  AlertCircle,
  UserPlus,
  Key
} from "lucide-react";
import { format, parseISO, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday?: string;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
  };
  preferences: string[];
  notes?: string;
  totalSpent: number;
  totalVisits: number;
  lastVisit?: string;
  averageTicket: number;
  status: 'active' | 'inactive' | 'vip';
  createdAt: string;
  licenseKey?: string; // Nova propriedade para licença
}

interface NewClientFormData {
  name: string;
  phone: string;
  email: string;
  birthday?: string;
  notes?: string;
  licenseKey?: string; // Campo para nova licença
}

// Dados iniciais simulados
const initialClients: Client[] = [
  {
    id: "1",
    name: "Cliente Exemplo",
    phone: "(11) 99999-0000",
    email: "cliente@exemplo.com",
    birthday: "1990-01-01",
    preferences: ["Serviço Exemplo"],
    notes: "",
    totalSpent: 100.00,
    totalVisits: 2,
    lastVisit: "2025-10-15",
    averageTicket: 50.00,
    status: 'active',
    createdAt: "2025-01-01"
  }
];

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  const [newClientData, setNewClientData] = useState<NewClientFormData>({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    notes: '',
    licenseKey: ''
  });

  // Filtrar clientes
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para cadastrar novo cliente
  const handleCreateClient = () => {
    if (!newClientData.name || !newClientData.phone || !newClientData.email) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Telefone e E-mail).');
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: newClientData.name,
      phone: newClientData.phone,
      email: newClientData.email,
      birthday: newClientData.birthday,
      notes: newClientData.notes,
      licenseKey: newClientData.licenseKey,
      preferences: [],
      totalSpent: 0,
      totalVisits: 0,
      averageTicket: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setClients(prev => [newClient, ...prev]);
    setNewClientData({ name: '', phone: '', email: '', birthday: '', notes: '', licenseKey: '' });
    setShowNewClientForm(false);
  };

  // Função para editar cliente
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setNewClientData({
      name: client.name,
      phone: client.phone,
      email: client.email,
      birthday: client.birthday || '',
      notes: client.notes || '',
      licenseKey: client.licenseKey || ''
    });
    setShowNewClientForm(true);
  };

  // Função para atualizar cliente
  const handleUpdateClient = () => {
    if (!editingClient || !newClientData.name || !newClientData.phone || !newClientData.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setClients(prev => prev.map(client => 
      client.id === editingClient.id 
        ? {
            ...client,
            name: newClientData.name,
            phone: newClientData.phone,
            email: newClientData.email,
            birthday: newClientData.birthday,
            notes: newClientData.notes,
            licenseKey: newClientData.licenseKey
          }
        : client
    ));

    setEditingClient(null);
    setNewClientData({ name: '', phone: '', email: '', birthday: '', notes: '', licenseKey: '' });
    setShowNewClientForm(false);
  };

  // Função para excluir cliente
  const handleDeleteClient = (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
    }
  };

  // Cores dos status
  const statusColors = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inativo' },
    vip: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'VIP' }
  };

  // Fechar formulário
  const handleCloseForm = () => {
    setShowNewClientForm(false);
    setEditingClient(null);
    setNewClientData({ name: '', phone: '', email: '', birthday: '', notes: '', licenseKey: '' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">👥 Gestão de Clientes</h2>
            <p className="text-gray-600">Gerencie seus clientes e mantenha relacionamentos sólidos</p>
          </div>
          <button
            onClick={() => setShowNewClientForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Cadastrar Cliente</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'active' || c.status === 'vip').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes VIP</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'vip').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {clients.reduce((sum, client) => sum + client.totalSpent, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Clientes
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Nome, telefone ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="vip">VIP</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Clientes Cadastrados ({filteredClients.length})
          </h3>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Cadastre seu primeiro cliente para começar'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setShowNewClientForm(true)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cadastrar Primeiro Cliente
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{client.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[client.status].bg} ${statusColors[client.status].text}`}>
                            {statusColors[client.status].label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {client.lastVisit 
                              ? `Última visita: ${format(new Date(client.lastVisit), 'dd/MM/yyyy')}`
                              : 'Nunca visitou'
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Total Gasto:</span>
                          <span className="ml-2 text-green-600 font-semibold">R$ {client.totalSpent.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Visitas:</span>
                          <span className="ml-2">{client.totalVisits}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Ticket Médio:</span>
                          <span className="ml-2 text-purple-600 font-semibold">R$ {client.averageTicket.toFixed(2)}</span>
                        </div>
                      </div>

                      {client.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Observações:</strong> {client.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditClient(client)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar Cliente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientDetails(true);
                        }}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Ver Detalhes"
                      >
                        <User className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir Cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cadastro/Edição de Cliente */}
      {showNewClientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingClient ? '✏️ Editar Cliente' : '✨ Cadastrar Novo Cliente'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nome Completo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={newClientData.name}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={newClientData.phone}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="cliente@email.com"
                    required
                  />
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={newClientData.birthday}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, birthday: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={newClientData.notes}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Preferências, alergias, observações especiais..."
                  />
                </div>

                {/* Nova Licença */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Licença
                  </label>
                  <input
                    type="text"
                    value={newClientData.licenseKey || ''}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, licenseKey: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Ex: SALAO-PREMIUM-2024-001"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Insira a chave da licença se este cliente possui uma licença do sistema
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingClient ? handleUpdateClient : handleCreateClient}
                  disabled={!newClientData.name || !newClientData.phone || !newClientData.email}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {editingClient ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Cliente */}
      {showClientDetails && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Detalhes do Cliente</h3>
                <button
                  onClick={() => setShowClientDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {selectedClient.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedClient.name}</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedClient.status].bg} ${statusColors[selectedClient.status].text} mt-2`}>
                    {statusColors[selectedClient.status].label}
                  </span>
                </div>

                {/* Contato */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-800">Informações de Contato</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient.email}</span>
                    </div>
                    {selectedClient.birthday && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>
                          {format(new Date(selectedClient.birthday), 'dd/MM/yyyy')} 
                          ({differenceInYears(new Date(), new Date(selectedClient.birthday))} anos)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-800">Estatísticas</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-green-600 font-semibold">Total Gasto</div>
                      <div className="text-lg font-bold text-green-700">R$ {selectedClient.totalSpent.toFixed(2)}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-blue-600 font-semibold">Total Visitas</div>
                      <div className="text-lg font-bold text-blue-700">{selectedClient.totalVisits}</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-purple-600 font-semibold">Ticket Médio</div>
                      <div className="text-lg font-bold text-purple-700">R$ {selectedClient.averageTicket.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-600 font-semibold">Última Visita</div>
                      <div className="text-lg font-bold text-gray-700">
                        {selectedClient.lastVisit 
                          ? format(new Date(selectedClient.lastVisit), 'dd/MM/yyyy')
                          : 'Nunca'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferências */}
                {selectedClient.preferences.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800">Preferências</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.preferences.map((pref, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações */}
                {selectedClient.notes && (
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800">Observações</h5>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">{selectedClient.notes}</p>
                  </div>
                )}

                {/* Licença */}
                {selectedClient.licenseKey && (
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800">Licença do Sistema</h5>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Chave da Licença:</span>
                      </div>
                      <code className="block mt-2 bg-white px-3 py-2 rounded border text-sm font-mono">
                        {selectedClient.licenseKey}
                      </code>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowClientDetails(false);
                    handleEditClient(selectedClient);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Editar Cliente
                </button>
                <button
                  onClick={() => setShowClientDetails(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}