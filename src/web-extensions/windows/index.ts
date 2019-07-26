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
  const buildTarget = process.env.REACT_APP_BUILD_TARGET;
  switch (buildTarget) {
    case "chrome":
      return new ChromeWindowsService();
    case "firefox":
      return new FirefoxWindowsService();
    default:
      console.error(
        "[windows-service] InitWindowsService: Missing or unsupported build target",
        buildTarget
      );
      return undefined;
  }
}
