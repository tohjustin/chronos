import Dexie from "dexie";

import { Activity, Domain, RawActivity } from "../models/activity";
import { DefiniteTimeRange, TimeRange } from "../models/time";

import {
  ActivityService,
  ActivityTableRecord,
  DatabaseRecords,
  DataMigrationService,
  DomainTableRecord,
  TitleTableRecord
} from "./types";
import { createUrl, exportTableRecords, generateRecords } from "./utils";

const DATABASE_NAME = "chronos_db";
export const ACTIVITY_TABLE = "activity";
export const DOMAIN_TABLE = "domain";
export const TITLE_TABLE = "title";

export class DatabaseConnection extends Dexie
  implements ActivityService, DataMigrationService {
  private [ACTIVITY_TABLE]: Dexie.Table<ActivityTableRecord, number>;
  private [DOMAIN_TABLE]: Dexie.Table<DomainTableRecord, number>;
  private [TITLE_TABLE]: Dexie.Table<TitleTableRecord, number>;

  public constructor() {
    super(DATABASE_NAME);
    this.version(1).stores({
      [ACTIVITY_TABLE]: "++id, domain, startTime, endTime",
      [DOMAIN_TABLE]: "id",
      [TITLE_TABLE]: "id"
    });

    this[ACTIVITY_TABLE] = this.table(ACTIVITY_TABLE);
    this[DOMAIN_TABLE] = this.table(DOMAIN_TABLE);
    this[TITLE_TABLE] = this.table(TITLE_TABLE);
  }

  private async getFavIconUrlMap(): Promise<Record<string, string>> {
    const domains = await this[DOMAIN_TABLE].toCollection().toArray();
    return domains.reduce(
      (acc: Record<string, string>, domain: DomainTableRecord) => {
        acc[domain.id] = domain.favIconUrl;
        return acc;
      },
      {}
    );
  }

  private async getTitleMap(): Promise<Record<string, string>> {
    const titles = await this[TITLE_TABLE].toCollection().toArray();
    return titles.reduce(
      (acc: Record<string, string>, title: TitleTableRecord) => {
        acc[title.id] = title.title;
        return acc;
      },
      {}
    );
  }

  public async createActivityRecord(rawActivity: RawActivity): Promise<void> {
    if (rawActivity.startTime >= rawActivity.endTime) {
      new Error(`[db]: Invalid time range, ${JSON.stringify(rawActivity)}`);
    }

    const { activity, domain, title } = generateRecords(rawActivity);
    try {
      await this.transaction(
        "rw",
        [this[ACTIVITY_TABLE], this[DOMAIN_TABLE], this[TITLE_TABLE]],
        async () => {
          await this[ACTIVITY_TABLE].add(activity);
          await this[DOMAIN_TABLE].put(domain);
          if (title) {
            await this[TITLE_TABLE].put(title);
          }
        }
      );
    } catch (err) {
      new Error(err);
    }
  }

  public deleteActivityRecords(recordIds: number[]): Promise<void> {
    return this[ACTIVITY_TABLE].bulkDelete(recordIds);
  }

  public async fetchAllActivityDomains(): Promise<Record<string, Domain>> {
    const domains = await this[DOMAIN_TABLE].toCollection().toArray();
    return domains.reduce(
      (acc: Record<string, Domain>, domain: DomainTableRecord) => {
        acc[domain.id] = domain;
        return acc;
      },
      {}
    );
  }

  public fetchAllActivityRecords(): Promise<Activity[]> {
    return this.fetchActivityRecords({ start: null, end: null });
  }

  public async fetchActivityRecords({
    start: startTime,
    end: endTime
  }: TimeRange): Promise<Activity[]> {
    let query;
    // Use Dexie's `WhereClause` as much as possible to leverage IndexedDB's
    // native querying support with is way faster than filtering with JS
    if (startTime && endTime) {
      query = this[ACTIVITY_TABLE].where("startTime")
        .aboveOrEqual(startTime)
        .and(record => record.endTime <= endTime);
    } else if (startTime) {
      query = this[ACTIVITY_TABLE].where("startTime").aboveOrEqual(startTime);
    } else if (endTime) {
      query = this[ACTIVITY_TABLE].where("endTime").belowOrEqual(endTime);
    } else {
      query = this[ACTIVITY_TABLE].toCollection();
    }

    const [
      activities,
      favIconUrlMapByDomain,
      titleMapByUrl
    ] = await Promise.all([
      query.toArray(),
      this.getFavIconUrlMap(),
      this.getTitleMap()
    ]);

    return activities.map(
      (activity: ActivityTableRecord): Activity => {
        const url = createUrl(activity);
        return {
          ...activity,
          favIconUrl: favIconUrlMapByDomain[activity.domain] || "",
          title: titleMapByUrl[url] || "",
          url
        } as Activity;
      }
    );
  }

  public fetchActivityTimeRange(): Promise<DefiniteTimeRange | null> {
    return this[ACTIVITY_TABLE].orderBy("startTime")
      .first()
      .then(oldestRecord => {
        return !oldestRecord
          ? null
          : {
              start: oldestRecord.startTime,
              end: Date.now()
            };
      });
  }

  public async exportDatabaseRecords(): Promise<DatabaseRecords> {
    const activityTableRecords = (await exportTableRecords<ActivityTableRecord>(
      this[ACTIVITY_TABLE]
    )).map(record => {
      delete record.id;
      return record;
    });
    const domainTableRecords = await exportTableRecords<DomainTableRecord>(
      this[DOMAIN_TABLE]
    );
    const titleTableRecords = await exportTableRecords<TitleTableRecord>(
      this[TITLE_TABLE]
    );

    return {
      [ACTIVITY_TABLE]: activityTableRecords,
      [DOMAIN_TABLE]: domainTableRecords,
      [TITLE_TABLE]: titleTableRecords
    };
  }

  public async importDatabaseRecords(data: DatabaseRecords): Promise<void> {
    const totalCount = data[ACTIVITY_TABLE].length;
    try {
      console.log(`[db] Begin importing ${totalCount} records...`);
      await this.transaction(
        "rw",
        [this[ACTIVITY_TABLE], this[DOMAIN_TABLE], this[TITLE_TABLE]],
        async () => {
          await this[ACTIVITY_TABLE].clear();
          await this[DOMAIN_TABLE].clear();
          await this[TITLE_TABLE].clear();

          await this[ACTIVITY_TABLE].bulkAdd(data[ACTIVITY_TABLE]);
          await this[DOMAIN_TABLE].bulkAdd(data[DOMAIN_TABLE]);
          await this[TITLE_TABLE].bulkAdd(data[TITLE_TABLE]);
        }
      );
      console.log("[db] All records were imported successfully");
    } catch (err) {
      console.error("[db]", err);
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
