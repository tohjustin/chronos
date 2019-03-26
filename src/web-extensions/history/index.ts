import { ChromeHistoryService } from "./chrome";
import { FirefoxHistoryService } from "./firefox";
import { HistoryService } from "./types";

/**
 * Initialize service for interacting with browser history
 *
 * @returns `HistoryService` object or `undefined` if the browser does not
 * support interactions with browser history.
 */
export function InitHistoryService(): HistoryService | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
      return new ChromeHistoryService();
    case "firefox":
      return new FirefoxHistoryService();
    default:
      return undefined;
  }
}
