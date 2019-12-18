import { IS_CHROMIUM, IS_FIREFOX } from "../utils/browserUtils";

import { DatabaseConnection } from "./indexedDb";
import { MockDatabaseConnection } from "./mock";
import { DatabaseService } from "./types";

const BUILD_TARGET = process.env.REACT_APP_BUILD_TARGET;

/**
 * Initialize database service for managing activity records
 *
 * @returns `DatabaseService` object or `undefined` if the browser has no
 * support for such service
 */
export function InitDatabaseService(): DatabaseService | undefined {
  switch (true) {
    case BUILD_TARGET === "demo":
      return new MockDatabaseConnection();
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
