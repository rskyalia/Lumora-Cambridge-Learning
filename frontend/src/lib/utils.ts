import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently.
 * Used by all Shadcn/UI components — combine with clsx for conditional classes.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-lumora", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
