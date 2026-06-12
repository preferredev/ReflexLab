import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-cyan-400/10 border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/20 hover:shadow-neon",
  ghost:
    "bg-transparent border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
  danger:
    "bg-rose-500/10 border-rose-500/60 text-rose-300 hover:bg-rose-500/20",
};

export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`rounded-md border px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all duration-150 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
