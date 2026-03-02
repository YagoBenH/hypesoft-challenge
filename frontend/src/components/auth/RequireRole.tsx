"use client";

import { useAuth } from "@/hooks/useAuth";
import { Alert } from "@/components/ui/Alert";

export function RequireRole({
  anyOf,
  children,
}: {
  anyOf: string[];
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const allowed = anyOf.some((role) => auth.hasRole(role));

  if (allowed) return <>{children}</>;

  return (
    <Alert title="Acesso negado" >
      Você não tem permissão para ver esta área {anyOf.join(", ")}.
    </Alert>
  );
}
