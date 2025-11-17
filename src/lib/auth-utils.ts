/**
 * Utilitários de Autenticação JWT
 * Sistema Multi-Tenant com bcrypt e jsonwebtoken
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_CHANGE_IN_PRODUCTION';

// Tipos
export interface TokenPayload {
  userId: string;
  email: string;
  salonId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  user?: TokenPayload;
  error?: string;
}

/**
 * Gera hash de senha com bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifica senha com hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Gera JWT token
 */
export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token válido por 7 dias
  });
}

/**
 * Verifica e decodifica JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
}

/**
 * Extrai token do header Authorization
 */
export function extractTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Middleware de autenticação para API Routes
 * Retorna dados do usuário autenticado ou erro
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthResult> {
  try {
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return {
        success: false,
        error: 'Token não fornecido. Use header: Authorization: Bearer <token>',
      };
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return {
        success: false,
        error: 'Token inválido ou expirado',
      };
    }

    return {
      success: true,
      user: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao autenticar requisição',
    };
  }
}

/**
 * Valida se o usuário tem acesso aos dados do salão
 * Multi-Tenant: userId deve pertencer ao salonId
 */
export function validateTenantAccess(userSalonId: string, resourceSalonId: string): boolean {
  return userSalonId === resourceSalonId;
}

/**
 * Gera resposta de erro 401 Não Autorizado
 */
export function unauthorizedResponse(message: string = 'Não autorizado') {
  return Response.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Gera resposta de erro 403 Proibido
 */
export function forbiddenResponse(message: string = 'Acesso negado') {
  return Response.json(
    { error: message },
    { status: 403 }
  );
}
