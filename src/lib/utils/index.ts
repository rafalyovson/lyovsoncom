import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD") // Normalize the string using Unicode Normalization Form D
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove any character that is not alphanumeric, space or hyphen
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

export function getFileExtension(filename: string): string | null {
  // Trim any leading or trailing whitespace
  const trimmedFilename = filename.trim();

  // Handle edge case for hidden files on Unix-like systems (e.g., .bashrc)
  if (trimmedFilename.startsWith(".") && !trimmedFilename.includes(".", 1)) {
    return null;
  }

  // Regular expression to match the extension after the last dot
  const match = /(?:\.([^.]+))?$/.exec(trimmedFilename);

  // Return the extension or null if no match is found
  return match && match[1] ? match[1] : null;
}

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
