import Dexie from "dexie";

import { ActivityRecord, ActivityService } from "./types";

export const ACTIVITY_TABLE = "activity";

export class ChronosDatabase extends Dexie implements ActivityService {
  private [ACTIVITY_TABLE]: Dexie.Table<ActivityRecord, number>;

  public constructor() {
    super("ChronosDatabase");
    this.version(1).stores({
      [ACTIVITY_TABLE]: "++id, hostname, title, startTime, endTime"
    });

    this[ACTIVITY_TABLE] = this.table(ACTIVITY_TABLE);
  }

  public createRecord(
    url: string,
    favIconUrl: string,
    title: string,
    startTime: number,
    endTime: number
  ): Promise<number> {
    const { hostname, pathname, search } = new URL(url);
    return this[ACTIVITY_TABLE].add({
      url,
      hostname,
      pathname,
      search,
      favIconUrl,
      title,
      startTime,
      endTime
    });
  }

  public fetchAllRecords(): Promise<ActivityRecord[]> {
    return this[ACTIVITY_TABLE].toCollection().toArray();
  }
}

/**
 * Initialize database for interacting with browser storage
 *
 * @returns `ChronosDatabase` object or `undefined` if the browser does not
 * support interactions with browser storage.
 */
export function InitChronosDatabase(): ChronosDatabase | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
    case "firefox":
      return new ChronosDatabase();
    default:
      return undefined;
  }
}
