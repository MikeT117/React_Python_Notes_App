import { createStore, compose, applyMiddleware } from "redux";
import appReducer from "../reducers/index";
// import { loadState, saveState } from "../persistence";
import thunk from "redux-thunk";
// const persistedState = loadState();

const store = createStore(
  appReducer,
  // persistedState,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

// store.subscribe(() => saveState(store.getState()))

export default store;
