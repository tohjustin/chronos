import {
  BrowserActionService,
  BrowserActionClickEvent,
  BrowserActionClickEventCallback,
  ChromeBrowserActionAPI
} from "./types";

export class ChromeBrowserActionService implements BrowserActionService {
  private browserAction: ChromeBrowserActionAPI;
  public onClicked: BrowserActionClickEvent;

  constructor(browserAction: ChromeBrowserActionAPI = chrome.browserAction) {
    this.browserAction = browserAction;
    this.onClicked = {
      addListener(callback: BrowserActionClickEventCallback): void {
        browserAction.onClicked.addListener(callback);
      },
      hasListener(callback: BrowserActionClickEventCallback): boolean {
        return browserAction.onClicked.hasListener(callback);
      },
      removeListener(callback: BrowserActionClickEventCallback): void {
        browserAction.onClicked.removeListener(callback);
      }
    };
  }
}
