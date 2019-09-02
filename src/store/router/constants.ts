import { getStartOfDay } from "../../utils/dateUtils";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// Domain
export const SEARCH_PARAM_DOMAIN = "domain";

// Time Range
export const DEFAULT_TIME_RANGE = {
  start: getStartOfDay(Date.now() - 4 * MS_PER_WEEK),
  end: null
};
export const SEARCH_PARAM_START_DATE = "startDate";
export const SEARCH_PARAM_END_DATE = "endDate";
