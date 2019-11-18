/**
 * Time window (in months) to display historical usage analytics
 */
export const HISTORICAL_USAGE_TIME_WINDOW = 6;

/**
 * Smallest time window that the application needs for computing domain
 * analytics
 */
export const DOMAIN_ANALYTICS_REQUIRED_TIME_WINDOW = Math.max(
  HISTORICAL_USAGE_TIME_WINDOW
);
