import { IS_CHROMIUM, IS_FIREFOX } from "../../utils/browserUtils";

import { ChromeWindowsService } from "./chrome";
import { FirefoxWindowsService } from "./firefox";
import { WindowsService } from "./types";

/**
 * Initialize service for interacting with browser windows
 *
 * @returns `WindowsService` object or `undefined` if the browser does not
 * support interactions with browser windows.
 */
export function InitWindowsService(): WindowsService | undefined {
  switch (true) {
    case IS_CHROMIUM:
      return new ChromeWindowsService();
    case IS_FIREFOX:
      return new FirefoxWindowsService();
    default:
      console.error(
        "[windows-service] Only Chromium or Firefox based browsers are supported"
      );
      return undefined;
  }
}
