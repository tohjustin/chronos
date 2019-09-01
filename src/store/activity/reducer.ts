/* eslint-disable @typescript-eslint/no-unused-vars */

import { combineReducers } from "redux";
import { createReducer, getType } from "typesafe-actions";
import { DeepReadonly } from "utility-types";

import { ActivityRecord } from "../../models/activity";
import { TimeRange } from "../../models/time";

import { loadActivityAsync, setSelectedDomain } from "./actions";

type State = DeepReadonly<{
  isLoadingRecords: boolean;
  records: ActivityRecord[];
  selectedDomain: string | null;
}>;

const INITIAL_STATE: State = {
  isLoadingRecords: false,
  records: [],
  selectedDomain: null
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
  selectedDomain: createReducer(INITIAL_STATE.selectedDomain).handleAction(
    [getType(setSelectedDomain)],
    (state, action) => action.payload
  )
});
