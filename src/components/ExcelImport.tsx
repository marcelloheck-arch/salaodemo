"use client";

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Users, 
  CheckCircle, 
  AlertCircle,
  X,
  Plus
} from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ClienteImportacao {
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  dataNascimento?: string;
  observacoes?: string;
  status?: 'novo' | 'validado' | 'erro';
  erro?: string;
}

interface ExcelImportProps {
  onImport: (clientes: ClienteImportacao[]) => void;
  onClose: () => void;
}

export default function ExcelImport({ onImport, onClose }: ExcelImportProps) {
  const [clientes, setClientes] = useState<ClienteImportacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mapear colunas do Excel para campos do sistema
  const mapearColuna = (header: string): string | null => {
    const headerLower = header.toLowerCase().trim();
    
    if (headerLower.includes('nome') || headerLower.includes('cliente')) return 'nome';
    if (headerLower.includes('telefone') || headerLower.includes('celular') || headerLower.includes('phone')) return 'telefone';
    if (headerLower.includes('email') || headerLower.includes('e-mail')) return 'email';
    if (headerLower.includes('endereco') || headerLower.includes('endereço') || headerLower.includes('rua')) return 'endereco';
    if (headerLower.includes('nascimento') || headerLower.includes('aniversario') || headerLower.includes('data')) return 'dataNascimento';
    if (headerLower.includes('observ') || headerLower.includes('obs') || headerLower.includes('nota')) return 'observacoes';
    
    return null;
  };

  // Validar dados do cliente
  const validarCliente = (cliente: any): ClienteImportacao => {
    const erros = [];
    
    if (!cliente.nome || cliente.nome.toString().trim() === '') {
      erros.push('Nome é obrigatório');
    }
    
    if (!cliente.telefone || cliente.telefone.toString().trim() === '') {
      erros.push('Telefone é obrigatório');
    } else {
      // Limpar e validar telefone
      const telefoneClean = cliente.telefone.toString().replace(/\D/g, '');
      if (telefoneClean.length < 10) {
        erros.push('Telefone deve ter pelo menos 10 dígitos');
      }
    }

    if (cliente.email && cliente.email.toString().trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cliente.email.toString().trim())) {
        erros.push('Email inválido');
      }
    }

    return {
      nome: cliente.nome?.toString().trim() || '',
      telefone: cliente.telefone?.toString().replace(/\D/g, '') || '',
      email: cliente.email?.toString().trim() || '',
      endereco: cliente.endereco?.toString().trim() || '',
      dataNascimento: cliente.dataNascimento?.toString().trim() || '',
      observacoes: cliente.observacoes?.toString().trim() || '',
      status: erros.length > 0 ? 'erro' : 'validado',
      erro: erros.length > 0 ? erros.join(', ') : undefined
    };
  };

  // Processar arquivo Excel
  const processarArquivo = async (file: File) => {
    setLoading(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        throw new Error('Arquivo deve conter pelo menos uma linha de dados além do cabeçalho');
      }

      const headers = jsonData[0] as string[];
      const mapeamento: { [key: number]: string } = {};

      // Mapear colunas automaticamente
      headers.forEach((header, index) => {
        const campo = mapearColuna(header);
        if (campo) {
          mapeamento[index] = campo;
        }
      });

      if (!Object.values(mapeamento).includes('nome')) {
        throw new Error('Coluna "Nome" não encontrada. Verifique se existe uma coluna com nome, cliente ou similar.');
      }

      // Processar dados
      const clientesProcessados: ClienteImportacao[] = [];
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        const cliente: any = {};

        // Mapear dados da linha
        Object.keys(mapeamento).forEach(colIndex => {
          const campo = mapeamento[parseInt(colIndex)];
          cliente[campo] = row[parseInt(colIndex)];
        });

        // Pular linhas vazias
        if (!cliente.nome && !cliente.telefone) continue;

        clientesProcessados.push(validarCliente(cliente));
      }

      setClientes(clientesProcessados);
      setStep('preview');

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      alert(`Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        alert('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
        return;
      }
      processarArquivo(file);
    }
  };

  // Baixar template Excel
  const baixarTemplate = () => {
    const template = [
      ['Nome', 'Telefone', 'Email', 'Endereço', 'Data Nascimento', 'Observações'],
      ['João Silva', '11999999999', 'joao@email.com', 'Rua das Flores, 123', '15/03/1990', 'Cliente VIP'],
      ['Maria Santos', '11888888888', 'maria@email.com', 'Av. Principal, 456', '22/07/1985', 'Prefere atendimento pela manhã']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'template_clientes.xlsx');
  };

  // Confirmar importação
  const confirmarImportacao = () => {
    const clientesValidos = clientes.filter(c => c.status !== 'erro');
    if (clientesValidos.length === 0) {
      alert('Nenhum cliente válido para importar');
      return;
    }

    onImport(clientesValidos);
    setStep('confirm');
  };

  const clientesValidos = clientes.filter(c => c.status !== 'erro').length;
  const clientesComErro = clientes.filter(c => c.status === 'erro').length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Importar Clientes do Excel</h2>
                <p className="text-gray-300 text-sm">Importe sua lista de clientes de um arquivo Excel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">Baixar Template</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Baixe o template Excel com as colunas corretas para importação
                    </p>
                    <button
                      onClick={baixarTemplate}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Baixar Template
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-gray-500/20 rounded-lg">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      Selecione seu arquivo Excel
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Formatos aceitos: .xlsx, .xls
                    </p>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {loading ? 'Processando...' : 'Escolher Arquivo'}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
                <h3 className="font-medium text-white mb-2">Instruções:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• O arquivo deve conter colunas com nomes como: Nome, Telefone, Email, etc.</li>
                  <li>• A primeira linha deve conter os cabeçalhos das colunas</li>
                  <li>• Nome e Telefone são campos obrigatórios</li>
                  <li>• O sistema detecta automaticamente as colunas corretas</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">{clientesValidos}</div>
                  <div className="text-sm text-gray-300">Clientes Válidos</div>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-400">{clientesComErro}</div>
                  <div className="text-sm text-gray-300">Com Erros</div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">{clientes.length}</div>
                  <div className="text-sm text-gray-300">Total</div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-gray-300 font-medium">Status</th>
                        <th className="text-left p-3 text-gray-300 font-medium">Nome</th>
                        <th className="text-left p-3 text-gray-300 font-medium">Telefone</th>
                        <th className="text-left p-3 text-gray-300 font-medium">Email</th>
                        <th className="text-left p-3 text-gray-300 font-medium">Erro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((cliente, index) => (
                        <tr key={index} className="border-t border-white/5">
                          <td className="p-3">
                            {cliente.status === 'validado' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                          </td>
                          <td className="p-3 text-white">{cliente.nome}</td>
                          <td className="p-3 text-gray-300">{cliente.telefone}</td>
                          <td className="p-3 text-gray-300">{cliente.email || '-'}</td>
                          <td className="p-3 text-red-400 text-sm">{cliente.erro || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('upload')}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmarImportacao}
                  disabled={clientesValidos === 0}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Importar {clientesValidos} Clientes
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Importação Realizada com Sucesso!
                </h3>
                <p className="text-gray-300">
                  {clientesValidos} clientes foram importados para o sistema.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}