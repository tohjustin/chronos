/**
 * Time window (in months) to display historical usage analytics via a Calendar
 * Heatmap
 */
export const HISTORICAL_USAGE_TIME_WINDOW = 6;

/**
 * Smallest time window (in months) required for computing analytics
 */
export const ANALYTICS_REQUIRED_TIME_WINDOW = Math.max(0);

/**
 * Smallest time window (in months) required for computing domain analytics
 */
export const DOMAIN_ANALYTICS_REQUIRED_TIME_WINDOW = Math.max(
  HISTORICAL_USAGE_TIME_WINDOW
);
