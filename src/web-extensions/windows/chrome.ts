import {
  BrowserWindow,
  BrowserWindowFocusChangedEvent,
  BrowserWindowFocusChangedEventCallback,
  ChromeWindowsAPI,
  WindowsService
} from "./types";

/** The `windowId` value that represents the absence of a browser window. */
export const CHROME_WINDOW_ID_NONE = chrome.windows.WINDOW_ID_NONE;

export class ChromeWindowsService implements WindowsService {
  private windows: ChromeWindowsAPI;

  public onFocusChanged: BrowserWindowFocusChangedEvent;

  constructor(windows: ChromeWindowsAPI = chrome.windows) {
    this.windows = windows;
    this.onFocusChanged = {
      addListener(callback: BrowserWindowFocusChangedEventCallback): void {
        windows.onFocusChanged.addListener(callback);
      },
      hasListener(callback: BrowserWindowFocusChangedEventCallback): boolean {
        return windows.onFocusChanged.hasListener(callback);
      },
      removeListener(callback: BrowserWindowFocusChangedEventCallback): void {
        windows.onFocusChanged.removeListener(callback);
      }
    };
  }

  get(windowId: number): Promise<BrowserWindow> {
    return new Promise(resolve => {
      this.windows.get(windowId, { populate: true }, window => {
        resolve(window);
      });
    });
  }
}
