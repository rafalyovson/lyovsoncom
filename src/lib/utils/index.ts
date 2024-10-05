import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

// Check if a URL is internal (belongs to the same domain)
export const isInternalLink = (url: string) => {
  return (
    url.startsWith('/') ||
    url.startsWith('https://lyovson.com') ||
    url.startsWith('https://www.lyovson.com')
  );
};

export { handlePostCats } from './handle-category-post';
export { handlePostTags } from './handle-tag-post';
export { imageOptimizeAction } from '../../data/actions/server-actions/image/image-optimize-action';
export { slugify } from './slugify-text';
export { sanitizeUrl } from './sanitize-url';
export { validateUrl } from './validate-url';
export { parseLexicalJSON } from './serialize-deserialize';
export { getSelectedNode } from './get-selected-node';
export { getDOMRangeRect } from './get-dom-rect-range';
export { debounce } from './debounce';
