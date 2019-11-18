import { createSelector } from "reselect";

import { ValidationStatus } from "../../models/validate";
import { RootState } from "../../store";
import {
  getEndOfDay,
  getStartOfDay,
  getTimestampFromDateString,
  isValidDateString
} from "../../utils/dateUtils";
import { getAllDomains } from "../activity/selectors";

import {
  DEFAULT_TIME_RANGE,
  SEARCH_PARAM_DOMAIN,
  SEARCH_PARAM_START_DATE,
  SEARCH_PARAM_END_DATE
} from "./constants";

/**
 * Retrieves browser's URL search parameters
 */
export const getSearchParams = (state: RootState) => {
  return state.router.location.search;
};

/**
 * Retrieves selected domain extracted from browser's URL search parameters
 */
export const getSearchParamsSelectedDomain = createSelector(
  getSearchParams,
  searchParams => {
    const params = new URLSearchParams(searchParams);

    return params.get(SEARCH_PARAM_DOMAIN);
  }
);

/**
 * Retrieves validation status of the selected domain extracted from browser's
 * URL search parameters
 */
export const getSearchParamsSelectedDomainValidationStatus = (
  state: RootState
): ValidationStatus => {
  const params = new URLSearchParams(state.router.location.search);
  const domainParam = params.get(SEARCH_PARAM_DOMAIN) || "";

  if (domainParam === "") {
    return { isValid: true, description: "" };
  }

  const allDomains = getAllDomains(state);
  if (allDomains[domainParam]) {
    return { isValid: true, description: "" };
  }

  return {
    isValid: false,
    description: `No records for "${domainParam}" found`
  };
};

/**
 * Retrieves selected time range extracted from browser's URL search parameters
 */
export const getSearchParamsSelectedTimeRange = createSelector(
  getSearchParams,
  searchParams => {
    const params = new URLSearchParams(searchParams);
    const startDateParam = params.get(SEARCH_PARAM_START_DATE);
    const endDateParam = params.get(SEARCH_PARAM_END_DATE);

    if (
      (startDateParam === null && endDateParam === null) ||
      (endDateParam !== null && !isValidDateString(endDateParam)) ||
      (startDateParam !== null && !isValidDateString(startDateParam))
    ) {
      return DEFAULT_TIME_RANGE;
    }

    return {
      start:
        startDateParam === null
          ? null
          : getStartOfDay(getTimestampFromDateString(startDateParam)),
      end:
        endDateParam === null
          ? null
          : getEndOfDay(getTimestampFromDateString(endDateParam))
    };
  }
);

/**
 * Retrieves validation status of the selected time range extracted from
 * browser's URL search parameters
 */
export const getSearchParamsSelectedTimeRangeValidationStatus = (
  state: RootState
): ValidationStatus => {
  const params = new URLSearchParams(state.router.location.search);
  const startDateParam = params.get(SEARCH_PARAM_START_DATE);
  const endDateParam = params.get(SEARCH_PARAM_END_DATE);

  if (
    (startDateParam !== null && !isValidDateString(startDateParam)) ||
    (endDateParam !== null && !isValidDateString(endDateParam))
  ) {
    return {
      isValid: false,
      description: "Selected date range contains malformed value(s)"
    };
  }

  if (startDateParam !== null || endDateParam !== null) {
    const today = getStartOfDay();
    const startTime =
      startDateParam !== null ? getTimestampFromDateString(startDateParam) : 0;
    const endTime =
      endDateParam !== null ? getTimestampFromDateString(endDateParam) : today;
    if (startTime > endTime || startTime > today || endTime > today) {
      return {
        isValid: false,
        description: "Selected date range is invalid"
      };
    }
  }

  return { isValid: true, description: "" };
};
