import { TimeRange } from "../../models/time";
import { minusDays } from "../../utils/dateUtils";

// Domain
export const SEARCH_PARAM_DOMAIN = "domain";

// Time Range
export const DEFAULT_TIME_RANGE: TimeRange = {
  start: minusDays(Date.now(), 27), // 4 weeks
  end: null
};
export const SEARCH_PARAM_START_DATE = "startDate";
export const SEARCH_PARAM_END_DATE = "endDate";
