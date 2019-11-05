import { ChromeBrowserActionService } from "./chrome";
import { FirefoxBrowserActionService } from "./firefox";
import { BrowserActionService } from "./types";

/**
 * Initialize service for interacting with browser action events
 *
 * @returns `BrowserActionService` object or `undefined` if the browser does not support
 * interactions with browser idle state & events.
 */
export function InitBrowserActionService(): BrowserActionService | undefined {
  const buildTarget = process.env.REACT_APP_BUILD_TARGET;
  switch (buildTarget) {
    case "chrome":
      return new ChromeBrowserActionService();
    case "firefox":
      return new FirefoxBrowserActionService();
    default:
      console.error(
        "[idle-service] InitBrowserActionService: Missing or unsupported build target",
        buildTarget
      );
      return undefined;
  }
}
