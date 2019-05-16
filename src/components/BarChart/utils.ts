/**
 * Finds the longest string in the given array & return its approximated length
 * in pixel
 * @param {string[]} arr array of strings
 * @returns {number} pixel length of longest string in array
 */
export function getLongestStringWidth(arr: string[]): number {
  // Manually tuned for "Open Sans" @ font-size 12px + font-weight 600
  const PIXEL_WIDTH_PER_CHAR = 8;

  const longestString = arr.reduce((acc, str) => {
    return str.length > acc ? str.length : acc;
  }, 0);

  return longestString * PIXEL_WIDTH_PER_CHAR;
}
