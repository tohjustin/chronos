import { routerMiddleware } from "connected-react-router";
import { createHashHistory } from "history";
import _ from "lodash";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "remote-redux-devtools";

import createRootReducer from "./root-reducer";
import { RootAction, RootState } from "./types";

// configure middlewares
export const history = createHashHistory();
const middlewares = [routerMiddleware(history), thunk];

let enhancer = applyMiddleware(...middlewares);
if (process.env.REACT_APP_DEBUG_MODE) {
  // compose enhancers (typed as `any` b/c `composeWithDevTools` doesn't work
  // nicely with Redux on Typescript 😭 This shouldn't affect the type-checking
  // for our redux state, action & reducers though...)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const composeEnhancers: any = composeWithDevTools({
    port: 8098,
    realtime: true,
    actionSanitizer: (action: RootAction) => {
      const sanitizedAction = _.cloneDeep(action);

      if (action.type === "LOAD_ACTIVITY_SUCCESS" && action.payload) {
        const recordCount = action.payload.length;
        const recordsPlaceholder = `<<LOTS_OF_RECORDS_${recordCount}>>`;
        _.set(sanitizedAction, "payload", recordsPlaceholder);
      }

      return sanitizedAction;
    },
    stateSanitizer: (state: RootState) => {
      const sanitizedState = _.cloneDeep(state);

      if (state.activity && state.activity.records) {
        const recordCount = state.activity.records.length;
        const recordsPlaceholder = `<<LOTS_OF_RECORDS_${recordCount}>>`;
        _.set(sanitizedState, "activity.records", recordsPlaceholder);
      }

      return sanitizedState;
    }
  });
  enhancer = composeEnhancers(enhancer);
}

const INITIAL_STATE = {};
const store = createStore(createRootReducer(history), INITIAL_STATE, enhancer);

// export store singleton instance
export default store;
