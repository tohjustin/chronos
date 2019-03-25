import { HistoryService } from "./types";
import ChromeHistoryService from "./chrome";

export function InitHistoryService(): HistoryService | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "CHROME":
      return new ChromeHistoryService();
    default:
      return undefined;
  }
}
