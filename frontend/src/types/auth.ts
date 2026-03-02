export type KeycloakUser = {
  id: string;
  username: string;
  email?: string;
  name?: string;
};

export type AuthContextValue = {
  initialized: boolean;
  authenticated: boolean;
  token: string | null;
  user: KeycloakUser | null;
  roles: string[];
  error: string | null;

  login: (options?: { email?: string; redirectTo?: string }) => Promise<void>;
  logout: (options?: { redirectTo?: string }) => Promise<void>;
  hasRole: (role: string) => boolean;
};