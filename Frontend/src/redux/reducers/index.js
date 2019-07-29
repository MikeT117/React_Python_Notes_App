import { combineReducers } from "redux";

const initialState = {
  notes: {
    all: [],
    filtered: [],
    unsynced: [],
    deleted: [],
    editor: {
      open: false,
      note: null
    },
    synced: true,
    syncFailure: false
  },
  user: {
    isLoggedIn: false,
    syncInterval: 5
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTE":
    case "DELETE_NOTE":
    case "UPDATE_NOTE":
    case "LOAD_NOTES":
    case "FILTER_NOTES":
    case "SYNC_WITH_BACKEND":
    case "EDITOR_LOAD_NEW":
    case "EDITOR_LOAD_EXISTING":
    case "SYNC_DELETE":
    case "SYNC_ADD_UPDATE":
    case "CLOSE_EDITOR":
      return Object.assign({}, state, {
        notes: notesReducer(state.notes, action)
      });
    case "LOGIN":
    case "RETRIEVE_ACCOUNT_DATA":
    case "MODIFY_SYNC_INTERVAL":
    case "UPDATE_AVATAR":
      return Object.assign({}, state, {
        user: userReducer(state.user, action)
      });

    case "LOGOUT":
      return { ...initialState };
    default:
      return state;
  }
};

const notesReducer = (state = initialState.notes, action) => {
  switch (action.type) {
    case "ADD_NOTE":
      return {
        ...state,
        all: [...state.all, { ...action.payload }],
        unsynced: [...state.unsynced, { ...action.payload }],
        synced: false
      };

    case "DELETE_NOTE":
      console.log(action.payload);
      if (state.unsynced.filter(d => d.id === action.payload.id).length > 0) {
        return {
          ...state,
          all: state.all.filter(d => d.id !== action.payload.id),
          unsynced: state.unsynced.filter(d => d.id !== action.payload.id),
          synced: false
        };
      }
      return {
        ...state,
        all: state.all.filter(d => d.id !== action.payload.id),
        deleted: [...state.deleted, action.payload],
        synced: false
      };

    case "UPDATE_NOTE":
      return {
        ...state,
        all: state.all.map(d => {
          if (d.id === action.payload.id) return { ...action.payload };
          return d;
        }),
        unsynced:
          state.unsynced.length > 0
            ? state.unsynced.map(d => {
                if (d.id === action.payload.id)
                  return { ...d, ...action.payload };
                return d;
              })
            : [...state.unsynced, action.payload],
        synced: false,
        filtered: []
      };

    case "EDITOR_LOAD_EXISTING":
      return {
        ...state,
        editor: {
          ...state.editor,
          open: true,
          note: {
            ...state.all.filter(d => {
              console.log(d);
              if (d.id === action.payload) return d;
              return null;
            })[0],
            newNote: false
          }
        }
      };

    case "EDITOR_LOAD_NEW":
      return { ...state, editor: { open: true, note: action.payload } };
    case "CLOSE_EDITOR":
      return { ...state, editor: { open: false, note: null } };
    case "FILTER_NOTES":
      return {
        ...state,
        filtered: state.all.filter(d => {
          if (
            d.title.toLowerCase().includes(action.payload) ||
            d.body.toLowerCase().includes(action.payload)
          )
            return d;
          return null;
        })
      };
    case "LOAD_NOTES":
      return { ...state, all: action.payload };
    case "SYNC_BEGIN":
      return { ...state };
    case "SYNC_ADD_UPDATE":
      return {
        ...state,
        unsynced: state.unsynced.filter(d => d.id !== action.payload)
      };
    case "SYNC_DELETE":
      return {
        ...state,
        deleted: state.deleted.filter(d => d.id !== action.payload)
      };
    case "SYNC_COMPLETED_SUCCESSFULY":
      return {
        ...state,
        synced: true,
        syncFailure: false
      };
    case "SYNC_FAILURE":
      return {
        ...state,
        syncFailure: false
      };
    default:
      return state;
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, ...action.payload };
    case "RETRIEVE_ACCOUNT_DATA":
      return { ...state, ...action.payload };
    case "UPDATE_AVATAR":
      return { ...state, avatar: action.payload };
    case "MODIFY_SYNC_INTERVAL":
      return { ...state, syncInterval: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  rootReducer
});
