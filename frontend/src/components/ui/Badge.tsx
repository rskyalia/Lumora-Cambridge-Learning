import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — unified Shadcn/UI component wired to the Lumora design system.
 *
 * Supports both `variant` (Shadcn standard) and `tone` (legacy alias) props
 * so existing usage keeps working while new code uses `variant`.
 *
 * Usage (new):
 *   <Badge variant="default">Stage 3</Badge>
 *   <Badge variant="mint">Completed</Badge>
 *
 * Usage (legacy, still works):
 *   <Badge tone="purple">AI insight</Badge>
 *   <Badge tone="mint">On track</Badge>
 */

type Tone = "purple" | "navy" | "mint" | "sun";

const toneToVariant: Record<Tone, string> = {
  purple: "default",
  navy:   "secondary",
  mint:   "mint",
  sun:    "sun",
};

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-lumora text-white shadow hover:bg-lumora-light",
        secondary:
          "border-transparent bg-lavender text-lumora hover:bg-lavender/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline:
          "border-lumora/30 text-lumora bg-transparent",
        mint:
          "border-transparent bg-mint-soft text-mint hover:bg-mint/20",
        sun:
          "border-transparent bg-sun-soft text-midnight hover:bg-sun/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** @deprecated Use `variant` instead. Kept for backward compatibility. */
  tone?: Tone;
}

function Badge({ className, variant, tone, ...props }: BadgeProps) {
  // `tone` is a legacy alias — map it to the equivalent variant
  const resolvedVariant = variant ?? (tone ? (toneToVariant[tone] as BadgeProps["variant"]) : undefined);
  return (
    <div className={cn(badgeVariants({ variant: resolvedVariant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
