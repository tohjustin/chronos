import _ from "lodash";
import { composeWithDevTools } from "remote-redux-devtools";

import { ActivityRecord } from "../models/activity";

import { ActivityState } from "./activity/slice";
import { RootAction, RootState } from "./index";

type SanitizedActivityAction = {
  type: string;
  payload: ActivityRecord[] | string;
};
type RootSanitizedActions = RootAction | SanitizedActivityAction;
interface SanitizedActivityState extends Omit<ActivityState, "records"> {
  records: ActivityRecord[] | string;
}
interface RootSanitizedState extends Omit<RootState, "activity"> {
  activity: SanitizedActivityState;
}

export const composeEnhancers = composeWithDevTools({
  port: 8098,
  realtime: true,
  actionSanitizer: (action: RootAction) => {
    const sanitizedAction: RootSanitizedActions = _.cloneDeep(action);
    if (
      typeof sanitizedAction !== "function" &&
      sanitizedAction.type === "getRecordsSuccess" &&
      sanitizedAction.payload &&
      Array.isArray(sanitizedAction.payload)
    ) {
      const recordCount = sanitizedAction.payload.length;
      const recordsPlaceholder = `<<${recordCount}_RECORDS>>`;
      sanitizedAction.payload = recordsPlaceholder;
    }

    return sanitizedAction;
  },
  stateSanitizer: (state: RootState) => {
    const sanitizedState: RootSanitizedState = _.cloneDeep(state);
    if (state.activity && state.activity.records) {
      const recordCount = state.activity.records.length;
      const recordsPlaceholder = `<<${recordCount}_RECORDS>>`;
      sanitizedState.activity.records = recordsPlaceholder;
    }

    return sanitizedState;
  }
});
