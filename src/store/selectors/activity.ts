import moment from "moment";
import { createSelector } from "reselect";

import { DefiniteTimeRange } from "../../models/time";
import { RootState } from "../../store/types";
import {
  getDateInMs,
  getHourOfWeek
} from "../../utils/dateUtils";

const DEFAULT_TIME_RANGE = {
  start: moment()
    .subtract(4, "week")
    .startOf("day")
    .valueOf(),
  end: null
};

/**
 * Get all activity records
 */
export const getAllRecords = (state: RootState) => state.activity.records;

export const getIsLoadingRecords = (state: RootState) =>
  state.activity.isLoadingRecords;

export const getSelectedTimeRange = (state: RootState) => {
  const selectedTimeRange = state.activity.selectedTimeRange;
  return selectedTimeRange === null ? DEFAULT_TIME_RANGE : selectedTimeRange;
};

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
 * Get all activity records that falls within the selected time range
 *
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
        (startTime === null ||
          record.startTime >= startTime ||
          record.endTime >= startTime) &&
        (endTime === null ||
          record.endTime <= endTime ||
          record.startTime <= endTime)
    );
  }
);

export const getAverageDurationByHourOfWeek = createSelector(
  getRecords,
  records => {
    const avgDurationByHourOfWeek: { [hourOfWeek: string]: number } = {};
    const totalDurationByHourOfWeek: {
      [hourOfWeek: string]: { [date: string]: number };
    } = {};

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
);

export const getTotalDurationByDate = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
    const totalDurationByDate: { [timestamp: string]: number } = {};
    const minDate = getDateInMs(effectiveTimeRange.start);
    const maxDate = getDateInMs(effectiveTimeRange.end);

    records.forEach(record => {
      let { startTime, endTime } = record;
      let [startDate, endDate] = [getDateInMs(startTime), getDateInMs(endTime)];

      // Handle records spanning over different dates
      while (startDate !== endDate) {
        const newEndTime = getDateInMs(endTime) - 1;
        const newEndDate = getDateInMs(newEndTime);

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

export const getTotalDurationByDomain = createSelector(
  getRecords,
  records => {
    const totalDurationByDomain: { [domain: string]: number } = {};
    const favIconUrlByDomain: { [domain: string]: string } = {};

    records.forEach(record => {
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
);
