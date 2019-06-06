/**
 * An unbounded range between two points in time (in milliseconds)
 */
export type TimeRange = {
  start: number | null;
  end: number | null;
};

/**
 * A bounded range between two points in time (in milliseconds)
 */
export type DefiniteTimeRange = TimeRange & {
  start: number;
  end: number;
};
