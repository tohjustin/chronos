import { createStore, applyMiddleware, Middleware } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";
import thunk from "redux-thunk";

import rootReducer from "./root-reducer";

// configure middlewares
const middlewares: Middleware[] = [thunk];
// compose enhancers
const composeEnhancers = composeWithDevTools({
  realtime: true,
  port: 8098
});
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState = {};

// create store
const store = createStore(rootReducer, initialState, enhancer);

// export store singleton instance
export default store;
