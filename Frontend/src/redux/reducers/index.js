import { combineReducers } from "redux";

const initialState = {
  notes: {
    base: [],
    main: []
  },
  user: {
    isLoggedIn: true,
    info: {}
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTE":
    case "DELETE_NOTE":
    case "UPDATE_NOTE":
    case "RETRIEVE_NOTES":
    case "FILTER_NOTES":
      return Object.assign({}, state, {
        notes: notesReducer(state.notes, action)
      });
    case "LOGIN":
    case "LOGOUT":
    case "RETRIEVE_ACCOUNT_DATA":
      return Object.assign({}, state, {
        user: userReducer(state.user, action)
      });
    default:
      return state;
  }
};

const notesReducer = (state = initialState.notes, action) => {
  switch (action.type) {
    case "ADD_NOTE":
      return [...state.base, action.payload];
    case "DELETE_NOTE":
      return state.base.filter(d => d.id !== action.payload);
    case "UPDATE_NOTE":
      let newData = state.base.map(d => {
        if (d.id === action.payload.id) {
          return {
            ...d,
            title: action.payload.title,
            body: action.payload.body
          };
        }
        return d;
      });

      return { ...state, base: newData, main: newData };
    case "FILTER_NOTES":
      return {
        ...state,
        main: state.base.filter(d => {
          if (
            d.title.includes(action.payload) ||
            d.body.includes(action.payload)
          )
            return d;
        })
      };
    case "RETRIEVE_NOTES":
      return { ...state, base: action.payload, main: action.payload };
    default:
      return state;
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, ...action.payload };
    case "LOGOUT":
      return { isLoggedIn: false, info: {} };
    case "RETRIEVE_ACCOUNT_DATA":
      return { ...state, info: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  rootReducer,
  notesReducer,
  userReducer
});
