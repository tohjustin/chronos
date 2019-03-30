import { FirefoxTabsService } from "./firefox";
import { TabsService } from "./types";

/**
 * Initialize service for interacting with browser tabs
 *
 * @returns `TabsService` object or `undefined` if the browser does not support
 * interactions with browser tabs.
 */
export function InitTabsService(): TabsService | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "firefox":
      return new FirefoxTabsService();
    default:
      return undefined;
  }
}
