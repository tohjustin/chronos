import Dexie from "dexie";

import { ActivityRecord, ActivityService } from "./types";

export const ACTIVITY_TABLE = "activity";

export class Database extends Dexie implements ActivityService {
  private [ACTIVITY_TABLE]: Dexie.Table<ActivityRecord, number>;

  public constructor() {
    super("ChronosDatabase");
    this.version(1).stores({
      [ACTIVITY_TABLE]: "++id, origin, title, startTime, endTime"
    });

    this[ACTIVITY_TABLE] = this.table(ACTIVITY_TABLE);
  }

  public createActivityRecord(
    url: string,
    favIconUrl: string,
    title: string,
    startTime: number,
    endTime: number
  ): Promise<number> {
    const { hash, origin, pathname, search } = new URL(url);
    return this[ACTIVITY_TABLE].add({
      url,
      origin,
      pathname,
      search,
      hash,
      favIconUrl,
      title,
      startTime,
      endTime
    });
  }

  public fetchAllActivityRecords(): Promise<ActivityRecord[]> {
    return this[ACTIVITY_TABLE].toCollection().toArray();
  }
}

/**
 * Initialize database for interacting with browser storage
 *
 * @returns `Database` object or `undefined` if the browser does not
 * support interactions with browser storage.
 */
export function InitDatabase(): Database | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
    case "firefox":
      return new Database();
    default:
      return undefined;
  }
}
