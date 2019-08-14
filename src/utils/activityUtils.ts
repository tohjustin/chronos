import moment from "moment";

import { ActivityRecord } from "../models/activity";
import { DefiniteTimeRange } from "../models/time";

import {
  getDayOfWeek,
  getDayOfWeekCount,
  getHourOfWeek,
  getStartOfDay
} from "./dateUtils";

/**
 * Creates a reducer function for splitting records that spans over the given
 * time boundary
 * @param unitOfTime time boundary
 * @returns reducer function to be used with `Array.reduce()`
 * @example
 * const records = [
 *   {
 *     // ...
 *     startTime: '<TIMESTAMP_OF_DAY_1_23:00:00.000>',
 *     endTime: '<TIMESTAMP_OF_DAY_3_16:30:00.000>',
 *   }
 * ];
 * const result = records.reduce(
 *   createActivitySplittingReducer('day'),
 *   []
 * );
 * // result = [
 * //   {
 * //     // ...same set of props from the original record
 * //     startTime: '<TIMESTAMP_OF_DAY_1_23:00:00.000>',
 * //     endTime: '<TIMESTAMP_OF_DAY_1_23:59:59.999>',
 * //   }
 * //   {
 * //     // ...same set of props from the original record
 * //     startTime: '<TIMESTAMP_OF_DAY_2_00:00:00.000>',
 * //     endTime: '<TIMESTAMP_OF_DAY_2_23:59:59.999>',
 * //   }
 * //   {
 * //     // ...same set of props from the original record
 * //     startTime: '<TIMESTAMP_OF_DAY_3_00:00:00.000>',
 * //     endTime: '<TIMESTAMP_OF_DAY_3_16:30:00.000>',
 * //   }
 * // ];
 */
export function createActivitySplittingReducer(unitOfTime: "hour" | "day") {
  return (acc: ActivityRecord[], e: ActivityRecord) => {
    const splittedRecords = [];
    let startTimeObj = moment(e.startTime);
    let endTimeObj = moment(e.endTime);

    while (
      endTimeObj.diff(startTimeObj, unitOfTime, true) >= 1 ||
      (endTimeObj.get(unitOfTime) !== startTimeObj.get(unitOfTime) &&
        !endTimeObj.isSame(endTimeObj.clone().startOf(unitOfTime)))
    ) {
      const newStartTimeObj = endTimeObj.clone().startOf(unitOfTime);
      if (newStartTimeObj.isSame(endTimeObj)) {
        newStartTimeObj.subtract(1, unitOfTime);
      }

      splittedRecords.unshift({
        ...e,
        startTime: newStartTimeObj.valueOf(),
        endTime: endTimeObj.valueOf()
      });
      endTimeObj = newStartTimeObj;
    }

    splittedRecords.unshift({
      ...e,
      startTime: startTimeObj.valueOf(),
      endTime: endTimeObj.valueOf()
    });
    return acc.concat(splittedRecords);
  };
}

export function computeTotalDuration(
  records: ActivityRecord[],
  effectiveTimeRange: DefiniteTimeRange
) {
  let totalDuration = 0;
  const minDate = getStartOfDay(effectiveTimeRange.start);
  const maxDate = getStartOfDay(effectiveTimeRange.end);

  records.forEach(record => {
    let { startTime, endTime } = record;
    let startDayOfWeek = getDayOfWeek(startTime);
    let endDayOfWeek = getDayOfWeek(endTime);

    // Handle records spanning over different days
    while (startDayOfWeek !== endDayOfWeek) {
      const endDate = getStartOfDay(endTime);
      const newEndTime = endDate - 1;
      const newEndDayOfWeek = getDayOfWeek(newEndTime);

      if (endDate >= minDate && endDate <= maxDate) {
        totalDuration += endTime - newEndTime;
      }

      [endTime, endDayOfWeek] = [newEndTime, newEndDayOfWeek];
    }

    // Compute total duration
    const startDate = getStartOfDay(startTime);
    if (startDate >= minDate && startDate <= maxDate) {
      totalDuration += endTime - startTime;
    }
  });

  return totalDuration;
}

export function computeTotalDurationByDate(
  records: ActivityRecord[],
  effectiveTimeRange: DefiniteTimeRange
) {
  const totalDurationByDate: { [timestamp: string]: number } = {};
  const minDate = getStartOfDay(effectiveTimeRange.start);
  const maxDate = getStartOfDay(effectiveTimeRange.end);

  records.forEach(record => {
    let { startTime, endTime } = record;
    let [startDate, endDate] = [
      getStartOfDay(startTime),
      getStartOfDay(endTime)
    ];

    // Handle records spanning over different dates
    while (startDate !== endDate) {
      const newEndTime = getStartOfDay(endTime) - 1;
      const newEndDate = getStartOfDay(newEndTime);

      if (endDate >= minDate && endDate <= maxDate) {
        const duration = endTime - newEndTime;
        const prevTotalDuration = totalDurationByDate[endDate] || 0;
        totalDurationByDate[endDate] = prevTotalDuration + duration;
      }

      [endTime, endDate] = [newEndTime, newEndDate];
    }

    if (endDate >= minDate && endDate <= maxDate) {
      const duration = endTime - startTime;
      const prevTotalDuration = totalDurationByDate[endDate] || 0;
      totalDurationByDate[endDate] = prevTotalDuration + duration;
    }
  });

  let currentDate = minDate;
  while (currentDate < maxDate) {
    // Manually zero out days with no activity
    if (totalDurationByDate[currentDate] === undefined) {
      totalDurationByDate[currentDate] = 0;
    }

    // Limit usage time up to maximum value of 24 hours
    if (totalDurationByDate[currentDate] > 0) {
      totalDurationByDate[currentDate] = Math.min(
        1000 * 60 * 60 * 24,
        totalDurationByDate[currentDate]
      );
    }

    currentDate += 1000 * 60 * 60 * 24;
  }

  // Sort results by chronological order
  return Object.entries(totalDurationByDate)
    .map(([key, value]) => ({
      timestamp: Number(key),
      totalDuration: value
    }))
    .sort((a, b) => {
      return a.timestamp < b.timestamp ? -1 : 1;
    });
}

export function computeTotalDurationByDayOfWeek(
  records: ActivityRecord[],
  effectiveTimeRange: DefiniteTimeRange
) {
  const totalDurationByDayOfWeek: { [dayOfWeek: string]: number } = {};
  const minDate = getStartOfDay(effectiveTimeRange.start);
  const maxDate = getStartOfDay(effectiveTimeRange.end);

  // zero out entries
  for (let day = 0; day < 7; day++) {
    totalDurationByDayOfWeek[day] = 0;
  }

  records.forEach(record => {
    let { startTime, endTime } = record;
    let startDayOfWeek = getDayOfWeek(startTime);
    let endDayOfWeek = getDayOfWeek(endTime);

    // Handle records spanning over different day of the week
    while (startDayOfWeek !== endDayOfWeek) {
      const endDate = getStartOfDay(endTime);
      const newEndTime = endDate - 1;
      const newEndDayOfWeek = getDayOfWeek(newEndTime);

      if (endDate >= minDate && endDate <= maxDate) {
        totalDurationByDayOfWeek[newEndDayOfWeek] += endTime - newEndTime;
      }

      [endTime, endDayOfWeek] = [newEndTime, newEndDayOfWeek];
    }

    // Compute total duration
    const startDate = getStartOfDay(startTime);
    if (startDate >= minDate && startDate <= maxDate) {
      totalDurationByDayOfWeek[endDayOfWeek] += endTime - startTime;
    }
  });

  // Sort results by chronological order
  return Object.entries(totalDurationByDayOfWeek)
    .map(([day, duration]) => ({ day: Number(day), duration }))
    .sort((a, b) => (a.day < b.day ? -1 : 1));
}

export function computeAverageDurationByHourOfWeek(
  records: ActivityRecord[],
  effectiveTimeRange: DefiniteTimeRange
) {
  const avgDurationByHourOfWeek: { [hourOfWeek: string]: number } = {};
  const totalDurationByHourOfWeek: {
    [hourOfWeek: string]: { [date: string]: number };
  } = {};
  const minDate = getStartOfDay(effectiveTimeRange.start);
  const maxDate = getStartOfDay(effectiveTimeRange.end);

  records.forEach(record => {
    let { startTime, endTime } = record;
    let startHourOfWeek = getHourOfWeek(startTime);
    let endHourOfWeek = getHourOfWeek(endTime);

    // Handle records spanning over different hour of the week
    while (
      startHourOfWeek.day !== endHourOfWeek.day ||
      startHourOfWeek.hour !== endHourOfWeek.hour
    ) {
      const newEndTime = new Date(endTime).setMinutes(0, 0, 0) - 1;
      const newEndHourOfWeek = getHourOfWeek(newEndTime);

      if (
        getStartOfDay(endTime) >= minDate &&
        getStartOfDay(endTime) <= maxDate
      ) {
        const hourOfWeekKey = String([endHourOfWeek.day, endHourOfWeek.hour]);
        if (totalDurationByHourOfWeek[hourOfWeekKey] === undefined) {
          totalDurationByHourOfWeek[hourOfWeekKey] = {};
        }
        const duration = endTime - newEndTime;
        const prevTotalDuration =
          totalDurationByHourOfWeek[hourOfWeekKey][getStartOfDay(endTime)] || 0;
        totalDurationByHourOfWeek[hourOfWeekKey][getStartOfDay(endTime)] =
          prevTotalDuration + duration;
      }

      [endTime, endHourOfWeek] = [newEndTime, newEndHourOfWeek];
    }

    // Compute total duration
    if (
      getStartOfDay(startTime) >= minDate &&
      getStartOfDay(startTime) <= maxDate
    ) {
      const hourOfWeekKey = `${endHourOfWeek.day},${endHourOfWeek.hour}`;
      const duration = endTime - startTime;
      if (totalDurationByHourOfWeek[hourOfWeekKey] === undefined) {
        totalDurationByHourOfWeek[hourOfWeekKey] = {};
      }
      const prevTotalDuration =
        totalDurationByHourOfWeek[hourOfWeekKey][getStartOfDay(endTime)] || 0;
      totalDurationByHourOfWeek[hourOfWeekKey][getStartOfDay(endTime)] =
        prevTotalDuration + duration;
    }
  });

  // Compute average duration
  const hourOfWeekKeys = Object.keys(totalDurationByHourOfWeek);
  for (let i = 0; i < hourOfWeekKeys.length; i++) {
    const hourOfWeekKey = hourOfWeekKeys[i];
    const dayOfWeek = Number(hourOfWeekKey.split(",")[0]);
    const dates = Object.values(totalDurationByHourOfWeek[hourOfWeekKey]);

    const totalDuration = dates.reduce((acc, val) => acc + val, 0);
    const dayOfWeekCount = getDayOfWeekCount(dayOfWeek, minDate, maxDate);

    avgDurationByHourOfWeek[hourOfWeekKey] =
      totalDuration / Math.max(dayOfWeekCount, 1);
  }

  // Manually zero out hour-of-week with no activity
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const hourOfWeekKey = `${day},${hour}`;
      if (avgDurationByHourOfWeek[hourOfWeekKey] === undefined) {
        avgDurationByHourOfWeek[hourOfWeekKey] = 0;
      }
    }
  }

  // Sort results by chronological order
  return Object.entries(avgDurationByHourOfWeek)
    .map(([key, value]) => {
      const [day, hour] = key.split(",");
      return {
        day: Number(day),
        hour: Number(hour),
        duration: value
      };
    })
    .sort((a, b) => {
      return a.day * 24 + a.hour < b.day * 24 + b.hour ? -1 : 1;
    });
}

export function isValidActivityRecord(record: ActivityRecord) {
  return record.startTime < record.endTime;
}
