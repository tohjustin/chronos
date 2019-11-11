import Dexie from "dexie";

import { Activity, ActivityRecord } from "../models/activity";
import { DefiniteTimeRange } from "../models/time";

import {
  ActivityService,
  DatabaseRecords,
  DataMigrationService
} from "./types";
import { exportTableRecords } from "./utils";

export const ACTIVITY_TABLE = "activity";

export class DatabaseConnection extends Dexie
  implements ActivityService, DataMigrationService {
  private [ACTIVITY_TABLE]: Dexie.Table<Activity, number>;

  public constructor() {
    super("Database");
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

  public deleteActivityRecords(recordIds: number[]): Promise<void> {
    return this[ACTIVITY_TABLE].bulkDelete(recordIds);
  }

  public fetchAllActivityRecords(): Promise<ActivityRecord[]> {
    return this[ACTIVITY_TABLE].toCollection().toArray();
  }

  public fetchActivityTimeRange(): Promise<DefiniteTimeRange | null> {
    return Promise.all([
      this[ACTIVITY_TABLE].orderBy("startTime").first(),
      this[ACTIVITY_TABLE].orderBy("startTime").last()
    ] as Promise<Activity | undefined>[]).then(values => {
      const [oldestRecord, newestRecord] = values;
      return !oldestRecord || !newestRecord
        ? null
        : {
            start: oldestRecord.startTime,
            end: newestRecord.endTime
          };
    });
  }

  public async exportDatabaseRecords(): Promise<DatabaseRecords> {
    const activityTableRecords = (await exportTableRecords<Activity>(
      this[ACTIVITY_TABLE]
    )).map(record => {
      delete record.id;
      return record;
    });

    return {
      [ACTIVITY_TABLE]: activityTableRecords
    };
  }

  public async importDatabaseRecords(data: DatabaseRecords): Promise<void> {
    const totalRecordCount = data[ACTIVITY_TABLE].length;

    try {
      // TODO: Clear existing records before importing
      await this[ACTIVITY_TABLE].bulkAdd(data[ACTIVITY_TABLE]);
      console.log(
        `[db] ${totalRecordCount} records were imported successfully`
      );
    } catch (err) {
      if (err instanceof Dexie.BulkError) {
        const successRecordCount = totalRecordCount - err.failures.length;
        console.error(
          `[db] ${successRecordCount} out of ${totalRecordCount} records were imported successfully`
        );
      } else {
        console.error(`[db] ${err}`);
      }
    }
  }
}

/**
 * Initialize database connection for interacting with browser storage
 *
 * @returns `DatabaseConnection` object or `undefined` if the browser does not
 * support interactions with browser storage.
 */
export function InitDatabaseConnection(): DatabaseConnection | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
    case "firefox":
      return new DatabaseConnection();
    case undefined:
      console.warn("[db] Missing build target");
      return undefined;
    default:
      console.error(
        "[db] Invalid build target specified:",
        process.env.REACT_APP_BUILD_TARGET
      );
      return undefined;
  }
}
