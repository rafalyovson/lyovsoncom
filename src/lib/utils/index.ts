import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalize the string using Unicode Normalization Form D
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove any character that is not alphanumeric, space or hyphen
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export { handlePostCats } from './handle-category-post';
export { handlePostTags } from './handle-tag-post';
