import * as d3 from "d3";

/**
 * Returns the number of days that are in the time interval
 *
 * @param startTime - start of time interval in milliseconds
 * @param endTime - end of time interval in milliseconds
 * @returns number of days (includes the days of `startTime` & `endTime`)
 */
export function getDayCount(startTime: number, endTime: number): number {
  return d3.timeDay.count(new Date(startTime), new Date(endTime)) + 1;
}

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
  const dayRange = getDayCount(startTime, endTime) - 1;

  if (dayRange <= dayOfWeekOffset) {
    return 0;
  }
  return Math.max(1, Math.ceil((dayRange - dayOfWeekOffset) / 7));
}

/**
 * Returns the day-of-week value of a timestamp
 *
 * @param timestamp - timestamp in milliseconds
 * @returns day-of-week value
 */
export function getDayOfWeek(timestamp: number): number {
  return new Date(timestamp).getDay();
}

/**
 * Returns the hour-of-day & day-of-week value of a timestamp
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
