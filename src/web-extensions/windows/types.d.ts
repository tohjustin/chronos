/** The state of this browser window. */
export type BrowserWindowState =
  | "normal"
  | "minimized"
  | "maximized"
  | "fullscreen"
  | "docked";

/** The type of window. */
export type BrowserWindowType =
  | "normal"
  | "popup"
  | "panel"
  | "app"
  | "devtools";

export interface BrowserWindow {
  /** The ID of the window. */
  id?: number;
  /** Whether the window is currently the focused window. */
  focused: boolean;
  /** Array of `Tab` objects representing the current tabs in the window. */
  tabs?: Tab[];
  /** Whether the window is incognito. */
  incognito: boolean;
  /** The type of browser window this is. */
  type?: BrowserWindowType;
  /** The state of this browser window. */
  state?: BrowserWindowState;
  /** The title of the window. Read-only. */
  title?: string;
}

/**
 * An object which allows the addition and removal of listeners for a window
 * event.
 */
export interface BrowserWindowEvent<T extends Function> {
  /**
   * Registers an event listener callback to an event.
   * @param callback Called when an event occurs. The parameters of this
   * function depend on the type of event. The callback parameter should be a
   * function that looks like this: `function() {...};`
   */
  addListener(callback: T): void;
  /**
   * @param callback Listener whose registration status shall be tested.
   */
  hasListener(callback: T): boolean;
  /**
   * Deregisters an event listener callback from an event.
   * @param callback Listener that shall be unregistered. The callback parameter
   * should be a function that looks like this: `function() {...};`
   */
  removeListener(callback: T): void;
}

export type BrowserWindowFocusChangedEventCallback = (windowId: number) => void;

export type BrowserWindowFocusChangedEvent = BrowserWindowEvent<
  BrowserWindowFocusChangedEventCallback
>;

/** Service for interacting with browser windows */
export interface WindowsService {
  /** The windowId value that represents the absence of a browser window. */
  WINDOW_ID_NONE: number;

  /** Gets details about a window. */
  get(windowId: number): Promise<BrowserWindow>;

  /**
   * Fired when the currently focused window changes. Will be `WINDOW_ID_NONE`
   * if all browser windows have lost focus.
   */
  onFocusChanged: BrowserWindowFocusChangedEvent;
}

/** An object implementing a subset of Chrome Extension Windows API */
export interface ChromeWindowsAPI {
  WINDOW_ID_NONE: number;

  get(
    windowId: number,
    getInfo: chrome.windows.GetInfo,
    callback: (window: chrome.windows.BrowserWindow) => void
  ): void;

  onFocusChanged: chrome.windows.WindowIdEvent;
}

/** An object implementing a subset of Web Extensions Windows API (Firefox) */
export interface FirefoxWindowsAPI {
  WINDOW_ID_NONE: number;

  get(
    windowId: number,
    getInfo?: browser.windows.GetInfo
  ): Promise<browser.windows.Window>;

  onFocusChanged: WebExtEvent<(windowId: number) => void>;
}
