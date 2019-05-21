import * as d3 from "d3";
import { RootState } from "../../store/types";

/**
 * Computes input timestamp's date
 * @param {number} timestamp
 * @returns {number} date in unix time format
 */
function getDateInMs(timestamp: number): number {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

/**
 * Computes the hour-of-day & day-of-week value of the input timestamp
 * @param {number} timestamp
 * @returns {{ hour: number; day: number }} hour-of-day & day-of-week value
 */
function getHourOfWeek(timestamp: number): { hour: number; day: number } {
  const time = new Date(timestamp);
  return {
    hour: time.getHours(),
    day: time.getDay()
  };
}

export function getIsLoadingRecords(state: RootState): boolean {
  return state.activity.isLoadingRecords;
}

export function getOldestActivityRecordTimestamp(
  state: RootState
): number | undefined {
  if (state.activity.records.length === 0) {
    return;
  }

  let oldestTimestamp = undefined;
  for (let i = 0; i < state.activity.records.length; i++) {
    const timestamp = state.activity.records[i].startTime;
    if (oldestTimestamp === undefined || oldestTimestamp > timestamp) {
      oldestTimestamp = timestamp;
    }
  }

  return oldestTimestamp;
}

export function getTotalDurationByDate(
  state: RootState
): { totalDuration: number; timestamp: number }[] {
  const totalDurationByDate: { [timestamp: string]: number } = {};

  state.activity.records.forEach(record => {
    let { startTime, endTime } = record;
    let [startDate, endDate] = [getDateInMs(startTime), getDateInMs(endTime)];

    // Handle records spanning over different dates
    while (startDate !== endDate) {
      const newEndTime = getDateInMs(endTime) - 1;

      const duration = endTime - newEndTime;
      const prevTotalDuration = totalDurationByDate[endDate] || 0;
      totalDurationByDate[endDate] = prevTotalDuration + duration;

      [endTime, endDate] = [newEndTime, getDateInMs(newEndTime)];
    }

    const duration = endTime - startTime;
    const prevTotalDuration = totalDurationByDate[endDate] || 0;
    totalDurationByDate[endDate] = prevTotalDuration + duration;
  });

  const [minDate, maxDate] = d3.extent(
    Object.keys(totalDurationByDate).map(Number)
  );
  if (minDate !== undefined && maxDate !== undefined) {
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

export function getTotalDurationByDomain(
  state: RootState
): { totalDuration: number; domain: string; favIconUrl: string }[] {
  const totalDurationByDomain: { [domain: string]: number } = {};
  const favIconUrlByDomain: { [domain: string]: string } = {};

  state.activity.records.forEach(record => {
    let { origin: domain, startTime, endTime } = record;

    if (domain !== undefined) {
      const duration = endTime - startTime;
      const prevTotalDuration = totalDurationByDomain[domain] || 0;
      totalDurationByDomain[domain] = prevTotalDuration + duration;
      favIconUrlByDomain[domain] = record.favIconUrl;
    }
  });

  // Sort results by domains with highest duration
  return Object.entries(totalDurationByDomain)
    .map(([key, value]) => ({
      domain: key.replace(/(https:\/\/|www\.)/g, ""),
      favIconUrl: favIconUrlByDomain[key],
      totalDuration: value
    }))
    .sort((a, b) => {
      return a.totalDuration > b.totalDuration ? -1 : 1;
    })
    .slice(0, 10);
}

export function getAverageDurationByHourOfWeek(
  state: RootState
): { duration: number; day: number; hour: number }[] {
  const avgDurationByHourOfWeek: { [hourOfWeek: string]: number } = {};
  const totalDurationByHourOfWeek: {
    [hourOfWeek: string]: { [date: string]: number };
  } = {};

  state.activity.records.forEach(record => {
    let { startTime, endTime } = record;
    let startHourOfWeek = getHourOfWeek(startTime);
    let endHourOfWeek = getHourOfWeek(endTime);

    // Handle records spanning over different hour of the week
    while (
      startHourOfWeek.day !== endHourOfWeek.day ||
      startHourOfWeek.hour !== endHourOfWeek.hour
    ) {
      const newEndTime = new Date(endTime).setMinutes(0, 0, 0) - 1;

      const hourOfWeekKey = String([endHourOfWeek.day, endHourOfWeek.hour]);
      const duration = endTime - newEndTime;
      if (totalDurationByHourOfWeek[hourOfWeekKey] === undefined) {
        totalDurationByHourOfWeek[hourOfWeekKey] = {};
      }
      const prevTotalDuration =
        totalDurationByHourOfWeek[hourOfWeekKey][getDateInMs(endTime)] || 0;
      totalDurationByHourOfWeek[hourOfWeekKey][getDateInMs(endTime)] =
        prevTotalDuration + duration;

      [endTime, endHourOfWeek] = [newEndTime, getHourOfWeek(newEndTime)];
    }

    // Compute total duration
    const hourOfWeekKey = String([endHourOfWeek.day, endHourOfWeek.hour]);
    const duration = endTime - startTime;
    if (totalDurationByHourOfWeek[hourOfWeekKey] === undefined) {
      totalDurationByHourOfWeek[hourOfWeekKey] = {};
    }
    const prevTotalDuration =
      totalDurationByHourOfWeek[hourOfWeekKey][getDateInMs(endTime)] || 0;
    totalDurationByHourOfWeek[hourOfWeekKey][getDateInMs(endTime)] =
      prevTotalDuration + duration;
  });

  // Compute average duration
  for (let i = 0; i < Object.keys(totalDurationByHourOfWeek).length; i++) {
    const key = Object.keys(totalDurationByHourOfWeek)[i];
    const dates = Object.values(totalDurationByHourOfWeek[key]);
    const avg = dates.reduce((acc, val) => acc + val, 0) / dates.length;
    avgDurationByHourOfWeek[key] = avg;
  }

  // Manually zero out hour-of-week with no activity
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const hourOfWeekKey = String([day, hour]);
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
