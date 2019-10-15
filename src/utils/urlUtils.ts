/**
 * Computes a new URL search params by merging an existing search params
 * with new set of search params
 * @param paramsString existing search params string
 * @param newParams search params to overwrite
 * @returns sorted & merged URL search params
 */
export function computeSearchParams(
  paramsString: string,
  newParams: { [queryName: string]: string | null }
) {
  const params = new URLSearchParams(paramsString);
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

/**
 * Computes a new URL search params by picking parameters with keys that are
 * found in the given `paramKeys` list
 * @param paramsString search params string
 * @param paramKeys list of parameter keys to pick
 * @returns sorted & picked URL search params
 */
export function pickSearchParams(paramsString: string, paramKeys: string[]) {
  const params = new URLSearchParams(paramsString);
  const newParams = new URLSearchParams();
  for (const key of paramKeys) {
    const value = params.get(key);
    if (value) {
      newParams.set(key, value);
    }
  }
  newParams.sort();

  return newParams;
}
