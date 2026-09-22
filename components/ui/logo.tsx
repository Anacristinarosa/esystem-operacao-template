import Link from "next/link";
import { cn } from "@/lib/utils";
import { PLATAFORMA } from "@/lib/config";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3 group", className)}>
      <div className="w-8 h-8 rounded-full bg-gold-foil gold-shadow flex items-center justify-center">
        <span className="text-white font-serif italic text-sm">
          {PLATAFORMA.iniciais}
        </span>
      </div>
      <span className="font-serif italic text-xl gold-text-rich group-hover:opacity-80 transition-opacity">
        {PLATAFORMA.nome}
      </span>
    </Link>
  );
}
