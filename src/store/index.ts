import { routerMiddleware } from "connected-react-router";
import { createHashHistory } from "history";
import _ from "lodash";
import { createStore, applyMiddleware, Middleware } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";
import thunk from "redux-thunk";

import createRootReducer from "./root-reducer";
import { RootAction, RootState } from "./types";

// configure middlewares
export const history = createHashHistory();
const middlewares: Middleware[] = [routerMiddleware(history), thunk];
// compose enhancers
const composeEnhancers = composeWithDevTools({
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
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState = {};

// create store
const store = createStore(createRootReducer(history), initialState, enhancer);

// export store singleton instance
export default store;
