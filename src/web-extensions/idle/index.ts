import { ChromeIdleService } from "./chrome";
import { IdleService } from "./types";

/**
 * Initialize service for interacting with browser idle state & events
 *
 * @returns `IdleService` object or `undefined` if the browser does not support
 * interactions with browser idle state & events.
 */
export function InitIdleService(): IdleService | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
      return new ChromeIdleService();
    default:
      return undefined;
  }
}
