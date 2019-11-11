import { createSlice, PayloadAction, Action } from "redux-starter-kit";
import { ThunkAction } from "redux-thunk";

import { InitDatabaseConnection } from "../../db";
import { ActivityRecord } from "../../models/activity";
import { RootState } from "../index";

export interface ActivityState {
  /**
   * Error resulting from `deleteRecords` or `loadRecords` thunks
   */
  error: Error | null;
  /**
   * Loading status of `deleteRecords` thunk
   */
  isDeleting: boolean;
  /**
   * Loading status of `loadRecords` thunk
   */
  isLoading: boolean;
  /**
   * List of all (fetched) activity records
   */
  records: ActivityRecord[];
}

const INITIAL_STATE: ActivityState = {
  error: null,
  isDeleting: false,
  isLoading: false,
  records: []
};

const activity = createSlice({
  name: "activity",
  initialState: INITIAL_STATE,
  reducers: {
    deleteRecordsStart(state: ActivityState) {
      state.isDeleting = true;
    },
    deleteRecordsSuccess(state, action: PayloadAction<number[]>) {
      state.records = state.records.filter(
        record => !action.payload.includes(record.id)
      );
      state.isDeleting = false;
      state.error = null;
    },
    deleteRecordsFailure(state: ActivityState, action: PayloadAction<Error>) {
      state.isDeleting = false;
      state.error = action.payload;
    },
    getRecordsStart(state: ActivityState) {
      state.isLoading = true;
    },
    getRecordsSuccess(state, action: PayloadAction<ActivityRecord[]>) {
      state.records = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    getRecordsFailure(state: ActivityState, action: PayloadAction<Error>) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

const loadRecords = (): ThunkAction<
  void,
  RootState,
  null,
  Action<string>
> => async dispatch => {
  dispatch(activity.actions.getRecordsStart());
  try {
    const db = InitDatabaseConnection();
    if (db === undefined) {
      throw "Unable to initialize DB connection";
    }

    const records = await db.fetchAllActivityRecords();
    dispatch(activity.actions.getRecordsSuccess(records));
  } catch (error) {
    dispatch(activity.actions.getRecordsFailure(error));
  }
};

const deleteRecords = (
  recordIds: number[],
  onSuccess?: () => void,
  onError?: () => void
): ThunkAction<void, RootState, null, Action<string>> => async dispatch => {
  dispatch(activity.actions.deleteRecordsStart());
  try {
    const db = InitDatabaseConnection();
    if (db === undefined) {
      throw "Unable to initialize DB connection";
    }

    await db.deleteActivityRecords(recordIds);
    if (onSuccess) {
      onSuccess();
    }
    dispatch(activity.actions.deleteRecordsSuccess(recordIds));
  } catch (error) {
    if (onError) {
      onError();
    }
    dispatch(activity.actions.deleteRecordsFailure(error));
  }
};

export const actions = {
  ...activity.actions,
  deleteRecords,
  loadRecords
};

export const reducer = activity.reducer;
