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
  const buildTarget = process.env.REACT_APP_BUILD_TARGET;
  switch (buildTarget) {
    case "chrome":
      return new ChromeIdleService();
    case "firefox":
      return new FirefoxIdleService();
    default:
      console.error(
        "[idle-service] InitIdleService: Missing or unsupported build target",
        buildTarget
      );
      return undefined;
  }
}
