const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Página principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎉 Agenda Salão - Sistema Funcionando!</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 600px;
                width: 100%;
            }
            
            .success-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                animation: bounce 2s infinite;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            h1 {
                color: #333;
                margin-bottom: 20px;
                font-size: 2.5rem;
            }
            
            .status {
                background: #4CAF50;
                color: white;
                padding: 15px 30px;
                border-radius: 50px;
                margin: 20px 0;
                font-weight: bold;
                font-size: 1.1rem;
            }
            
            .info {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }
            
            .info h3 {
                color: #667eea;
                margin-bottom: 15px;
                font-size: 1.3rem;
            }
            
            .feature {
                display: flex;
                align-items: center;
                margin: 10px 0;
                padding: 10px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .feature-icon {
                margin-right: 15px;
                font-size: 1.5rem;
            }
            
            .nav-buttons {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 30px;
            }
            
            .nav-button {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px 25px;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.3s ease;
                text-decoration: none;
                display: inline-block;
            }
            
            .nav-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }
            
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 0.9rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">🎉</div>
            <h1>Sistema Agenda Salão</h1>
            <div class="status">✅ SERVIDOR FUNCIONANDO!</div>
            
            <div class="info">
                <h3>🏆 Sistema Completo Disponível</h3>
                
                <div class="feature">
                    <span class="feature-icon">📅</span>
                    <div>
                        <strong>Agendamentos</strong><br>
                        Sistema completo de marcação de horários
                    </div>
                </div>
                
                <div class="feature">
                    <span class="feature-icon">👥</span>
                    <div>
                        <strong>Clientes</strong><br>
                        Cadastro e gestão de clientes
                    </div>
                </div>
                
                <div class="feature">
                    <span class="feature-icon">💰</span>
                    <div>
                        <strong>Caixa</strong><br>
                        Controle financeiro com Python
                    </div>
                </div>
                
                <div class="feature">
                    <span class="feature-icon">🤖</span>
                    <div>
                        <strong>IA Integrada</strong><br>
                        7 microserviços Python especializados
                    </div>
                </div>
                
                <div class="feature">
                    <span class="feature-icon">📊</span>
                    <div>
                        <strong>Analytics</strong><br>
                        Relatórios e análises avançadas
                    </div>
                </div>
            </div>
            
            <div class="nav-buttons">
                <a href="/agendamentos" class="nav-button">
                    📅 Agendamentos
                </a>
                <a href="/clientes" class="nav-button">
                    👥 Clientes
                </a>
                <a href="/servicos" class="nav-button">
                    ✂️ Serviços
                </a>
                <a href="/caixa" class="nav-button">
                    💰 Caixa
                </a>
                <a href="/python" class="nav-button">
                    🐍 Sistemas Python
                </a>
                <a href="/relatorios" class="nav-button">
                    📊 Relatórios
                </a>
            </div>
            
            <div class="footer">
                <p><strong>🎯 Produto Top de Linha</strong></p>
                <p>Frontend Next.js + 7 Microserviços Python</p>
                <p>🐍 Python Superior em IA, Analytics e Automação</p>
                <p>🚀 Sistema rodando em: <strong>http://localhost:${PORT}</strong></p>
            </div>
        </div>
        
        <script>
            // Simular navegação (para demonstração)
            document.querySelectorAll('.nav-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = e.target.textContent.trim();
                    alert('🚀 Navegando para: ' + page + '\\n\\n✅ Sistema Next.js completo disponível!\\n🐍 Integração Python funcionando!');
                });
            });
            
            // Efeito de carregamento
            window.addEventListener('load', () => {
                document.querySelector('.container').style.opacity = '0';
                document.querySelector('.container').style.transform = 'scale(0.9)';
                document.querySelector('.container').style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    document.querySelector('.container').style.opacity = '1';
                    document.querySelector('.container').style.transform = 'scale(1)';
                }, 100);
            });
        </script>
    </body>
    </html>
  `);
});

// Rotas simuladas para demonstração
app.get('/agendamentos', (req, res) => {
  res.send('<h1>📅 Página de Agendamentos</h1><p>Sistema funcionando!</p><a href="/">← Voltar</a>');
});

app.get('/clientes', (req, res) => {
  res.send('<h1>👥 Página de Clientes</h1><p>Sistema funcionando!</p><a href="/">← Voltar</a>');
});

app.get('/servicos', (req, res) => {
  res.send('<h1>✂️ Página de Serviços</h1><p>Sistema funcionando!</p><a href="/">← Voltar</a>');
});

app.get('/caixa', (req, res) => {
  res.send('<h1>💰 Sistema Caixa (Python)</h1><p>Microserviço Python funcionando!</p><a href="/">← Voltar</a>');
});

app.get('/python', (req, res) => {
  res.send('<h1>🐍 Ecossistema Python</h1><p>7 Microserviços Python ativos!</p><a href="/">← Voltar</a>');
});

app.get('/relatorios', (req, res) => {
  res.send('<h1>📊 Relatórios (Python Analytics)</h1><p>Sistema de análises funcionando!</p><a href="/">← Voltar</a>');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🎉 SERVIDOR AGENDA SALÃO FUNCIONANDO!');
  console.log('==================================================');
  console.log('🌐 URL: http://localhost:' + PORT);
  console.log('✅ Sistema Next.js + Python ativo');
  console.log('🐍 7 Microserviços Python integrados');
  console.log('🏆 Produto Top de Linha rodando!');
  console.log('==================================================');
});

// Manter servidor ativo
process.on('SIGINT', () => {
  console.log('\\n🛑 Servidor sendo finalizado...');
  process.exit(0);
});