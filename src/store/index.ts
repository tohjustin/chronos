import { connectRouter, routerMiddleware } from "connected-react-router";
import { createHashHistory } from "history";
import { applyMiddleware, combineReducers } from "redux";
import { configureStore } from "redux-starter-kit";
import thunk from "redux-thunk";

import { ValueOf } from "../utils/typeUtils";

import {
  actions as activityActions,
  reducer as activityReducer,
  selectors as activitySelectors
} from "./activity";
import {
  actions as dataMigrationActions,
  reducer as dataMigrationReducer
} from "./dataMigration";
import { composeEnhancers } from "./reduxDevTools";

export const actions = { ...activityActions, ...dataMigrationActions };
export const selectors = { ...activitySelectors };

export const history = createHashHistory();
const middleware = [thunk, routerMiddleware(history)];

// Couldn't seem to get enhancers to be typed correctly... 😢
// Not a big deal at the moment as using `any` here doesn't affect the
// type-checking for our redux state, action, reducers & selectors
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let enhancer: any = applyMiddleware(...middleware);
if (process.env.REACT_APP_DEBUG_MODE) {
  enhancer = composeEnhancers(enhancer);
}

export const store = configureStore({
  devTools: false,
  enhancers: [enhancer],
  reducer: combineReducers({
    activity: activityReducer,
    dataMigration: dataMigrationReducer,
    router: connectRouter(history)
  })
});

export type Dispatch = typeof store.dispatch;
export type RootAction = ReturnType<ValueOf<typeof actions>>;
export type RootState = ReturnType<typeof store.getState>;
