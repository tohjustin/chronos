import _ from "lodash";
import { createSelector } from "reselect";

import { MS_PER_DAY } from "../../constants/time";
import { DefiniteTimeRange } from "../../models/time";
import { RootState } from "../../store";
import {
  computeAverageDurationByHourOfWeek,
  computeTotalDuration,
  computeTotalDurationByDate,
  computeTotalDurationByDayOfWeek,
  isValidActivityRecord
} from "../../utils/activityUtils";
import { getDayCount } from "../../utils/dateUtils";
import { selectors as routerSelectors } from "../router";

/**
 * Retrieves all activity records
 */
export const getAllRecords = (state: RootState) => {
  return state.activity.records.filter(isValidActivityRecord);
};

/**
 * Retrieves the status of deleting activity records
 */
export const getIsDeletingRecords = (state: RootState) =>
  state.activity.isDeleting;

/**
 * Retrieves the status of loading activity records
 */
export const getIsLoadingRecords = (state: RootState) =>
  state.activity.isLoading;

/**
 * Retrieves time range of all (fetched) activity records in store
 */
export const getRecordsTimeRange = (state: RootState) => {
  return state.activity.recordsTimeRange;
};

/**
 * Retrieves selected time range
 */
export const getSelectedTimeRange = (state: RootState) =>
  state.activity.selectedTimeRange;

/**
 * Retrieves the time range of all recorded activity found in database (oldest
 * & most recently recorded activity)
 */
export const getActivityTimeRange = (state: RootState) =>
  state.activity.totalTimeRange;

/**
 * Retrieves the state of whether there are any activity records
 */
export const getHasRecords = createSelector(
  getAllRecords,
  records => records.length > 0
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
        start: _.get(selectedTimeRange, "start") || 0,
        end: _.get(selectedTimeRange, "end") || 0
      };
    }

    return {
      start: _.get(selectedTimeRange, "start") || activityTimeRange.start,
      end: _.get(selectedTimeRange, "end") || activityTimeRange.end
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
  (records): { [domain: string]: { favIconUrl?: string } } => {
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
  [getAllRecords, routerSelectors.getSelectedDomain],
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
      const { hash, pathname, search, startTime, endTime } = record;
      const path = `${pathname}${hash}${search}`;
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
 * Retrieves total number of unique page visits (by pathname + hash + search)
 * to a selected domain that falls within the selected time range.
 */
export const getSelectedDomainTotalPageVisitCount = createSelector(
  getSelectedDomainRecords,
  selectedDomainRecords => {
    return _.chain(selectedDomainRecords)
      .uniqBy(({ pathname, hash, search }) => `${pathname}${hash}${search}`)
      .value().length;
  }
);

/**
 * Retrieves average page visit duration on a selected domain that
 * falls within the selected time range
 */
export const getSelectedDomainAveragePageVisitDuration = createSelector(
  [getSelectedDomainRecords, getEffectiveTimeRange],
  (selectedDomainRecords, effectiveTimeRange) => {
    // (total duration on website) divide by (# of page visited)
    return (
      computeTotalDuration(selectedDomainRecords, effectiveTimeRange) /
      Math.max(selectedDomainRecords.length, 1)
    );
  }
);
