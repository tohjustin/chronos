import {
  HistoryItem,
  HistoryQuery,
  HistoryService,
  Range,
  TransitionType,
  Url,
  VisitItem
} from "./types";

export default class ChromeHistoryService implements HistoryService {
  addUrl(details: Url): Promise<void> {
    return new Promise(resolve => {
      chrome.history.addUrl(details, resolve);
    });
  }

  deleteAll(): Promise<void> {
    return new Promise(resolve => {
      chrome.history.deleteAll(resolve);
    });
  }

  deleteRange(range: Range): Promise<void> {
    return new Promise(resolve => {
      chrome.history.deleteRange(range, resolve);
    });
  }

  deleteUrl(details: Url): Promise<void> {
    return new Promise(resolve => {
      chrome.history.deleteUrl(details, resolve);
    });
  }

  getVisits(details: Url): Promise<VisitItem[]> {
    return new Promise(resolve => {
      chrome.history.getVisits(details, visitItems => {
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
      chrome.history.search(query, resolve);
    });
  }
}
