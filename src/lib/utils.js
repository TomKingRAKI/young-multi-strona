import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Skopiuj ten kod. To jest wersja JS tego, co wkleiłeś.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}