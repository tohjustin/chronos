import {
  BrowserWindow,
  BrowserWindowFocusChangedEvent,
  BrowserWindowFocusChangedEventCallback,
  FirefoxWindowsAPI,
  WindowsService
} from "./types";

export class FirefoxWindowsService implements WindowsService {
  private windows: FirefoxWindowsAPI;

  public WINDOW_ID_NONE: number;
  public onFocusChanged: BrowserWindowFocusChangedEvent;

  constructor(windows: FirefoxWindowsAPI = browser.windows) {
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
    return this.windows.get(windowId, { populate: true });
  }
}
