"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Produtos" },
];


export function SidebarShop({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-dvh bg-(--background) text-(--foreground)">
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div className="grid min-h-dvh md:grid-cols-[240px_1fr]">
          <button
            className=" top-4 left-4 z-50 md:hidden py-3 px-4 rounded-md"
            onClick={toggleSidebar}
          >
            <div className="flex flex-col space-y-1">
              <span className={`block h-0.5 w-6 bg-current transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>

          <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform dark:border-zinc-800 dark:bg-zinc-900 md:sticky md:top-0 md:z-auto md:flex md:h-dvh md:w-auto md:flex-col md:translate-x-0 md:p-5 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
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
                {links.map((link) => {
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
                  <span className="text-sm font-medium opacity-95">{auth.user?.name || auth.user?.username }</span>
                  <span className="text-xs opacity-70">{auth.user?.email }</span>
                </div>
              </div>

              <Button onClick={() => auth.logout({ redirectTo: "/login" })}>Sair</Button>
            </div>
          </aside>

          <main className={`p-4 transition-all md:p-6 ${isOpen ? 'md:ml-0' : ''}`}>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
