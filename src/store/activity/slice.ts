import { createSlice, PayloadAction, Action } from "redux-starter-kit";
import { batch } from "react-redux";
import { ThunkAction } from "redux-thunk";

import { InitDatabaseConnection } from "../../db";
import { ActivityRecord } from "../../models/activity";
import { DefiniteTimeRange, TimeRange } from "../../models/time";
import { isWithinTimeRange } from "../../utils/dateUtils";
import { DEFAULT_TIME_RANGE } from "../router/constants";
import { RootState } from "../index";

import {
  getRecordsTimeRange,
  getEffectiveSearchParamsSelectedTimeRange
} from "./selectors";

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
   * Status of whether the initial record fetch has completed
   */
  isInitialized: boolean;
  /**
   * Loading status of `loadRecords` thunk
   */
  isLoading: boolean;
  /**
   * List of all (fetched) activity records
   */
  records: ActivityRecord[];
  /**
   * Time range of all (fetched) activity records
   */
  recordsTimeRange: TimeRange | null;
  /**
   * Selected activity time range
   */
  selectedTimeRange: TimeRange;
  /**
   * Time range of all recorded activity found in database
   */
  totalTimeRange: DefiniteTimeRange | null;
}

const INITIAL_STATE: ActivityState = {
  error: null,
  isDeleting: false,
  isInitialized: false,
  isLoading: false,
  records: [],
  recordsTimeRange: null,
  selectedTimeRange: DEFAULT_TIME_RANGE,
  totalTimeRange: null
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
      state.isInitialized = true;
      state.isLoading = false;
      state.error = null;
    },
    getRecordsFailure(state: ActivityState, action: PayloadAction<Error>) {
      state.isInitialized = true;
      state.isLoading = false;
      state.error = action.payload;
    },
    setRecordsTimeRange(state, action: PayloadAction<TimeRange | null>) {
      state.recordsTimeRange = action.payload;
    },
    setSelectedTimeRange(state, action: PayloadAction<TimeRange>) {
      state.selectedTimeRange = action.payload;
    },
    setTotalTimeRange(state, action: PayloadAction<DefiniteTimeRange | null>) {
      state.totalTimeRange = action.payload;
    }
  }
});

const loadRecords = (): ThunkAction<
  void,
  RootState,
  null,
  Action<string>
> => async (dispatch, getState) => {
  const state = getState();
  const timeRange = getEffectiveSearchParamsSelectedTimeRange(state);
  const recordsTimeRange = getRecordsTimeRange(state);

  // Don't fetch data from DB if we already have them in the store
  if (recordsTimeRange && isWithinTimeRange(recordsTimeRange, timeRange)) {
    dispatch(activity.actions.setSelectedTimeRange(timeRange));
    return;
  }

  dispatch(activity.actions.getRecordsStart());
  try {
    const db = InitDatabaseConnection();
    if (db === undefined) {
      throw "Unable to initialize DB connection";
    }

    const [records, activityTimeRange] = await Promise.all([
      db.fetchActivityRecords(timeRange),
      db.fetchActivityTimeRange()
    ]);

    // Batch actions to ensure smooth UI transition on store updates
    batch(() => [
      dispatch(activity.actions.getRecordsSuccess(records || [])),
      dispatch(activity.actions.setRecordsTimeRange(timeRange)),
      dispatch(activity.actions.setSelectedTimeRange(timeRange)),
      dispatch(activity.actions.setTotalTimeRange(activityTimeRange))
    ]);
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
