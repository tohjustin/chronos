import {
  FirefoxHistoryAPI,
  HistoryItem,
  HistoryQuery,
  HistoryService,
  Range,
  TransitionType,
  Url,
  VisitItem
} from "./types";

export class FirefoxHistoryService implements HistoryService {
  private history: FirefoxHistoryAPI;

  constructor(history: FirefoxHistoryAPI = browser.history) {
    this.history = history;
  }

  addUrl(details: {
    url: string;
    title?: string;
    transition?: TransitionType;
    visitTime?: number;
  }): Promise<void> {
    return this.history.addUrl(details);
  }

  deleteAll(): Promise<void> {
    return this.history.deleteAll();
  }

  deleteRange(range: Range): Promise<void> {
    return this.history.deleteRange({
      startTime: new Date(range.startTime),
      endTime: new Date(range.endTime)
    });
  }

  deleteUrl(details: Url): Promise<void> {
    return this.history.deleteUrl(details);
  }

  getVisits(details: Url): Promise<VisitItem[]> {
    return this.history.getVisits(details);
  }

  search(query: HistoryQuery): Promise<HistoryItem[]> {
    return this.history.search(query);
  }
}
