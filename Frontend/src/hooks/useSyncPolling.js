import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { syncToBackend } from "../api/index";

export default () => {
  const creds = useSelector(state => state.rootReducer.user.refresh_token);
  const unsynced = useSelector(state => state.rootReducer.notes.unsynced);
  const deleted = useSelector(state => state.rootReducer.notes.deleted);
  const syncInterval =
    useSelector(state => state.rootReducer.user.syncInterval) * 1000;

  const dispatch = useDispatch();

  let deleteTimeout;
  let unsyncedTimeout;

  const unsyncedSync = () => {
    unsynced.map(d =>
      dispatch(
        syncToBackend(
          creds,
          d,
          "saveUpdateNote",
          "SYNC_WITH_BACKEND_ADD_UPDATE"
        )
      )
    );
  };

  const deletedSync = () => {
    deleted.map(d =>
      dispatch(
        syncToBackend(creds, d, "deleteNote", "SYNC_WITH_BACKEND_DELETE")
      )
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

  useEffect(() => {
    if (unsynced.length > 0) unsyncedSync();
    if (deleted.length > 0) deletedSync();
  }, []);

  useEffect(() => unsyncedInitiator(), [unsynced]);
  useEffect(() => deletedInitiator(), [deleted]);

  return [setSyncInterval];
};
