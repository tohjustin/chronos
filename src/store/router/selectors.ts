import { createSelector } from "reselect";

import { RootState } from "../../store";
import {
  getTimestampFromDateString,
  isValidDateString
} from "../../utils/dateUtils";

import {
  DEFAULT_TIME_RANGE,
  SEARCH_PARAM_DOMAIN,
  SEARCH_PARAM_START_DATE,
  SEARCH_PARAM_END_DATE
} from "./constants";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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
 * Retrieves selected time range extracted from browser's URL search parameters
 */
export const getSelectedTimeRange = createSelector(
  getSearchParams,
  searchParams => {
    const params = new URLSearchParams(searchParams);
    const startDateParam = params.get(SEARCH_PARAM_START_DATE) || "";
    const endDateParam = params.get(SEARCH_PARAM_END_DATE) || "";

    if (
      !isValidDateString(startDateParam) ||
      !isValidDateString(endDateParam)
    ) {
      return DEFAULT_TIME_RANGE;
    }
    const start = getTimestampFromDateString(startDateParam);
    const end = getTimestampFromDateString(endDateParam);

    return {
      start,
      end: end + (MS_PER_DAY - 1)
    };
  }
);
