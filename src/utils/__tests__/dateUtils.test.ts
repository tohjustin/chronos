import { MS_PER_DAY, MS_PER_HOUR } from "../../constants/time";
import {
  formatDateString,
  getDayCount,
  getDayOfWeek,
  getDayOfWeekCount,
  getHourOfWeek,
  getStartOfDay,
  getTimestampFromDateString,
  isValidDateString
} from "../dateUtils";

describe("getStartOfDay", () => {
  const START_OF_DAY = 1556434800000; // Apr 28, 2019 00:00:00.000 (Sun)
  const START_OF_NEXT_DAY = 1556521200000; // Apr 29, 2019 00:00:00.000 (Sun)
  const TEST_CASES = [...Array(13)].map((val, index) => [
    START_OF_DAY + index * 2 * MS_PER_HOUR,
    index < 12 ? START_OF_DAY : START_OF_NEXT_DAY
  ]);

  test.each(TEST_CASES)("getStartOfDay(%i) returns %i", (a, expected) => {
    expect(getStartOfDay(a)).toEqual(expected);
  });
});

describe("getDayCount", () => {
  const START_DATE = 1556694000000; // May 1, 2019 00:00:00.000 (Wed)
  const END_DATE_NEAR = 1556866800000; // May 3, 2019 00:00:00.000 (Fri)
  const END_DATE_FAR = 1559890800000; // Jun 7, 2019 00:00:00.000 (Fri)

  describe("time interval = 1", () => {
    test.each([[0, 0, 1]])(
      "getDayCount(%i, %i) returns %i",
      (a, b, expected) => {
        expect(getDayCount(a, b)).toBe(expected);
      }
    );
  });

  describe("time interval < 1 week", () => {
    test.each([[START_DATE, END_DATE_NEAR, 3]])(
      "getDayCount(%i, %i) returns %i",
      (a, b, expected) => {
        expect(getDayCount(a, b)).toBe(expected);
      }
    );
  });

  describe("time interval > 1 month", () => {
    test.each([[START_DATE, END_DATE_FAR, 38]])(
      "getDayCount(%i, %i) returns %i",
      (a, b, expected) => {
        expect(getDayCount(a, b)).toBe(expected);
      }
    );
  });
});

describe("getDayOfWeekCount", () => {
  const START_DATE = 1556694000000; // May 1, 2019 00:00:00.000 (Wed)
  const END_DATE_NEAR = 1556866800000; // May 3, 2019 00:00:00.000 (Fri)
  const END_DATE_FAR = 1559890800000; // Jun 7, 2019 00:00:00.000 (Fri)

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
      TIMESTAMP + index * MS_PER_DAY,
      index
    ]);

    test.each(TEST_CASES)("getDayOfWeek(%i) returns %o", (a, expected) => {
      expect(getDayOfWeek(a)).toEqual(expected);
    });
  });

  describe("changing time-of-day", () => {
    const TEST_CASES = [...Array(24)].map((val, index) => [
      TIMESTAMP + index * MS_PER_HOUR,
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
      TIMESTAMP + index * MS_PER_DAY,
      { day: index, hour: 0 }
    ]);

    test.each(TEST_CASES)("getHourOfWeek(%i) returns %o", (a, expected) => {
      expect(getHourOfWeek(a)).toEqual(expected);
    });
  });

  describe("changing time-of-day", () => {
    const TEST_CASES = [...Array(24)].map((val, index) => [
      TIMESTAMP + index * MS_PER_HOUR,
      { day: 0, hour: index }
    ]);

    test.each(TEST_CASES)("getHourOfWeek(%i) returns %o", (a, expected) => {
      expect(getHourOfWeek(a)).toEqual(expected);
    });
  });
});

describe("formatDateString", () => {
  const TEST_CASES = [
    [1546329600000, "2019-01-01"], // Jan 1, 2019 00:00:00.000 (Tue)
    [1546372800000, "2019-01-01"], // Jan 1, 2019 12:00:00.000 (Tue)
    [1548921600000, "2019-01-31"], // Jan 31, 2019 00:00:00.000 (Thu)
    [1548964800000, "2019-01-31"], // Jan 31, 2019 12:00:00.000 (Thu)
    [1569913200000, "2019-10-01"], // Oct 1, 2019 00:00:00.000 (Tue)
    [1569956400000, "2019-10-01"], // Oct 1, 2019 12:00:00.000 (Tue)
    [1572505200000, "2019-10-31"], // Oct 31, 2019 00:00:00.000 (Thu)
    [1572548400000, "2019-10-31"] // Oct 31, 2019 12:00:00.000 (Thu)
  ];

  test.each(TEST_CASES)("formatDateString(%i) returns %s", (a, expected) => {
    expect(formatDateString(a)).toEqual(expected);
  });
});

describe("getTimestampFromDateString", () => {
  const TEST_CASES = [
    ["2019-01-01", 1546329600000], // Jan 1, 2019 00:00:00.000 (Tue)
    ["2019-01-31", 1548921600000], // Jan 31, 2019 00:00:00.000 (Thu)
    ["2019-10-01", 1569913200000], // Oct 1, 2019 00:00:00.000 (Tue)
    ["2019-10-31", 1572505200000] // Oct 31, 2019 00:00:00.000 (Thu)
  ];

  test.each(TEST_CASES)(
    'getTimestampFromDateString("%s") returns %i',
    (a, expected) => {
      expect(getTimestampFromDateString(a)).toEqual(expected);
    }
  );
});

describe("isValidDateString", () => {
  const TEST_CASES = [
    // valid cases
    ["2019-01-01", true],
    ["2019-01-31", true],
    ["2019-10-01", true],
    ["2019-10-31", true],
    // missing padding with '0'
    ["2019-1-1", false],
    ["2019-1-31", false],
    // incorrect delimiter
    ["2019.01.01", false],
    ["2019.01.31", false],
    ["2019:01:01", false],
    ["2019:01;31", false],
    // ISO string
    ["2019-01-01T00:00:00.000Z", false],
    // days that a month doesn't have
    ["2019-01-32", false],
    ["2019-02-30", false],
    ["2019-02-31", false],
    ["2019-04-31", false],
    ["2019-04-32", false],
    // leap year
    ["2020-02-29", true],
    ["2019-02-29", false],
    ["2018-02-29", false],
    ["2017-02-29", false]
  ];

  test.each(TEST_CASES)('isValidDateString("%s") returns %s', (a, expected) => {
    expect(isValidDateString(a)).toEqual(expected);
  });
});
