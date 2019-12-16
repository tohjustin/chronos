import _ from "lodash";
import { createSelector } from "reselect";

import { MS_PER_DAY } from "../../constants/time";
import { Activity, Domain } from "../../models/activity";
import { DefiniteTimeRange, TimeRange } from "../../models/time";
import { RootState } from "../../store";
import {
  computeAverageDurationByHourOfWeek,
  computeTotalDuration,
  computeTotalDurationByDate,
  computeTotalDurationByDayOfWeek
} from "../../utils/activityUtils";
import { getDayCount, getEndOfDay, getStartOfDay } from "../../utils/dateUtils";
import { selectors as routerSelectors } from "../router";

/**
 * Retrieves all visited domains
 */
export const getAllDomains = (state: RootState): Record<string, Domain> => {
  return state.activity.domains;
};

/**
 * Retrieves all activity records
 */
export const getAllRecords = (state: RootState): Activity[] => {
  return state.activity.records;
};

/**
 * Retrieves the status of deleting activity records
 */
export const getIsDeletingRecords = (state: RootState) =>
  state.activity.isDeleting;

/**
 * Retrieves the status of whether the initial record fetch has completed
 */
export const getIsInitialized = (state: RootState) =>
  state.activity.isInitialized;

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
 * Retrieves selected time range extracted from browser's URL search parameters
 * clamped within the time range of all recorded activity
 */
export const getEffectiveSearchParamsSelectedTimeRange = createSelector(
  [getActivityTimeRange, routerSelectors.getSearchParamsSelectedTimeRange],
  (activityTimeRange, searchParamsSelectedTimeRange): TimeRange => {
    const { start, end } = searchParamsSelectedTimeRange;
    const startOfToday = getStartOfDay();

    return {
      start:
        start !== null && activityTimeRange
          ? _.clamp(start, activityTimeRange.start, startOfToday)
          : start,
      end: end === startOfToday ? null : end
    };
  }
);

/**
 * Retrieves selected time range clamped within the time range of all recorded
 * activity
 */
export const getEffectiveSelectedTimeRange = createSelector(
  [getActivityTimeRange, getSelectedTimeRange],
  (activityTimeRange, selectedTimeRange): DefiniteTimeRange => {
    if (activityTimeRange === null) {
      return { start: getStartOfDay(), end: getEndOfDay() };
    }

    const selectedStartTime = _.get(selectedTimeRange, "start");
    const selectedEndTime = _.get(selectedTimeRange, "end");
    const { start, end } = activityTimeRange;
    return {
      start: getStartOfDay(
        selectedStartTime ? _.clamp(selectedStartTime, start, end) : start
      ),
      end: getEndOfDay(
        selectedEndTime ? _.clamp(selectedEndTime, start, end) : end
      )
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
  [getRecords, getEffectiveSelectedTimeRange],
  (records, effectiveTimeRange) => {
    return computeAverageDurationByHourOfWeek(records, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records as a ratio to the total
 * time duration that falls within the selected time range.
 */
export const getRatioToTotalDuration = createSelector(
  [getRecords, getEffectiveSelectedTimeRange],
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
  [getRecords, getEffectiveSelectedTimeRange],
  (records, effectiveTimeRange) => {
    return computeTotalDuration(records, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by the date of the activity's timestamp
 */
export const getTotalDurationByDate = createSelector(
  [getRecords, getEffectiveSelectedTimeRange],
  (records, effectiveTimeRange) => {
    return computeTotalDurationByDate(records, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by the day-of-week of the activity's timestamp
 */
export const getTotalDurationByDayOfWeek = createSelector(
  [getRecords, getEffectiveSelectedTimeRange],
  (records, effectiveTimeRange) => {
    return computeTotalDurationByDayOfWeek(records, effectiveTimeRange);
  }
);

/**
 * Retrieves total duration of all activity records that falls within the
 * selected time range, grouped by domain & sorted in descreasing duration.
 */
export const getTotalDurationByDomain = createSelector(
  [getRecords, getAllDomains],
  (records, allDomains) => {
    const totalDurationByDomain: { [domain: string]: number } = {};
    records.forEach(record => {
      const { domain, startTime, endTime } = record;
      const duration = endTime - startTime;
      const prevTotalDuration = totalDurationByDomain[domain] || 0;
      totalDurationByDomain[domain] = prevTotalDuration + duration;
    });

    // Sort results by domains with highest duration
    return Object.entries(totalDurationByDomain)
      .map(([domain, totalDuration]) => ({
        domain,
        totalDuration,
        favIconUrl: allDomains[domain]
          ? allDomains[domain].favIconUrl
          : undefined
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
export const getTotalDomainVisitCount = createSelector(getRecords, records => {
  return _.uniqBy(records, record => record.domain).length;
});

/**
 * Retrieves total number of unique page visits by url that falls within the
 * selected time range.
 */
export const getTotalPageVisitCount = createSelector(getRecords, records => {
  return _.uniqBy(records, record => record.url).length;
});

/**
 * Retrieves all activity records of a selected domain
 */
export const getAllSelectedDomainRecords = createSelector(
  [getAllRecords, routerSelectors.getSearchParamsSelectedDomain],
  (records, selectedDomain) => {
    return records.filter(record => selectedDomain === record.domain);
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain,
 * grouped by the date of the activity's timestamp
 */
export const getAllSelectedDomainTotalDurationByDate = createSelector(
  [getAllSelectedDomainRecords, getActivityTimeRange],
  (allSelectedDomainRecords, getActivityTimeRange) => {
    return getActivityTimeRange
      ? computeTotalDurationByDate(
          allSelectedDomainRecords,
          getActivityTimeRange
        )
      : [];
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
  [getSelectedDomainRecords, getEffectiveSelectedTimeRange],
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
  [getRecords, getSelectedDomainRecords, getEffectiveSelectedTimeRange],
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
  [getSelectedDomainRecords, getEffectiveSelectedTimeRange],
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
  [getSelectedDomainRecords, getEffectiveSelectedTimeRange],
  (selectedDomainRecords, effectiveTimeRange) => {
    return computeTotalDurationByDate(
      selectedDomainRecords,
      effectiveTimeRange
    );
  }
);

/**
 * Retrieves total duration of all activity records of a selected domain that
 * falls within the selected time range, grouped by the day-of-week of the
 * activity's timestamp
 */
export const getSelectedDomainTotalDurationByDayOfWeek = createSelector(
  [getSelectedDomainRecords, getEffectiveSelectedTimeRange],
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
      [path: string]: { totalDuration: number; title?: string; path: string };
    } = {};

    selectedDomainRecords.forEach(record => {
      const { path, startTime, endTime } = record;
      const duration = endTime - startTime;
      const prevTotalDuration = totalDurationByPathname[path]
        ? totalDurationByPathname[path].totalDuration
        : 0;
      totalDurationByPathname[path] = {
        path,
        title: record.title,
        totalDuration: prevTotalDuration + duration
      };
    });

    // Sort results by paths with highest duration
    return Object.values(totalDurationByPathname).sort((a, b) => {
      return a.totalDuration > b.totalDuration ? -1 : 1;
    });
  }
);

/**
 * Retrieves total number of unique page visits to a selected domain that falls
 * within the selected time range.
 */
export const getSelectedDomainTotalPageVisitCount = createSelector(
  getSelectedDomainRecords,
  selectedDomainRecords => {
    return _.uniqBy(selectedDomainRecords, record => record.path).length;
  }
);

/**
 * Retrieves average page visit duration on a selected domain that
 * falls within the selected time range
 */
export const getSelectedDomainAveragePageVisitDuration = createSelector(
  [getSelectedDomainRecords, getEffectiveSelectedTimeRange],
  (selectedDomainRecords, effectiveTimeRange) => {
    // (total duration on website) divide by (# of page visited)
    return (
      computeTotalDuration(selectedDomainRecords, effectiveTimeRange) /
      Math.max(selectedDomainRecords.length, 1)
    );
  }
);
