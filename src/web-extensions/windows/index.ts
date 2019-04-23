import { ChromeWindowsService } from "./chrome";
import { FirefoxWindowsService } from "./firefox";
import { WindowsService } from "./types";

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
