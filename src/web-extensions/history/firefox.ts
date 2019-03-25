import {
  HistoryItem,
  HistoryQuery,
  HistoryService,
  Range,
  TransitionType,
  Url,
  VisitItem
} from "./types";

export default class FirefoxHistoryService implements HistoryService {
  addUrl(details: {
    url: string;
    title?: string;
    transition?: TransitionType;
    visitTime?: number;
  }): Promise<void> {
    return browser.history.addUrl(details);
  }

  deleteAll(): Promise<void> {
    return browser.history.deleteAll();
  }

  deleteRange(range: Range): Promise<void> {
    return browser.history.deleteRange({
      startTime: new Date(range.startTime),
      endTime: new Date(range.endTime)
    });
  }

  deleteUrl(details: Url): Promise<void> {
    return browser.history.deleteUrl(details);
  }

  getVisits(details: Url): Promise<VisitItem[]> {
    return browser.history.getVisits(details);
  }

  search(query: HistoryQuery): Promise<HistoryItem[]> {
    return browser.history.search(query);
  }
}
