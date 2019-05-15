/**
 * Converts number of bytes into human-readable format (up to GB)
 * @param {number} bytes Number of bytes to convert
 * @param {number} [fractionDigits=2] Number of digits after the decimal point.
 * Must be in the range 0 - 20, inclusive.
 * @returns {string} number of bytes in human-readable format
 */
export function formatBytes(bytes: number, fractionDigits: number = 2) {
  switch (true) {
    case bytes < 1024:
      return bytes + " Bytes";
    case bytes < 1048576:
      return (bytes / 1024).toFixed(fractionDigits) + " KB";
    case bytes < 1073741824:
      return (bytes / 1048576).toFixed(fractionDigits) + " MB";
    default:
      return (bytes / 1073741824).toFixed(fractionDigits) + " GB";
  }
}

/**
 * Converts distance between two dates into human-readable format
 * @param {number} startDate start date in milliseconds
 * @param {number} endDate end date in milliseconds
 * @returns {string} distance between two dates in human-readable format
 */
export function formatDateDistance(startDate: number, endDate: number): string {
  let result = "";
  const distanceInNearestMins = Math.floor((endDate - startDate) / 1000 / 60);
  if (distanceInNearestMins > 0 && distanceInNearestMins < 60) {
    return "Less than a minute";
  }

  const days = Math.floor(distanceInNearestMins / 60 / 24);
  const hours = Math.floor(distanceInNearestMins / 60) % 24;
  const minutes = distanceInNearestMins % 60;

  if (days > 0) {
    result += `${days} ${days > 1 ? "days" : "day"}`;
    if (hours > 0 || minutes > 0) {
      result += ", ";
    }
  }
  if (hours > 0) {
    result += `${hours} ${hours > 1 ? "hours" : "hour"}`;
    if (minutes > 0) {
      result += " ";
    }
  }
  if (minutes > 0) {
    result += `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  }

  return result;
}
