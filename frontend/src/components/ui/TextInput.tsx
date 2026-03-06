"use client";

import { forwardRef } from "react";

export const TextInput = forwardRef<
  HTMLInputElement,
  {
    label: string;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ label, error, className, ...props }, ref) {
  return (
    <label className="flex w-full flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <input
        ref={ref}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-(--foreground)/20 ${
          error
            ? "border-(--foreground)"
            : "border-(--foreground)/20"
        } ${className ?? ""}`}
        {...props}
      />
      {error ? <span className="text-xs opacity-80">{error}</span> : null}
    </label>
  );
});
