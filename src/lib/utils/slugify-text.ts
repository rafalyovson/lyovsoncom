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
