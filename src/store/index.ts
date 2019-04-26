import { routerMiddleware } from "connected-react-router";
import { createHashHistory } from "history";
import { createStore, applyMiddleware, Middleware } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";
import thunk from "redux-thunk";

import createRootReducer from "./root-reducer";

// configure middlewares
export const history = createHashHistory();
const middlewares: Middleware[] = [routerMiddleware(history), thunk];
// compose enhancers
const composeEnhancers = composeWithDevTools({
  realtime: true,
  port: 8098
});
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState = {};

// create store
const store = createStore(createRootReducer(history), initialState, enhancer);

// export store singleton instance
export default store;
