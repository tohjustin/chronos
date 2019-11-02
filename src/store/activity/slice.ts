import { createSlice, PayloadAction, Action } from "redux-starter-kit";
import { ThunkAction } from "redux-thunk";

import { InitDatabase } from "../../db";
import { ActivityRecord } from "../../models/activity";
import { RootState } from "../index";

export interface ActivityState {
  error: Error | null;
  isDeleting: boolean;
  isLoading: boolean;
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
    deleteRecordsSuccess(
      state,
      { payload: deletedRecordIds }: PayloadAction<number[]>
    ) {
      state.records = state.records.filter(
        record => !deletedRecordIds.includes(record.id)
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
    getRecordsSuccess(state, { payload }: PayloadAction<ActivityRecord[]>) {
      state.records = payload;
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
    const db = InitDatabase();
    if (db === undefined) {
      throw "Unable to initialize DB";
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
    const db = InitDatabase();
    if (db === undefined) {
      throw "Unable to initialize DB";
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
