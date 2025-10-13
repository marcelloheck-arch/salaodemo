'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Key, 
  Shield, 
  Save, 
  X, 
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { SystemLicense, LicensePlan, LICENSE_PLANS } from '@/types/license';
import { LocalStorageService } from '@/services/localStorageService';

interface ManualLicenseCreatorProps {
  onLicenseCreated: (license: SystemLicense) => void;
}

interface ManualLicenseForm {
  // Dados do Cliente
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientCnpj: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  
  // Dados da Licença
  planoId: string;
  customLicenseKey: string;
  dataVencimento: string;
  renovacaoAutomatica: boolean;
  status: 'ativa' | 'suspensa';
  
  // Limites Personalizados
  customLimits: {
    maxUsuarios?: number;
    maxClientes?: number;
    maxAgendamentos?: number;
  };
  
  // Recursos Extras
  recursosExtras: string[];
  observacoesAdmin: string;
}

export default function ManualLicenseCreator({ onLicenseCreated }: ManualLicenseCreatorProps) {
  const [formData, setFormData] = useState<ManualLicenseForm>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    clientCnpj: '',
    clientAddress: '',
    clientCity: '',
    clientState: '',
    planoId: '',
    customLicenseKey: '',
    dataVencimento: '',
    renovacaoAutomatica: true,
    status: 'ativa',
    customLimits: {},
    recursosExtras: [],
    observacoesAdmin: ''
  });

  const [availablePlans, setAvailablePlans] = useState<LicensePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Cliente, 2: Licença, 3: Confirmação
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPlans();
    generateLicenseKey();
  }, []);

  const loadPlans = () => {
    try {
      const data = localStorage.getItem('agenda_salao_plans');
      const savedPlans = data ? JSON.parse(data) : [];
      setAvailablePlans(savedPlans.length > 0 ? savedPlans : LICENSE_PLANS);
    } catch {
      setAvailablePlans(LICENSE_PLANS);
    }
  };

  const generateLicenseKey = () => {
    // Prefixos variados para diferentes contextos
    const prefixes = ['AGS', 'SLN', 'BEL', 'SAL', 'LIC', 'PRO', 'ADM', 'SYS'];
    
    // Anos variados (atual e próximo)
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear + 1];
    
    // Função para gerar segmento alfanumérico
    const generateSegment = (length: number) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    // Gerar chave com formato: PREFIX-YEAR-SEG1-SEG2-SEG3
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const seg1 = generateSegment(4);
    const seg2 = generateSegment(4);
    const seg3 = generateSegment(4);
    
    const key = `${prefix}-${year}-${seg1}-${seg2}-${seg3}`;
    setFormData(prev => ({ ...prev, customLicenseKey: key }));
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = 'Nome é obrigatório';
      if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Email é obrigatório';
      if (!formData.clientEmail.includes('@')) newErrors.clientEmail = 'Email inválido';
      if (!formData.clientCompany.trim()) newErrors.clientCompany = 'Empresa é obrigatória';
      if (!formData.clientCity.trim()) newErrors.clientCity = 'Cidade é obrigatória';
      if (!formData.clientState.trim()) newErrors.clientState = 'Estado é obrigatório';
    }

    if (stepNumber === 2) {
      if (!formData.planoId) newErrors.planoId = 'Selecione um plano';
      if (!formData.dataVencimento) newErrors.dataVencimento = 'Data de vencimento é obrigatória';
      if (!formData.customLicenseKey.trim()) newErrors.customLicenseKey = 'Chave de licença é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsLoading(true);

    try {
      const selectedPlan = availablePlans.find(p => p.id === formData.planoId);
      if (!selectedPlan) throw new Error('Plano não encontrado');

      const newLicense: SystemLicense = {
        id: `manual-${Date.now()}`,
        chaveAtivacao: formData.customLicenseKey,
        userId: `client-${Date.now()}`,
        planoId: formData.planoId,
        status: formData.status,
        dataAtivacao: new Date(),
        dataVencimento: new Date(formData.dataVencimento),
        renovacaoAutomatica: formData.renovacaoAutomatica,
        limitesPersonalizados: Object.keys(formData.customLimits).length > 0 ? formData.customLimits : undefined,
        recursosAtivos: [...selectedPlan.recursos, ...formData.recursosExtras],
        observacoesAdmin: formData.observacoesAdmin,
        clientData: {
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          company: formData.clientCompany,
          cnpj: formData.clientCnpj,
          address: formData.clientAddress,
          city: formData.clientCity,
          state: formData.clientState
        }
      };

      // Salvar no localStorage
      const localStorageService = LocalStorageService.getInstance();
      const existingLicenses = localStorageService.loadLicenses();
      const updatedLicenses = [...existingLicenses, newLicense];
      
      console.log('📝 Criando nova licença:', newLicense);
      console.log('📦 Total de licenças antes:', existingLicenses.length);
      console.log('📦 Total de licenças depois:', updatedLicenses.length);
      
      localStorageService.saveLicenses(updatedLicenses);
      
      // Verificar se foi salva corretamente
      const verifyLicenses = localStorageService.loadLicenses();
      console.log('✅ Verificação - Total de licenças salvas:', verifyLicenses.length);
      console.log('✅ Última licença salva:', verifyLicenses[verifyLicenses.length - 1]);

      onLicenseCreated(newLicense);
      resetForm();

    } catch (error) {
      console.error('Erro ao criar licença:', error);
      setErrors({ submit: 'Erro ao criar licença. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientCompany: '',
      clientCnpj: '',
      clientAddress: '',
      clientCity: '',
      clientState: '',
      planoId: '',
      customLicenseKey: '',
      dataVencimento: '',
      renovacaoAutomatica: true,
      status: 'ativa',
      customLimits: {},
      recursosExtras: [],
      observacoesAdmin: ''
    });
    setStep(1);
    setErrors({});
    generateLicenseKey();
  };

  const selectedPlan = availablePlans.find(p => p.id === formData.planoId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { step: 1, label: 'Dados do Cliente', icon: User },
            { step: 2, label: 'Configurar Licença', icon: Key },
            { step: 3, label: 'Confirmar & Criar', icon: CheckCircle }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= item.step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= item.step ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Dados do Cliente */}
      {step === 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Dados do Cliente</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.clientName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: João Silva"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.clientEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="joao@empresa.com"
              />
              {errors.clientEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.clientEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <input
                type="text"
                value={formData.clientCompany}
                onChange={(e) => setFormData({...formData, clientCompany: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.clientCompany ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Salão Beleza & Estilo"
              />
              {errors.clientCompany && (
                <p className="mt-1 text-sm text-red-600">{errors.clientCompany}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                value={formData.clientCnpj}
                onChange={(e) => setFormData({...formData, clientCnpj: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                value={formData.clientAddress}
                onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rua das Flores, 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                value={formData.clientCity}
                onChange={(e) => setFormData({...formData, clientCity: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.clientCity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="São Paulo"
              />
              {errors.clientCity && (
                <p className="mt-1 text-sm text-red-600">{errors.clientCity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <input
                type="text"
                value={formData.clientState}
                onChange={(e) => setFormData({...formData, clientState: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.clientState ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="SP"
              />
              {errors.clientState && (
                <p className="mt-1 text-sm text-red-600">{errors.clientState}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configurar Licença */}
      {step === 2 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Key className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Configurar Licença</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plano *
              </label>
              <select
                value={formData.planoId}
                onChange={(e) => setFormData({...formData, planoId: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.planoId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um plano</option>
                {availablePlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nome} - R$ {plan.preco.toFixed(2)}/mês
                  </option>
                ))}
              </select>
              {errors.planoId && (
                <p className="mt-1 text-sm text-red-600">{errors.planoId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave da Licença *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.customLicenseKey}
                  onChange={(e) => setFormData({...formData, customLicenseKey: e.target.value})}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customLicenseKey ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="AGS-24ABC12345-MANUAL"
                />
                <button
                  type="button"
                  onClick={generateLicenseKey}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Gerar nova chave"
                >
                  🔄
                </button>
              </div>
              {errors.customLicenseKey && (
                <p className="mt-1 text-sm text-red-600">{errors.customLicenseKey}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento *
              </label>
              <input
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dataVencimento ? 'border-red-300' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.dataVencimento && (
                <p className="mt-1 text-sm text-red-600">{errors.dataVencimento}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'ativa' | 'suspensa'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ativa">Ativa</option>
                <option value="suspensa">Suspensa</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.renovacaoAutomatica}
                  onChange={(e) => setFormData({...formData, renovacaoAutomatica: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Renovação Automática
                </span>
              </label>
            </div>
          </div>

          {/* Limites Personalizados */}
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Limites Personalizados (Opcional)</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Usuários
                </label>
                <input
                  type="number"
                  value={formData.customLimits.maxUsuarios || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    customLimits: {...formData.customLimits, maxUsuarios: Number(e.target.value) || undefined}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deixe vazio para usar padrão do plano"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Clientes
                </label>
                <input
                  type="number"
                  value={formData.customLimits.maxClientes || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    customLimits: {...formData.customLimits, maxClientes: Number(e.target.value) || undefined}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deixe vazio para usar padrão do plano"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Agendamentos/mês
                </label>
                <input
                  type="number"
                  value={formData.customLimits.maxAgendamentos || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    customLimits: {...formData.customLimits, maxAgendamentos: Number(e.target.value) || undefined}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deixe vazio para usar padrão do plano"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações Administrativas
            </label>
            <textarea
              value={formData.observacoesAdmin}
              onChange={(e) => setFormData({...formData, observacoesAdmin: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observações internas sobre esta licença..."
            />
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmação */}
      {step === 3 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Confirmar & Criar Licença</h3>
          </div>

          <div className="space-y-6">
            {/* Resumo do Cliente */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Dados do Cliente</h4>
              <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Nome:</span>
                  <p className="font-medium">{formData.clientName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{formData.clientEmail}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Empresa:</span>
                  <p className="font-medium">{formData.clientCompany}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Localização:</span>
                  <p className="font-medium">{formData.clientCity}, {formData.clientState}</p>
                </div>
              </div>
            </div>

            {/* Resumo da Licença */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Configuração da Licença</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-blue-600">Plano:</span>
                    <p className="font-medium">{selectedPlan?.nome}</p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-600">Valor:</span>
                    <p className="font-medium">R$ {selectedPlan?.preco.toFixed(2)}/mês</p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-600">Chave:</span>
                    <p className="font-medium font-mono">{formData.customLicenseKey}</p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-600">Vencimento:</span>
                    <p className="font-medium">{new Date(formData.dataVencimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-600">Status:</span>
                    <p className="font-medium">{formData.status === 'ativa' ? 'Ativa' : 'Suspensa'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-blue-600">Renovação:</span>
                    <p className="font-medium">{formData.renovacaoAutomatica ? 'Automática' : 'Manual'}</p>
                  </div>
                </div>

                {Object.keys(formData.customLimits).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <span className="text-sm text-blue-600">Limites Personalizados:</span>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {formData.customLimits.maxUsuarios && (
                        <p className="text-sm">Usuários: {formData.customLimits.maxUsuarios}</p>
                      )}
                      {formData.customLimits.maxClientes && (
                        <p className="text-sm">Clientes: {formData.customLimits.maxClientes}</p>
                      )}
                      {formData.customLimits.maxAgendamentos && (
                        <p className="text-sm">Agendamentos: {formData.customLimits.maxAgendamentos}/mês</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{errors.submit}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Anterior
            </button>
            
            <div className="space-x-3">
              <button
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Criar Licença</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}