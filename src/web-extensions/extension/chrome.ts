import { ChromeExtensionAPI, ExtensionService } from "./types";

export class ChromeExtensionService implements ExtensionService {
  private extension: ChromeExtensionAPI;

  constructor(extension: ChromeExtensionAPI = chrome.extension) {
    this.extension = extension;
  }

  getURL(path: string): string {
    return this.extension.getURL(path);
  }
}
