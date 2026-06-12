import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-panel/90 p-6 ${className}`}>
      {children}
    </div>
  );
}
