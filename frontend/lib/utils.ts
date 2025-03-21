import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pad = (num: number | string) => {
  num = num.toString();
  return num.length < 2 ? "0" + num : num; 
}