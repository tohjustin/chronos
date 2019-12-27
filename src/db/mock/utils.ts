import { Activity } from "../../models/activity";
import { getStartOfDay, minusDays } from "../../utils/dateUtils";
import { DomainTableRecord } from "../types";

import DATA from "./data.json";

type Page = { title: string; path: string };
type Website = {
  domain: string;
  favIconUrl: string;
  pages: Page[];
};
type Range = [number, number];

// Parameters for generating mock data
const ACTIVITY_DURATION_RANGE_SHORT: Range = [100, 120000]; // 100ms ~ 2min
const ACTIVITY_DURATION_RANGE_MEDIUM: Range = [120000, 300000]; // 2 ~ 5min
const ACTIVITY_DURATION_RANGE_LONG: Range = [300000, 900000]; // 5 ~ 15min
const IDLE_DURATION_RANGE: Range = [60000, 1800000]; // 1 ~ 30min
const ACTIVITY_DURATION_PER_DAY_RANGE: Range = [1800000, 36000000]; // 0.5 ~ 10h
const ACTIVITY_TIME_RANGE: Range = [32400000, 75600000]; // 9am ~ 9pm
const DAYS_TO_GENERATE = 60; // 2 months

const generateId: () => number = (function() {
  const idGenerator = (function* getActivityIdGenerator() {
    let index = 1;
    while (true) yield index++;
  })();

  return function(): number {
    return idGenerator.next().value;
  };
})();

function randomRangeValue([min, max]: Range): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomArrayElement<T>(arr: T[]): T {
  const len = arr.length;
  if (len === 0) {
    throw new Error("Array is empty");
  }
  return arr[Math.floor(Math.random() * len) % len];
}

function generateActivityRecord(startTime: number, endTime: number): Activity {
  const website = randomArrayElement(DATA as Website[]);
  const page = randomArrayElement<Page>(website.pages);
  return {
    id: generateId(),
    url: `${website.domain}${page.path}`,
    domain: website.domain,
    path: page.path,
    endTime,
    startTime,
    title: page.title,
    favIconUrl: website.favIconUrl
  };
}

export function generateRecords(): {
  activity: Activity[];
  domain: Record<string, DomainTableRecord>;
} {
  const domain = DATA.reduce<Record<string, DomainTableRecord>>(
    (acc, datum) => {
      acc[datum.domain] = {
        id: datum.domain,
        favIconUrl: datum.favIconUrl
      };
      return acc;
    },
    {}
  );

  const activity: Activity[] = [];
  const startOfToday = getStartOfDay();
  for (let day = 0; day < DAYS_TO_GENERATE; day++) {
    const startOfDay = minusDays(startOfToday, day);
    const browsingStartTime = startOfDay + ACTIVITY_TIME_RANGE[0];
    const browsingEndTime = startOfDay + randomRangeValue(ACTIVITY_TIME_RANGE);

    let maxDuration = randomRangeValue(ACTIVITY_DURATION_PER_DAY_RANGE);
    let endTime = browsingEndTime;
    while (maxDuration > 0 && endTime > browsingStartTime) {
      const durationRange = randomArrayElement([
        ACTIVITY_DURATION_RANGE_LONG,
        ACTIVITY_DURATION_RANGE_MEDIUM,
        ACTIVITY_DURATION_RANGE_SHORT
      ]);
      const duration = randomRangeValue(durationRange);
      const startTime = endTime - duration;
      const activityRecord = generateActivityRecord(startTime, endTime);

      activity.push(activityRecord);
      endTime = startTime - 1;
      maxDuration = maxDuration - duration;

      // Add some idle time between each activity
      if (Math.random() > 0.5) {
        const idleDuration = randomRangeValue(IDLE_DURATION_RANGE);
        endTime = endTime - idleDuration - 1;
        maxDuration = maxDuration - idleDuration;
      }
    }
  }

  return { activity, domain };
}
