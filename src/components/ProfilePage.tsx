"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Clock, 
  Settings,
  Save,
  Upload,
  Camera,
  Edit3
} from 'lucide-react';
import { Button, GlassCard } from '@/components/ui';

interface SalonProfile {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: string;
  workingHours: {
    [key: string]: { start: string; end: string; closed: boolean };
  };
  services: string[];
  description: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<SalonProfile>({
    name: 'Beleza & Estilo',
    ownerName: 'Maria Silva',
    email: 'admin@salao.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    workingHours: {
      monday: { start: '09:00', end: '18:00', closed: false },
      tuesday: { start: '09:00', end: '18:00', closed: false },
      wednesday: { start: '09:00', end: '18:00', closed: false },
      thursday: { start: '09:00', end: '18:00', closed: false },
      friday: { start: '09:00', end: '19:00', closed: false },
      saturday: { start: '08:00', end: '17:00', closed: false },
      sunday: { start: '09:00', end: '15:00', closed: true },
    },
    services: ['Corte', 'Escova', 'Manicure', 'Pedicure', 'Hidratação'],
    description: 'Salão especializado em beleza e bem-estar, com profissionais qualificados e ambiente acolhedor.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'hours' | 'services'>('basic');

  // Carregar dados do usuário autenticado
  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);
        console.log('📋 Carregando dados do usuário no perfil:', userData);
        
        setProfile(prevProfile => ({
          ...prevProfile,
          name: userData.salonName || prevProfile.name,
          ownerName: userData.name || prevProfile.ownerName,
          email: userData.email || prevProfile.email,
        }));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const handleSave = () => {
    // Atualizar localStorage para refletir mudanças no header
    const currentUser = JSON.parse(localStorage.getItem('agenda_salao_user') || '{}');
    const updatedUser = {
      ...currentUser,
      name: profile.ownerName,
      email: profile.email,
      salonName: profile.name,
      phone: profile.phone
    };
    localStorage.setItem('agenda_salao_user', JSON.stringify(updatedUser));
    
    // Atualizar também authUser
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const mergedAuthUser = { ...authUser, ...updatedUser };
    localStorage.setItem('authUser', JSON.stringify(mergedAuthUser));
    
    // Disparar evento customizado para atualizar MainApp
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: mergedAuthUser }));
    
    console.log('Saving profile:', profile);
    console.log('Updated user in localStorage:', updatedUser);
    setIsEditing(false);
    alert('Perfil salvo com sucesso! O nome será atualizado automaticamente.');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Perfil do Salão</h2>
            <p className="text-gray-600">Gerencie as informações do seu estabelecimento</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <GlassCard className="mb-6">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center overflow-hidden">
                {profile.logo ? (
                  <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-2xl">📅</span>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary-dark">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-gray-600 mb-2">Proprietário: {profile.ownerName}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {profile.email}
                </span>
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {profile.phone}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'basic', label: 'Informações Básicas', icon: User },
                { id: 'hours', label: 'Horário de Funcionamento', icon: Clock },
                { id: 'services', label: 'Serviços', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Salão
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Proprietário
                    </label>
                    <input
                      type="text"
                      value={profile.ownerName}
                      onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours Tab */}
            {activeTab === 'hours' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Horário de Funcionamento</h3>
                {Object.entries(profile.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-32">
                      <span className="font-medium text-gray-700">
                        {dayNames[day as keyof typeof dayNames]}
                      </span>
                    </div>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => setProfile({
                          ...profile,
                          workingHours: {
                            ...profile.workingHours,
                            [day]: { ...hours, closed: !e.target.checked }
                          }
                        })}
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-600">Aberto</span>
                    </label>

                    {!hours.closed && (
                      <>
                        <input
                          type="time"
                          value={hours.start}
                          onChange={(e) => setProfile({
                            ...profile,
                            workingHours: {
                              ...profile.workingHours,
                              [day]: { ...hours, start: e.target.value }
                            }
                          })}
                          disabled={!isEditing}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                        />
                        <span className="text-gray-500">às</span>
                        <input
                          type="time"
                          value={hours.end}
                          onChange={(e) => setProfile({
                            ...profile,
                            workingHours: {
                              ...profile.workingHours,
                              [day]: { ...hours, end: e.target.value }
                            }
                          })}
                          disabled={!isEditing}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                        />
                      </>
                    )}

                    {hours.closed && (
                      <span className="text-gray-400 italic">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Serviços Oferecidos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{service}</span>
                      {isEditing && (
                        <button
                          onClick={() => setProfile({
                            ...profile,
                            services: profile.services.filter((_, i) => i !== index)
                          })}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newService = prompt('Nome do novo serviço:');
                        if (newService) {
                          setProfile({
                            ...profile,
                            services: [...profile.services, newService]
                          });
                        }
                      }}
                      className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary"
                    >
                      + Adicionar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
