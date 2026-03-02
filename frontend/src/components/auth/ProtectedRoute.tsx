"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Alert } from "@/components/ui/Alert";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.initialized) return;
    if (auth.authenticated) return;
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [auth.initialized, auth.authenticated, pathname, router]);

  if (!auth.initialized) {
    return (
      <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <Alert title="Carregando" >
            Verificando sessão…
          </Alert>
        </div>
      </main>
    );
  }

  if (!auth.authenticated) return null;
  return <>{children}</>;
}
