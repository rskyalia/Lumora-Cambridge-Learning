import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shadcn/UI Input — styled for the Lumora design system.
 *
 * Usage:
 *   import { Input } from "@/components/ui/input";
 *   <Input type="email" placeholder="your@email.com" />
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-lavender/80 bg-white px-4 py-2 text-sm",
          "text-midnight placeholder:text-midnight/30",
          "ring-offset-white",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumora focus-visible:ring-offset-2 focus-visible:border-transparent",
          "hover:border-lumora/40",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-lavender/30",
          "transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
