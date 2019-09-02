import _ from "lodash";
import { createSelector } from "reselect";

import { DefiniteTimeRange } from "../../models/time";
import { RootState } from "../../store";
import {
  computeAverageDurationByHourOfWeek,
  computeTotalDuration,
  computeTotalDurationByDate,
  computeTotalDurationByDayOfWeek,
  isValidActivityRecord
} from "../../utils/activityUtils";
import {
  getDayCount,
  getStartOfDay,
  getTimestampFromDateString,
  isValidDateString
} from "../../utils/dateUtils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = MS_PER_DAY * 7;
const DEFAULT_TIME_RANGE = {
  start: getStartOfDay(Date.now() - 4 * MS_PER_WEEK),
  end: null
};

/**
 * Retrieves all activity records
 */
export const getAllRecords = (state: RootState) => {
  return state.activity.records.filter(isValidActivityRecord);
};

/**
 * Retrieves the status of loading activity records into the redux store
 */
export const getIsLoadingRecords = (state: RootState) =>
  state.activity.isLoading;

/**
 * Retrieves the user selected domain
 */
export const getSelectedDomain = (state: RootState) => {
  const params = new URLSearchParams(state.router.location.search);

  return params.get("domain");
};

/**
 * Retrieves the user selected time range
 */
export const getSelectedTimeRange = (state: RootState) => {
  const params = new URLSearchParams(state.router.location.search);
  const startDateParam = params.get("startDate") || "";
  const endDateParam = params.get("endDate") || "";

  if (!isValidDateString(startDateParam) || !isValidDateString(endDateParam)) {
    return DEFAULT_TIME_RANGE;
  }
  const start = getTimestampFromDateString(startDateParam);
  const end = getTimestampFromDateString(endDateParam);

  return {
    start,
    end: end === start ? end + (MS_PER_DAY - 1) : end
  };
};

/**
 * Retrieves validation status of user selected time range
 */
export const getIsSelectedTimeRangeValid = (state: RootState) => {
  const params = new URLSearchParams(state.router.location.search);
  const startDateParam = params.get("startDate") || "";
  const endDateParam = params.get("endDate") || "";

  if (startDateParam === "" && endDateParam === "") {
    return true;
  }

  if (!isValidDateString(startDateParam) || !isValidDateString(endDateParam)) {
    return false;
  }

  const startTime = getTimestampFromDateString(startDateParam);
  const endTime = getTimestampFromDateString(endDateParam);
  if (startTime > endTime) {
    return false;
  }

  return true;
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
 * Retrieves the set of domains & the domain's favicon URL from all activity
 * records
 * @remarks We return a hash-map to enable faster lookups for `favIconUrl`
 */
export const getAllDomains = createSelector(
  getAllRecords,
  records => {
    const allDomains = new Set<string>();
    const favIconUrlByDomain = new Map<string, string>();

    records.forEach(record => {
      const { origin, favIconUrl } = record;
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
 * Retrieves average duration of all activity records that falls within the
 * selected time range, grouped by the hour-of-day & day-of-week of the
 * activity's timestamp
 */
export const getAverageDurationByHourOfWeek = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
    return computeAverageDurationByHourOfWeek(records, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records as a ratio to the total
 * time duration that falls within the selected time range.
 */
export const getRatioToTotalDuration = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
    const dayCount = getDayCount(
      effectiveTimeRange.start,
      effectiveTimeRange.end
    );

    return (
      computeTotalDuration(records, effectiveTimeRange) /
      Math.max(dayCount * MS_PER_DAY, 1)
    );
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range
 */
export const getTotalDuration = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
    return computeTotalDuration(records, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by the date of the activity's timestamp
 */
export const getTotalDurationByDate = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
    return computeTotalDurationByDate(records, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by the day-of-week of the activity's timestamp
 */
export const getTotalDurationByDayOfWeek = createSelector(
  [getRecords, getEffectiveTimeRange],
  (records, effectiveTimeRange) => {
    return computeTotalDurationByDayOfWeek(records, effectiveTimeRange);
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
      const { origin, startTime, endTime } = record;
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
      });
  }
);

/**
 * Retrieves total number of unique domain visits that falls within the
 * selected time range.
 */
export const getTotalDomainVisitCount = createSelector(
  getRecords,
  records => {
    return _.chain(records)
      .uniqBy(record => record.origin)
      .value().length;
  }
);

/**
 * Retrieves total number of unique page visits (by origin + pathname + search)
 * that falls within the selected time range.
 */
export const getTotalPageVisitCount = createSelector(
  getRecords,
  records => {
    return _.chain(records)
      .uniqBy(
        records => `${records.origin}${records.pathname}${records.search}`
      )
      .value().length;
  }
);

/**
 * Retrieves all activity records of a selected domain
 */
export const getAllSelectedDomainRecords = createSelector(
  [getAllRecords, getSelectedDomain],
  (records, selectedDomain) => {
    return records.filter(
      record =>
        selectedDomain === record.origin.replace(/(https?:\/\/|www\.)/g, "")
    );
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain,
 * grouped by the date of the activity's timestamp
 */
export const getAllSelectedDomainTotalDurationByDate = createSelector(
  [getAllSelectedDomainRecords, getActivityTimeRange],
  (allSelectedDomainRecords, activityTimeRange) => {
    return computeTotalDurationByDate(
      allSelectedDomainRecords,
      activityTimeRange || { start: 0, end: Date.now() }
    );
  }
);

/**
 * Retrieves all activity records of a selected domain that falls within the
 * selected time range
 * @remarks
 * Includes records with time intervals that overlaps with the time range
 * boundaries
 */
export const getSelectedDomainRecords = createSelector(
  [getAllSelectedDomainRecords, getSelectedTimeRange],
  (allSelectedDomainRecords, selectedTimeRange) => {
    const { start: startTime, end: endTime } = selectedTimeRange;
    return allSelectedDomainRecords.filter(
      record =>
        (startTime === null || record.endTime >= startTime) &&
        (endTime === null || record.startTime <= endTime)
    );
  }
);

/**
 * Retrieves average duration of all activity records of a selected domain that
 * falls within the selected time range, grouped by the hour-of-day &
 * day-of-week of the activity's timestamp
 */
export const getSelectedDomainAverageDurationByHourOfWeek = createSelector(
  [getSelectedDomainRecords, getEffectiveTimeRange],
  (selectedDomainRecords, effectiveTimeRange) => {
    return computeAverageDurationByHourOfWeek(
      selectedDomainRecords,
      effectiveTimeRange
    );
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain as a
 * ratio to total duration of all activity records that falls within the
 * selected time range.
 */
export const getSelectedDomainRatioToTotalDuration = createSelector(
  [getRecords, getSelectedDomainRecords, getEffectiveTimeRange],
  (records, selectedDomainRecords, effectiveTimeRange) => {
    return (
      computeTotalDuration(selectedDomainRecords, effectiveTimeRange) /
      Math.max(computeTotalDuration(records, effectiveTimeRange), 1)
    );
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain that
 * falls within the selected time range.
 */
export const getSelectedDomainTotalDuration = createSelector(
  [getSelectedDomainRecords, getEffectiveTimeRange],
  (selectedDomainRecords, effectiveTimeRange) => {
    return computeTotalDuration(selectedDomainRecords, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain that
 * falls within the selected time range, grouped by the date of the activity's
 * timestamp
 */
export const getSelectedDomainTotalDurationByDate = createSelector(
  [getSelectedDomainRecords, getEffectiveTimeRange],
  (selectedDomainRecords, effectiveTimeRange) => {
    return computeTotalDurationByDate(
      selectedDomainRecords,
      effectiveTimeRange || { start: 0, end: Date.now() }
    );
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain that
 * falls within the selected time range, grouped by the day-of-week of the
 * activity's timestamp
 */
export const getSelectedDomainTotalDurationByDayOfWeek = createSelector(
  [getSelectedDomainRecords, getEffectiveTimeRange],
  (selectedDomainRecords, effectiveTimeRange) => {
    return computeTotalDurationByDayOfWeek(
      selectedDomainRecords,
      effectiveTimeRange
    );
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain that
 * falls within the selected time range, grouped by pathname of the activity's
 * URL
 */
export const getSelectedDomainTotalDurationByPath = createSelector(
  getSelectedDomainRecords,
  selectedDomainRecords => {
    const totalDurationByPathname: {
      [path: string]: { totalDuration: number; title: string; path: string };
    } = {};

    selectedDomainRecords.forEach(record => {
      const { pathname, search, startTime, endTime } = record;
      const path = `${pathname}${search}`;
      if (path !== "") {
        const duration = endTime - startTime;
        const prevTotalDuration = totalDurationByPathname[path]
          ? totalDurationByPathname[path].totalDuration
          : 0;
        totalDurationByPathname[path] = {
          path,
          title: record.title,
          totalDuration: prevTotalDuration + duration
        };
      }
    });

    // Sort results by paths with highest duration
    return Object.entries(totalDurationByPathname)
      .map(([, value]) => value)
      .sort((a, b) => {
        return a.totalDuration > b.totalDuration ? -1 : 1;
      });
  }
);

/**
 * Retrieves total number of unique page visits (by pathname + search) to a
 * selected domain that falls within the selected time range.
 */
export const getSelectedDomainTotalPageVisitCount = createSelector(
  getSelectedDomainRecords,
  selectedDomainRecords => {
    return _.chain(selectedDomainRecords)
      .uniqBy(records => `${records.pathname}${records.search}`)
      .value().length;
  }
);

/**
 * Retrieves average page visit duration on a selected domain that
 * falls within the selected time range
 */
export const getSelectedDomainAveragePageVisitDuration = createSelector(
  [
    getSelectedDomainRecords,
    getSelectedDomainTotalPageVisitCount,
    getEffectiveTimeRange
  ],
  (
    selectedDomainRecords,
    selectedDomainTotalPageVisitCount,
    effectiveTimeRange
  ) => {
    // (total duration on website) divide by (# of unique page visited)
    return (
      computeTotalDuration(selectedDomainRecords, effectiveTimeRange) /
      Math.max(selectedDomainTotalPageVisitCount, 1)
    );
  }
);
