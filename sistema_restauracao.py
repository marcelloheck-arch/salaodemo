"""
Sistema de Restauração de Backup - Salão de Beleza
Restaura backup completo do projeto com verificação de integridade
"""

import os
import shutil
import zipfile
import json
import hashlib
from datetime import datetime
from pathlib import Path

class SistemaRestauracao:
    def __init__(self, diretorio_destino):
        self.diretorio_destino = Path(diretorio_destino)
        self.diretorio_backups = self.diretorio_destino / "backups"
        
    def listar_backups_disponiveis(self):
        """Lista todos os backups disponíveis"""
        print("📦 BACKUPS DISPONÍVEIS:")
        print("=" * 50)
        
        if not self.diretorio_backups.exists():
            print("❌ Diretório de backups não encontrado!")
            return []
        
        backups = []
        for arquivo in self.diretorio_backups.glob("backup_completo_*.zip"):
            # Extrair timestamp do nome
            timestamp = arquivo.stem.split("_")[-2] + "_" + arquivo.stem.split("_")[-1]
            
            # Converter para data legível
            try:
                data_obj = datetime.strptime(timestamp, "%Y%m%d_%H%M%S")
                data_legivel = data_obj.strftime("%d/%m/%Y %H:%M:%S")
            except:
                data_legivel = timestamp
            
            # Tamanho do arquivo
            tamanho_mb = arquivo.stat().st_size / (1024 * 1024)
            
            backup_info = {
                "arquivo": arquivo,
                "timestamp": timestamp,
                "data_legivel": data_legivel,
                "tamanho_mb": round(tamanho_mb, 2)
            }
            
            backups.append(backup_info)
            
            print(f"📁 {arquivo.name}")
            print(f"   📅 Data: {data_legivel}")
            print(f"   💾 Tamanho: {tamanho_mb:.2f} MB")
            print()
        
        # Ordenar por data (mais recente primeiro)
        backups.sort(key=lambda x: x["timestamp"], reverse=True)
        return backups
    
    def verificar_integridade_backup(self, arquivo_backup):
        """Verifica integridade do backup usando hash"""
        print(f"🔍 Verificando integridade de {arquivo_backup.name}...")
        
        # Procurar relatório correspondente
        timestamp = arquivo_backup.stem.split("_")[-2] + "_" + arquivo_backup.stem.split("_")[-1]
        relatorio_path = self.diretorio_backups / f"relatorio_{timestamp}.json"
        
        if not relatorio_path.exists():
            print("⚠️ Relatório de backup não encontrado. Verificação limitada.")
            return True
        
        # Carregar relatório
        with open(relatorio_path, "r", encoding="utf-8") as f:
            relatorio = json.load(f)
        
        # Verificar hash
        hash_esperado = relatorio["backup_info"]["hash_sha256"]
        hash_atual = self._calcular_hash_arquivo(arquivo_backup)
        
        if hash_atual == hash_esperado:
            print("✅ Integridade verificada - Hash SHA256 correto")
            return True
        else:
            print("❌ ERRO DE INTEGRIDADE - Hash SHA256 incorreto!")
            print(f"   Esperado: {hash_esperado}")
            print(f"   Atual:    {hash_atual}")
            return False
    
    def restaurar_backup(self, arquivo_backup, confirmar=True):
        """Restaura backup completo"""
        print(f"🔄 INICIANDO RESTAURAÇÃO DE BACKUP")
        print("=" * 50)
        print(f"📁 Arquivo: {arquivo_backup.name}")
        
        # Verificar integridade primeiro
        if not self.verificar_integridade_backup(arquivo_backup):
            print("❌ RESTAURAÇÃO CANCELADA - Problema de integridade!")
            return False
        
        if confirmar:
            resposta = input("\n⚠️ ATENÇÃO: Esta operação irá sobrescrever arquivos existentes!\nDeseja continuar? (s/N): ")
            if resposta.lower() not in ["s", "sim", "y", "yes"]:
                print("❌ Restauração cancelada pelo usuário.")
                return False
        
        try:
            # Criar backup dos arquivos atuais (se existirem)
            self._backup_arquivos_atuais()
            
            # Extrair backup
            print("📦 Extraindo arquivos do backup...")
            temp_dir = self.diretorio_destino / "temp_restore"
            temp_dir.mkdir(exist_ok=True)
            
            with zipfile.ZipFile(arquivo_backup, 'r') as zipf:
                zipf.extractall(temp_dir)
            
            # Restaurar frontend
            self._restaurar_frontend(temp_dir)
            
            # Restaurar sistemas Python
            self._restaurar_sistemas_python(temp_dir)
            
            # Restaurar configurações
            self._restaurar_configuracoes(temp_dir)
            
            # Restaurar scripts
            self._restaurar_scripts(temp_dir)
            
            # Limpar diretório temporário
            shutil.rmtree(temp_dir)
            
            print("✅ RESTAURAÇÃO CONCLUÍDA COM SUCESSO!")
            print("🎉 Projeto restaurado para estado do backup")
            return True
            
        except Exception as e:
            print(f"❌ ERRO NA RESTAURAÇÃO: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    def _backup_arquivos_atuais(self):
        """Cria backup dos arquivos atuais antes da restauração"""
        print("💾 Fazendo backup dos arquivos atuais...")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_atual = self.diretorio_backups / f"backup_antes_restauracao_{timestamp}"
        backup_atual.mkdir(exist_ok=True)
        
        # Arquivos importantes para preservar
        arquivos_preservar = ["src", "package.json", "requirements.txt"]
        
        for arquivo in arquivos_preservar:
            origem = self.diretorio_destino / arquivo
            if origem.exists():
                if origem.is_dir():
                    destino = backup_atual / arquivo
                    shutil.copytree(origem, destino, ignore=shutil.ignore_patterns(
                        'node_modules', '.next', '__pycache__'
                    ))
                else:
                    shutil.copy2(origem, backup_atual / arquivo)
        
        print(f"💾 Backup atual salvo em: {backup_atual.name}")
    
    def _restaurar_frontend(self, temp_dir):
        """Restaura código frontend"""
        print("🌐 Restaurando frontend...")
        
        frontend_source = temp_dir / "frontend"
        if not frontend_source.exists():
            print("⚠️ Frontend não encontrado no backup")
            return
        
        # Copiar arquivos do frontend
        for item in frontend_source.iterdir():
            destino = self.diretorio_destino / item.name
            if destino.exists():
                if destino.is_dir():
                    shutil.rmtree(destino)
                else:
                    destino.unlink()
            
            if item.is_dir():
                shutil.copytree(item, destino)
            else:
                shutil.copy2(item, destino)
        
        print("✅ Frontend restaurado")
    
    def _restaurar_sistemas_python(self, temp_dir):
        """Restaura sistemas Python"""
        print("🐍 Restaurando sistemas Python...")
        
        python_source = temp_dir / "python_systems"
        if not python_source.exists():
            print("⚠️ Sistemas Python não encontrados no backup")
            return
        
        # Copiar cada sistema Python
        for sistema in python_source.iterdir():
            destino = self.diretorio_destino / sistema.name
            if destino.exists():
                shutil.rmtree(destino)
            
            shutil.copytree(sistema, destino)
            print(f"  ✅ {sistema.name}")
        
        print("✅ Sistemas Python restaurados")
    
    def _restaurar_configuracoes(self, temp_dir):
        """Restaura configurações"""
        print("⚙️ Restaurando configurações...")
        
        config_source = temp_dir / "configuracoes"
        if not config_source.exists():
            print("⚠️ Configurações não encontradas no backup")
            return
        
        # Copiar configurações
        for config in config_source.iterdir():
            destino = self.diretorio_destino / config.name
            if destino.exists():
                if destino.is_dir():
                    shutil.rmtree(destino)
                else:
                    destino.unlink()
            
            if config.is_dir():
                shutil.copytree(config, destino)
            else:
                shutil.copy2(config, destino)
        
        print("✅ Configurações restauradas")
    
    def _restaurar_scripts(self, temp_dir):
        """Restaura scripts"""
        print("📜 Restaurando scripts...")
        
        scripts_source = temp_dir / "scripts"
        if not scripts_source.exists():
            print("⚠️ Scripts não encontrados no backup")
            return
        
        # Copiar scripts
        for script in scripts_source.iterdir():
            destino = self.diretorio_destino / script.name
            if destino.exists():
                destino.unlink()
            
            shutil.copy2(script, destino)
        
        print("✅ Scripts restaurados")
    
    def _calcular_hash_arquivo(self, arquivo_path):
        """Calcula hash SHA256 do arquivo"""
        hash_sha256 = hashlib.sha256()
        with open(arquivo_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        return hash_sha256.hexdigest()

def main():
    """Função principal de restauração"""
    print("🔄 SISTEMA DE RESTAURAÇÃO - SALÃO DE BELEZA")
    print("🐍 Python Superior em Backup e Recuperação")
    print("=" * 60)
    
    # Detectar diretório do projeto
    script_dir = Path(__file__).parent
    
    # Criar sistema de restauração
    restore_system = SistemaRestauracao(script_dir)
    
    # Listar backups disponíveis
    backups = restore_system.listar_backups_disponiveis()
    
    if not backups:
        print("❌ Nenhum backup encontrado!")
        return
    
    # Mostrar menu
    print("📋 SELECIONE UM BACKUP PARA RESTAURAR:")
    for i, backup in enumerate(backups, 1):
        print(f"{i}. {backup['data_legivel']} ({backup['tamanho_mb']} MB)")
    
    try:
        opcao = int(input("\nDigite o número do backup (0 para cancelar): "))
        
        if opcao == 0:
            print("❌ Operação cancelada.")
            return
        
        if 1 <= opcao <= len(backups):
            backup_selecionado = backups[opcao - 1]
            print(f"\n🎯 Backup selecionado: {backup_selecionado['data_legivel']}")
            
            # Executar restauração
            sucesso = restore_system.restaurar_backup(backup_selecionado["arquivo"])
            
            if sucesso:
                print("\n🎉 PROJETO RESTAURADO COM SUCESSO!")
                print("💡 Recomendações pós-restauração:")
                print("  1. Execute: npm install")
                print("  2. Execute: pip install -r requirements.txt")
                print("  3. Teste o sistema: npm run dev")
            
        else:
            print("❌ Opção inválida!")
            
    except ValueError:
        print("❌ Entrada inválida!")
    except KeyboardInterrupt:
        print("\n❌ Operação cancelada pelo usuário.")

if __name__ == "__main__":
    main()