import { Dispatch } from "redux";
import { createAsyncAction } from "typesafe-actions";

import { InitChronosDatabase } from "../../db";
import { ActivityRecord } from "../../db/types";

export const loadActivityAsync = createAsyncAction(
  "LOAD_ACTIVITY_REQUEST",
  "LOAD_ACTIVITY_SUCCESS",
  "LOAD_ACTIVITY_FAILURE"
)<undefined, ActivityRecord[], string>();

export const loadActivity = () => async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadActivityAsync.request());
  try {
    const db = InitChronosDatabase();
    if (db === undefined) {
      throw "Unable to intialize DB";
    }

    const payload = await db.fetchAllRecords();
    dispatch(loadActivityAsync.success(payload));
  } catch (error) {
    dispatch(loadActivityAsync.failure(error));
  }
};

export const actions = {
  loadActivityAsync,
  loadActivity
};
