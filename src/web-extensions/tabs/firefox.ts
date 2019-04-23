import {
  FirefoxTabsAPI,
  Tab,
  TabActivatedEvent,
  TabActivatedEventCallback,
  TabRemovedEvent,
  TabRemovedEventCallback,
  TabsService,
  TabUpdatedEvent,
  TabUpdatedEventCallback
} from "./types";

export class FirefoxTabsService implements TabsService {
  private tabs: FirefoxTabsAPI;
  public onActivated: TabActivatedEvent;
  public onRemoved: TabRemovedEvent;
  public onUpdated: TabUpdatedEvent;

  constructor(tabs: FirefoxTabsAPI = browser.tabs) {
    this.tabs = tabs;
    this.onActivated = {
      addListener(callback: TabActivatedEventCallback): void {
        tabs.onActivated.addListener(callback);
      },
      hasListener(callback: TabActivatedEventCallback): boolean {
        return tabs.onActivated.hasListener(callback);
      },
      removeListener(callback: TabActivatedEventCallback): void {
        tabs.onActivated.removeListener(callback);
      }
    };
    this.onRemoved = {
      addListener(callback: TabRemovedEventCallback): void {
        tabs.onRemoved.addListener(callback);
      },
      hasListener(callback: TabRemovedEventCallback): boolean {
        return tabs.onRemoved.hasListener(callback);
      },
      removeListener(callback: TabRemovedEventCallback): void {
        tabs.onRemoved.removeListener(callback);
      }
    };
    this.onUpdated = {
      addListener(callback: TabUpdatedEventCallback): void {
        tabs.onUpdated.addListener(callback);
      },
      hasListener(callback: TabUpdatedEventCallback): boolean {
        return tabs.onUpdated.hasListener(callback);
      },
      removeListener(callback: TabUpdatedEventCallback): void {
        tabs.onUpdated.removeListener(callback);
      }
    };
  }

  get(tabId: number): Promise<Tab> {
    return this.tabs.get(tabId);
  }
}
