import { Tab } from "../tabs/types";

/**
 * An object which allows the addition and removal of listeners for a browser
 * action event.
 */
export interface BrowserActionEvent<T extends Function> {
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

export type BrowserActionClickEventCallback = (tab: Tab) => void;

export type BrowserActionClickEvent = BrowserActionEvent<
  BrowserActionClickEventCallback
>;

/** Service for interacting with browser action events */
export interface BrowserActionService {
  /** Fired when a browser action icon is clicked. This event will not fire if the browser action has a popup. */
  onClicked: BrowserActionClickEvent;
}

/** An object implementing a subset of Chrome Extension Browser Action API */
export interface ChromeBrowserActionAPI {
  onClicked: chrome.browserAction.BrowserClickedEvent;
}

/** An object implementing a subset of Web Extension Browser Action API (Firefox) */
export interface FirefoxBrowserActionAPI {
  onClicked: WebExtEvent<(tab: browser.tabs.Tab) => void>;
}
