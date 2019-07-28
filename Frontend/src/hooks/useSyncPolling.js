import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { syncToBackend } from "../redux/actions";

let deleteTimeout;
let unsyncedTimeout;

export default () => {
  const creds = useSelector(state => state.rootReducer.user.refresh_token);
  const unsynced = useSelector(state => state.rootReducer.notes.unsynced);
  const deleted = useSelector(state => state.rootReducer.notes.deleted);
  const syncInterval =
    useSelector(state => state.rootReducer.user.syncInterval) * 1000 || 2000;

  const dispatch = useDispatch();

  const unsyncedSync = () => {
    unsynced.length > 0 &&
      unsynced.map(d =>
        dispatch(syncToBackend(creds, d, "saveUpdateNote", "SYNC_ADD_UPDATE"))
      );
  };

  const deletedSync = () => {
    deleted.length > 0 &&
      deleted.map(d =>
        dispatch(syncToBackend(creds, d, "deleteNote", "SYNC_DELETE"))
      );
  };

  const unsyncedInitiator = () => {
    clearTimeout(unsyncedTimeout);
    unsyncedTimeout = setTimeout(() => {
      unsyncedSync();
    }, syncInterval);
  };

  const deletedInitiator = () => {
    clearTimeout(deleteTimeout);
    deleteTimeout = setTimeout(() => {
      deletedSync();
    }, syncInterval);
  };

  const sync = () => {
    unsyncedSync();
    deletedSync();
  };

  useEffect(() => {
    sync();
  }, []);

  useEffect(() => unsyncedInitiator(), [unsynced]);
  useEffect(() => deletedInitiator(), [deleted]);

  return [sync];
};
