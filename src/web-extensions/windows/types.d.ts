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
  /**
   * Gets details about a window.
   * @since Chrome 18.
   */
  get(
    windowId: number,
    getInfo: chrome.windows.GetInfo,
    callback: (window: chrome.windows.BrowserWindow) => void
  ): void;

  /**
   * Fired when the currently focused window changes. Will be
   * `chrome.windows.WINDOW_ID_NONE` if all chrome windows have lost focus.
   *
   * Note: On some Linux window managers, `WINDOW_ID_NONE` will always be sent
   * immediately preceding a switch from one chrome window to another.
   */
  onFocusChanged: chrome.windows.WindowIdEvent;
}

/** An object implementing a subset of Web Extensions Windows API (Firefox) */
export interface FirefoxWindowsAPI {
  /** Gets details about a window. */
  get(
    windowId: number,
    getInfo?: browser.windows.GetInfo
  ): Promise<browser.windows.Window>;

  /**
   * Fired when the currently focused window changes. Will be
   * `windows.WINDOW_ID_NONE` if all browser windows have lost focus.
   *
   * Note: On some Linux window managers, `WINDOW_ID_NONE` will always be sent
   * immediately preceding a switch from one browser window to another.
   * @param windowId ID of the newly focused window.
   */
  onFocusChanged: WebExtEvent<(windowId: number) => void>;
}
