import Dexie from "dexie";

import {
  ActivityRecord,
  ActivityService,
  DatabaseRecords,
  DataMigrationService
} from "./types";
import { exportTableRecords } from "./utils";

export const ACTIVITY_TABLE = "activity";

export class Database extends Dexie
  implements ActivityService, DataMigrationService {
  private [ACTIVITY_TABLE]: Dexie.Table<ActivityRecord, number>;

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

  public fetchAllActivityRecords(): Promise<ActivityRecord[]> {
    return this[ACTIVITY_TABLE].toCollection().toArray();
  }

  public async exportDatabaseRecords(): Promise<DatabaseRecords> {
    return {
      [ACTIVITY_TABLE]: await exportTableRecords<ActivityRecord>(
        this[ACTIVITY_TABLE]
      )
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
