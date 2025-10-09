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
  Heart
} from "lucide-react";
import { format, parseISO, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
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
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Maria Silva",
    phone: "(11) 99999-1234",
    email: "maria.silva@email.com",
    birthday: "1990-05-15",
    address: {
      street: "Rua das Flores, 123",
      neighborhood: "Centro",
      city: "São Paulo"
    },
    preferences: ["Corte moderno", "Escova", "Produtos veganos"],
    notes: "Cliente preferencial, sempre pontual",
    totalSpent: 1250.00,
    totalVisits: 15,
    lastVisit: "2025-09-28",
    averageTicket: 83.33,
    status: "vip",
    createdAt: "2024-08-15T10:30:00"
  },
  {
    id: "2",
    name: "João Santos",
    phone: "(11) 98888-5678",
    email: "joao.santos@email.com",
    birthday: "1985-12-03",
    preferences: ["Corte masculino", "Barba"],
    totalSpent: 340.00,
    totalVisits: 8,
    lastVisit: "2025-10-01",
    averageTicket: 42.50,
    status: "active",
    createdAt: "2025-01-20T14:15:00"
  },
  {
    id: "3",
    name: "Fernanda Lima",
    phone: "(11) 97777-9012",
    email: "fernanda.lima@email.com",
    birthday: "1995-08-22",
    address: {
      street: "Av. Paulista, 1000",
      neighborhood: "Bela Vista",
      city: "São Paulo"
    },
    preferences: ["Manicure", "Pedicure", "Nail art"],
    notes: "Gosta de cores vibrantes",
    totalSpent: 890.00,
    totalVisits: 12,
    lastVisit: "2025-09-30",
    averageTicket: 74.17,
    status: "active",
    createdAt: "2024-11-10T16:45:00"
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    phone: "(11) 96666-3456",
    preferences: ["Barba", "Corte simples"],
    totalSpent: 180.00,
    totalVisits: 6,
    lastVisit: "2025-08-15",
    averageTicket: 30.00,
    status: "inactive",
    createdAt: "2024-06-05T11:20:00"
  }
];

const statusColors = {
  active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inativo' },
  vip: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'VIP' }
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'totalSpent'>('name');
  const [showNewClient, setShowNewClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filtrar e ordenar clientes
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.phone.includes(searchTerm) ||
                           client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastVisit':
          return new Date(b.lastVisit || 0).getTime() - new Date(a.lastVisit || 0).getTime();
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        default:
          return 0;
      }
    });

  // Estatísticas
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    vip: clients.filter(c => c.status === 'vip').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h2>
            <p className="text-gray-600">Gerencie sua base de clientes</p>
          </div>
          <button
            onClick={() => setShowNewClient(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes VIP</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vip}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Gift className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="vip">VIP</option>
              <option value="inactive">Inativos</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Nome</option>
              <option value="lastVisit">Última Visita</option>
              <option value="totalSpent">Total Gasto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando seus primeiros clientes'}
            </p>
            <button
              onClick={() => setShowNewClient(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Adicionar Primeiro Cliente
            </button>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {client.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[client.status].bg} ${statusColors[client.status].text}`}>
                        {statusColors[client.status].label}
                      </span>
                      {client.birthday && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          🎂 {differenceInYears(new Date(), parseISO(client.birthday))} anos
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                      {client.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.lastVisit && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Última visita: {format(parseISO(client.lastVisit), 'dd/MM/yyyy')}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1 text-green-600">
                        <span className="font-medium">R$ {client.totalSpent.toFixed(2)}</span>
                        <span className="text-gray-500">total gasto</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <span className="font-medium">{client.totalVisits}</span>
                        <span className="text-gray-500">visitas</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-600">
                        <span className="font-medium">R$ {client.averageTicket.toFixed(2)}</span>
                        <span className="text-gray-500">ticket médio</span>
                      </div>
                    </div>

                    {/* Preferences */}
                    {client.preferences.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {client.preferences.slice(0, 3).map((pref, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                            >
                              {pref}
                            </span>
                          ))}
                          {client.preferences.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{client.preferences.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Ações do menu
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Novo Cliente (placeholder) */}
      {showNewClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Novo Cliente</h3>
            <p className="text-gray-600 mb-4">
              Funcionalidade de cadastro completo em desenvolvimento. 
              Incluirá formulário com dados pessoais, preferências e histórico.
            </p>
            <button
              onClick={() => setShowNewClient(false)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Cliente (placeholder) */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Cliente</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedClient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedClient.name}</h4>
                  <p className="text-gray-600">{selectedClient.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Total Gasto:</span>
                  <span className="ml-2 text-green-600">R$ {selectedClient.totalSpent.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Total de Visitas:</span>
                  <span className="ml-2">{selectedClient.totalVisits}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Ticket Médio:</span>
                  <span className="ml-2 text-purple-600">R$ {selectedClient.averageTicket.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Status:</span>
                  <span className={`ml-2 ${statusColors[selectedClient.status].text}`}>
                    {statusColors[selectedClient.status].label}
                  </span>
                </div>
              </div>

              {selectedClient.preferences.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Preferências:</h5>
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

              {selectedClient.notes && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Observações:</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedClient.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Editar Cliente
              </button>
              <button className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                Histórico de Agendamentos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}