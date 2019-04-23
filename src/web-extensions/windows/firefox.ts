import {
  BrowserWindow,
  BrowserWindowFocusChangedEvent,
  BrowserWindowFocusChangedEventCallback,
  FirefoxWindowsAPI,
  WindowsService
} from "./types";

/** The `windowId` value that represents the absence of a browser window. */
export const FIREFOX_WINDOW_ID_NONE = browser.windows.WINDOW_ID_NONE;

export class FirefoxWindowsService implements WindowsService {
  private windows: FirefoxWindowsAPI;

  public onFocusChanged: BrowserWindowFocusChangedEvent;

  constructor(windows: FirefoxWindowsAPI = browser.windows) {
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
    return this.windows.get(windowId, { populate: true });
  }
}
