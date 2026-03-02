"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function AuthButton({
  children,
  className = "",
  disabled,
  ...props  
}: ButtonProps) {
  const classes = `w-full h-[50px] rounded-[40px] font-semibold text-black-apacity shadow-lg transition-all duration-300 bg-gradient-to-r from-black/20 to-white/50 hover:opacity-90 hover:scale-[1.02]
    ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}
    ${className}
  `.trim();

  return (
    <button {...props} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
export const Button = AuthButton;

export function ButtonLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = `inline-flex w-full h-[50px] items-center justify-center rounded-[40px] font-semibold text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-black/20 to-white/50 hover:opacity-90 hover:scale-[1.02]
    ${className}
  `.trim();

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}