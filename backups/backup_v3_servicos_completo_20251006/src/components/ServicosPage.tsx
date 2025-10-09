"use client";

import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Plus, 
  Search,
  Filter,
  Clock,
  DollarSign,
  Star,
  Edit,
  Trash2,
  MoreVertical,
  Tag,
  Users,
  TrendingUp,
  Eye,
  EyeOff,
  Save,
  X
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  duration: number; // em minutos
  price: number;
  commission: number; // porcentagem
  isActive: boolean;
  popularity: number; // 0-100
  totalBookings: number;
  revenue: number;
  professionals: string[]; // IDs dos profissionais que podem fazer
  createdAt: string;
}

interface NewService {
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  commission: number;
  professionals: string[];
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Corte Feminino",
    description: "Corte moderno com técnicas atuais",
    category: "Cabelo",
    duration: 60,
    price: 65.00,
    commission: 40,
    isActive: true,
    popularity: 95,
    totalBookings: 120,
    revenue: 7800.00,
    professionals: ["1", "2"],
    createdAt: "2024-08-01T10:00:00"
  },
  {
    id: "2",
    name: "Escova Progressiva",
    description: "Alisamento natural e duradouro",
    category: "Cabelo",
    duration: 180,
    price: 150.00,
    commission: 45,
    isActive: true,
    popularity: 78,
    totalBookings: 45,
    revenue: 6750.00,
    professionals: ["1"],
    createdAt: "2024-08-01T10:00:00"
  },
  {
    id: "3",
    name: "Manicure",
    description: "Cuidado completo das unhas das mãos",
    category: "Unhas",
    duration: 45,
    price: 35.00,
    commission: 35,
    isActive: true,
    popularity: 88,
    totalBookings: 200,
    revenue: 7000.00,
    professionals: ["3"],
    createdAt: "2024-08-01T10:00:00"
  },
  {
    id: "4",
    name: "Pedicure",
    description: "Cuidado completo das unhas dos pés",
    category: "Unhas",
    duration: 60,
    price: 45.00,
    commission: 35,
    isActive: true,
    popularity: 82,
    totalBookings: 150,
    revenue: 6750.00,
    professionals: ["3"],
    createdAt: "2024-08-01T10:00:00"
  },
  {
    id: "5",
    name: "Coloração",
    description: "Mudança de cor com produtos premium",
    category: "Cabelo",
    duration: 120,
    price: 120.00,
    commission: 50,
    isActive: true,
    popularity: 72,
    totalBookings: 80,
    revenue: 9600.00,
    professionals: ["1", "2"],
    createdAt: "2024-08-01T10:00:00"
  },
  {
    id: "6",
    name: "Barba",
    description: "Aparar e modelar barba",
    category: "Masculino",
    duration: 30,
    price: 25.00,
    commission: 40,
    isActive: true,
    popularity: 65,
    totalBookings: 95,
    revenue: 2375.00,
    professionals: ["4"],
    createdAt: "2024-08-01T10:00:00"
  },
  {
    id: "7",
    name: "Hidratação",
    description: "Tratamento intensivo para cabelos",
    category: "Cabelo",
    duration: 90,
    price: 80.00,
    commission: 35,
    isActive: false,
    popularity: 60,
    totalBookings: 30,
    revenue: 2400.00,
    professionals: ["1", "2"],
    createdAt: "2024-08-01T10:00:00"
  }
];

const categories = ["Todos", "Cabelo", "Unhas", "Masculino", "Estética"];

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity' | 'revenue'>('name');
  const [showNewService, setShowNewService] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showEditService, setShowEditService] = useState(false);
  const [newService, setNewService] = useState<NewService>({
    name: '',
    description: '',
    category: '',
    duration: 60,
    price: 0,
    commission: 30,
    professionals: []
  });

  // Funções para gerenciar serviços
  const handleCreateService = () => {
    if (newService.name && newService.category && newService.price > 0) {
      const service: Service = {
        id: `service-${Date.now()}`,
        name: newService.name,
        description: newService.description,
        category: newService.category,
        duration: newService.duration,
        price: newService.price,
        commission: newService.commission,
        isActive: true,
        popularity: 0,
        totalBookings: 0,
        revenue: 0,
        professionals: newService.professionals,
        createdAt: new Date().toISOString()
      };
      
      setServices(prev => [...prev, service]);
      setNewService({
        name: '',
        description: '',
        category: '',
        duration: 60,
        price: 0,
        commission: 30,
        professionals: []
      });
      setShowNewService(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowEditService(true);
  };

  const handleSaveEditService = () => {
    if (editingService) {
      setServices(prev => 
        prev.map(s => s.id === editingService.id ? editingService : s)
      );
      setShowEditService(false);
      setEditingService(null);
    }
  };

  const handleToggleServiceStatus = (serviceId: string) => {
    setServices(prev => 
      prev.map(s => s.id === serviceId ? { ...s, isActive: !s.isActive } : s)
    );
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  // Filtrar e ordenar serviços
  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'Todos' || service.category === categoryFilter;
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && service.isActive) ||
                           (statusFilter === 'inactive' && !service.isActive);
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'revenue':
          return b.revenue - a.revenue;
        default:
          return 0;
      }
    });

  // Estatísticas
  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    revenue: services.reduce((sum, s) => sum + s.revenue, 0),
    averagePrice: services.reduce((sum, s) => sum + s.price, 0) / services.length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Serviços</h2>
            <p className="text-gray-600">Gerencie o catálogo de serviços do salão</p>
          </div>
          <button
            onClick={() => setShowNewService(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Serviço</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Scissors className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Serviços Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.averagePrice.toFixed(2)}</p>
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
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Nome</option>
              <option value="price">Preço</option>
              <option value="popularity">Popularidade</option>
              <option value="revenue">Receita</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Scissors className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum serviço encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== 'Todos' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando seus primeiros serviços'}
            </p>
            <button
              onClick={() => setShowNewService(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Adicionar Primeiro Serviço
            </button>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                service.isActive ? 'border-gray-200 hover:border-purple-300' : 'border-gray-100 opacity-75'
              }`}
              onClick={() => setSelectedService(service)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.category === 'Cabelo' ? 'bg-pink-100 text-pink-800' :
                      service.category === 'Unhas' ? 'bg-purple-100 text-purple-800' :
                      service.category === 'Masculino' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {service.category}
                    </span>
                    {!service.isActive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {service.name}
                  </h3>
                  
                  {service.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditService(service);
                    }}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar serviço"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleServiceStatus(service.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={service.isActive ? "Desativar serviço" : "Ativar serviço"}
                  >
                    {service.isActive ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(service.id);
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Excluir serviço"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Price and Duration */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{service.duration}min</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="flex items-center space-x-1 text-purple-600">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">{service.popularity}%</span>
                  </div>
                  <span className="text-gray-500">popularidade</span>
                </div>
                
                <div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{service.totalBookings}</span>
                  </div>
                  <span className="text-gray-500">agendamentos</span>
                </div>
              </div>

              {/* Revenue */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Receita gerada:</span>
                  <span className="font-bold text-green-600">
                    R$ {service.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">Comissão:</span>
                  <span className="font-medium text-purple-600">
                    {service.commission}%
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Novo Serviço */}
      {showNewService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Criar Novo Serviço
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  placeholder="Ex: Corte Feminino"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Descrição do serviço"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Cabelo">Cabelo</option>
                  <option value="Unhas">Unhas</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Estética">Estética</option>
                  <option value="Maquiagem">Maquiagem</option>
                  <option value="Sobrancelha">Sobrancelha</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    value={newService.duration}
                    onChange={(e) => setNewService({...newService, duration: parseInt(e.target.value) || 60})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comissão (%)
                </label>
                <input
                  type="number"
                  value={newService.commission}
                  onChange={(e) => setNewService({...newService, commission: parseFloat(e.target.value) || 0})}
                  placeholder="30"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowNewService(false);
                  setNewService({
                    name: '',
                    description: '',
                    category: '',
                    duration: 60,
                    price: 0,
                    commission: 30,
                    professionals: []
                  });
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateService}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Criar Serviço
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Serviço (placeholder) */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Serviço</h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedService.name}</h4>
                <p className="text-gray-600">{selectedService.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Categoria:</span>
                  <span className="ml-2">{selectedService.category}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Duração:</span>
                  <span className="ml-2">{selectedService.duration} minutos</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Preço:</span>
                  <span className="ml-2 text-green-600">R$ {selectedService.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Comissão:</span>
                  <span className="ml-2 text-purple-600">{selectedService.commission}%</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Popularidade:</span>
                  <span className="ml-2">{selectedService.popularity}%</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Status:</span>
                  <span className={`ml-2 ${selectedService.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedService.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Performance:</h5>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600">Total de Agendamentos:</span>
                    <p className="text-lg font-bold text-blue-600">{selectedService.totalBookings}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Receita Gerada:</span>
                    <p className="text-lg font-bold text-green-600">R$ {selectedService.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button 
                onClick={() => {
                  handleEditService(selectedService);
                  setSelectedService(null);
                }}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Editar Serviço
              </button>
              <button 
                onClick={() => handleToggleServiceStatus(selectedService.id)}
                className={`flex-1 border py-2 rounded-lg transition-colors ${
                  selectedService.isActive 
                    ? 'border-red-600 text-red-600 hover:bg-red-50'
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                {selectedService.isActive ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Serviço */}
      {showEditService && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Editar Serviço
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={editingService.category}
                  onChange={(e) => setEditingService({...editingService, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Cabelo">Cabelo</option>
                  <option value="Unhas">Unhas</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Estética">Estética</option>
                  <option value="Maquiagem">Maquiagem</option>
                  <option value="Sobrancelha">Sobrancelha</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={(e) => setEditingService({...editingService, price: parseFloat(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    value={editingService.duration}
                    onChange={(e) => setEditingService({...editingService, duration: parseInt(e.target.value) || 60})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comissão (%)
                </label>
                <input
                  type="number"
                  value={editingService.commission}
                  onChange={(e) => setEditingService({...editingService, commission: parseFloat(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditService(false);
                  setEditingService(null);
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditService}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}