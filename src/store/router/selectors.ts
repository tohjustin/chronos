import { createSelector } from "reselect";

import { ValidationStatus } from "../../models/validate";
import { RootState } from "../../store";
import {
  getStartOfDay,
  getTimestampFromDateString,
  isValidDateString,
  getEndOfDay
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
export const getSelectedDomain = createSelector(
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
export const getSelectedDomainValidationStatus = (
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
export const getSelectedTimeRange = createSelector(
  getSearchParams,
  searchParams => {
    const params = new URLSearchParams(searchParams);
    const startDateParam = params.get(SEARCH_PARAM_START_DATE) || "";
    const endDateParam = params.get(SEARCH_PARAM_END_DATE) || "";

    return !isValidDateString(startDateParam) ||
      !isValidDateString(endDateParam)
      ? DEFAULT_TIME_RANGE
      : {
          start: getStartOfDay(getTimestampFromDateString(startDateParam)),
          end: getEndOfDay(getTimestampFromDateString(endDateParam))
        };
  }
);

/**
 * Retrieves validation status of the selected time range extracted from
 * browser's URL search parameters
 */
export const getSelectedTimeRangeValidationStatus = (
  state: RootState
): ValidationStatus => {
  const params = new URLSearchParams(state.router.location.search);
  const startDateParam = params.get(SEARCH_PARAM_START_DATE) || "";
  const endDateParam = params.get(SEARCH_PARAM_END_DATE) || "";

  if (startDateParam === "" && endDateParam === "") {
    return { isValid: true, description: "" };
  }

  if (!isValidDateString(startDateParam) || !isValidDateString(endDateParam)) {
    return {
      isValid: false,
      description: "Selected date range is malformed"
    };
  }

  const startTime = getTimestampFromDateString(startDateParam);
  const endTime = getTimestampFromDateString(endDateParam);
  if (startTime > endTime) {
    return {
      isValid: false,
      description: "Selected date range is invalid"
    };
  }

  return { isValid: true, description: "" };
};
