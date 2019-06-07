import moment from "moment";

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
  const start = moment(startTime);
  const end = moment(endTime);
  const dayOffset = (dayOfWeek - start.get("day") + 7) % 7;
  const dayRange = end.diff(start, "days");

  const result = Math.ceil((dayRange - dayOffset) / 7);
  return dayOffset >= dayRange ? 0 : Math.max(result, 1);
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
