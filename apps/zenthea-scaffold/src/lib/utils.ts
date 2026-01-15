import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind CSS classes
 * Used as a visual primitive helper only - no workflow semantics
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
