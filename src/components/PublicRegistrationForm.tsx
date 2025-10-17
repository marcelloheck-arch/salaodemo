'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { UserRegistration, LicensePlan, LICENSE_PLANS } from '@/types/license';
import PlanSelection from '@/components/PlanSelection';
import { EmailService } from '@/services/emailService';
import LocalStorageService from '@/services/LocalStorageService';

interface PublicRegistrationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

type FormStep = 'company' | 'personal' | 'plan' | 'confirmation';

export default function PublicRegistrationForm({ onCancel, onSuccess }: PublicRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('company');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<LicensePlan | null>(null);
  
  const [formData, setFormData] = useState<Partial<UserRegistration>>({
    nomeEmpresa: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    nome: '',
    email: '',
    telefone: '',
    observacoes: '',
    status: 'pendente',
    dataCadastro: new Date()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailService = EmailService.getInstance();
  const storageService = LocalStorageService.getInstance();

  // Estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Validação de email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validação de CNPJ (básica)
  const isValidCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  // Validar step atual
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'company') {
      if (!formData.nomeEmpresa?.trim()) {
        newErrors.nomeEmpresa = 'Nome da empresa é obrigatório';
      }
      if (!formData.endereco?.trim()) {
        newErrors.endereco = 'Endereço é obrigatório';
      }
      if (!formData.cidade?.trim()) {
        newErrors.cidade = 'Cidade é obrigatória';
      }
      if (!formData.estado) {
        newErrors.estado = 'Estado é obrigatório';
      }
      if (formData.cnpj && !isValidCNPJ(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ inválido';
      }
    }

    if (currentStep === 'personal') {
      if (!formData.nome?.trim()) {
        newErrors.nome = 'Nome é obrigatório';
      }
      if (!formData.email?.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (currentStep === 'plan') {
      if (!selectedPlan) {
        newErrors.plan = 'Selecione um plano';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar entre steps
  const handleNext = () => {
    if (!validateCurrentStep()) return;

    const steps: FormStep[] = ['company', 'personal', 'plan', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: FormStep[] = ['company', 'personal', 'plan', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Atualizar form data
  const updateFormData = (field: keyof UserRegistration, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Formatar CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Formatar CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Submeter formulário
  const handleSubmit = async () => {
    if (!selectedPlan) {
      alert('Selecione um plano antes de continuar');
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar registro completo
      const registration: UserRegistration = {
        id: `reg_${Date.now()}`,
        nomeEmpresa: formData.nomeEmpresa!,
        cnpj: formData.cnpj || undefined,
        endereco: formData.endereco!,
        cidade: formData.cidade!,
        estado: formData.estado!,
        cep: formData.cep || undefined,
        nome: formData.nome!,
        email: formData.email!,
        telefone: formData.telefone || undefined,
        observacoes: formData.observacoes || undefined,
        planoSelecionado: selectedPlan.id,
        status: 'pendente',
        dataCadastro: new Date()
      };

      // Salvar no localStorage para que apareça no painel administrativo
      storageService.addRegistration(registration);
      console.log('✅ Registro salvo no localStorage:', registration);

      // Enviar notificação para admin (simulado)
      await emailService.notifyNewRegistration(registration, selectedPlan);

      alert('✅ Registro enviado com sucesso! Você receberá um email com as próximas instruções.');
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao submeter registro:', error);
      alert('❌ Erro ao enviar registro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar indicador de progresso
  const renderProgressIndicator = () => {
    const steps = [
      { key: 'company', label: 'Empresa', icon: Building },
      { key: 'personal', label: 'Dados Pessoais', icon: User },
      { key: 'plan', label: 'Plano', icon: FileText },
      { key: 'confirmation', label: 'Confirmação', icon: CheckCircle }
    ];

    const currentIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                isActive ? 'bg-slate-500 border-slate-500 text-white' :
                'bg-gray-200 border-gray-300 text-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-slate-600' : 
                isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏪 Cadastro do Salão
          </h1>
          <p className="text-gray-600">
            Registre seu salão e escolha o plano ideal para seu negócio
          </p>
        </div>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Form Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          
          {/* Step: Company Info */}
          {currentStep === 'company' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Informações da Empresa
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Empresa *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.nomeEmpresa || ''}
                      onChange={(e) => updateFormData('nomeEmpresa', e.target.value)}
                      className={`w-full bg-white/70 border-2 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all ${
                        errors.nomeEmpresa ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nome do seu salão"
                    />
                  </div>
                  {errors.nomeEmpresa && (
                    <p className="text-red-500 text-sm mt-1">{errors.nomeEmpresa}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj || ''}
                    onChange={(e) => updateFormData('cnpj', formatCNPJ(e.target.value))}
                    className={`w-full bg-white/70 border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all ${
                      errors.cnpj ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                  {errors.cnpj && (
                    <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.endereco || ''}
                    onChange={(e) => updateFormData('endereco', e.target.value)}
                    className={`w-full bg-white/70 border-2 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all ${
                      errors.endereco ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Rua, número, bairro"
                  />
                </div>
                {errors.endereco && (
                  <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.cidade || ''}
                    onChange={(e) => updateFormData('cidade', e.target.value)}
                    className={`w-full bg-white/70 border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all ${
                      errors.cidade ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Sua cidade"
                  />
                  {errors.cidade && (
                    <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.estado || ''}
                    onChange={(e) => updateFormData('estado', e.target.value)}
                    className={`w-full bg-white/70 border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all ${
                      errors.estado ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione</option>
                    {estados.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                  {errors.estado && (
                    <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.cep || ''}
                    onChange={(e) => updateFormData('cep', formatCEP(e.target.value))}
                    className="w-full bg-white/70 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Personal Info */}
          {currentStep === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Dados do Responsável
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.nome || ''}
                      onChange={(e) => updateFormData('nome', e.target.value)}
                      className={`w-full bg-white/70 border-2 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all ${
                        errors.nome ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full bg-white/70 border-2 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone (opcional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.telefone || ''}
                    onChange={(e) => updateFormData('telefone', formatPhone(e.target.value))}
                    className="w-full bg-white/70 border-2 border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => updateFormData('observacoes', e.target.value)}
                  className="w-full bg-white/70 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  rows={4}
                  placeholder="Conte-nos sobre seu salão, necessidades especiais, etc."
                />
              </div>
            </div>
          )}

          {/* Step: Plan Selection */}
          {currentStep === 'plan' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Escolha seu Plano
              </h2>
              
              <PlanSelection
                onPlanSelect={setSelectedPlan}
                selectedPlan={selectedPlan}
              />
              
              {errors.plan && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{errors.plan}</p>
                </div>
              )}
            </div>
          )}

          {/* Step: Confirmation */}
          {currentStep === 'confirmation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Confirmar Dados
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Dados da Empresa</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Empresa:</span>
                    <p className="font-medium">{formData.nomeEmpresa}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">CNPJ:</span>
                    <p className="font-medium">{formData.cnpj || 'Não informado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Endereço:</span>
                    <p className="font-medium">{formData.endereco}, {formData.cidade}/{formData.estado}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Dados do Responsável</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nome:</span>
                    <p className="font-medium">{formData.nome}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefone:</span>
                    <p className="font-medium">{formData.telefone || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {selectedPlan && (
                <div className="bg-gradient-to-r from-slate-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Plano Selecionado</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-slate-600">{selectedPlan.nome}</h4>
                      <p className="text-gray-600 text-sm">{selectedPlan.descricao}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-600">
                        R$ {selectedPlan.preco.toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-sm">/{selectedPlan.periodo}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>📧 Próximos passos:</strong> Após o envio, você receberá um email de confirmação. 
                  Nossa equipe analisará sua solicitação e entrará em contato em até 24 horas.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={onCancel}
                className="px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancelar
              </button>
              
              {currentStep !== 'company' && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-6 py-3 text-slate-600 bg-slate-100 rounded-lg hover:bg-purple-200 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Anterior</span>
                </button>
              )}
            </div>

            <div>
              {currentStep !== 'confirmation' ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Finalizar Cadastro</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
