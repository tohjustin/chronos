/** Service for interacting with browser extension APIs & events */
export interface ExtensionService {
  /**
   * Converts a relative path within an extension install directory to a fully-qualified URL.
   * @param path A path to a resource within an extension expressed relative to its install directory.
   * @returns The fully-qualified URL to the resource.
   */
  getURL(path: string): string;
}

/** An object implementing a subset of Chrome Extension Idle API */
export interface ChromeExtensionAPI {
  getURL(path: string): string;
}

/** An object implementing a subset of Web Extension Idle API (Firefox) */
export interface FirefoxExtensionAPI {
  getURL(path: string): string;
}
