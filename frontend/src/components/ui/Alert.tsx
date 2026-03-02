"use client";

import type { ReactNode } from "react";

type AlertProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function Alert({ title, children, className = "" }: AlertProps) {
  return (
    <div
      className={[
        "rounded-lg border px-4 py-3 text-sm",
        "border-[color:var(--foreground)]/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="font-medium">{title}</div>
      <div className="mt-1 opacity-90">{children}</div>
    </div>
  );
}

export function ErrorAlert({ title, children, className = "" }: AlertProps) {
  return (
    <div
      className={[
        "rounded-lg border px-4 py-3 text-sm",
        "border-[color:var(--foreground)]/40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="alert"
      aria-live="assertive"
    >
      <div className="font-medium">{title}</div>
      <div className="mt-1 opacity-90">{children}</div>
    </div>
  );
}