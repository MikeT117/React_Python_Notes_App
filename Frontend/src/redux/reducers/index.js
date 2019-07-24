import { combineReducers } from "redux";
import genTimeStamp from "../../functions";

const initialState = {
  notes: {
    base: [],
    main: [],
    unsynced: []
  },
  user: {
    isLoggedIn: false,
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
    case "SYNC_WITH_BACKEND":
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
  const timestamp = genTimeStamp();
  switch (action.type) {
    case "ADD_NOTE":
      const newNote = {
        ...action.payload,
        id: Math.max.apply(Math, state.base.map(d => d.id)) + 1,
        newNote: true,
        timeStampModified: timestamp,
        timeStampEntered: timestamp
      };
      const base = [...state.base, newNote];

      return {
        ...state,
        base: base,
        main: base,
        unsynced: [...state.unsynced, newNote]
      };
    case "DELETE_NOTE":
      return state.base.filter(d => d.id !== action.payload);

    case "UPDATE_NOTE":
      let newData = state.base.map(d => {
        if (d.id === action.payload.id) {
          return {
            ...action.payload,
            timeStampModified: timestamp
          };
        }
        return d;
      });
      return {
        ...state,
        base: newData,
        main: newData,
        unsynced: [
          ...state.unsynced,
          {
            ...action.payload,
            timeStampModified: timestamp,
            newNote: false
          }
        ]
      };

    case "FILTER_NOTES":
      return {
        ...state,
        main: state.base.filter(d => {
          if (
            d.title.toLowerCase().includes(action.payload) ||
            d.body.toLowerCase().includes(action.payload)
          )
            return d;
        })
      };
    case "RETRIEVE_NOTES":
      return { ...state, base: action.payload, main: action.payload };
    case "SYNC_WITH_BACKEND":
      return {
        ...state,
        unsynced: state.unsynced.filter(d => d.id != action.payload)
      };
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
