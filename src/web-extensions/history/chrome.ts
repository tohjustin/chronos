import {
  ChromeHistoryAPI,
  HistoryItem,
  HistoryQuery,
  HistoryService,
  Range,
  TransitionType,
  Url,
  VisitItem
} from "./types";

export class ChromeHistoryService implements HistoryService {
  private history: ChromeHistoryAPI;

  constructor(history: ChromeHistoryAPI = chrome.history) {
    this.history = history;
  }

  addUrl(details: Url): Promise<void> {
    return new Promise(resolve => {
      this.history.addUrl(details, resolve);
    });
  }

  deleteAll(): Promise<void> {
    return new Promise(resolve => {
      this.history.deleteAll(resolve);
    });
  }

  deleteRange(range: Range): Promise<void> {
    return new Promise(resolve => {
      this.history.deleteRange(range, resolve);
    });
  }

  deleteUrl(details: Url): Promise<void> {
    return new Promise(resolve => {
      this.history.deleteUrl(details, resolve);
    });
  }

  getVisits(details: Url): Promise<VisitItem[]> {
    return new Promise(resolve => {
      this.history.getVisits(details, visitItems => {
        const items = visitItems.map(item => ({
          ...item,
          transition: item.transition as TransitionType
        }));
        resolve(items);
      });
    });
  }

  search(query: HistoryQuery): Promise<HistoryItem[]> {
    return new Promise(resolve => {
      this.history.search(query, resolve);
    });
  }
}
