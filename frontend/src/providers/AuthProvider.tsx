"use client";

import type Keycloak from "keycloak-js";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AuthContextValue, KeycloakUser } from "@/types/auth";
import { getKeycloakClient } from "@/services/auth/keycloakClient";
import { getRolesFromToken, parseJwt, validateJwtClaims } from "@/services/auth/roles";

export const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(token: string): KeycloakUser | null {
  const payload = parseJwt<Record<string, unknown>>(token);
  if (!payload) return null;
  return {
    id: String(payload["sub"] ?? ""),
    username: String(payload["preferred_username"] ?? payload["email"] ?? ""),
    email: payload["email"] ? String(payload["email"]) : undefined,
    name: payload["name"] ? String(payload["name"]) : undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const keycloakRef = useRef<Keycloak | null>(null);

  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<KeycloakUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const syncFromKeycloak = useCallback((kc: Keycloak) => {
    const currentToken = kc.token ?? null;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
    setAuthenticated(Boolean(kc.authenticated));
    setToken(currentToken);

    if (currentToken) {
      const validationError = validateJwtClaims(currentToken);
      if (validationError) {
        setError(validationError);
      }
      setUser(toUser(currentToken));
      setRoles(getRolesFromToken(currentToken, clientId));
    } else {
      setUser(null);
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const kc = getKeycloakClient();
        if (!kc) return;
        keycloakRef.current = kc;

        kc.onAuthSuccess = () => syncFromKeycloak(kc);
        kc.onAuthRefreshSuccess = () => syncFromKeycloak(kc);
        kc.onAuthLogout = () => syncFromKeycloak(kc);
        kc.onTokenExpired = async () => {
          try {
            await kc.updateToken(30);
            syncFromKeycloak(kc);
          } catch {
            syncFromKeycloak(kc);
          }
        };

        const ok = await kc.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
          checkLoginIframe: false,
        });

        if (!mounted) return;
        syncFromKeycloak(kc);
        setInitialized(true);
        setError(null);

        if (!ok) {
        }
      } catch (err) {
        if (!mounted) return;
        setInitialized(true);
        setAuthenticated(false);
        const message =
          err instanceof Error
            ? err.message
            : "Falha ao inicializar o Keycloak. Verifique variáveis NEXT_PUBLIC_KEYCLOAK_*";
        setError(message);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [syncFromKeycloak]);

  useEffect(() => {
    if (!initialized) return;
    if (!authenticated) return;
    const kc = keycloakRef.current;
    if (!kc) return;

    const intervalId = window.setInterval(async () => {
      try {
        await kc.updateToken(60);
        syncFromKeycloak(kc);
      } catch (err) {
        console.error("Falha ao atualizar token:", err);
      }
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [initialized, authenticated, syncFromKeycloak]);

  const login = useCallback<AuthContextValue["login"]>(
    async (options) => {
      const kc = keycloakRef.current ?? getKeycloakClient();
      if (!kc) throw new Error("Keycloak não está disponível");
      const redirectTo = options?.redirectTo ?? "/dashboard";
      const redirectUri = `${window.location.origin}${redirectTo}`;
      await kc.login({
        redirectUri,
        loginHint: options?.email,
      });
    },
    []
  );

  const logout = useCallback<AuthContextValue["logout"]>(
    async (options) => {
      const kc = keycloakRef.current;
      const redirectTo = options?.redirectTo ?? "/login";
      const redirectUri = `${window.location.origin}${redirectTo}`;
      if (!kc) {
        window.location.assign(redirectUri);
        return;
      }
      await kc.logout({ redirectUri });
    },
    []
  );

  const hasRole = useCallback((role: string) => roles.includes(role), [roles]);

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      authenticated,
      token,
      user,
      roles,
      error,
      login,
      logout,
      hasRole,
    }),
    [initialized, authenticated, token, user, roles, error, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
