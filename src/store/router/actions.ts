import { push } from "connected-react-router";
import { Action } from "redux-starter-kit";
import { ThunkAction } from "redux-thunk";

import { TimeRange } from "../../models/time";
import { formatDateString } from "../../utils/dateUtils";
import { computeSearchParams } from "../../utils/urlUtils";
import { RootState } from "../index";

import {
  DEFAULT_TIME_RANGE,
  SEARCH_PARAM_DOMAIN,
  SEARCH_PARAM_START_DATE,
  SEARCH_PARAM_END_DATE
} from "./constants";
import {
  getSearchParams,
  getSearchParamsSelectedDomain,
  getSearchParamsSelectedTimeRange
} from "./selectors";

const setSelectedDomain = (
  domain: string | null
): ThunkAction<void, RootState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const selectedDomain = getSearchParamsSelectedDomain(state);
  if (selectedDomain === domain) {
    return;
  }

  const searchParams = getSearchParams(state);
  const newSearchParams = computeSearchParams(searchParams, {
    [SEARCH_PARAM_DOMAIN]: domain
  });
  dispatch(push(`?${newSearchParams.toString()}`));
};

const setSelectedTimeRange = (
  range: TimeRange | null
): ThunkAction<void, RootState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const selectedTimeRange = getSearchParamsSelectedTimeRange(state);
  if (
    (range !== null &&
      selectedTimeRange.end === range.end &&
      selectedTimeRange.start === range.start) ||
    (range === null && selectedTimeRange === DEFAULT_TIME_RANGE)
  ) {
    return;
  }

  const searchParams = getSearchParams(state);
  const newSearchParams = computeSearchParams(searchParams, {
    [SEARCH_PARAM_START_DATE]:
      range && range.start ? formatDateString(range.start) : null,
    [SEARCH_PARAM_END_DATE]:
      range && range.end ? formatDateString(range.end) : null
  });
  dispatch(push(`?${newSearchParams.toString()}`));
};

export const actions = {
  setSelectedDomain,
  setSelectedTimeRange
};
