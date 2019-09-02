/**
 * Computes a new URL search params by merging an existing search params
 * with new set of search params
 * @param searchParams existing search params string
 * @param newParams search params to overwrite
 * @returns sorted & merged URL search params
 */
export function computeSearchParams(
  searchParams: string,
  newParams: { [queryName: string]: string | null }
) {
  const params = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(newParams)) {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  params.sort();

  return params;
}
