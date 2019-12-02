import { createSlice, PayloadAction, Action } from "redux-starter-kit";
import { batch } from "react-redux";
import { ThunkAction } from "redux-thunk";

import {
  ANALYTICS_REQUIRED_TIME_WINDOW,
  DOMAIN_ANALYTICS_REQUIRED_TIME_WINDOW
} from "../../constants/analytics";
import { InitDatabaseConnection } from "../../db";
import { Activity, Domain } from "../../models/activity";
import { DefiniteTimeRange, TimeRange } from "../../models/time";
import { extendTimeRange, isWithinTimeRange } from "../../utils/dateUtils";
import { DEFAULT_TIME_RANGE } from "../router/constants";
import { getSearchParamsSelectedDomain } from "../router/selectors";
import { RootState } from "../index";

import {
  getEffectiveSearchParamsSelectedTimeRange,
  getRecordsTimeRange
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
  domains: {},
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
        record => !action.payload.includes(record.id as number)
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
    getRecordsSuccess(state, action: PayloadAction<Activity[]>) {
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
  options: { forceReload: boolean } = { forceReload: false }
): ThunkAction<void, RootState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const isLoadingDomainAnalytics =
    getSearchParamsSelectedDomain(state) !== null;
  const recordsTimeRange = getRecordsTimeRange(state);
  const selectedTimeRange = getEffectiveSearchParamsSelectedTimeRange(state);

  // Ensure we fetched enough data that's required to compute analytics
  const requiredTimeRange = extendTimeRange(selectedTimeRange, {
    months: isLoadingDomainAnalytics
      ? DOMAIN_ANALYTICS_REQUIRED_TIME_WINDOW
      : ANALYTICS_REQUIRED_TIME_WINDOW
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
    const db = InitDatabaseConnection();
    if (db === undefined) {
      throw "Unable to initialize DB connection";
    }

    const [allDomains, records, activityTimeRange] = await Promise.all([
      db.fetchAllActivityDomains(),
      db.fetchActivityRecords(requiredTimeRange),
      db.fetchActivityTimeRange()
    ]);

    // Batch actions to ensure smooth UI transition on store updates
    batch(() => [
      dispatch(activity.actions.getRecordsSuccess(records || [])),
      dispatch(activity.actions.setDomains(allDomains || {})),
      dispatch(activity.actions.setRecordsTimeRange(requiredTimeRange)),
      dispatch(activity.actions.setSelectedTimeRange(selectedTimeRange)),
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
