/** Object representing a raw (unprocessed) segment of web browsing activity */
export interface RawActivity {
  url: string;
  startTime: number;
  endTime: number;
  title: string;
  favIconUrl: string;
}

/** Object representing a segment of web browsing activity */
export interface Activity {
  id: number;
  url: string;
  domain: string;
  path: string;
  startTime: number;
  endTime: number;
  title?: string;
  favIconUrl?: string;
}

/** Object representing a domain & its metadata */
export interface Domain {
  id: string;
  favIconUrl: string;
}
