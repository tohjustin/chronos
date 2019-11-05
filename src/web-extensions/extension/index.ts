import { ChromeExtensionService } from "./chrome";
import { FirefoxExtensionService } from "./firefox";
import { ExtensionService } from "./types";

/**
 * Initialize service for interacting with browser extension APIs & events
 *
 * @returns `ExtensionService` object or `undefined` if the browser does not support
 * interactions with browser extension APIs & events.
 */
export function InitExtensionService(): ExtensionService | undefined {
  const buildTarget = process.env.REACT_APP_BUILD_TARGET;
  switch (buildTarget) {
    case "chrome":
      return new ChromeExtensionService();
    case "firefox":
      return new FirefoxExtensionService();
    default:
      console.error(
        "[extension-service] InitExtensionService: Missing or unsupported build target",
        buildTarget
      );
      return undefined;
  }
}
