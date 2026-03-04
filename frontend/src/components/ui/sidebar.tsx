"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Produtos" },
];


export function SidebarShop({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-dvh bg-(--background) text-(--foreground)">
        <div className="grid min-h-dvh md:grid-cols-[240px_1fr]">
          <aside className="border-r border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:sticky md:top-0 md:flex md:h-dvh md:flex-col md:p-5">
            <div className="flex items-center gap-2 px-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-violet-600 text-sm font-semibold text-white">
                S
              </div>
              <div>
                <p className="text-sm font-semibold">ShopSense</p>
              </div>
            </div>

            <div className="mt-8 px-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50">Menu Principal</p>
              <nav className="mt-2 grid gap-1">
                {mainLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-slate-100 font-semibold dark:bg-zinc-800"
                          : "opacity-85 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto px-2 pb-2">
              <div className="flex items-center gap-3 py-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium dark:bg-zinc-800">
                  {auth.user?.name ? auth.user.name[0].toUpperCase() : auth.user?.username ? auth.user.username[0].toUpperCase() : "A"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium opacity-95">{auth.user?.name || auth.user?.username || "Admin"}</span>
                  <span className="text-xs opacity-70">{auth.user?.email || "admin@hypesoft.com"}</span>
                </div>
              </div>

              <Button onClick={() => auth.logout({ redirectTo: "/login" })}>Sair</Button>
            </div>
          </aside>

          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
