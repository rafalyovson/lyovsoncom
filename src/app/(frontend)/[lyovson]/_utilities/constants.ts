export const LYOVSON_ITEMS_PER_PAGE = 25;
export const MAX_INDEXED_PAGE = 3;

export function getValidPageNumber(pageNumber: string): number | null {
  const parsedPage = Number(pageNumber);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return null;
  }

  return parsedPage;
}
