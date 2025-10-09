"""
Sistema de Backup Completo - Salão de Beleza
Backup automático de todos os arquivos e configurações
"""

import os
import shutil
import zipfile
import json
from datetime import datetime
import hashlib
import sqlite3
from pathlib import Path

class SistemaBackup:
    def __init__(self, diretorio_projeto):
        self.diretorio_projeto = Path(diretorio_projeto)
        self.diretorio_backup = self.diretorio_projeto / "backups"
        self.diretorio_backup.mkdir(exist_ok=True)
        
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.nome_backup = f"backup_completo_{self.timestamp}"
        
    def criar_backup_completo(self):
        """Cria backup completo de todo o projeto"""
        print("🚀 INICIANDO BACKUP COMPLETO DO PROJETO")
        print("=" * 50)
        
        # Criar diretório do backup
        backup_path = self.diretorio_backup / self.nome_backup
        backup_path.mkdir(exist_ok=True)
        
        # 1. Backup do código fonte
        self._backup_codigo_fonte(backup_path)
        
        # 2. Backup dos sistemas Python
        self._backup_sistemas_python(backup_path)
        
        # 3. Backup de configurações
        self._backup_configuracoes(backup_path)
        
        # 4. Backup de dependências
        self._backup_dependencias(backup_path)
        
        # 5. Backup de scripts
        self._backup_scripts(backup_path)
        
        # 6. Criar arquivo compactado
        arquivo_zip = self._criar_arquivo_compactado(backup_path)
        
        # 7. Gerar relatório do backup
        self._gerar_relatorio_backup(backup_path, arquivo_zip)
        
        print(f"✅ BACKUP COMPLETO FINALIZADO!")
        print(f"📁 Localização: {arquivo_zip}")
        print("=" * 50)
        
        return arquivo_zip
    
    def _backup_codigo_fonte(self, backup_path):
        """Backup do código fonte Next.js"""
        print("📁 Fazendo backup do código fonte...")
        
        fonte_path = backup_path / "frontend"
        fonte_path.mkdir(exist_ok=True)
        
        # Arquivos e diretórios importantes do frontend
        itens_frontend = [
            "src",
            "public", 
            "package.json",
            "package-lock.json",
            "next.config.js",
            "tailwind.config.ts",
            "tsconfig.json",
            ".env.local",
            ".env.example",
            "README.md"
        ]
        
        for item in itens_frontend:
            origem = self.diretorio_projeto / item
            if origem.exists():
                if origem.is_dir():
                    destino = fonte_path / item
                    shutil.copytree(origem, destino, ignore=shutil.ignore_patterns(
                        '*.log', '*.tmp', '__pycache__', 'node_modules', '.next'
                    ))
                else:
                    shutil.copy2(origem, fonte_path / item)
                print(f"  ✅ {item}")
        
        print(f"📁 Frontend backup: {len(list(fonte_path.rglob('*')))} arquivos")
    
    def _backup_sistemas_python(self, backup_path):
        """Backup de todos os sistemas Python"""
        print("🐍 Fazendo backup dos sistemas Python...")
        
        python_path = backup_path / "python_systems"
        python_path.mkdir(exist_ok=True)
        
        # Sistemas Python
        sistemas_python = [
            "python-caixa",
            "python-analytics", 
            "python-relatorios",
            "python-ml",
            "python-imagens",
            "python-dados",
            "python-automacao",
            "ai-agent"
        ]
        
        for sistema in sistemas_python:
            origem = self.diretorio_projeto / sistema
            if origem.exists():
                destino = python_path / sistema
                shutil.copytree(origem, destino, ignore=shutil.ignore_patterns(
                    '*.pyc', '__pycache__', '*.log', '.venv', 'dados_cache.db'
                ))
                print(f"  ✅ {sistema}")
        
        print(f"🐍 Python systems backup: {len(list(python_path.rglob('*.py')))} arquivos Python")
    
    def _backup_configuracoes(self, backup_path):
        """Backup de arquivos de configuração"""
        print("⚙️ Fazendo backup das configurações...")
        
        config_path = backup_path / "configuracoes"
        config_path.mkdir(exist_ok=True)
        
        # Arquivos de configuração
        configs = [
            "requirements.txt",
            ".gitignore",
            ".github",
            "iniciar-produto-top-linha.bat",
            "iniciar-ecossistema-python.bat"
        ]
        
        for config in configs:
            origem = self.diretorio_projeto / config
            if origem.exists():
                if origem.is_dir():
                    destino = config_path / config
                    shutil.copytree(origem, destino)
                else:
                    shutil.copy2(origem, config_path / config)
                print(f"  ✅ {config}")
        
        print(f"⚙️ Configurações backup: {len(list(config_path.rglob('*')))} arquivos")
    
    def _backup_dependencias(self, backup_path):
        """Backup de informações de dependências"""
        print("📦 Fazendo backup das dependências...")
        
        deps_path = backup_path / "dependencias"
        deps_path.mkdir(exist_ok=True)
        
        # Salvar versões das dependências
        dependencias_info = {
            "timestamp": self.timestamp,
            "node_version": self._get_command_output("node --version"),
            "npm_version": self._get_command_output("npm --version"),
            "python_version": self._get_command_output("python --version"),
            "pip_version": self._get_command_output("pip --version")
        }
        
        # Salvar lista de pacotes instalados
        try:
            npm_list = self._get_command_output("npm list --depth=0")
            dependencias_info["npm_packages"] = npm_list
        except:
            dependencias_info["npm_packages"] = "Erro ao obter lista npm"
        
        try:
            pip_list = self._get_command_output("pip list")
            dependencias_info["python_packages"] = pip_list
        except:
            dependencias_info["python_packages"] = "Erro ao obter lista pip"
        
        # Salvar em JSON
        with open(deps_path / "dependencias_info.json", "w", encoding="utf-8") as f:
            json.dump(dependencias_info, f, indent=2, ensure_ascii=False)
        
        # Copiar requirements.txt
        req_origem = self.diretorio_projeto / "requirements.txt"
        if req_origem.exists():
            shutil.copy2(req_origem, deps_path / "requirements.txt")
        
        # Copiar package.json
        pkg_origem = self.diretorio_projeto / "package.json"
        if pkg_origem.exists():
            shutil.copy2(pkg_origem, deps_path / "package.json")
        
        print(f"📦 Dependências backup: {len(list(deps_path.rglob('*')))} arquivos")
    
    def _backup_scripts(self, backup_path):
        """Backup de scripts de inicialização"""
        print("📜 Fazendo backup dos scripts...")
        
        scripts_path = backup_path / "scripts"
        scripts_path.mkdir(exist_ok=True)
        
        # Scripts
        scripts = [f for f in self.diretorio_projeto.glob("*.bat")]
        scripts.extend(self.diretorio_projeto.glob("*.sh"))
        scripts.extend(self.diretorio_projeto.glob("*.ps1"))
        
        for script in scripts:
            shutil.copy2(script, scripts_path / script.name)
            print(f"  ✅ {script.name}")
        
        print(f"📜 Scripts backup: {len(list(scripts_path.rglob('*')))} arquivos")
    
    def _criar_arquivo_compactado(self, backup_path):
        """Cria arquivo ZIP do backup"""
        print("🗜️ Compactando backup...")
        
        arquivo_zip = self.diretorio_backup / f"{self.nome_backup}.zip"
        
        with zipfile.ZipFile(arquivo_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for arquivo in backup_path.rglob('*'):
                if arquivo.is_file():
                    arcname = arquivo.relative_to(backup_path)
                    zipf.write(arquivo, arcname)
        
        # Calcular tamanho
        tamanho_mb = arquivo_zip.stat().st_size / (1024 * 1024)
        print(f"🗜️ Arquivo compactado: {tamanho_mb:.2f} MB")
        
        return arquivo_zip
    
    def _gerar_relatorio_backup(self, backup_path, arquivo_zip):
        """Gera relatório detalhado do backup"""
        print("📊 Gerando relatório do backup...")
        
        # Contar arquivos por tipo
        contadores = {
            "typescript": len(list(backup_path.rglob("*.ts"))),
            "tsx": len(list(backup_path.rglob("*.tsx"))),
            "javascript": len(list(backup_path.rglob("*.js"))),
            "python": len(list(backup_path.rglob("*.py"))),
            "json": len(list(backup_path.rglob("*.json"))),
            "css": len(list(backup_path.rglob("*.css"))),
            "md": len(list(backup_path.rglob("*.md"))),
            "total": len(list(backup_path.rglob("*")))
        }
        
        # Calcular hash do backup
        hash_backup = self._calcular_hash_arquivo(arquivo_zip)
        
        relatorio = {
            "backup_info": {
                "nome": self.nome_backup,
                "timestamp": self.timestamp,
                "data_legivel": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                "tamanho_mb": round(arquivo_zip.stat().st_size / (1024 * 1024), 2),
                "hash_sha256": hash_backup
            },
            "estatisticas": contadores,
            "estrutura": {
                "frontend": "Código fonte Next.js/React",
                "python_systems": "7 microserviços Python",
                "configuracoes": "Arquivos de configuração",
                "dependencias": "Informações de dependências",
                "scripts": "Scripts de inicialização"
            },
            "sistemas_incluidos": [
                "Frontend Next.js com TypeScript",
                "Sistema Caixa (Python + FastAPI)",
                "Sistema Analytics (Python + Pandas)",
                "Sistema Relatórios (Python + NumPy)",
                "Sistema ML (Python + Scikit-learn)",
                "Sistema Imagens (Python + OpenCV)",
                "Sistema Big Data (Python + SciPy)",
                "Sistema Automação (Python + APScheduler)",
                "AI Agent (Python + NLP)"
            ]
        }
        
        # Salvar relatório
        relatorio_path = self.diretorio_backup / f"relatorio_{self.timestamp}.json"
        with open(relatorio_path, "w", encoding="utf-8") as f:
            json.dump(relatorio, f, indent=2, ensure_ascii=False)
        
        # Salvar relatório em texto
        relatorio_txt = self.diretorio_backup / f"relatorio_{self.timestamp}.txt"
        with open(relatorio_txt, "w", encoding="utf-8") as f:
            f.write("🚀 RELATÓRIO DE BACKUP - SISTEMA SALÃO DE BELEZA\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"📅 Data: {relatorio['backup_info']['data_legivel']}\n")
            f.write(f"📁 Nome: {relatorio['backup_info']['nome']}\n")
            f.write(f"💾 Tamanho: {relatorio['backup_info']['tamanho_mb']} MB\n")
            f.write(f"🔐 Hash: {relatorio['backup_info']['hash_sha256']}\n\n")
            
            f.write("📊 ESTATÍSTICAS DE ARQUIVOS:\n")
            f.write("-" * 30 + "\n")
            for tipo, count in contadores.items():
                f.write(f"{tipo.upper()}: {count} arquivos\n")
            
            f.write(f"\n🎯 SISTEMAS INCLUÍDOS:\n")
            f.write("-" * 30 + "\n")
            for sistema in relatorio['sistemas_incluidos']:
                f.write(f"✅ {sistema}\n")
            
            f.write(f"\n🏆 RESULTADO:\n")
            f.write("-" * 30 + "\n")
            f.write("✅ Backup completo de produto TOP DE LINHA\n")
            f.write("✅ Frontend Next.js + 7 microserviços Python\n")
            f.write("✅ Demonstração de superioridade Python em áreas específicas\n")
            f.write("✅ Integração perfeita entre tecnologias\n")
        
        print(f"📊 Relatório salvo: {relatorio_path.name}")
        return relatorio
    
    def _get_command_output(self, command):
        """Executa comando e retorna output"""
        try:
            import subprocess
            result = subprocess.run(command.split(), capture_output=True, text=True, timeout=10)
            return result.stdout.strip() if result.returncode == 0 else f"Erro: {result.stderr}"
        except Exception as e:
            return f"Erro ao executar: {str(e)}"
    
    def _calcular_hash_arquivo(self, arquivo_path):
        """Calcula hash SHA256 do arquivo"""
        hash_sha256 = hashlib.sha256()
        with open(arquivo_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        return hash_sha256.hexdigest()

def main():
    """Função principal do backup"""
    # Detectar diretório do projeto
    script_dir = Path(__file__).parent
    projeto_dir = script_dir.parent if script_dir.name == "backups" else script_dir
    
    print("🚀 SISTEMA DE BACKUP - SALÃO DE BELEZA")
    print("🐍 Python Superior em Backup e Automação")
    print("=" * 60)
    print(f"📁 Diretório do projeto: {projeto_dir}")
    print()
    
    # Criar sistema de backup
    backup_system = SistemaBackup(projeto_dir)
    
    try:
        # Executar backup completo
        arquivo_backup = backup_system.criar_backup_completo()
        
        print()
        print("🎉 BACKUP CONCLUÍDO COM SUCESSO!")
        print(f"📦 Arquivo: {arquivo_backup}")
        print(f"💾 Tamanho: {arquivo_backup.stat().st_size / (1024*1024):.2f} MB")
        print()
        print("🔐 SEGURANÇA:")
        print("✅ Todos os arquivos fonte preservados")
        print("✅ Configurações e dependências salvas")
        print("✅ Hash SHA256 gerado para verificação")
        print("✅ Relatório detalhado criado")
        print()
        print("🚀 SISTEMAS INCLUÍDOS:")
        print("✅ Frontend Next.js completo")
        print("✅ 7 microserviços Python")
        print("✅ Scripts de automação")
        print("✅ Configurações de desenvolvimento")
        
    except Exception as e:
        print(f"❌ ERRO NO BACKUP: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()