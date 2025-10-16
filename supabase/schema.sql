-- ============================================================================
-- SCHEMA PARA SISTEMA DE GERENCIAMENTO DE SALÃO DE BELEZA
-- Execute este script no seu Supabase SQL Editor
-- ============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABELA: saloes
-- ============================================================================
CREATE TABLE public.saloes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    licenca_id UUID
);

-- ============================================================================
-- TABELA: clientes
-- ============================================================================
CREATE TABLE public.clientes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE,
    endereco TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'))
);

-- ============================================================================
-- TABELA: servicos
-- ============================================================================
CREATE TABLE public.servicos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao INTEGER NOT NULL, -- em minutos
    categoria VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'))
);

-- ============================================================================
-- TABELA: agendamentos
-- ============================================================================
CREATE TABLE public.agendamentos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE RESTRICT,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: licencas
-- ============================================================================
CREATE TABLE public.licencas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chave_ativacao VARCHAR(50) UNIQUE NOT NULL,
    plano_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'suspensa', 'cancelada', 'expirada')),
    data_ativacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
    salao_id UUID REFERENCES public.saloes(id) ON DELETE SET NULL,
    recursos_ativos TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: transacoes
-- ============================================================================
CREATE TABLE public.transacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
    agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: registros_usuario (para o sistema de licenças)
-- ============================================================================
CREATE TABLE public.registros_usuario (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome_empresa VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    plano_selecionado VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
    data_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índices para clientes
CREATE INDEX idx_clientes_salao_id ON public.clientes(salao_id);
CREATE INDEX idx_clientes_status ON public.clientes(status);

-- Índices para serviços
CREATE INDEX idx_servicos_salao_id ON public.servicos(salao_id);
CREATE INDEX idx_servicos_status ON public.servicos(status);

-- Índices para agendamentos
CREATE INDEX idx_agendamentos_salao_id ON public.agendamentos(salao_id);
CREATE INDEX idx_agendamentos_cliente_id ON public.agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_data ON public.agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_status ON public.agendamentos(status);

-- Índices para transações
CREATE INDEX idx_transacoes_salao_id ON public.transacoes(salao_id);
CREATE INDEX idx_transacoes_data ON public.transacoes(data_transacao);
CREATE INDEX idx_transacoes_tipo ON public.transacoes(tipo);

-- Índices para licenças
CREATE INDEX idx_licencas_chave ON public.licencas(chave_ativacao);
CREATE INDEX idx_licencas_status ON public.licencas(status);
CREATE INDEX idx_licencas_salao_id ON public.licencas(salao_id);

-- ============================================================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas as tabelas
CREATE TRIGGER update_saloes_updated_at BEFORE UPDATE ON public.saloes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON public.servicos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licencas_updated_at BEFORE UPDATE ON public.licencas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transacoes_updated_at BEFORE UPDATE ON public.transacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registros_usuario_updated_at BEFORE UPDATE ON public.registros_usuario 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.saloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme necessário)
-- Por enquanto, permitindo acesso completo para desenvolvimento
CREATE POLICY "Permitir tudo por enquanto" ON public.saloes FOR ALL USING (true);
CREATE POLICY "Permitir tudo por enquanto" ON public.clientes FOR ALL USING (true);
CREATE POLICY "Permitir tudo por enquanto" ON public.servicos FOR ALL USING (true);
CREATE POLICY "Permitir tudo por enquanto" ON public.agendamentos FOR ALL USING (true);
CREATE POLICY "Permitir tudo por enquanto" ON public.licencas FOR ALL USING (true);
CREATE POLICY "Permitir tudo por enquanto" ON public.transacoes FOR ALL USING (true);
CREATE POLICY "Permitir tudo por enquanto" ON public.registros_usuario FOR ALL USING (true);

-- ============================================================================
-- DADOS INICIAIS DE EXEMPLO
-- ============================================================================

-- Inserir um salão de exemplo
INSERT INTO public.saloes (nome, email, telefone, endereco) VALUES 
('Salão Exemplo', 'admin@salao.com', '(11) 99999-9999', 'Rua das Flores, 123 - São Paulo/SP');

-- Obter o ID do salão inserido
DO $$
DECLARE
    salao_exemplo_id UUID;
    cliente_exemplo_id UUID;
    servico_exemplo_id UUID;
BEGIN
    -- Buscar ID do salão
    SELECT id INTO salao_exemplo_id FROM public.saloes WHERE email = 'admin@salao.com';
    
    -- Inserir cliente de exemplo
    INSERT INTO public.clientes (salao_id, nome, telefone) 
    VALUES (salao_exemplo_id, 'Cliente Exemplo', '(11) 88888-8888')
    RETURNING id INTO cliente_exemplo_id;
    
    -- Inserir serviço de exemplo
    INSERT INTO public.servicos (salao_id, nome, preco, duracao) 
    VALUES (salao_exemplo_id, 'Serviço Exemplo', 50.00, 60)
    RETURNING id INTO servico_exemplo_id;
    
    -- Inserir agendamento de exemplo
    INSERT INTO public.agendamentos (salao_id, cliente_id, servico_id, data_agendamento, hora_inicio, hora_fim, valor_total) 
    VALUES (salao_exemplo_id, cliente_exemplo_id, servico_exemplo_id, CURRENT_DATE + INTERVAL '1 day', '14:00', '15:00', 50.00);
    
    -- Inserir transação de exemplo
    INSERT INTO public.transacoes (salao_id, tipo, categoria, descricao, valor) 
    VALUES (salao_exemplo_id, 'receita', 'Serviços', 'Exemplo de receita', 50.00);
END $$;

-- ============================================================================
-- VIEWS ÚTEIS
-- ============================================================================

-- View para agendamentos com detalhes
CREATE VIEW agendamentos_detalhados AS
SELECT 
    a.id,
    a.data_agendamento,
    a.hora_inicio,
    a.hora_fim,
    a.valor_total,
    a.status,
    a.observacoes,
    c.nome AS cliente_nome,
    c.telefone AS cliente_telefone,
    s.nome AS servico_nome,
    s.duracao AS servico_duracao,
    sl.nome AS salao_nome
FROM public.agendamentos a
JOIN public.clientes c ON a.cliente_id = c.id
JOIN public.servicos s ON a.servico_id = s.id
JOIN public.saloes sl ON a.salao_id = sl.id;

-- View para relatórios financeiros
CREATE VIEW relatorio_financeiro AS
SELECT 
    salao_id,
    DATE_TRUNC('month', data_transacao) AS mes,
    SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS total_receitas,
    SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS total_despesas,
    SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) AS saldo
FROM public.transacoes
GROUP BY salao_id, DATE_TRUNC('month', data_transacao)
ORDER BY mes DESC;

-- ============================================================================
-- SCHEMA CONCLUÍDO!
-- ============================================================================

-- Para verificar se tudo foi criado corretamente:
SELECT 
    schemaname, 
    tablename, 
    tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;