import { connectRouter, routerMiddleware } from "connected-react-router";
import { createHashHistory } from "history";
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  StoreEnhancer
} from "redux";
import thunk from "redux-thunk";

import { InitDatabaseService } from "../db";
import { ValueOf } from "../utils/typeUtils";

import {
  actions as activityActions,
  reducer as activityReducer,
  selectors as activitySelectors
} from "./activity";
import {
  actions as dataMigrationActions,
  reducer as dataMigrationReducer,
  selectors as dataMigrationSelectors
} from "./dataMigration";
import {
  actions as routerActions,
  constants as routerConstants,
  selectors as routerSelectors
} from "./router";
import composeWithDevTools from "./reduxDevTools";

export const actions = {
  ...activityActions,
  ...dataMigrationActions,
  ...routerActions
};
export const constants = {
  ...routerConstants
};
export const selectors = {
  ...activitySelectors,
  ...dataMigrationSelectors,
  ...routerSelectors
};

// Setup store enhancers
const finalCompose = process.env.REACT_APP_REMOTE_DEBUG_MODE
  ? composeWithDevTools
  : compose;
export const history = createHashHistory();
const databaseService = InitDatabaseService();
const middleware = [
  thunk.withExtraArgument({ databaseService }),
  routerMiddleware(history)
];
const storeEnhancers = [applyMiddleware(...middleware)];
const composedEnhancer = finalCompose(...storeEnhancers) as StoreEnhancer;

// Using `createStore` directly instead of RSK's `configureStore` b/c we need to
// compose with `remote-redux-devtools`.
export const store = createStore(
  combineReducers({
    activity: activityReducer,
    dataMigration: dataMigrationReducer,
    router: connectRouter(history)
  }),
  {}, // empty preloaded state
  composedEnhancer
);

export type Dispatch = typeof store.dispatch;
export type RootAction = ReturnType<ValueOf<typeof actions>>;
export type RootState = ReturnType<typeof store.getState>;
