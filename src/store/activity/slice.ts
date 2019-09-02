import { push } from "connected-react-router";
import { createSlice, PayloadAction, Action } from "redux-starter-kit";
import { ThunkAction } from "redux-thunk";

import { InitDatabase } from "../../db";
import { ActivityRecord } from "../../models/activity";
import { TimeRange } from "../../models/time";
import { formatDateString } from "../../utils/dateUtils";
import { RootState } from "../index";

export interface ActivityState {
  records: ActivityRecord[];
  selectedDomain: string | null;
  isLoading: boolean;
  error: Error | null;
}

const INITIAL_STATE: ActivityState = {
  records: [],
  selectedDomain: null,
  isLoading: false,
  error: null
};

const activity = createSlice({
  slice: "activity",
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
    },
    setSelectedDomain(
      state: ActivityState,
      action: PayloadAction<string | null>
    ) {
      state.selectedDomain = action.payload;
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

const setSelectedTimeRange = (
  range: TimeRange | null
): ThunkAction<void, RootState, null, Action<string>> => async dispatch => {
  let queryString = "";
  if (range && range.start) {
    queryString += queryString === "" ? "?" : "&";
    queryString += `startDate=${formatDateString(range.start)}`;
  }
  if (range && range.end) {
    queryString += queryString === "" ? "?" : "&";
    queryString += `endDate=${formatDateString(range.end)}`;
  }

  dispatch(push(queryString));
};

export const actions = {
  ...activity.actions,
  loadRecords,
  setSelectedTimeRange
};

export const reducer = activity.reducer;
