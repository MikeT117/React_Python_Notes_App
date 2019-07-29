import { useEffect, useCallback } from "react";
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

  const dispatch = useCallback(useDispatch(), []);

  const unsyncedSync = useCallback(() => {
    unsynced.length > 0 &&
      unsynced.map(d => {
        dispatch(syncToBackend(creds, d, "saveUpdateNote", "SYNC_ADD_UPDATE"));
        return null;
      });
  }, [unsynced, creds, dispatch]);

  const deletedSync = useCallback(() => {
    deleted.length > 0 &&
      deleted.map(d =>
        dispatch(syncToBackend(creds, d, "deleteNote", "SYNC_DELETE"))
      );
  }, [deleted, creds, dispatch]);

  const unsyncedInitiator = useCallback(() => {
    clearTimeout(unsyncedTimeout);
    unsyncedTimeout = setTimeout(() => {
      unsyncedSync();
    }, syncInterval);
  }, [unsyncedSync, syncInterval]);

  const deletedInitiator = useCallback(() => {
    clearTimeout(deleteTimeout);
    deleteTimeout = setTimeout(() => {
      deletedSync();
    }, syncInterval);
  }, [deletedSync, syncInterval]);

  const sync = useCallback(() => {
    unsyncedSync();
    deletedSync();
    console.log("Test");
  }, [unsyncedSync, deletedSync]);

  useEffect(() => unsyncedInitiator(), [unsyncedInitiator]);
  useEffect(() => deletedInitiator(), [deletedInitiator]);

  return [sync];
};
