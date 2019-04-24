/** Object representing a segment of web browsing acivity */
export interface ActivityRecord {
  id?: number;
  startTime: number;
  endTime: number;
  hostname: string;
  pathname: string;
  search: string;
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
  createRecord(
    url: string,
    favIconUrl: string,
    title: string,
    startTime: number,
    endTime: number
  ): Promise<number>;
}
