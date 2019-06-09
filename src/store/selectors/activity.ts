import _ from "lodash";
import moment from "moment";
import { createSelector } from "reselect";

import { ActivityRecord } from "../../db/types";
import { DefiniteTimeRange } from "../../models/time";
import { RootState } from "../../store/types";
import { createActivitySplittingReducer } from "../../utils/activityUtils";
import {
  getDateInMs,
  getDayOfWeekCount,
  getHourOfWeek
} from "../../utils/dateUtils";

const DEFAULT_TIME_RANGE = {
  start: moment()
    .subtract(4, "week")
    .startOf("day")
    .valueOf(),
  end: null
};

const EMPTY_HOUR_OF_WEEK_DATA = (() => {
  const result: { [hourOfWeekKey: string]: ActivityRecord[] } = {};
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const hourOfWeekKey = `${day},${hour}`;
      result[hourOfWeekKey] = [];
    }
  }
  return result;
})();

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
    const minDate = getDateInMs(effectiveTimeRange.start);
    const maxDate = getDateInMs(effectiveTimeRange.end);

    return _.chain(records)
      .reduce(createActivitySplittingReducer("hour"), [])
      .filter(
        r =>
          r.startTime >= effectiveTimeRange.start &&
          r.endTime <= effectiveTimeRange.end
      )
      .groupBy(record => {
        const hourOfWeek = getHourOfWeek(record.startTime);
        return `${hourOfWeek.day},${hourOfWeek.hour}`;
      })
      .merge(EMPTY_HOUR_OF_WEEK_DATA)
      .mapValues((records: ActivityRecord[], hourOfWeekKey: string) => {
        const [dayOfWeek, hourOfDay] = hourOfWeekKey.split(",").map(Number);
        const dayOfWeekCount = getDayOfWeekCount(dayOfWeek, minDate, maxDate);
        const totalDuration = _.sumBy(records, r => r.endTime - r.startTime);
        return {
          day: dayOfWeek,
          hour: hourOfDay,
          duration: totalDuration / Math.max(dayOfWeekCount, 1)
        };
      })
      .values()
      .sort((a, b) => (a.day * 24 + a.hour < b.day * 24 + b.hour ? -1 : 1))
      .value();
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by the date of the activity's timestamp
 */
export const getTotalDurationByDate = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
    const minDate = getDateInMs(effectiveTimeRange.start);
    const maxDate = getDateInMs(effectiveTimeRange.end);

    return _.chain(records)
      .reduce(createActivitySplittingReducer("day"), [])
      .filter(
        r =>
          r.startTime >= effectiveTimeRange.start &&
          r.endTime <= effectiveTimeRange.end
      )
      .groupBy(record => getDateInMs(record.startTime))
      .merge(
        _.range(minDate, maxDate, 24 * 60 * 60 * 1000).reduce<{
          [dateInMs: number]: ActivityRecord[];
        }>((acc, dateInMs) => {
          acc[dateInMs] = [];
          return acc;
        }, {})
      )
      .mapValues((records: ActivityRecord[], dateInMs: string) => {
        const totalDuration = _.sumBy(records, r => r.endTime - r.startTime);
        return {
          timestamp: Number(dateInMs),
          totalDuration
        };
      })
      .values()
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      .value();
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
