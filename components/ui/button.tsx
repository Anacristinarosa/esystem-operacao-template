import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps
  extends BaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: never;
}

interface LinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type Props = ButtonProps | LinkProps;

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-foil text-white gold-shadow hover:opacity-90",
  ghost:
    "text-gold-700 hover:bg-gold-50",
  outline:
    "gold-border-rich text-gold-700 hover:bg-gold-50",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

export function Button(props: Props) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
  } = props;

  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-[0.05em] uppercase transition-all",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} rel={props.rel} className={cls}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  void _v; void _s; void _c; void _ch;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
