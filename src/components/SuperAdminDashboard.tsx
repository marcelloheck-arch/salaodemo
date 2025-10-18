'use client'

import React, { useState } from 'react';
import { 
  Users, 
  Key, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  LogOut,
  Database
} from 'lucide-react';
import { LicenseWithFeatures as License, SimpleClient as Client } from '@/lib/licenseDatabase';
import { LicenseGenerator, PLAN_CONFIGS, PlanConfig } from '@/lib/licenseGenerator';
import LicenseManagementPage from './LicenseManagementPage';
import MigrationManager from './MigrationManager';

// Tipos expandidos para o dashboard
interface ExtendedClient extends Client {
  phone?: string;
  company?: string;
  cnpj?: string;
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
  };
  licenses: License[];
  totalRevenue: number;
}

// Mock data - em produção viria do banco de dados
const mockClients: ExtendedClient[] = [
  {
    id: '1',
    name: 'Salão Beleza Total',
    email: 'contato@belezatotal.com',
    phone: '(11) 99999-9999',
    company: 'Beleza Total Ltda',
    cnpj: '12.345.678/0001-90',
    address: {
      street: 'Rua das Flores',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567'
    },
    licenses: [],
    createdAt: new Date('2024-01-15'),
    status: 'active',
    totalRevenue: 149.70
  },
  {
    id: '2',
    name: 'Estúdio Hair & Beauty',
    email: 'admin@studiobeauty.com',
    phone: '(11) 88888-8888',
    company: 'Studio Beauty ME',
    address: {
      street: 'Av. Paulista',
      number: '456',
      city: 'São Paulo',
      state: 'SP',
      zip: '01310-100'
    },
    licenses: [],
    createdAt: new Date('2024-02-20'),
    status: 'active',
    totalRevenue: 299.40
  }
];

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

export default function SuperAdminDashboard({ onLogout }: SuperAdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<'overview' | 'clients' | 'licenses' | 'plans'>('overview');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateLicense, setShowCreateLicense] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ExtendedClient | null>(null);

  // Estatísticas gerais
  const totalClients = clients.length;
  const totalRevenue = (clients as ExtendedClient[]).reduce((sum, client) => sum + client.totalRevenue, 0);
  const totalLicenses = (clients as ExtendedClient[]).reduce((sum, client) => sum + client.licenses.length, 0);
  const activeClients = clients.filter(client => (client as any).status === 'active').length;

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Licenças Ativas</p>
              <p className="text-3xl font-bold text-gray-900">{totalLicenses}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Key className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-3xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-gray-900">87%</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Vendas Recentes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas dos Últimos 30 Dias</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Gráfico será implementado aqui</p>
        </div>
      </div>
    </div>
  );

  const ClientsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Gestão de Clientes</h2>
        <button
          onClick={() => setShowCreateLicense(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Licença
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Licenças
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{(client as ExtendedClient).company || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{(client as ExtendedClient).cnpj || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{(client as ExtendedClient).licenses.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {(client as ExtendedClient).totalRevenue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedClient(client as ExtendedClient)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PlansTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Planos Disponíveis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLAN_CONFIGS.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white p-6 rounded-lg shadow-sm border-2 ${
              plan.popular ? 'border-primary' : 'border-gray-200'
            } relative`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 text-xs font-semibold rounded-full">
                  Mais Popular
                </span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">R$ {plan.price}</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {plan.maxUsers === -1 ? 'Usuários ilimitados' : `Até ${plan.maxUsers} usuários`}
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Recursos inclusos:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature.id} className="flex items-center text-sm">
                    {feature.enabled ? (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400 mr-2" />
                    )}
                    <span className={feature.enabled ? 'text-gray-900' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Key className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin - Agenda Salão</h1>
            </div>
            
            {/* Botão de Sair */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
              { id: 'clients', label: 'Clientes', icon: Users },
              { id: 'licenses', label: 'Licenças', icon: Key },
              { id: 'plans', label: 'Planos', icon: DollarSign },
              { id: 'migration', label: 'Migração', icon: Database },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'overview' && <OverviewTab />}
        {currentTab === 'clients' && <ClientsTab />}
        {currentTab === 'licenses' && <LicenseManagementPage />}
        {currentTab === 'plans' && <PlansTab />}
        {currentTab === 'migration' && <MigrationManager />}
      </main>
    </div>
  );
}
