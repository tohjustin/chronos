import { getDateInMs, getHourOfWeek } from "../dateUtils";

describe("getDateInMs", () => {
  const START_OF_DAY = 1556434800000; // Apr 28, 2019 0000H (Sun)
  const START_OF_NEXT_DAY = 1556521200000; // Apr 29, 2019 0000H (Sun)
  const TEST_CASES = [...Array(13)].map((val, index) => [
    START_OF_DAY + index * 2 * 60 * 60 * 1000,
    index < 12 ? START_OF_DAY : START_OF_NEXT_DAY
  ]);

  test.each(TEST_CASES)("getDateInMs(%i) returns %i", (a, expected) => {
    expect(getDateInMs(a)).toEqual(expected);
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
