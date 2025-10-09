"""
Sistema de Processamento de Imagens
Python superior para manipulação e análise de imagens
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import io
import base64
import numpy as np
import cv2
from typing import List, Optional, Dict, Any
import face_recognition
import json
from datetime import datetime

app = FastAPI(title="Sistema de Processamento de Imagens", description="Processamento avançado com Python")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class ProcessamentoRequest(BaseModel):
    tipo: str  # 'redimensionar', 'filtro', 'correcao', 'marca_dagua'
    parametros: Dict[str, Any]

class AnaliseImagemRequest(BaseModel):
    incluir_faces: Optional[bool] = True
    incluir_cores: Optional[bool] = True
    incluir_qualidade: Optional[bool] = True

class ProcessadorImagens:
    """Sistema avançado de processamento de imagens"""
    
    def __init__(self):
        self.faces_conhecidas = {}  # Database de faces conhecidas
        self.historico_processamento = []
    
    def analisar_imagem(self, imagem_bytes: bytes, incluir_faces: bool = True, 
                       incluir_cores: bool = True, incluir_qualidade: bool = True) -> Dict[str, Any]:
        """Análise completa da imagem"""
        try:
            # Converter para PIL
            imagem_pil = Image.open(io.BytesIO(imagem_bytes))
            
            # Converter para array numpy para OpenCV
            imagem_array = np.array(imagem_pil)
            if len(imagem_array.shape) == 3 and imagem_array.shape[2] == 3:
                imagem_cv2 = cv2.cvtColor(imagem_array, cv2.COLOR_RGB2BGR)
            else:
                imagem_cv2 = imagem_array
            
            resultado = {
                'dimensoes': {
                    'largura': imagem_pil.width,
                    'altura': imagem_pil.height,
                    'formato': imagem_pil.format or 'Unknown',
                    'modo': imagem_pil.mode,
                    'tamanho_bytes': len(imagem_bytes)
                }
            }
            
            # Análise de qualidade
            if incluir_qualidade:
                resultado['qualidade'] = self._analisar_qualidade(imagem_cv2, imagem_pil)
            
            # Análise de cores
            if incluir_cores:
                resultado['cores'] = self._analisar_cores(imagem_pil)
            
            # Detecção de faces
            if incluir_faces and len(imagem_array.shape) == 3:
                resultado['faces'] = self._detectar_faces(imagem_array)
            
            return resultado
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao analisar imagem: {str(e)}")
    
    def _analisar_qualidade(self, imagem_cv2: np.ndarray, imagem_pil: Image.Image) -> Dict[str, Any]:
        """Análise de qualidade da imagem"""
        # Análise de nitidez (Laplacian)
        gray = cv2.cvtColor(imagem_cv2, cv2.COLOR_BGR2GRAY) if len(imagem_cv2.shape) == 3 else imagem_cv2
        nitidez = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Análise de brilho
        brilho_medio = np.mean(gray)
        
        # Análise de contraste
        contraste = np.std(gray)
        
        # Score de qualidade
        score_nitidez = min(100, (nitidez / 100) * 100)
        score_brilho = 100 - abs(brilho_medio - 127) / 127 * 100
        score_contraste = min(100, (contraste / 64) * 100)
        
        qualidade_geral = (score_nitidez + score_brilho + score_contraste) / 3
        
        return {
            'nitidez': {
                'valor': round(nitidez, 2),
                'score': round(score_nitidez, 1),
                'categoria': 'excelente' if score_nitidez > 80 else 'boa' if score_nitidez > 50 else 'regular'
            },
            'brilho': {
                'valor': round(brilho_medio, 2),
                'score': round(score_brilho, 1),
                'categoria': 'ideal' if abs(brilho_medio - 127) < 30 else 'aceitavel' if abs(brilho_medio - 127) < 60 else 'problema'
            },
            'contraste': {
                'valor': round(contraste, 2),
                'score': round(score_contraste, 1),
                'categoria': 'alto' if contraste > 50 else 'medio' if contraste > 25 else 'baixo'
            },
            'qualidade_geral': {
                'score': round(qualidade_geral, 1),
                'categoria': 'excelente' if qualidade_geral > 80 else 'boa' if qualidade_geral > 60 else 'regular' if qualidade_geral > 40 else 'ruim'
            },
            'recomendacoes': self._gerar_recomendacoes_qualidade(score_nitidez, score_brilho, score_contraste)
        }
    
    def _gerar_recomendacoes_qualidade(self, nitidez: float, brilho: float, contraste: float) -> List[str]:
        """Gera recomendações para melhorar a qualidade"""
        recomendacoes = []
        
        if nitidez < 50:
            recomendacoes.append("Aplicar filtro de nitidez para melhorar a definição")
        if brilho < 60:
            recomendacoes.append("Aumentar o brilho da imagem")
        elif brilho > 80:
            recomendacoes.append("Reduzir o brilho da imagem")
        if contraste < 50:
            recomendacoes.append("Aumentar o contraste para maior definição")
        
        if not recomendacoes:
            recomendacoes.append("Imagem com boa qualidade, não necessita ajustes")
        
        return recomendacoes
    
    def _analisar_cores(self, imagem_pil: Image.Image) -> Dict[str, Any]:
        """Análise de cores da imagem"""
        # Converter para array numpy
        imagem_array = np.array(imagem_pil)
        
        if len(imagem_array.shape) != 3:
            return {'erro': 'Imagem não colorida'}
        
        # Análise por canal RGB
        cores_rgb = {
            'vermelho': {
                'media': float(np.mean(imagem_array[:, :, 0])),
                'desvio': float(np.std(imagem_array[:, :, 0]))
            },
            'verde': {
                'media': float(np.mean(imagem_array[:, :, 1])),
                'desvio': float(np.std(imagem_array[:, :, 1]))
            },
            'azul': {
                'media': float(np.mean(imagem_array[:, :, 2])),
                'desvio': float(np.std(imagem_array[:, :, 2]))
            }
        }
        
        # Cores dominantes
        cores_dominantes = self._extrair_cores_dominantes(imagem_pil)
        
        # Temperatura de cor
        temperatura = self._calcular_temperatura_cor(cores_rgb)
        
        return {
            'canais_rgb': cores_rgb,
            'cores_dominantes': cores_dominantes,
            'temperatura_cor': temperatura,
            'saturacao_media': self._calcular_saturacao_media(imagem_pil),
            'harmonia': self._analisar_harmonia_cores(cores_dominantes)
        }
    
    def _extrair_cores_dominantes(self, imagem_pil: Image.Image, num_cores: int = 5) -> List[Dict[str, Any]]:
        """Extrai cores dominantes da imagem"""
        # Redimensionar para acelerar processamento
        imagem_pequena = imagem_pil.resize((150, 150))
        
        # Converter para array e reshape
        data = np.array(imagem_pequena)
        data = data.reshape((-1, 3))
        
        # K-means clustering para encontrar cores dominantes
        from sklearn.cluster import KMeans
        kmeans = KMeans(n_clusters=num_cores, random_state=42, n_init=10)
        kmeans.fit(data)
        
        cores = []
        for i, cor in enumerate(kmeans.cluster_centers_):
            cores.append({
                'rgb': [int(cor[0]), int(cor[1]), int(cor[2])],
                'hex': f"#{int(cor[0]):02x}{int(cor[1]):02x}{int(cor[2]):02x}",
                'porcentagem': float(np.sum(kmeans.labels_ == i) / len(kmeans.labels_) * 100),
                'nome_aproximado': self._nome_cor_aproximado(cor)
            })
        
        return sorted(cores, key=lambda x: x['porcentagem'], reverse=True)
    
    def _nome_cor_aproximado(self, rgb: np.ndarray) -> str:
        """Aproxima um nome para a cor RGB"""
        r, g, b = rgb
        
        # Cores básicas aproximadas
        if r > 200 and g > 200 and b > 200:
            return "Branco"
        elif r < 50 and g < 50 and b < 50:
            return "Preto"
        elif r > g + 50 and r > b + 50:
            return "Vermelho"
        elif g > r + 50 and g > b + 50:
            return "Verde"
        elif b > r + 50 and b > g + 50:
            return "Azul"
        elif r > 150 and g > 150 and b < 100:
            return "Amarelo"
        elif r > 150 and g < 100 and b > 150:
            return "Magenta"
        elif r < 100 and g > 150 and b > 150:
            return "Ciano"
        elif r > 150 and g > 100 and b < 100:
            return "Laranja"
        else:
            return "Misto"
    
    def _calcular_temperatura_cor(self, cores_rgb: Dict[str, Dict[str, float]]) -> Dict[str, Any]:
        """Calcula temperatura de cor da imagem"""
        r = cores_rgb['vermelho']['media']
        b = cores_rgb['azul']['media']
        
        if b > 0:
            ratio = r / b
            if ratio > 1.2:
                categoria = "Quente"
                kelvin_aproximado = 3000
            elif ratio < 0.8:
                categoria = "Fria"
                kelvin_aproximado = 6500
            else:
                categoria = "Neutra"
                kelvin_aproximado = 5000
        else:
            categoria = "Neutra"
            kelvin_aproximado = 5000
        
        return {
            'categoria': categoria,
            'kelvin_aproximado': kelvin_aproximado,
            'ratio_vermelho_azul': round(ratio if 'ratio' in locals() else 1.0, 2)
        }
    
    def _calcular_saturacao_media(self, imagem_pil: Image.Image) -> float:
        """Calcula saturação média da imagem"""
        # Converter para HSV
        imagem_hsv = imagem_pil.convert('HSV')
        hsv_array = np.array(imagem_hsv)
        
        # Canal S (saturação) é o índice 1
        saturacao_media = np.mean(hsv_array[:, :, 1])
        return round(saturacao_media / 255 * 100, 2)
    
    def _analisar_harmonia_cores(self, cores_dominantes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analisa harmonia das cores"""
        if len(cores_dominantes) < 2:
            return {'harmonia': 'monocromatica', 'score': 85}
        
        # Análise básica de contraste
        cor1 = cores_dominantes[0]['rgb']
        cor2 = cores_dominantes[1]['rgb']
        
        # Calcular contraste
        contraste = np.sqrt(sum((c1 - c2) ** 2 for c1, c2 in zip(cor1, cor2)))
        
        if contraste > 200:
            harmonia = 'alto_contraste'
            score = 90
        elif contraste > 100:
            harmonia = 'contrastante'
            score = 75
        else:
            harmonia = 'suave'
            score = 80
        
        return {
            'harmonia': harmonia,
            'score': round(score, 1),
            'contraste_principal': round(contraste, 1)
        }
    
    def _detectar_faces(self, imagem_array: np.ndarray) -> Dict[str, Any]:
        """Detecta faces na imagem"""
        try:
            # Encontrar localizações das faces
            localizacoes_faces = face_recognition.face_locations(imagem_array)
            
            if not localizacoes_faces:
                return {'quantidade': 0, 'faces': []}
            
            # Extrair encodings das faces
            encodings_faces = face_recognition.face_encodings(imagem_array, localizacoes_faces)
            
            faces_detectadas = []
            for i, (localizacao, encoding) in enumerate(zip(localizacoes_faces, encodings_faces)):
                top, right, bottom, left = localizacao
                
                face_info = {
                    'id': f'face_{i+1}',
                    'posicao': {
                        'top': int(top),
                        'right': int(right), 
                        'bottom': int(bottom),
                        'left': int(left)
                    },
                    'dimensoes': {
                        'largura': int(right - left),
                        'altura': int(bottom - top)
                    },
                    'qualidade_detectao': 'alta',  # Simplificado
                    'confianca': 0.95  # Simplificado
                }
                
                faces_detectadas.append(face_info)
            
            return {
                'quantidade': len(faces_detectadas),
                'faces': faces_detectadas,
                'recomendacoes': self._gerar_recomendacoes_faces(faces_detectadas, imagem_array.shape)
            }
            
        except Exception as e:
            return {'erro': f'Erro na detecção de faces: {str(e)}', 'quantidade': 0}
    
    def _gerar_recomendacoes_faces(self, faces: List[Dict[str, Any]], shape_imagem: tuple) -> List[str]:
        """Gera recomendações baseadas na detecção de faces"""
        recomendacoes = []
        
        if not faces:
            recomendacoes.append("Nenhuma face detectada - ideal para fotos de ambiente")
            return recomendacoes
        
        altura_img, largura_img = shape_imagem[:2]
        
        for face in faces:
            face_area = face['dimensoes']['largura'] * face['dimensoes']['altura']
            img_area = altura_img * largura_img
            porcentagem_face = (face_area / img_area) * 100
            
            if porcentagem_face < 5:
                recomendacoes.append("Face muito pequena - considere recortar ou reenquadrar")
            elif porcentagem_face > 30:
                recomendacoes.append("Face bem enquadrada para retrato")
        
        if len(faces) > 1:
            recomendacoes.append(f"Múltiplas faces detectadas ({len(faces)}) - ideal para fotos de grupo")
        
        return recomendacoes
    
    def processar_imagem(self, imagem_bytes: bytes, tipo: str, parametros: Dict[str, Any]) -> bytes:
        """Processa imagem com base no tipo solicitado"""
        try:
            imagem = Image.open(io.BytesIO(imagem_bytes))
            
            if tipo == 'redimensionar':
                imagem_processada = self._redimensionar(imagem, parametros)
            elif tipo == 'filtro':
                imagem_processada = self._aplicar_filtro(imagem, parametros)
            elif tipo == 'correcao':
                imagem_processada = self._corrigir_imagem(imagem, parametros)
            elif tipo == 'marca_dagua':
                imagem_processada = self._adicionar_marca_dagua(imagem, parametros)
            else:
                raise ValueError(f"Tipo de processamento não suportado: {tipo}")
            
            # Converter de volta para bytes
            buffer = io.BytesIO()
            formato = parametros.get('formato', 'JPEG')
            imagem_processada.save(buffer, format=formato)
            
            return buffer.getvalue()
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro no processamento: {str(e)}")
    
    def _redimensionar(self, imagem: Image.Image, parametros: Dict[str, Any]) -> Image.Image:
        """Redimensiona a imagem"""
        largura = parametros.get('largura')
        altura = parametros.get('altura')
        manter_proporcao = parametros.get('manter_proporcao', True)
        
        if manter_proporcao and largura and altura:
            imagem.thumbnail((largura, altura), Image.Resampling.LANCZOS)
            return imagem
        elif largura and altura:
            return imagem.resize((largura, altura), Image.Resampling.LANCZOS)
        else:
            raise ValueError("Largura e altura são obrigatórios")
    
    def _aplicar_filtro(self, imagem: Image.Image, parametros: Dict[str, Any]) -> Image.Image:
        """Aplica filtros na imagem"""
        filtro = parametros.get('filtro')
        intensidade = parametros.get('intensidade', 1.0)
        
        if filtro == 'blur':
            return imagem.filter(ImageFilter.GaussianBlur(radius=intensidade))
        elif filtro == 'sharpen':
            return imagem.filter(ImageFilter.UnsharpMask(radius=intensidade))
        elif filtro == 'edge':
            return imagem.filter(ImageFilter.FIND_EDGES)
        elif filtro == 'emboss':
            return imagem.filter(ImageFilter.EMBOSS)
        else:
            raise ValueError(f"Filtro não suportado: {filtro}")
    
    def _corrigir_imagem(self, imagem: Image.Image, parametros: Dict[str, Any]) -> Image.Image:
        """Corrige parâmetros da imagem"""
        brilho = parametros.get('brilho', 1.0)
        contraste = parametros.get('contraste', 1.0)
        saturacao = parametros.get('saturacao', 1.0)
        
        # Aplicar correções
        if brilho != 1.0:
            enhancer = ImageEnhance.Brightness(imagem)
            imagem = enhancer.enhance(brilho)
        
        if contraste != 1.0:
            enhancer = ImageEnhance.Contrast(imagem)
            imagem = enhancer.enhance(contraste)
        
        if saturacao != 1.0:
            enhancer = ImageEnhance.Color(imagem)
            imagem = enhancer.enhance(saturacao)
        
        return imagem
    
    def _adicionar_marca_dagua(self, imagem: Image.Image, parametros: Dict[str, Any]) -> Image.Image:
        """Adiciona marca d'água na imagem"""
        texto = parametros.get('texto', 'Salão de Beleza')
        posicao = parametros.get('posicao', 'bottom_right')
        opacidade = parametros.get('opacidade', 0.5)
        
        # Criar uma camada transparente
        overlay = Image.new('RGBA', imagem.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Tentar usar fonte padrão
        try:
            # Tamanho da fonte baseado no tamanho da imagem
            font_size = max(20, min(imagem.width, imagem.height) // 20)
            font = ImageFont.load_default()
        except:
            font = None
        
        # Calcular posição do texto
        if font:
            bbox = draw.textbbox((0, 0), texto, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
        else:
            text_width = len(texto) * 10
            text_height = 20
        
        if posicao == 'bottom_right':
            x = imagem.width - text_width - 20
            y = imagem.height - text_height - 20
        elif posicao == 'bottom_left':
            x = 20
            y = imagem.height - text_height - 20
        elif posicao == 'top_right':
            x = imagem.width - text_width - 20
            y = 20
        else:  # top_left
            x = 20
            y = 20
        
        # Desenhar texto com opacidade
        alpha = int(255 * opacidade)
        draw.text((x, y), texto, fill=(255, 255, 255, alpha), font=font)
        
        # Combinar com a imagem original
        if imagem.mode != 'RGBA':
            imagem = imagem.convert('RGBA')
        
        return Image.alpha_composite(imagem, overlay).convert('RGB')

# Instanciar processador
processador = ProcessadorImagens()

# Endpoints
@app.get("/")
async def root():
    return {"message": "Sistema de Processamento de Imagens - Python Superior", "status": "online"}

@app.post("/imagens/analisar")
async def analisar_imagem(file: UploadFile = File(...), request: AnaliseImagemRequest = AnaliseImagemRequest()):
    """Análise completa de imagem"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    contents = await file.read()
    resultado = processador.analisar_imagem(
        contents, 
        request.incluir_faces,
        request.incluir_cores,
        request.incluir_qualidade
    )
    
    return {
        'arquivo': file.filename,
        'analise': resultado,
        'timestamp': datetime.now().isoformat()
    }

@app.post("/imagens/processar")
async def processar_imagem(file: UploadFile = File(...), request: ProcessamentoRequest = ProcessamentoRequest):
    """Processa imagem com filtros e correções"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    contents = await file.read()
    imagem_processada = processador.processar_imagem(contents, request.tipo, request.parametros)
    
    return Response(
        content=imagem_processada,
        media_type="image/jpeg",
        headers={"Content-Disposition": f"attachment; filename=processada_{file.filename}"}
    )

@app.get("/imagens/capacidades")
async def capacidades_sistema():
    """Lista capacidades do sistema de processamento"""
    return {
        'tipos_processamento': {
            'redimensionar': {
                'descricao': 'Altera dimensões da imagem',
                'parametros': ['largura', 'altura', 'manter_proporcao', 'formato']
            },
            'filtro': {
                'descricao': 'Aplica filtros artísticos',
                'parametros': ['filtro', 'intensidade'],
                'filtros_disponiveis': ['blur', 'sharpen', 'edge', 'emboss']
            },
            'correcao': {
                'descricao': 'Corrige brilho, contraste e saturação',
                'parametros': ['brilho', 'contraste', 'saturacao']
            },
            'marca_dagua': {
                'descricao': 'Adiciona marca d\'água',
                'parametros': ['texto', 'posicao', 'opacidade']
            }
        },
        'analises_disponiveis': {
            'qualidade': 'Análise de nitidez, brilho e contraste',
            'cores': 'Extração de cores dominantes e harmonia',
            'faces': 'Detecção e análise de faces'
        },
        'formatos_suportados': ['JPEG', 'PNG', 'BMP', 'TIFF'],
        'vantagens_python': [
            'OpenCV para processamento avançado',
            'Face Recognition com deep learning',
            'Scikit-learn para clustering de cores',
            'PIL/Pillow para manipulação eficiente',
            'NumPy para operações matriciais rápidas'
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🖼️ SISTEMA DE PROCESSAMENTO DE IMAGENS - PYTHON SUPERIOR")
    print("📸 Análise avançada com OpenCV e face recognition")
    print("🎨 Processamento profissional de imagens")
    print("🚀 Servidor rodando em http://localhost:8005")
    
    uvicorn.run(app, host="0.0.0.0", port=8005)