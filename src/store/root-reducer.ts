import { combineReducers } from "redux";
import { reducer as activityReducer } from "./activity";

const rootReducer = combineReducers({
  activity: activityReducer
});

export default rootReducer;
