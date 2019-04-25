import { createStore, applyMiddleware, Middleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./root-reducer";

// configure middlewares
const middlewares: Middleware[] = [];
// compose enhancers
const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState = {};

// create store
const store = createStore(rootReducer, initialState, enhancer);

// export store singleton instance
export default store;
