import {
  getDayOfWeek,
  getDayOfWeekCount,
  getHourOfWeek,
  getStartOfDay
} from "../dateUtils";

describe("getStartOfDay", () => {
  const START_OF_DAY = 1556434800000; // Apr 28, 2019 00:00:00.000 (Sun)
  const START_OF_NEXT_DAY = 1556521200000; // Apr 29, 2019 00:00:00.000 (Sun)
  const TEST_CASES = [...Array(13)].map((val, index) => [
    START_OF_DAY + index * 2 * 60 * 60 * 1000,
    index < 12 ? START_OF_DAY : START_OF_NEXT_DAY
  ]);

  test.each(TEST_CASES)("getStartOfDay(%i) returns %i", (a, expected) => {
    expect(getStartOfDay(a)).toEqual(expected);
  });
});

describe("getDayOfWeekCount", () => {
  const START_DATE = 1556694000000; // May 1, 2019 00:00:00.000 (Wed)
  const END_DATE_NEAR = 1556866800000; // May 3, 2019 00:00:00.000 (Fri)
  const END_DATE_FAR = 1559890800000; // June 7, 2019 00:00:00.000 (Fri)

  describe("time interval = 0", () => {
    test.each([
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [2, 0, 0, 0],
      [3, 0, 0, 0],
      [4, 0, 0, 0],
      [5, 0, 0, 0],
      [6, 0, 0, 0]
    ])("getDayOfWeekCount(%i, %i, %i) returns %i", (a, b, c, expected) => {
      expect(getDayOfWeekCount(a, b, c)).toBe(expected);
    });
  });

  describe("time interval < 1 week", () => {
    test.each([
      [0, START_DATE, END_DATE_NEAR, 0],
      [1, START_DATE, END_DATE_NEAR, 0],
      [2, START_DATE, END_DATE_NEAR, 0],
      [3, START_DATE, END_DATE_NEAR, 1],
      [4, START_DATE, END_DATE_NEAR, 1],
      [5, START_DATE, END_DATE_NEAR, 0],
      [6, START_DATE, END_DATE_NEAR, 0]
    ])("getDayOfWeekCount(%i, %i, %i) returns %i", (a, b, c, expected) => {
      expect(getDayOfWeekCount(a, b, c)).toBe(expected);
    });
  });

  describe("time interval > 1 month", () => {
    test.each([
      [0, START_DATE, END_DATE_FAR, 5],
      [1, START_DATE, END_DATE_FAR, 5],
      [2, START_DATE, END_DATE_FAR, 5],
      [3, START_DATE, END_DATE_FAR, 6],
      [4, START_DATE, END_DATE_FAR, 6],
      [5, START_DATE, END_DATE_FAR, 5],
      [6, START_DATE, END_DATE_FAR, 5]
    ])("getDayOfWeekCount(%i, %i, %i) returns %i", (a, b, c, expected) => {
      expect(getDayOfWeekCount(a, b, c)).toBe(expected);
    });
  });
});

describe("getDayOfWeek", () => {
  const TIMESTAMP = 1556436600000; // Apr 28, 2019 0030H (Sun)

  describe("changing day-of-week", () => {
    const TEST_CASES = [...Array(7)].map((val, index) => [
      TIMESTAMP + index * 24 * 60 * 60 * 1000,
      index
    ]);

    test.each(TEST_CASES)("getDayOfWeek(%i) returns %o", (a, expected) => {
      expect(getDayOfWeek(a)).toEqual(expected);
    });
  });

  describe("changing time-of-day", () => {
    const TEST_CASES = [...Array(24)].map((val, index) => [
      TIMESTAMP + index * 60 * 60 * 1000,
      0
    ]);

    test.each(TEST_CASES)("getDayOfWeek(%i) returns %o", (a, expected) => {
      expect(getDayOfWeek(a)).toEqual(expected);
    });
  });
});

describe("getHourOfWeek", () => {
  const TIMESTAMP = 1556436600000; // Apr 28, 2019 0030H (Sun)

  describe("changing day-of-week", () => {
    const TEST_CASES = [...Array(7)].map((val, index) => [
      TIMESTAMP + index * 24 * 60 * 60 * 1000,
      { day: index, hour: 0 }
    ]);

    test.each(TEST_CASES)("getHourOfWeek(%i) returns %o", (a, expected) => {
      expect(getHourOfWeek(a)).toEqual(expected);
    });
  });

  describe("changing time-of-day", () => {
    const TEST_CASES = [...Array(24)].map((val, index) => [
      TIMESTAMP + index * 60 * 60 * 1000,
      { day: 0, hour: index }
    ]);

    test.each(TEST_CASES)("getHourOfWeek(%i) returns %o", (a, expected) => {
      expect(getHourOfWeek(a)).toEqual(expected);
    });
  });
});
