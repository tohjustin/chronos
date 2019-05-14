/**
 * An object which allows the addition and removal of listeners for an idle
 * event.
 */
export interface IdleEvent<T extends Function> {
  /**
   * Registers an event listener callback to an event.
   * @param callback Called when an event occurs. The parameters of this
   * function depend on the type of event. The callback parameter should be a
   * function that looks like this: `function() {...};`
   */
  addListener(callback: T): void;
  /**
   * @param callback Listener whose registration status shall be tested.
   */
  hasListener(callback: T): boolean;
  /**
   * Deregisters an event listener callback from an event.
   * @param callback Listener that shall be unregistered. The callback parameter
   * should be a function that looks like this: `function() {...};`
   */
  removeListener(callback: T): void;
}

export type IdleState = "active" | "idle" | "locked";

export type IdleStateChangeEventCallback = (newState: IdleState) => void;

export type IdleStateChangeEvent = IdleEvent<IdleStateChangeEventCallback>;

/** Service for interacting with browser idle state & events */
export interface IdleService {
  /**
   * Returns "idle" if the user has not generated any input for a specified
   * number of seconds, or "active" otherwise.
   *
   * @param detectionIntervalInSeconds The system is considered idle if
   * `detectionIntervalInSeconds` seconds have elapsed since the last user input
   * detected.
   */
  queryState(detectionIntervalInSeconds: number): Promise<IdleState>;

  /**
   * Sets the interval, in seconds, used to determine when the system is in an
   * idle state for `onStateChanged` events.
   * The default interval is 60 seconds.
   * @param intervalInSeconds Threshold, in seconds, used to determine when the
   * system is in an idle state.
   */
  setDetectionInterval(intervalInSeconds: number): void;

  /**
   * Fired when the system changes to an active or idle state. The event fires
   * with `"idle"` if the the user has not generated any input for a specified
   * number of seconds, and `"active"` when the user generates input on an idle
   * system.
   */
  onStateChanged: IdleStateChangeEvent;
}

/** An object implementing a subset of Chrome Extension Idle API */
export interface ChromeIdleAPI {
  /**
   * Returns "locked" if the system is locked, "idle" if the user has not
   * generated any input for a specified number of seconds, or "active"
   * otherwise.
   * @param detectionIntervalInSeconds The system is considered idle if
   * detectionIntervalInSeconds seconds have elapsed since the last user input
   * detected.
   * Since Chrome 25.
   * @param callback The callback parameter should be a function that looks like
   * this: `function(IdleState newState) {...}`;
   */
  queryState(
    detectionIntervalInSeconds: number,
    callback: (newState: string) => void
  ): void;

  /**
   * Sets the interval, in seconds, used to determine when the system is in an
   * idle state for onStateChanged events. The default interval is 60 seconds.
   * @since Chrome 25.
   * @param intervalInSeconds Threshold, in seconds, used to determine when the
   * system is in an idle state.
   */
  setDetectionInterval(intervalInSeconds: number): void;

  /**
   * Fired when the system changes to an active, idle or locked state. The event
   * fires with "locked" if the screen is locked or the screensaver activates,
   * "idle" if the system is unlocked and the user has not generated any input
   * for a specified number of seconds, and "active" when the user generates
   * input on an idle system.
   */
  onStateChanged: chrome.idle.IdleStateChangedEvent;
}

/** An object implementing a subset of Web Extension Idle API (Firefox) */
export interface FirefoxIdleAPI {
  /**
   * Returns "idle" if the user has not generated any input for a specified
   * number of seconds, or "active" otherwise.
   * @param detectionIntervalInSeconds The system is considered idle if
   * detectionIntervalInSeconds seconds have elapsed since the last user input
   * detected.
   */
  queryState(detectionIntervalInSeconds: number): Promise<IdleState>;

  /**
   * Sets the interval, in seconds, used to determine when the system is in an
   * idle state for onStateChanged events.
   * The default interval is 60 seconds.
   * @param intervalInSeconds Threshold, in seconds, used to determine when the
   * system is in an idle state.
   */
  setDetectionInterval(intervalInSeconds: number): void;

  /**
   * Fired when the system changes to an active or idle state. The event fires
   * with "idle" if the the user has not generated any input for a specified
   * number of seconds, and "active" when the user generates input on an idle
   * system.
   */
  onStateChanged: WebExtEvent<(newState: IdleState) => void>;
}
