import { TimeRange } from "../../models/time";
import { getStartOfDay, minusDays } from "../../utils/dateUtils";

// Domain
export const SEARCH_PARAM_DOMAIN = "domain";

// Time Range
export const DEFAULT_TIME_RANGE: TimeRange = {
  start: minusDays(getStartOfDay(), 27), // 4 weeks
  end: null
};
export const SEARCH_PARAM_START_DATE = "startDate";
export const SEARCH_PARAM_END_DATE = "endDate";
