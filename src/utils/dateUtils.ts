import * as d3 from "d3";
import { DateTime, Duration, DurationObject } from "luxon";

import { TimeRange } from "../models/time";

/**
 * Formats a timestamp to a date string that conforms to `YYYY-MM-DD` format
 *
 * @param timestamp - timestamp in milliseconds
 * @returns formatted date string
 */
export function formatDateString(timestamp: number) {
  return d3.timeFormat("%Y-%m-%d")(new Date(timestamp));
}

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
 * Returns the end of day based on the given timestamp
 *
 * @param timestamp - timestamp in milliseconds, defaults to current time if
 * not provided
 * @returns end of day in milliseconds (unix time)
 */
export function getEndOfDay(timestamp: number = Date.now()): number {
  return new Date(timestamp).setHours(23, 59, 59, 999);
}

/**
 * Returns the start of day based on the given timestamp
 *
 * @param timestamp - timestamp in milliseconds, defaults to current time if
 * not provided
 * @returns start of day in milliseconds (unix time)
 */
export function getStartOfDay(timestamp: number = Date.now()): number {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

/**
 * Get timestamp of a date string that conforms to `YYYY-MM-DD` format.
 * Timestamp will have the same date & adjusted to the local start of day time.
 *
 * @param dateString - valid date string
 * @returns timestamp in milliseconds, converted from date string
 */
export function getTimestampFromDateString(dateString: string) {
  const date = new Date(dateString);
  const offsetInMs = date.getTimezoneOffset() * 60 * 1000;

  return date.getTime() + offsetInMs;
}

/**
 * Check if a string is a valid date string that conforms to `YYYY-MM-DD` format
 *
 * @param s - input string
 * @returns `true` if input string is a valid date string, `false` otherwise
 */
export function isValidDateString(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return false;
  }

  const date = new Date(s);
  if (Number.isNaN(date.valueOf())) {
    return false;
  }

  const [, , day] = s.split("-");
  if (date.getUTCDate() !== Number.parseInt(day)) {
    return false;
  }

  return true;
}

/**
 * Check if time range `b` is contained within time range `a`
 *
 * @param a - time range to compare against
 * @param b - time range under comparison
 * @returns `true` if time range `b` is contained within time range `a`,
 * `false` otherwise
 */
export function isWithinTimeRange(a: TimeRange, b: TimeRange) {
  if (a.start !== null && (b.start === null || a.start > b.start)) {
    return false;
  }
  if (a.end !== null && (b.end === null || a.end < b.end)) {
    return false;
  }

  return true;
}

/**
 * Add duration (in terms of days) from the given timestamp
 *
 * @param timestamp - timestamp in milliseconds
 * @param day - duration in terms of days to substract
 * @returns added time in milliseconds (unix time)
 */
export function addDays(timestamp: number, days: number): number {
  return DateTime.fromMillis(timestamp)
    .plus({ days })
    .valueOf();
}

/**
 * Subtract duration (in terms of days) from the given timestamp
 *
 * @param timestamp - timestamp in milliseconds
 * @param day - duration in terms of days to substract
 * @returns substracted time in milliseconds (unix time)
 */
export function minusDays(timestamp: number, days: number): number {
  return DateTime.fromMillis(timestamp)
    .minus({ days })
    .valueOf();
}

/**
 * Converts the given duration to milliseconds
 *
 * @param duration - `luxon` duration object
 * @returns duration in milliseconds
 */
export function milliseconds(duration: DurationObject) {
  return Duration.fromObject(duration).as("milliseconds");
}

/**
 * Modifies the time range's start time to a point in time that it's large enough
 * to cover the given duration (relative to its end time)
 *
 * @param timeRange - time range
 * @param duration - minimum duration the time range needs to cover
 * @returns extended time range
 */
export function extendTimeRange(
  timeRange: TimeRange,
  durationObject: DurationObject
) {
  const durationInMs = milliseconds(durationObject);
  const end = timeRange.end || getEndOfDay();

  if (
    timeRange.start !== null &&
    durationInMs !== 0 &&
    end - timeRange.start < durationInMs
  ) {
    return {
      start:
        timeRange.start === null ? null : getStartOfDay(end - durationInMs),
      end: timeRange.end === null ? null : end
    };
  }

  return timeRange;
}
