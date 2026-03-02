import { isJwtExpired } from "@/services/auth/roles";

class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, message: string, body: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getApiBaseUrl(): string {
  
  const url = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
  if (!url) {
    throw new Error("Defina NEXT_PUBLIC_API_URL");
  }
  return url.replace(/\/+$/, "");
}

function buildUrl(path: string): string {
  const base = `${getApiBaseUrl()}/`;
  const cleanPath = String(path ?? "").replace(/^\/+/, "");
  return new URL(cleanPath, base).toString();
}

type ApiFetch = {
  path: string;
  token: string;
  init?: RequestInit;
};

export async function apiFetch<T>({
  path,
  token,
  init,
}: ApiFetch): Promise<T> {
  if (!token) throw new Error("Sem token de autenticação.");
  if (isJwtExpired(token, 10)) throw new Error("Token expirado.");

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(buildUrl(path), { ...init, headers });
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const Body = await res.text().catch(() => "");

  if (!res.ok) {
    const msg = Body ? `API ${res.status}: ${Body}` : `API ${res.status}: ${res.statusText}`;
    throw new ApiError(res.status, msg, Body);
  }

  if (!Body) return undefined as T;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(Body) as T;
    } catch {
      throw new Error("Resposta JSON inválida da API.");
    }
  }

  return Body as unknown as T;
}

export { ApiError };