import { getStartOfDay } from "../../utils/dateUtils";

// Domain
export const SEARCH_PARAM_DOMAIN = "domain";

// Time Range
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = MS_PER_DAY * 7;
const DEFAULT_START_TIME_OFFSET = 4 * MS_PER_WEEK - MS_PER_DAY;
export const DEFAULT_TIME_RANGE = {
  start: getStartOfDay(Date.now()) - DEFAULT_START_TIME_OFFSET,
  end: null
};
export const SEARCH_PARAM_START_DATE = "startDate";
export const SEARCH_PARAM_END_DATE = "endDate";
