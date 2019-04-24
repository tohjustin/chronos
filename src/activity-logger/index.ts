import { InitChronosDatabase } from "../db";
import { ActivityService } from "../db/types";
import { InitTabsService } from "../web-extensions/tabs";
import {
  Tab,
  TabChangeInfo,
  TabsService,
  TabActiveInfo
} from "../web-extensions/tabs/types";
import { InitWindowsService } from "../web-extensions/windows";
import { WindowsService } from "../web-extensions/windows/types";

export interface Activity {
  endTime: number;
  favIconUrl: string;
  startTime: number;
  title: string;
  url: string;
}

export interface ActivityLoggerDependencies {
  activityService: ActivityService;
  tabsService: TabsService;
  windowsService: WindowsService;
}

export interface TabWithRequiredFields extends Tab {
  favIconUrl: string;
  title: string;
  url: string;
}

const EMPTY_ACTIVITY = {
  url: "",
  favIconUrl: "",
  title: "",
  startTime: 0,
  endTime: 0
};

export class ActivityLogger {
  private activityService: ActivityService;
  private tabsService: TabsService;
  private windowsService: WindowsService;

  public currentActivity: Activity;

  constructor(dependencies: ActivityLoggerDependencies) {
    this.activityService = dependencies.activityService;
    this.tabsService = dependencies.tabsService;
    this.windowsService = dependencies.windowsService;

    this.currentActivity = EMPTY_ACTIVITY;
  }

  private hasActiveActivity(activity: Activity): boolean {
    return activity.url !== EMPTY_ACTIVITY.url;
  }

  private hasSwitchedToValidTab(tab: Tab): tab is TabWithRequiredFields {
    return (
      tab &&
      tab.active &&
      tab.favIconUrl !== undefined &&
      tab.title !== undefined &&
      tab.url !== undefined &&
      tab.url !== this.currentActivity.url
    );
  }

  private handleTabsOnActivated = async (
    activeInfo: TabActiveInfo
  ): Promise<void> => {
    const tab = await this.tabsService.get(activeInfo.tabId);
    if (this.hasSwitchedToValidTab(tab)) {
      const activity = { ...this.currentActivity, endTime: Date.now() };
      this.currentActivity = {
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        title: tab.title,
        startTime: activity.endTime + 1,
        endTime: 0
      };

      if (this.hasActiveActivity(activity)) {
        await this.log(activity);
      }
    }
  };

  private handleTabsOnUpdated = async (
    tabId: number,
    changeInfo: TabChangeInfo,
    tab: Tab
  ): Promise<void> => {
    if (this.hasSwitchedToValidTab(tab)) {
      const activity = { ...this.currentActivity, endTime: Date.now() };
      this.currentActivity = {
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        title: tab.title,
        startTime: activity.endTime + 1,
        endTime: 0
      };

      if (this.hasActiveActivity(activity)) {
        await this.log(activity);
      }
    }
  };

  private handleWindowsOnFocusChange = async (
    windowId: number
  ): Promise<void> => {
    // When browser window is being defocused
    if (windowId === this.windowsService.WINDOW_ID_NONE) {
      const activity = { ...this.currentActivity, endTime: Date.now() };
      this.currentActivity = EMPTY_ACTIVITY;

      if (this.hasActiveActivity(activity)) {
        await this.log(activity);
      }
      return;
    }

    const { tabs = [] } = await this.windowsService.get(windowId);
    const activeTab: Tab = tabs.find(tab => tab.active);
    if (this.hasSwitchedToValidTab(activeTab)) {
      const activity = { ...this.currentActivity, endTime: Date.now() };
      this.currentActivity = {
        url: activeTab.url,
        favIconUrl: activeTab.favIconUrl,
        title: activeTab.title,
        startTime: activity.endTime + 1,
        endTime: 0
      };

      if (this.hasActiveActivity(activity)) {
        await this.log(activity);
      }
    }
  };

  /**
   * Logs current activity, activity will not be logged if URL matches any
   * blacklisted domains
   */
  private async log({
    url,
    favIconUrl,
    title,
    startTime,
    endTime
  }: Activity): Promise<void> {
    // TODO: Add logic to exclude tracking user-defined blacklisted domains
    try {
      await this.activityService.createRecord(
        url,
        favIconUrl,
        title,
        startTime,
        endTime
      );
    } catch (e) {
      console.error("[activity-logger]:", e.stack || e);
    }
  }

  /**
   * Register event-handlers to start logging web browsing activity
   */
  public run(): void {
    this.tabsService.onActivated.addListener(this.handleTabsOnActivated);
    this.tabsService.onUpdated.addListener(this.handleTabsOnUpdated);
    this.windowsService.onFocusChanged.addListener(
      this.handleWindowsOnFocusChange
    );
  }
}

/**
 * Initialize activity logger & all its related dependencies
 */
export function InitActivityLogger(): void {
  // Initialize all dependencies
  const db = InitChronosDatabase();
  const activityService = db;
  const tabsService = InitTabsService();
  const windowsService = InitWindowsService();

  if (activityService && tabsService && windowsService) {
    const logger = new ActivityLogger({
      activityService,
      tabsService,
      windowsService
    });
    logger.run();
  }
}
