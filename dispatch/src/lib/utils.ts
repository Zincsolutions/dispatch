import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// User-entered search terms get spliced into a PostgREST .or() filter
// expression, where commas and parentheses are syntax. Strip them so a
// search like "foo, bar (baz)" can't break or alter the filter.
export function sanitizeSearchTerm(term: string | undefined): string {
  if (!term) return ""
  return term.replace(/[,()]/g, " ").replace(/\s+/g, " ").trim()
}
