const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns the number of day-of-week that are in the time interval
 *
 * @param dayOfWeek - day of week (`0 = "Sunday"`, `6 = "Saturday"`)
 * @param startTime - start of time interval in milliseconds
 * @param endTime - end of time interval in milliseconds
 * @returns number of day-of-week
 */
export function getDayOfWeekCount(
  dayOfWeek: number,
  startTime: number,
  endTime: number
): number {
  const startTimeDayOfWeek = new Date(startTime).getDay();
  const dayOfWeekOffset = (dayOfWeek - startTimeDayOfWeek + 7) % 7;
  const dayRange = Math.floor((endTime - startTime) / MS_PER_DAY);

  if (dayRange <= dayOfWeekOffset) {
    return 0;
  }
  return Math.max(1, Math.ceil((dayRange - dayOfWeekOffset) / 7));
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

/**
 * Returns the start of day based on the given timestamp
 *
 * @param timestamp - timestamp in milliseconds
 * @returns start of day in milliseconds (unix time)
 */
export function getStartOfDay(timestamp: number): number {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}
