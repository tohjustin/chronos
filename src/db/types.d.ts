/** Object representing a segment of web browsing acivity */
export interface ActivityRecord {
  id?: number;
  startTime: number;
  endTime: number;
  origin: string;
  pathname: string;
  search: string;
  hash: string;
  title: string;
  favIconUrl: string;
  url: string;
}

/** Service for interacting with activity records */
export interface ActivityService {
  /**
   * Creates & stores an activity record
   * @param url activity URL
   * @param favIconUrl page favicon URL
   * @param title page title
   * @param startTime activity start time in milliseconds
   * @param endTime activity end time in milliseconds
   * @returns ID of the created record
   */
  createActivityRecord(
    url: string,
    favIconUrl: string,
    title: string,
    startTime: number,
    endTime: number
  ): Promise<number>;

  /**
   * Fetches all stored activity records
   * @returns Collection of Activity Records
   */
  fetchAllActivityRecords(): Promise<ActivityRecord[]>;
}
