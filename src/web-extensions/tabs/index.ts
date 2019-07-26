import { ChromeTabsService } from "./chrome";
import { FirefoxTabsService } from "./firefox";
import { TabsService } from "./types";

/**
 * Initialize service for interacting with browser tabs
 *
 * @returns `TabsService` object or `undefined` if the browser does not support
 * interactions with browser tabs.
 */
export function InitTabsService(): TabsService | undefined {
  const buildTarget = process.env.REACT_APP_BUILD_TARGET;
  switch (buildTarget) {
    case "chrome":
      return new ChromeTabsService();
    case "firefox":
      return new FirefoxTabsService();
    default:
      console.error(
        "[tabs-service] InitTabsService: Missing or unsupported build target",
        buildTarget
      );
      return undefined;
  }
}
