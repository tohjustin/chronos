import { IS_CHROMIUM, IS_FIREFOX } from "../../utils/browserUtils";

import { ChromeIdleService } from "./chrome";
import { FirefoxIdleService } from "./firefox";
import { IdleService } from "./types";

/**
 * Initialize service for interacting with browser idle state & events
 *
 * @returns `IdleService` object or `undefined` if the browser does not support
 * interactions with browser idle state & events.
 */
export function InitIdleService(): IdleService | undefined {
  switch (true) {
    case IS_CHROMIUM:
      return new ChromeIdleService();
    case IS_FIREFOX:
      return new FirefoxIdleService();
    default:
      console.error(
        "[idle-service] Only Chromium or Firefox based browsers are supported"
      );
      return undefined;
  }
}
