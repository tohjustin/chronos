import { CHROME_WINDOW_ID_NONE, ChromeWindowsService } from "./chrome";
import { FIREFOX_WINDOW_ID_NONE, FirefoxWindowsService } from "./firefox";
import { WindowsService } from "./types";

function getWindowIdNone(): number {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
      return CHROME_WINDOW_ID_NONE;
    case "firefox":
      return FIREFOX_WINDOW_ID_NONE;
    default:
      return -1;
  }
}

/** The `windowId` value that represents the absence of a browser window. */
export const WINDOW_ID_NONE = getWindowIdNone();

/**
 * Initialize service for interacting with browser windows
 *
 * @returns `WindowsService` object or `undefined` if the browser does not
 * support interactions with browser windows.
 */
export function InitWindowsService(): WindowsService | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
      return new ChromeWindowsService();
    case "firefox":
      return new FirefoxWindowsService();
    default:
      return undefined;
  }
}
