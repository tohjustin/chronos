import { TimeRange } from "../../models/time";
import { getEndOfDay, getStartOfDay, minusDays } from "../../utils/dateUtils";

// Domain
export const SEARCH_PARAM_DOMAIN = "domain";

// Time Range
const now = getStartOfDay(Date.now());
export const DEFAULT_TIME_RANGE: TimeRange = {
  start: minusDays(getStartOfDay(now), 27), // 4 weeks
  end: getEndOfDay(now)
};
export const SEARCH_PARAM_START_DATE = "startDate";
export const SEARCH_PARAM_END_DATE = "endDate";
