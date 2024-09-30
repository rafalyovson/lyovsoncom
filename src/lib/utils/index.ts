import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export { handlePostCats } from './handle-category-post';
export { handlePostTags } from './handle-tag-post';
export { optimizeImage } from './optimize-image';
export { slugify } from './slugify-text';
