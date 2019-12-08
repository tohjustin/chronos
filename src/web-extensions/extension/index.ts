import { IS_CHROMIUM, IS_FIREFOX } from "../../utils/browserUtils";

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
  switch (true) {
    case IS_CHROMIUM:
      return new ChromeExtensionService();
    case IS_FIREFOX:
      return new FirefoxExtensionService();
    default:
      console.error(
        "[extension-service] Only Chromium or Firefox based browsers are supported"
      );
      return undefined;
  }
}
