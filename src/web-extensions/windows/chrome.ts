import {
  BrowserWindow,
  BrowserWindowFocusChangedEvent,
  BrowserWindowFocusChangedEventCallback,
  ChromeWindowsAPI,
  WindowsService
} from "./types";

export class ChromeWindowsService implements WindowsService {
  private windows: ChromeWindowsAPI;

  public WINDOW_ID_NONE: number;
  public onFocusChanged: BrowserWindowFocusChangedEvent;

  constructor(windows: ChromeWindowsAPI = chrome.windows) {
    this.windows = windows;
    this.WINDOW_ID_NONE = windows.WINDOW_ID_NONE;
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
