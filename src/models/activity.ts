/** Object representing a segment of web browsing activity */
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
