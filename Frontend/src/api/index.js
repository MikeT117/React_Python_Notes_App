export const getAllNotes = creds => {
  return async dispatch => {
    try {
      const resp = await fetch(
        `http://${window.location.hostname}:5000/retrieveNotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${creds}`
          },
          body: ""
        }
      );
      if (resp.status === 200) {
        const json = await resp.json();
        dispatch({ type: "RETRIEVE_NOTES", payload: json });
      }
    } catch (e) {
      console.log("Error getting notes!", e);
    }
  };
};

export const retrieveAccountData = creds => {
  return async dispatch => {
    try {
      const resp = await fetch(
        `http://${window.location.hostname}:5000/retrieveAccountData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${creds}`
          }
        }
      );
      if (resp.status === 200) {
        const json = await resp.json();
        dispatch({ type: "RETRIEVE_ACCOUNT_DATA", payload: json });
      }
    } catch (e) {
      console.log("Error retrieving account data", e);
    }
  };
};

export const login = userDetails => {
  return async dispatch => {
    try {
      const resp = await fetch(
        `http://${window.location.hostname}:5000/login`,
        {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(userDetails)
        }
      );
      if (resp.status === 200) {
        const json = await resp.json();
        dispatch({ type: "LOGIN", payload: json });
      }
    } catch (e) {
      console.log("Error logging in, Please try again later", e);
    }
  };
};

export const syncToBackend = (
  creds,
  data,
  endpoint = "saveUpdateNote",
  type = "SYNC_WITH_BACKEND_ADD_UPDATE"
) => {
  // dispatch an event to notify the user that syncing has begun
  return async dispatch => {
    try {
      const resp = await fetch(
        `http://${window.location.hostname}:5000/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${creds}`
          },
          body: JSON.stringify(data)
        }
      );

      if (resp.status === 200) {
        dispatch({ type: type, payload: data.id });
        // dispatch an event to notify the user that syncing has completed
        return;
      }
      // dispatch an event to notify the user that syncing has failed
    } catch (e) {
      console.log("Issue during sync, Please try again later!", e);
    }
  };
};
