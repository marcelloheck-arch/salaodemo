'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Star,
  Archive,
  Tag
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { produtosApi } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  barcode?: string;
  image?: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    brand: product?.brand || '',
    price: product?.price || 0,
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    minStock: product?.minStock || 5,
    unit: product?.unit || 'unidade',
    barcode: product?.barcode || '',
    status: product?.status || 'active' as 'active' | 'inactive' | 'discontinued'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Shampoo',
    'Condicionador',
    'Máscara de Tratamento',
    'Coloração',
    'Produtos para Corte',
    'Ferramentas',
    'Acessórios',
    'Higienização',
    'Outros'
  ];

  const units = [
    'unidade',
    'ml',
    'litro',
    'grama',
    'kg',
    'metro',
    'par'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (formData.costPrice < 0) {
      newErrors.costPrice = 'Preço de custo não pode ser negativo';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Estoque não pode ser negativo';
    }

    if (formData.minStock < 0) {
      newErrors.minStock = 'Estoque mínimo não pode ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData: Product = {
      id: product?.id || Date.now().toString(),
      ...formData,
      createdAt: product?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(productData);
  };

  const profitMargin = formData.price > 0 && formData.costPrice > 0 
    ? ((formData.price - formData.costPrice) / formData.price * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {product ? 'Editar Produto' : 'Novo Produto'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nome do produto"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Marca do produto"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Descrição do produto"
          />
        </div>

        {/* Categoria e Código */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Barras
            </label>
            <input
              type="text"
              value={formData.barcode}
              onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Código de barras"
            />
          </div>
        </div>

        {/* Preços */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço de Custo *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  errors.costPrice ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0,00"
              />
            </div>
            {errors.costPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.costPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço de Venda *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0,00"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margem de Lucro
            </label>
            <div className="flex items-center h-10 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
              <span className={`font-medium ${profitMargin > 30 ? 'text-green-600' : profitMargin > 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Estoque */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque Atual *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque Mínimo *
            </label>
            <input
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                errors.minStock ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="5"
            />
            {errors.minStock && (
              <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidade de Medida
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            {[
              { value: 'active', label: 'Ativo', color: 'text-green-600' },
              { value: 'inactive', label: 'Inativo', color: 'text-yellow-600' },
              { value: 'discontinued', label: 'Descontinuado', color: 'text-red-600' }
            ].map(({ value, label, color }) => (
              <label key={value} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={formData.status === value}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="mr-2"
                />
                <span className={`text-sm ${color}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-slate-600 to-pink-600 text-white rounded-lg font-medium hover:from-slate-700 hover:to-pink-700 transition-all"
          >
            {product ? 'Atualizar' : 'Criar'} Produto
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar produtos da API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await produtosApi.list();
        if (response.success && response.data) {
          const mappedProducts = response.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            category: p.category,
            brand: p.brand || '',
            price: parseFloat(p.price),
            costPrice: p.costPrice ? parseFloat(p.costPrice) : 0,
            stock: p.stock,
            minStock: p.minStock,
            unit: p.unit,
            barcode: p.barcode,
            status: p.status.toLowerCase() as 'active' | 'inactive' | 'discontinued',
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'discontinued': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'discontinued': return 'Descontinuado';
      default: return status;
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { color: 'text-red-600', icon: XCircle, text: 'Sem estoque' };
    if (stock <= minStock) return { color: 'text-yellow-600', icon: AlertTriangle, text: 'Estoque baixo' };
    return { color: 'text-green-600', icon: CheckCircle, text: 'Em estoque' };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchTerm));
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleNewProduct = async (newProduct: Product) => {
    try {
      const response = await produtosApi.create({
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        brand: newProduct.brand,
        price: newProduct.price,
        costPrice: newProduct.costPrice,
        stock: newProduct.stock,
        minStock: newProduct.minStock,
        unit: newProduct.unit,
        barcode: newProduct.barcode,
        status: newProduct.status.toUpperCase(),
      });

      if (response.success && response.data) {
        const mappedProduct = {
          ...response.data,
          price: parseFloat(response.data.price),
          costPrice: response.data.costPrice ? parseFloat(response.data.costPrice) : 0,
          status: response.data.status.toLowerCase() as 'active' | 'inactive' | 'discontinued',
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };
        setProducts(prev => [mappedProduct, ...prev]);
        setShowNewProduct(false);
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto. Tente novamente.');
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await produtosApi.update(updatedProduct.id, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        category: updatedProduct.category,
        brand: updatedProduct.brand,
        price: updatedProduct.price,
        costPrice: updatedProduct.costPrice,
        stock: updatedProduct.stock,
        minStock: updatedProduct.minStock,
        unit: updatedProduct.unit,
        barcode: updatedProduct.barcode,
        status: updatedProduct.status.toUpperCase(),
      });

      if (response.success && response.data) {
        const mappedProduct = {
          ...response.data,
          price: parseFloat(response.data.price),
          costPrice: response.data.costPrice ? parseFloat(response.data.costPrice) : 0,
          status: response.data.status.toLowerCase() as 'active' | 'inactive' | 'discontinued',
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };
        setProducts(prev => prev.map(p => p.id === mappedProduct.id ? mappedProduct : p));
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await produtosApi.delete(productId);
        if (response.success) {
          setProducts(prev => prev.filter(p => p.id !== productId));
        }
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto. Tente novamente.');
      }
    }
  };
    setSelectedProduct(null);
    setShowProductDetails(false);
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-gray-600">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Produtos</h2>
          <p className="text-gray-600 text-sm">Gerencie o estoque e produtos do salão</p>
        </div>
        <button
          onClick={() => setShowNewProduct(true)}
          className="bg-gradient-to-r from-slate-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-slate-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Valor do Estoque</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalValue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Categorias</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Tag className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="discontinued">Descontinuado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 font-medium text-gray-700 text-sm">Produto</th>
                <th className="text-left p-3 font-medium text-gray-700 text-sm">Categoria</th>
                <th className="text-left p-3 font-medium text-gray-700 text-sm">Preço</th>
                <th className="text-left p-3 font-medium text-gray-700 text-sm">Estoque</th>
                <th className="text-left p-3 font-medium text-gray-700 text-sm">Status</th>
                <th className="text-center p-3 font-medium text-gray-700 text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock, product.minStock);
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-600">{product.brand}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">R$ {product.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Custo: R$ {product.costPrice.toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <stockStatus.icon className={`w-4 h-4 ${stockStatus.color}`} />
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{product.stock} {product.unit}</div>
                          <div className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-slate-600 hover:text-purple-800 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Novo Produto */}
      {showNewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProductForm
              onSave={handleNewProduct}
              onCancel={() => setShowNewProduct(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {selectedProduct && !showProductDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProductForm
              product={selectedProduct}
              onSave={handleEditProduct}
              onCancel={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
