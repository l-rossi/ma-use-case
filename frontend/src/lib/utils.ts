import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function windowed<T>(array: Array<T>, size: number, step: number = 1): Array<Array<T | undefined>> {
  const result = [];
  for (let i = 0; i <= array.length; i += step) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
