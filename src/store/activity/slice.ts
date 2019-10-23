import { createSlice, PayloadAction, Action } from "redux-starter-kit";
import { ThunkAction } from "redux-thunk";

import { InitDatabase } from "../../db";
import { ActivityRecord } from "../../models/activity";
import { RootState } from "../index";

export interface ActivityState {
  records: ActivityRecord[];
  isLoading: boolean;
  error: Error | null;
}

const INITIAL_STATE: ActivityState = {
  records: [],
  isLoading: false,
  error: null
};

const activity = createSlice({
  name: "activity",
  initialState: INITIAL_STATE,
  reducers: {
    getRecordsStart(state: ActivityState) {
      state.isLoading = true;
    },
    getRecordsFailure(state: ActivityState, action: PayloadAction<Error>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getRecordsSuccess(state, { payload }: PayloadAction<ActivityRecord[]>) {
      state.records = payload;
      state.isLoading = false;
      state.error = null;
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

export const actions = {
  ...activity.actions,
  loadRecords
};

export const reducer = activity.reducer;
