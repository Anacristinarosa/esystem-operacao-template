import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "rich";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-cream-50 p-6",
        variant === "rich" ? "gold-border-rich gold-shadow-lg" : "gold-border gold-shadow",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("font-serif italic text-2xl mb-2 gold-text-rich", className)}>
      {children}
    </h3>
  );
}

export function CardEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">
      {children}
    </p>
  );
}
