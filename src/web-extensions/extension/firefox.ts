import { ExtensionService, FirefoxExtensionAPI } from "./types";

export class FirefoxExtensionService implements ExtensionService {
  private extension: FirefoxExtensionAPI;

  constructor(extension: FirefoxExtensionAPI = chrome.extension) {
    this.extension = extension;
  }

  getURL(path: string): string {
    return this.extension.getURL(path);
  }
}
