'use client';

import React, { useState, useEffect } from 'react';
import { Check, Star } from 'lucide-react';
import { LICENSE_PLANS, SYSTEM_FEATURES, LicensePlan } from '@/types/license';

interface PlanSelectionProps {
  onPlanSelect: (plan: LicensePlan | null) => void;
  selectedPlan?: LicensePlan | null;
}

export default function PlanSelection({ onPlanSelect, selectedPlan }: PlanSelectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'mensal' | 'anual'>('mensal');
  const [availablePlans, setAvailablePlans] = useState<LicensePlan[]>(LICENSE_PLANS);

  useEffect(() => {
    // Carregar planos editados do localStorage se disponível
    const savedPlans = localStorage.getItem('license_plans');
    if (savedPlans) {
      setAvailablePlans(JSON.parse(savedPlans));
    }
  }, []);

  const handlePlanSelect = (planId: string) => {
    const plan = availablePlans.find(p => p.id === planId);
    onPlanSelect(plan || null);
  };

  const getFeatureDetails = (featureId: string) => {
    return SYSTEM_FEATURES.find(f => f.id === featureId);
  };

  const getPlanPrice = (plan: LicensePlan) => {
    if (billingPeriod === 'anual') {
      return plan.preco * 10; // 2 meses grátis no anual
    }
    return plan.preco;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Escolha o Plano Ideal
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selecione o plano que melhor atende às necessidades do seu salão. 
          Todos os planos incluem suporte técnico e atualizações gratuitas.
        </p>
      </div>

      {/* Toggle de período */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingPeriod('mensal')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'mensal'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingPeriod('anual')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'anual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Anual <span className="text-green-600 text-xs">(2 meses grátis)</span>
          </button>
        </div>
      </div>

      {/* Grid de planos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {availablePlans.map((plan: LicensePlan) => {
          const isSelected = selectedPlan?.id === plan.id;
          const isPopular = plan.id === 'professional';
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-slate-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.nome}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.descricao}</p>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    R$ {getPlanPrice(plan).toFixed(2)}
                  </div>
                  <div className="text-gray-500 text-sm">/{billingPeriod}</div>
                  {billingPeriod === 'anual' && (
                    <div className="text-green-600 text-xs">
                      Economize R$ {(plan.preco * 2).toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-left">
                  {plan.recursos.slice(0, 6).map((featureId: string) => {
                    const feature = getFeatureDetails(featureId);
                    return feature ? (
                      <div key={featureId} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature.nome}</span>
                      </div>
                    ) : null;
                  })}
                  
                  {plan.recursos.length > 6 && (
                    <div className="text-xs text-gray-500 text-center pt-2">
                      +{plan.recursos.length - 6} recursos adicionais
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-2 text-blue-600 font-medium text-sm">
                      <Check className="w-4 h-4" />
                      <span>Plano Selecionado</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-600 text-sm">
              Você selecionou o plano <strong>{selectedPlan.nome}</strong> por{' '}
              <strong>R$ {getPlanPrice(selectedPlan).toFixed(2)}/{billingPeriod}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Comparação de recursos */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparação de Recursos
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Recursos</th>
                {availablePlans.map((plan: LicensePlan) => (
                  <th key={plan.id} className="text-center py-2 font-medium text-gray-700">
                    {plan.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SYSTEM_FEATURES.slice(0, 8).map(feature => (
                <tr key={feature.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-900">{feature.nome}</td>
                  {availablePlans.map((plan: LicensePlan) => (
                    <td key={plan.id} className="py-2 text-center">
                      {plan.recursos.includes(feature.id) ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
