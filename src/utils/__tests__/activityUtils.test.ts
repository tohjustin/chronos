import { createActivitySplittingReducer } from "../activityUtils";

describe("createActivitySplittingReducer", () => {
  describe('split by "day"', () => {
    const DAY0_003000_111 = 1556436600111; // Apr 28, 2019 00:30:00.111 (Sun)
    const DAY1_000000_000 = 1556521200000; // Apr 29, 2019 00:00:00.000 (Mon)
    const DAY2_000000_000 = 1556607600000; // Apr 30, 2019 00:00:00.000 (Tue)
    const DAY2_093000_222 = 1556641800222; // Apr 30, 2019 09:30:00.222 (Tue)

    test.each([
      [
        "created reducer splits records that span across day boundaries",
        [{ startTime: DAY0_003000_111, endTime: DAY2_093000_222 }],
        [
          { startTime: DAY0_003000_111, endTime: DAY1_000000_000 },
          { startTime: DAY1_000000_000, endTime: DAY2_000000_000 },
          { startTime: DAY2_000000_000, endTime: DAY2_093000_222 }
        ]
      ],
      [
        "created reducer does not split records that do not span across day boundaries",
        [{ startTime: DAY0_003000_111, endTime: DAY1_000000_000 }],
        [{ startTime: DAY0_003000_111, endTime: DAY1_000000_000 }]
      ]
    ])("%s", (description, a, expected) => {
      const reducerFn = createActivitySplittingReducer("day");
      expect(reducerFn).toBeInstanceOf(Function);

      const result = a.reduce(reducerFn, []);
      expect(result).toEqual(expected);
    });
  });

  describe('split by "hour"', () => {
    const DAY0_003000_111 = 1556436600111; // Apr 28, 2019 00:30:00.111 (Sun)
    const DAY0_010000_000 = 1556438400000; // Apr 28, 2019 01:00:00.000 (Sun)
    const DAY0_020000_000 = 1556442000000; // Apr 28, 2019 02:00:00.000 (Sun)
    const DAY0_023000_222 = 1556443800222; // Apr 28, 2019 02:30:00.222 (Sun)

    test.each([
      [
        "created reducer splits records that span across hour boundaries",
        [{ startTime: DAY0_003000_111, endTime: DAY0_023000_222 }],
        [
          { startTime: DAY0_003000_111, endTime: DAY0_010000_000 },
          { startTime: DAY0_010000_000, endTime: DAY0_020000_000 },
          { startTime: DAY0_020000_000, endTime: DAY0_023000_222 }
        ]
      ],
      [
        "created reducer does not split records that do not span across hour boundaries",
        [{ startTime: DAY0_003000_111, endTime: DAY0_010000_000 }],
        [{ startTime: DAY0_003000_111, endTime: DAY0_010000_000 }]
      ],
      [
        "created reducer does not split records that do not span across hour boundaries",
        [{ startTime: DAY0_010000_000, endTime: DAY0_010000_000 + 1 }],
        [{ startTime: DAY0_010000_000, endTime: DAY0_010000_000 + 1 }]
      ],
      [
        "created reducer does not split records that do not span across hour boundaries",
        [{ startTime: DAY0_010000_000 - 1, endTime: DAY0_010000_000 + 1 }],
        [
          { startTime: DAY0_010000_000 - 1, endTime: DAY0_010000_000 },
          { startTime: DAY0_010000_000, endTime: DAY0_010000_000 + 1 }
        ]
      ]
    ])("%s", (description, a, expected) => {
      const reducerFn = createActivitySplittingReducer("hour");
      expect(reducerFn).toBeInstanceOf(Function);

      const result = a.reduce(reducerFn, []);
      expect(result).toEqual(expected);
    });
  });
});
