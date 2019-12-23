import { createSlice, PayloadAction } from "redux-starter-kit";
import { batch } from "react-redux";

import { ANALYTICS_REQUIRED_TIME_WINDOW } from "../../constants/analytics";
import { Activity, Domain } from "../../models/activity";
import { DefiniteTimeRange, TimeRange } from "../../models/time";
import { extendTimeRange, isWithinTimeRange } from "../../utils/dateUtils";
import { DEFAULT_TIME_RANGE } from "../router/constants";
import { ThunkAction } from "../types";

import {
  getEffectiveSearchParamsSelectedTimeRange,
  getIsInitialized,
  getRecordsTimeRange
} from "./selectors";

export interface ActivityState {
  /**
   * Loading status of `deleteRecords` thunk
   */
  isDeletingRecords: boolean;
  /**
   * Error resulting from `deleteRecords` thunk
   */
  deletingRecordsError: Error | null;
  /**
   * Success status of `deleteRecords` thunk
   */
  deletingRecordsSuccess: boolean | null;
  /**
   * Status of whether the initial record fetch has completed
   */
  isInitialized: boolean;
  /**
   * Loading status of `loadRecords` thunk
   */
  isLoadingRecords: boolean;
  /**
   * Error resulting from `loadRecords` thunks
   */
  loadingRecordsError: Error | null;
  /**
   * Success status from `loadRecords` thunks
   */
  loadingRecordsSuccess: boolean | null;
  /**
   * Map of all (fetched) domain records, keyed by domain value
   */
  domains: Record<string, Domain>;
  /**
   * List of all (fetched) activity records
   */
  records: Activity[];
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
  deletingRecordsError: null,
  deletingRecordsSuccess: null,
  domains: {},
  isDeletingRecords: false,
  isInitialized: false,
  isLoadingRecords: false,
  loadingRecordsError: null,
  loadingRecordsSuccess: null,
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
      state.isDeletingRecords = true;
      state.deletingRecordsSuccess = null;
    },
    deleteRecordsSuccess(state, action: PayloadAction<number[]>) {
      state.records = state.records.filter(
        record => !action.payload.includes(record.id as number)
      );
      state.isDeletingRecords = false;
      state.deletingRecordsError = null;
      state.deletingRecordsSuccess = true;
    },
    deleteRecordsFailure(state: ActivityState, action: PayloadAction<Error>) {
      state.isDeletingRecords = false;
      state.deletingRecordsError = action.payload;
      state.deletingRecordsSuccess = false;
    },
    getRecordsStart(state: ActivityState) {
      state.isLoadingRecords = true;
      state.loadingRecordsSuccess = null;
    },
    getRecordsSuccess(state, action: PayloadAction<Activity[]>) {
      state.records = action.payload;
      state.isInitialized = true;
      state.isLoadingRecords = false;
      state.loadingRecordsError = null;
      state.loadingRecordsSuccess = true;
    },
    getRecordsFailure(state: ActivityState, action: PayloadAction<Error>) {
      state.isInitialized = true;
      state.isLoadingRecords = false;
      state.loadingRecordsError = action.payload;
      state.loadingRecordsSuccess = false;
    },
    setDomains(state, action: PayloadAction<Record<string, Domain>>) {
      state.domains = action.payload;
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

const loadRecords = (
  onSuccess?: () => void,
  onError?: (error: Error) => void,
  options: { forceReload: boolean } = { forceReload: false }
): ThunkAction => async (dispatch, getState, { databaseService }) => {
  const state = getState();
  const recordsTimeRange = getRecordsTimeRange(state);
  const selectedTimeRange = getEffectiveSearchParamsSelectedTimeRange(state);

  // Ensure we fetched enough data that's required to compute analytics
  const requiredTimeRange = extendTimeRange(selectedTimeRange, {
    months: ANALYTICS_REQUIRED_TIME_WINDOW
  });

  // Don't fetch data from DB if we already have them in the store
  if (
    !options.forceReload &&
    recordsTimeRange &&
    isWithinTimeRange(recordsTimeRange, requiredTimeRange)
  ) {
    dispatch(activity.actions.setSelectedTimeRange(selectedTimeRange));
    return;
  }

  dispatch(activity.actions.getRecordsStart());
  try {
    if (databaseService === undefined) {
      throw Error("Unable to connect to database");
    }

    // Only fetch all domains & activity time range on initialization
    if (options.forceReload || !getIsInitialized(state)) {
      const [allDomains, totalTimeRange, records] = await Promise.all([
        databaseService.fetchAllActivityDomains(),
        databaseService.fetchActivityTimeRange(),
        databaseService.fetchActivityRecords(requiredTimeRange)
      ]);

      if (onSuccess) {
        onSuccess();
      }

      // Batch actions to ensure smooth UI transition on store updates
      batch(() => [
        dispatch(activity.actions.getRecordsSuccess(records || [])),
        dispatch(activity.actions.setRecordsTimeRange(requiredTimeRange)),
        dispatch(activity.actions.setSelectedTimeRange(selectedTimeRange)),
        dispatch(activity.actions.setDomains(allDomains || {})),
        dispatch(activity.actions.setTotalTimeRange(totalTimeRange))
      ]);
    } else {
      const records = await databaseService.fetchActivityRecords(
        requiredTimeRange
      );

      if (onSuccess) {
        onSuccess();
      }

      // Batch actions to ensure smooth UI transition on store updates
      batch(() => [
        dispatch(activity.actions.getRecordsSuccess(records || [])),
        dispatch(activity.actions.setRecordsTimeRange(requiredTimeRange)),
        dispatch(activity.actions.setSelectedTimeRange(selectedTimeRange))
      ]);
    }
  } catch (error) {
    if (onError) {
      onError(error);
    }
    dispatch(activity.actions.getRecordsFailure(error));
  }
};

const deleteRecords = (
  recordIds: number[],
  onSuccess?: () => void,
  onError?: (error: Error) => void
): ThunkAction => async (dispatch, getState, { databaseService }) => {
  dispatch(activity.actions.deleteRecordsStart());
  try {
    if (databaseService === undefined) {
      throw Error("Unable to connect to DB");
    }

    await databaseService.deleteActivityRecords(recordIds);
    if (onSuccess) {
      onSuccess();
    }
    dispatch(activity.actions.deleteRecordsSuccess(recordIds));
  } catch (error) {
    if (onError) {
      onError(error);
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
