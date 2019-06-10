import { Dispatch } from "redux";
import { createAction, createAsyncAction } from "typesafe-actions";

import { InitDatabase } from "../../db";
import { ActivityRecord } from "../../db/types";
import { TimeRange } from "../../models/time";

export const loadActivityAsync = createAsyncAction(
  "LOAD_ACTIVITY_REQUEST",
  "LOAD_ACTIVITY_SUCCESS",
  "LOAD_ACTIVITY_FAILURE"
)<undefined, ActivityRecord[], string>();

export const loadActivity = () => async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadActivityAsync.request());
  try {
    const db = InitDatabase();
    if (db === undefined) {
      throw "Unable to initialize DB";
    }

    const payload = await db.fetchAllActivityRecords();
    dispatch(loadActivityAsync.success(payload));
  } catch (error) {
    dispatch(loadActivityAsync.failure(error));
  }
};

export const setSelectedTimeRange = createAction(
  "SET_SELECTED_TIME_RANGE",
  action => {
    return (range: TimeRange | null) => action(range);
  }
);

export const setSelectedDomain = createAction("SET_SELECTED_DOMAIN", action => {
  return (domain: string | null) => action(domain);
});

export const actions = {
  loadActivityAsync,
  loadActivity,
  setSelectedDomain,
  setSelectedTimeRange
};
