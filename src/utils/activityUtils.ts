import moment from "moment";

import { ActivityRecord } from "../db/types";

/**
 * Creates a reducer function for splitting records that spans over the given
 * time boundary
 * @param unitOfTime time boundary
 * @returns reducer function to be used with `Array.reduce()`
 * @example
 * const records = [
 *   {
 *     // ...
 *     startTime: '<TIMESTAMP_OF_DAY_1_23:00:00.000>',
 *     endTime: '<TIMESTAMP_OF_DAY_3_16:30:00.000>',
 *   }
 * ];
 * const result = records.reduce(
 *   createActivitySplittingReducer('day'),
 *   []
 * );
 * // result = [
 * //   {
 * //     // ...same set of props from the original record
 * //     startTime: '<TIMESTAMP_OF_DAY_1_23:00:00.000>',
 * //     endTime: '<TIMESTAMP_OF_DAY_1_23:59:59.999>',
 * //   }
 * //   {
 * //     // ...same set of props from the original record
 * //     startTime: '<TIMESTAMP_OF_DAY_2_00:00:00.000>',
 * //     endTime: '<TIMESTAMP_OF_DAY_2_23:59:59.999>',
 * //   }
 * //   {
 * //     // ...same set of props from the original record
 * //     startTime: '<TIMESTAMP_OF_DAY_3_00:00:00.000>',
 * //     endTime: '<TIMESTAMP_OF_DAY_3_16:30:00.000>',
 * //   }
 * // ];
 */
export function createActivitySplittingReducer(unitOfTime: "hour" | "day") {
  return (acc: ActivityRecord[], e: ActivityRecord) => {
    const splittedRecords = [];
    let startTimeObj = moment(e.startTime);
    let endTimeObj = moment(e.endTime);

    while (
      endTimeObj.diff(startTimeObj, unitOfTime, true) >= 1 ||
      (endTimeObj.get(unitOfTime) !== startTimeObj.get(unitOfTime) &&
        !endTimeObj.isSame(endTimeObj.clone().startOf(unitOfTime)))
    ) {
      const newStartTimeObj = endTimeObj.clone().startOf(unitOfTime);
      if (newStartTimeObj.isSame(endTimeObj)) {
        newStartTimeObj.subtract(1, unitOfTime);
      }

      splittedRecords.unshift({
        ...e,
        startTime: newStartTimeObj.valueOf(),
        endTime: endTimeObj.valueOf()
      });
      endTimeObj = newStartTimeObj;
    }

    splittedRecords.unshift({
      ...e,
      startTime: startTimeObj.valueOf(),
      endTime: endTimeObj.valueOf()
    });
    return acc.concat(splittedRecords);
  };
}
