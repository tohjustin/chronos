import {
  FirefoxIdleAPI,
  IdleService,
  IdleState,
  IdleStateChangeEvent,
  IdleStateChangeEventCallback
} from "./types";

export class FirefoxIdleService implements IdleService {
  private idle: FirefoxIdleAPI;
  public onStateChanged: IdleStateChangeEvent;

  constructor(idle: FirefoxIdleAPI = browser.idle) {
    this.idle = idle;
    this.onStateChanged = {
      addListener(callback: IdleStateChangeEventCallback): void {
        idle.onStateChanged.addListener(callback);
      },
      hasListener(callback: IdleStateChangeEventCallback): boolean {
        return idle.onStateChanged.hasListener(callback);
      },
      removeListener(callback: IdleStateChangeEventCallback): void {
        idle.onStateChanged.removeListener(callback);
      }
    };
  }

  queryState(detectionIntervalInSeconds: number): Promise<IdleState> {
    return this.idle.queryState(detectionIntervalInSeconds);
  }

  setDetectionInterval(intervalInSeconds: number): void {
    this.idle.setDetectionInterval(intervalInSeconds);
  }
}
