import { InitDatabase } from "../db";
import { ActivityService } from "../db/types";
import { InitIdleService } from "../web-extensions/idle";
import { IdleService, IdleState } from "../web-extensions/idle/types";
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
  idleService: IdleService;
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
const IDLE_DETECTION_INTERVAL = 600; // 10 minutes

export class ActivityLogger {
  private activityService: ActivityService;
  private idleService: IdleService;
  private tabsService: TabsService;
  private windowsService: WindowsService;

  public currentActivity: Activity;

  constructor(dependencies: ActivityLoggerDependencies) {
    this.activityService = dependencies.activityService;
    this.idleService = dependencies.idleService;
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

  private handleIdleOnStateChanged = async (
    newState: IdleState
  ): Promise<void> => {
    if (!this.hasActiveActivity(this.currentActivity)) {
      return;
    }

    switch (newState) {
      case "active": {
        this.currentActivity.startTime = Date.now();
        break;
      }
      case "idle":
      case "locked": {
        const activity = { ...this.currentActivity, endTime: Date.now() };
        this.currentActivity.startTime = EMPTY_ACTIVITY.startTime;

        await this.log(activity);
        break;
      }
    }
  };

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

      await this.log(activity);
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

      await this.log(activity);
    }
  };

  private handleWindowsOnFocusChange = async (
    windowId: number
  ): Promise<void> => {
    // When browser window is being unfocused
    if (windowId === this.windowsService.WINDOW_ID_NONE) {
      const activity = { ...this.currentActivity, endTime: Date.now() };
      this.currentActivity = EMPTY_ACTIVITY;

      await this.log(activity);
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

      await this.log(activity);
    }
  };

  /**
   * Logs current activity, activity will not be logged if its URL is invalid or
   * matches any blacklisted domains
   */
  private async log(activity: Activity): Promise<void> {
    if (!this.hasActiveActivity(activity)) {
      return;
    }

    // TODO: Add logic to exclude tracking user-defined blacklisted domains
    try {
      await this.activityService.createActivityRecord(
        activity.url,
        activity.favIconUrl,
        activity.title,
        activity.startTime,
        activity.endTime
      );
    } catch (e) {
      console.error("[activity-logger]:", e.stack || e);
    }
  }

  /**
   * Set logging configuration & register event-handlers to start logging web
   * browsing activity
   */
  public run(): void {
    this.idleService.setDetectionInterval(IDLE_DETECTION_INTERVAL);

    this.idleService.onStateChanged.addListener(this.handleIdleOnStateChanged);
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
  const db = InitDatabase();
  const activityService = db;
  const idleService = InitIdleService();
  const tabsService = InitTabsService();
  const windowsService = InitWindowsService();

  if (activityService && idleService && tabsService && windowsService) {
    const logger = new ActivityLogger({
      activityService,
      idleService,
      tabsService,
      windowsService
    });
    logger.run();
  }
}
