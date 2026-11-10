import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Shadcn/UI Button — wired to the Lumora design system.
 *
 * Variants are mapped to brand colours so you get Shadcn's
 * composability while keeping the Lumora visual identity.
 *
 * Usage:
 *   import { Button } from "@/components/ui/button";
 *   <Button variant="default">Start for free</Button>
 *   <Button variant="outline" size="sm">Log in</Button>
 *   <Button asChild><Link href="/register">Go</Link></Button>
 */
const buttonVariants = cva(
  // base — always applied
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Lumora brand purple — primary action
        default:
          "bg-lumora text-white shadow-[0_4px_14px_rgba(108,92,231,0.35)] hover:-translate-y-0.5 hover:bg-lumora-light hover:shadow-[0_8px_24px_rgba(108,92,231,0.45)] active:translate-y-0",
        // Destructive — red
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // Outline — border only
        outline:
          "border-2 border-lumora/40 bg-transparent text-lumora shadow-sm hover:border-lumora hover:bg-lumora/5",
        // Secondary — lavender background
        secondary:
          "bg-lavender text-lumora shadow-sm hover:bg-lavender/80",
        // Ghost — no background
        ghost:
          "hover:bg-lumora/8 hover:text-lumora",
        // Link style
        link:
          "text-lumora underline-offset-4 hover:underline",
        // Mint accent — secondary action
        mint:
          "bg-mint text-white shadow-sm hover:bg-mint/90",
        // Sun/yellow — highlight action
        sun:
          "bg-sun text-midnight shadow-sm hover:bg-sun/90",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm:      "h-8 rounded-pill px-4 text-xs",
        lg:      "h-12 rounded-pill px-9 text-base",
        xl:      "h-14 rounded-pill px-10 text-base font-extrabold",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
