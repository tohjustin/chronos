/* eslint-disable @typescript-eslint/no-unused-vars */

import { combineReducers } from "redux";
import { createReducer, getType } from "typesafe-actions";
import { DeepReadonly } from "utility-types";

import { ActivityRecord } from "../../db/types";
import { TimeRange } from "../../models/time";

import { loadActivityAsync, setSelectedTimeRange } from "./actions";

type State = DeepReadonly<{
  isLoadingRecords: boolean;
  records: ActivityRecord[];
  selectedTimeRange: TimeRange | null;
}>;

const INITIAL_STATE: State = {
  isLoadingRecords: false,
  records: [],
  selectedTimeRange: null
};

export const reducer = combineReducers({
  isLoadingRecords: createReducer(INITIAL_STATE.isLoadingRecords)
    .handleAction([loadActivityAsync.request], (state, action) => true)
    .handleAction(
      [loadActivityAsync.success, loadActivityAsync.failure],
      (state, action) => false
    ),
  records: createReducer(INITIAL_STATE.records).handleAction(
    [loadActivityAsync.success],
    (state, action) => action.payload
  ),
  selectedTimeRange: createReducer(
    INITIAL_STATE.selectedTimeRange
  ).handleAction(
    [getType(setSelectedTimeRange)],
    (state, action) => action.payload
  )
});
