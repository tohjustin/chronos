import {
  ChromeIdleAPI,
  IdleService,
  IdleState,
  IdleStateChangeEvent,
  IdleStateChangeEventCallback
} from "./types";

export class ChromeIdleService implements IdleService {
  private idle: ChromeIdleAPI;
  public onStateChanged: IdleStateChangeEvent;

  constructor(idle: ChromeIdleAPI = chrome.idle) {
    this.idle = idle;
    this.onStateChanged = {
      addListener(callback: IdleStateChangeEventCallback): void {
        idle.onStateChanged.addListener(newState => {
          callback(newState as IdleState);
        });
      },
      hasListener(callback: IdleStateChangeEventCallback): boolean {
        return idle.onStateChanged.hasListener(newState => {
          callback(newState as IdleState);
        });
      },
      removeListener(callback: IdleStateChangeEventCallback): void {
        idle.onStateChanged.removeListener(newState => {
          callback(newState as IdleState);
        });
      }
    };
  }

  queryState(detectionIntervalInSeconds: number): Promise<IdleState> {
    return new Promise(resolve => {
      this.idle.queryState(detectionIntervalInSeconds, newState => {
        const temp = newState as IdleState;
        resolve(temp);
      });
    });
  }

  setDetectionInterval(intervalInSeconds: number): void {
    this.idle.setDetectionInterval(intervalInSeconds);
  }
}
