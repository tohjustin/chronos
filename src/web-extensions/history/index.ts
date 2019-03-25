import ChromeHistoryService from "./chrome";
import FirefoxHistoryService from "./firefox";
import { HistoryService } from "./types";

export function InitHistoryService(): HistoryService | undefined {
  switch (process.env.REACT_APP_BUILD_TARGET) {
    case "chrome":
      return new ChromeHistoryService();
    case "firefox":
      return new FirefoxHistoryService();
    default:
      return undefined;
  }
}
