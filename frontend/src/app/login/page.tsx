"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("Informe um e-mail válido"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const keycloakAdmin = useMemo(() => {
    const base = (process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8080").replace(/\/+$/, "");
    return `${base}/admin`;
  }, []);

  const next = useMemo(() => {
    const raw = searchParams.get("next");
    return raw && raw.startsWith("/") ? raw : "/dashboard";
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await auth.login({ email: values.email, redirectTo: next });
    } catch {
      setSubmitError("Falha ao iniciar o login");
      setSubmitting(false);
    }
  });

  if (auth.initialized && auth.authenticated) {
    router.replace(next);
    return null;
  }

  return (
    <main className="min-h-dvh bg-cyan-200 text-(--foreground)">
      <div className="mx-auto grid min-h-dvh w-full max-w-6xl place-items-center px-4 py-10">
        <Card className="w-full max-w-md">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
            <p className="text-sm opacity-80">
              Autenticação por Keycloak (OAuth2 / OpenID Connect).
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {!auth.initialized && (
              <Alert title="Carregando" >
                Preparando autenticação…
              </Alert>
            )}
            {auth.error && (
              <Alert title="Erro" >
                {auth.error}
              </Alert>
            )}
            {submitError && (
              <Alert title="Não foi possível continuar" >
                {submitError}
              </Alert>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 ">
            <TextInput
              label="E-mail"
              placeholder="voce@empresa.com"
              autoComplete="email"
              error={errors.email?.message}
              disabled={!auth.initialized || submitting}
              {...register("email")}
            />

            <Button type="submit" disabled={!auth.initialized || submitting || !isValid}>
              {submitting ? "Redirecionando…" : "Continuar"}
            </Button>
          </form>

          <p className="mt-6 text-xs opacity-70">
            <a
              href={keycloakAdmin}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Clique para cadastrar novo usuário no login do Keycloak.
            </a>
          </p>
        </Card>
      </div>
    </main>
  );
}
