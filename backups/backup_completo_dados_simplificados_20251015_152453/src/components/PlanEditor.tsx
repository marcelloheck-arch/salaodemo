'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, DollarSign, Users, Calendar } from 'lucide-react';
import { LicensePlan, LICENSE_PLANS } from '@/types/license';

interface PlanEditorProps {
  onPlansUpdate?: (plans: LicensePlan[]) => void;
}

export default function PlanEditor({ onPlansUpdate }: PlanEditorProps) {
  const [plans, setPlans] = useState<LicensePlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    // Carregar planos do localStorage ou usar padrão
    const savedPlans = localStorage.getItem('license_plans');
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    } else {
      setPlans([...LICENSE_PLANS]);
    }
  }, []);

  const savePlans = (newPlans: LicensePlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('license_plans', JSON.stringify(newPlans));
    onPlansUpdate?.(newPlans);
  };

  const handleSavePlan = (planId: string, updatedPlan: Partial<LicensePlan>) => {
    const newPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, ...updatedPlan } : plan
    );
    savePlans(newPlans);
    setEditingPlan(null);
  };

  const handleAddNewPlan = (newPlan: Omit<LicensePlan, 'id'>) => {
    const planWithId = {
      ...newPlan,
      id: `plan_${Date.now()}`
    };
    savePlans([...plans, planWithId]);
    setIsAddingNew(false);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      const newPlans = plans.filter(plan => plan.id !== planId);
      savePlans(newPlans);
    }
  };

  const resetToDefault = () => {
    if (confirm('Deseja restaurar os planos padrão? Isso irá sobrescrever todas as alterações.')) {
      localStorage.removeItem('license_plans');
      setPlans([...LICENSE_PLANS]);
      onPlansUpdate?.([...LICENSE_PLANS]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editor de Planos</h2>
          <p className="text-gray-600">Gerencie os planos de licença e seus valores</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Restaurar Padrão
          </button>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-gradient-to-r from-slate-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Plano</span>
          </button>
        </div>
      </div>

      {/* Lista de Planos */}
      <div className="grid gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isEditing={editingPlan === plan.id}
            onEdit={() => setEditingPlan(plan.id)}
            onSave={(updatedPlan) => handleSavePlan(plan.id, updatedPlan)}
            onCancel={() => setEditingPlan(null)}
            onDelete={() => handleDeletePlan(plan.id)}
          />
        ))}

        {/* Formulário para Novo Plano */}
        {isAddingNew && (
          <NewPlanForm
            onSave={handleAddNewPlan}
            onCancel={() => setIsAddingNew(false)}
          />
        )}
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: LicensePlan;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (plan: Partial<LicensePlan>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

function PlanCard({ plan, isEditing, onEdit, onSave, onCancel, onDelete }: PlanCardProps) {
  const [formData, setFormData] = useState(plan);

  const handleSave = () => {
    onSave(formData);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Usuários</label>
            <input
              type="number"
              value={formData.maxUsuarios}
              onChange={(e) => setFormData({ ...formData, maxUsuarios: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Clientes</label>
            <input
              type="number"
              value={formData.maxClientes}
              onChange={(e) => setFormData({ ...formData, maxClientes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Agendamentos/mês</label>
            <input
              type="number"
              value={formData.maxAgendamentos}
              onChange={(e) => setFormData({ ...formData, maxAgendamentos: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value as 'mensal' | 'anual' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Recursos Inclusos</label>
            <div className="grid md:grid-cols-3 gap-2">
              {['agenda', 'clientes', 'servicos', 'funcionarios', 'produtos', 'financeiro', 'relatorios', 'marketing', 'backup', 'whatsapp', 'multilocal', 'api'].map((recurso) => (
                <label key={recurso} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.recursos.includes(recurso)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, recursos: [...formData.recursos, recurso] });
                      } else {
                        setFormData({ ...formData, recursos: formData.recursos.filter(r => r !== recurso) });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{recurso}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 grid md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.suportePrioritario}
                onChange={(e) => setFormData({ ...formData, suportePrioritario: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Suporte Prioritário</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalizacao}
                onChange={(e) => setFormData({ ...formData, personalizacao: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Personalização</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.relatoriosAvancados}
                onChange={(e) => setFormData({ ...formData, relatoriosAvancados: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Relatórios Avançados</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.integracao}
                onChange={(e) => setFormData({ ...formData, integracao: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Integrações</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{plan.nome}</h3>
          <p className="text-gray-600 mt-1">{plan.descricao}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">
            R$ {plan.preco.toFixed(2)}
          </span>
          <span className="text-gray-500">/{plan.periodo}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{plan.maxUsuarios} usuários</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{plan.maxClientes} clientes</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{plan.maxAgendamentos} agendamentos</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recursos:</h4>
        <div className="flex flex-wrap gap-2">
          {plan.recursos.map((recurso) => (
            <span
              key={recurso}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md capitalize"
            >
              {recurso}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onDelete}
          className="px-3 py-1 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Excluir</span>
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-1 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-1"
        >
          <Edit2 className="w-4 h-4" />
          <span>Editar</span>
        </button>
      </div>
    </div>
  );
}

interface NewPlanFormProps {
  onSave: (plan: Omit<LicensePlan, 'id'>) => void;
  onCancel: () => void;
}

function NewPlanForm({ onSave, onCancel }: NewPlanFormProps) {
  const [formData, setFormData] = useState<Omit<LicensePlan, 'id'>>({
    nome: '',
    descricao: '',
    preco: 0,
    periodo: 'mensal',
    recursos: ['agenda', 'clientes'],
    maxUsuarios: 1,
    maxClientes: 100,
    maxAgendamentos: 50,
    suportePrioritario: false,
    personalizacao: false,
    relatoriosAvancados: false,
    integracao: false
  });

  const handleSave = () => {
    if (!formData.nome || !formData.descricao || formData.preco <= 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Novo Plano</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano *</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Básico, Premium..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva para quem é ideal este plano..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Criar Plano
        </button>
      </div>
    </div>
  );
}