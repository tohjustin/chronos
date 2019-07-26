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
  const buildTarget = process.env.REACT_APP_BUILD_TARGET;
  switch (buildTarget) {
    case "chrome":
      return new ChromeHistoryService();
    case "firefox":
      return new FirefoxHistoryService();
    default:
      console.error(
        "[history-service] InitHistoryService: Missing or unsupported build target",
        buildTarget
      );
      return undefined;
  }
}
