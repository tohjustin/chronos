/* eslint-disable @typescript-eslint/no-unused-vars */

import { combineReducers } from "redux";
import { createAsyncAction, createReducer } from "typesafe-actions";
import { DeepReadonly } from "utility-types";

import { ActivityRecord } from "../../db/types";

type State = DeepReadonly<{
  isLoadingRecords: boolean;
  records: ActivityRecord[];
}>;

const INITIAL_STATE: State = {
  isLoadingRecords: false,
  records: []
};

const loadActivityAsync = createAsyncAction(
  "LOAD_ACTIVITY_REQUEST",
  "LOAD_ACTIVITY_SUCCESS",
  "LOAD_ACTIVITY_FAILURE"
)<undefined, ActivityRecord[], string>();

export const actions = {
  loadActivityAsync
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
  )
});
