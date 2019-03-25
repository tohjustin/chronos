/** The transition type for this visit from its referrer. */
export type TransitionType =
  | "auto_bookmark"
  | "auto_subframe"
  | "auto_toplevel"
  | "form_submit"
  | "generated"
  | "keyword_generated"
  | "keyword"
  | "link"
  | "manual_subframe"
  | "reload"
  | "typed";

/** An object encapsulating one result of a history query. */
export interface HistoryItem {
  /** The unique identifier for the item. */
  id: string;
  /** The URL navigated to by a user. */
  url?: string;
  /** The title of the page when it was last loaded. */
  title?: string;
  /**
   * When this page was last loaded, represented in milliseconds since the
   * epoch.
   */
  lastVisitTime?: number;
  /** The number of times the user has navigated to this page. */
  visitCount?: number;
  /**
   * The number of times the user has navigated to this page by typing in the
   * address.
   */
  typedCount?: number;
}

/** An object encapsulating the options of a history query. */
export interface HistoryQuery {
  /**
   * A free-text query to the history service. Leave empty to retrieve all
   * pages.
   */
  text: string;
  /** Optional. The maximum number of results to retrieve. Defaults to 100. */
  maxResults?: number;
  /**
   * Optional. Limit results to those visited after this date, represented in
   * milliseconds since the epoch.
   */
  startTime?: number;
  /**
   * Optional. Limit results to those visited before this date, represented in
   * milliseconds since the epoch.
   */
  endTime?: number;
}

export interface Range {
  /**
   * Items added to history after this date, represented in milliseconds since
   * the epoch.
   */
  startTime: number;
  /**
   * Items added to history before this date, represented in milliseconds since
   * the epoch.
   */
  endTime: number;
}

export interface Url {
  /**
   * The URL for the operation. It must be in the format as returned from a call
   * to history.search.
   */
  url: string;
}

/** An object encapsulating one visit to a URL. */
export interface VisitItem {
  /** The unique identifier for the item. */
  id: string;
  /** The unique identifier for this visit. */
  visitId: string;
  /** When this visit occurred, represented in milliseconds since the epoch. */
  visitTime?: number;
  /** The visit ID of the referrer. */
  referringVisitId: string;
  /** The transition type for this visit from its referrer. */
  transition: TransitionType;
}

/** Service for interacting with browser history */
export interface HistoryService {
  /**
   * Adds a URL to the history with a default visitTime of the current time and
   * a default transition type of "link".
   */
  addUrl(details: Url): Promise<void>;

  /** Deletes all items from the history. */
  deleteAll(): Promise<void>;

  /**
   * Removes all items within the specified date range from the history. Pages
   * will not be removed from the history unless all visits fall within the
   * range.
   */
  deleteRange(range: Range): Promise<void>;

  /** Removes all occurrences of the given URL from the history. */
  deleteUrl(details: Url): Promise<void>;

  /** Retrieves information about visits to a URL. */
  getVisits(details: Url): Promise<VisitItem[]>;

  /**
   * Searches the history for the last visit time of each page matching the
   * query.
   */
  search(query: HistoryQuery): Promise<HistoryItem[]>;
}
