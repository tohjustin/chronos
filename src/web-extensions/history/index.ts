import { IS_CHROMIUM, IS_FIREFOX } from "../../utils/browserUtils";

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
  switch (true) {
    case IS_CHROMIUM:
      return new ChromeHistoryService();
    case IS_FIREFOX:
      return new FirefoxHistoryService();
    default:
      console.error(
        "[history-service] Only Chromium or Firefox based browsers are supported"
      );
      return undefined;
  }
}
