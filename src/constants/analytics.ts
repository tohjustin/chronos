import { milliseconds } from "../utils/dateUtils";

/**
 * Size of duration buckets to display usage distribution analytics via a
 * Vertical Bar Chart
 */
export const DURATION_BUCKET_SIZE = milliseconds({ second: 60 });
export const DURATION_BUCKET_MAX = milliseconds({ minute: 60 });
export const MAX_BUCKET_COUNT = DURATION_BUCKET_MAX / DURATION_BUCKET_SIZE + 1;

/**
 * Time window (in months) to display historical usage analytics via a Calendar
 * Heatmap
 */
export const HISTORICAL_USAGE_TIME_WINDOW = 6;

/**
 * Smallest time window (in months) required for computing analytics
 */
export const ANALYTICS_REQUIRED_TIME_WINDOW = Math.max(
  HISTORICAL_USAGE_TIME_WINDOW
);
