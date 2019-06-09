import { createSelector } from "reselect";

import { DefiniteTimeRange } from "../../models/time";
import { RootState } from "../../store/types";
import {
  getDayOfWeekCount,
  getHourOfWeek,
  getStartOfDay
} from "../../utils/dateUtils";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_TIME_RANGE = {
  start: getStartOfDay(Date.now() - 4 * MS_PER_WEEK),
  end: null
};

/**
 * Retrieves all activity records
 */
export const getAllRecords = (state: RootState) => state.activity.records;

/**
 * Retrieves the state loading activity records from IndexedDB into the redux
 * store
 */
export const getIsLoadingRecords = (state: RootState) =>
  state.activity.isLoadingRecords;

/**
 * Retrieves the user selected domain
 */
export const getSelectedDomain = (state: RootState) =>
  state.activity.selectedDomain;

/**
 * Retrieves the user selected time range
 */
export const getSelectedTimeRange = (state: RootState) => {
  const selectedTimeRange = state.activity.selectedTimeRange;
  return selectedTimeRange === null ? DEFAULT_TIME_RANGE : selectedTimeRange;
};

/**
 * Retrieves the time range of all recorded activity (oldest & most recently
 * recorded activity in IndexedDB)
 */
export const getActivityTimeRange = createSelector(
  getAllRecords,
  (records): DefiniteTimeRange | null => {
    if (records.length === 0) {
      return null;
    }

    let oldestTimestamp = records[0].startTime;
    let newestTimestamp = records[0].startTime;
    for (let i = 1; i < records.length; i++) {
      const timestamp = records[i].startTime;

      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
      }
      if (timestamp > newestTimestamp) {
        newestTimestamp = timestamp;
      }
    }

    return { start: oldestTimestamp, end: newestTimestamp };
  }
);

/**
 * Retrieves the effective time range - result of combining the selected time
 * range & the time range of all recorded activity
 */
export const getEffectiveTimeRange = createSelector(
  [getActivityTimeRange, getSelectedTimeRange],
  (activityTimeRange, selectedTimeRange): DefiniteTimeRange => {
    if (activityTimeRange === null) {
      return {
        start: selectedTimeRange.start || 0,
        end: selectedTimeRange.end || 0
      };
    }

    return {
      start:
        selectedTimeRange.start === null
          ? activityTimeRange.start
          : selectedTimeRange.start,
      end:
        selectedTimeRange.end === null
          ? activityTimeRange.end
          : selectedTimeRange.end
    };
  }
);

/**
 * Retrieves all activity records that falls within the selected time range
 * @remarks
 * Includes records with time intervals that overlaps with the time range
 * boundaries
 */
export const getRecords = createSelector(
  [getAllRecords, getSelectedTimeRange],
  (records, selectedTimeRange) => {
    const { start: startTime, end: endTime } = selectedTimeRange;
    return records.filter(
      record =>
        (startTime === null || record.endTime >= startTime) &&
        (endTime === null || record.startTime <= endTime)
    );
  }
);

/**
 * Retrieves average duration of all activity records that falls within the
 * selected time range, grouped by the hour-of-day & day-of-week of the
 * activity's timestamp
 */
export const getAverageDurationByHourOfWeek = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
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
            totalDurationByHourOfWeek[hourOfWeekKey][getStartOfDay(endTime)] ||
            0;
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
);

/**
 * Retrieves the set of domains & the domain's favion URL from all activity
 * records
 * @remarks We return a hashmap to enable faster lookups for `favIconUrl`
 */
export const getAllDomains = createSelector(
  getAllRecords,
  records => {
    const allDomains = new Set<string>();
    const favIconUrlByDomain = new Map<string, string>();

    records.forEach(record => {
      let { origin, favIconUrl } = record;
      const domain = origin.replace(/(https?:\/\/|www\.)/g, "");
      if (!allDomains.has(domain)) {
        allDomains.add(domain);
      }
      if (allDomains.has(domain) && favIconUrl) {
        favIconUrlByDomain.set(domain, favIconUrl);
      }
    });

    // Sort results by domains with highest duration
    return [...allDomains].reduce(
      (acc: { [domain: string]: { favIconUrl?: string } }, domain) => {
        acc[domain] = {
          favIconUrl: favIconUrlByDomain.get(domain)
        };
        return acc;
      },
      {}
    );
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by the date of the activity's timestamp
 */
export const getTotalDurationByDate = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
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
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by domain of the activity's URL
 */
export const getTotalDurationByDomain = createSelector(
  getRecords,
  records => {
    const totalDurationByDomain: { [domain: string]: number } = {};
    const favIconUrlByDomain: { [domain: string]: string } = {};

    records.forEach(record => {
      let { origin, startTime, endTime } = record;
      const domain = origin.replace(/(https?:\/\/|www\.)/g, "");

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
        domain: key,
        favIconUrl: favIconUrlByDomain[key],
        totalDuration: value
      }))
      .sort((a, b) => {
        return a.totalDuration > b.totalDuration ? -1 : 1;
      })
      .slice(0, 10);
  }
);
