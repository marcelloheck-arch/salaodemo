#!/bin/bash
# Script para testar a demo localmente

echo "🎭 SalaoGerent - Iniciando Demonstração Local"
echo "============================================="

# Verificar se estamos na pasta correta
if [ ! -f "index.html" ]; then
    echo "❌ Erro: Execute este script na pasta demo"
    exit 1
fi

# Verificar se Python está instalado
if command -v python3 &> /dev/null; then
    echo "🐍 Iniciando servidor Python..."
    echo "📱 Acesse: http://localhost:8000"
    echo "⏹️  Pressione Ctrl+C para parar"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🐍 Iniciando servidor Python..."
    echo "📱 Acesse: http://localhost:8000"
    echo "⏹️  Pressione Ctrl+C para parar"
    python -m http.server 8000
elif command -v php &> /dev/null; then
    echo "🐘 Iniciando servidor PHP..."
    echo "📱 Acesse: http://localhost:8000"
    echo "⏹️  Pressione Ctrl+C para parar"
    php -S localhost:8000
elif command -v npx &> /dev/null; then
    echo "📦 Iniciando servidor Node.js..."
    echo "📱 Acesse: http://localhost:8080"
    echo "⏹️  Pressione Ctrl+C para parar"
    npx http-server -p 8080
else
    echo "❌ Nenhum servidor local encontrado!"
    echo "💡 Instale Python, PHP ou Node.js para rodar localmente"
    echo "🌐 Ou abra index.html diretamente no navegador"
    echo ""
    echo "📋 Credenciais de teste:"
    echo "   Email: admin@salao.com"
    echo "   Senha: demo123"
    echo ""
    echo "🎯 Ou use os botões de acesso rápido!"
fi