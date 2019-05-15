/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";

import { reducer as activityReducer } from "./activity";
import { reducer as dataMigrationReducer } from "./dataMigration";

const createRootReducer = (history: History<any>) =>
  combineReducers({
    activity: activityReducer,
    dataMigration: dataMigrationReducer,
    router: connectRouter(history)
  });

export default createRootReducer;
