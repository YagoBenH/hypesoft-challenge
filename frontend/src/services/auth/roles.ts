type JwtPayload = {
  exp?: number; // expires at (seconds)
  nbf?: number; // not valid before (seconds)
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

function toUnixSeconds(dateMs = Date.now()) {
  return Math.floor(dateMs / 1000);
}

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  // Browser (and Node 18+)
  if (typeof globalThis.atob === "function") {
    return globalThis.atob(padded);
  }

  // Fallback (Node). Avoids static import to keep it simple.
  const BufferRef = (globalThis as unknown as { Buffer?: typeof Buffer }).Buffer;
  if (BufferRef?.from) {
    return BufferRef.from(padded, "base64").toString("utf-8");
  }

  throw new Error("Não foi possível decodificar base64 (atob/Buffer indisponível).");
}

function readPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const json = decodeBase64Url(parts[1] ?? "");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

// Mantido por compatibilidade (se outras partes do app usam)
export function parseJwt<T>(token: string): T | null {
  return readPayload(token) as T | null;
}

export function getRolesFromToken(token: string, clientId?: string): string[] {
  const payload = readPayload(token);
  if (!payload) return [];

  const realmRoles = payload.realm_access?.roles ?? [];
  const clientRoles = clientId ? payload.resource_access?.[clientId]?.roles ?? [] : [];

  return [...new Set([...realmRoles, ...clientRoles])].sort();
}

export function isJwtExpired(token: string, leewaySeconds = 0): boolean {
  const payload = readPayload(token);
  if (!payload) return true; // token malformado => trate como inválido

  // Se não tiver exp, não dá pra “expirar” aqui (quem valida é a API).
  if (typeof payload.exp !== "number") return false;

  const now = toUnixSeconds();
  return payload.exp <= now + leewaySeconds;
}

/**
 * Valida "claims de tempo" (nbf/exp). Isso NÃO valida assinatura do JWT.
 * Retorna uma mensagem amigável ou null (ok).
 */
export function validateJwtClaims(token: string): string | null {
  const payload = readPayload(token);
  if (!payload) return "Token inválido (JWT malformado).";

  const now = toUnixSeconds();

  if (typeof payload.nbf === "number" && payload.nbf > now) {
    return "Token ainda não é válido. Tente novamente.";
  }

  if (typeof payload.exp === "number" && payload.exp <= now) {
    return "Sua sessão expirou. Faça login novamente.";
  }

  return null;
}