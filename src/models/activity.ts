/** Object representing a segment of web browsing activity */
export interface Activity {
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

/** Object representing a segment of web browsing activity stored in DB */
export interface ActivityRecord extends Activity {
  id: number;
}
