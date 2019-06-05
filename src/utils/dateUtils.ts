/**
 * Returns the date of a timestamp
 *
 * @param timestamp - timestamp in milliseconds
 * @returns date in milliseconds (unix time)
 */
export function getDateInMs(timestamp: number): number {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

/**
 * Returns the hour-of-day & day-of-week value a timestamp
 *
 * @param timestamp - timestamp in milliseconds
 * @returns hour-of-day & day-of-week values
 */
export function getHourOfWeek(
  timestamp: number
): { hour: number; day: number } {
  const time = new Date(timestamp);
  return {
    hour: time.getHours(),
    day: time.getDay()
  };
}
