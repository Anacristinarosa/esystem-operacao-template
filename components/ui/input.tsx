import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-[10px] tracking-[0.3em] uppercase text-gold-700 mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-md bg-cream-50 gold-border text-ink placeholder:text-ink-faint",
            "focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400",
            "transition-all",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";
