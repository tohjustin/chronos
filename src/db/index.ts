import { IS_CHROMIUM, IS_FIREFOX } from "../utils/browserUtils";

import { DatabaseConnection } from "./indexedDb";
import { DatabaseService } from "./types";

/**
 * Initialize database service for managing activity records
 *
 * @returns `DatabaseService` object or `undefined` if the browser has no
 * support for such service
 */
export function InitDatabaseService(): DatabaseService | undefined {
  switch (true) {
    case IS_CHROMIUM:
    case IS_FIREFOX:
      return new DatabaseConnection();
    default:
      console.error(
        "[db] Only Chromium or Firefox based browsers are supported"
      );
      return undefined;
  }
}
