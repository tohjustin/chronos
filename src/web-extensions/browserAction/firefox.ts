import {
  BrowserActionClickEvent,
  BrowserActionClickEventCallback,
  BrowserActionService,
  FirefoxBrowserActionAPI
} from "./types";

export class FirefoxBrowserActionService implements BrowserActionService {
  private browserAction: FirefoxBrowserActionAPI;
  public onClicked: BrowserActionClickEvent;

  constructor(browserAction: FirefoxBrowserActionAPI = browser.browserAction) {
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
