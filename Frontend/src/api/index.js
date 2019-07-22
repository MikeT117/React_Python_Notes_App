import { async } from "q";

export const getAllNotes = (search = "") => {
  return async dispatch => {
    const refresh_token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjMyMzIwOTcsIm5iZiI6MTU2MzIzMjA5NywianRpIjoiYzE4NWNjYWMtODAxZS00ZWQ2LWE5OTEtNzcyZGU2ODJlMGFkIiwiZXhwIjoxNTY1ODI0MDk3LCJpZGVudGl0eSI6IlJhem9yMTE2IiwidHlwZSI6InJlZnJlc2gifQ.LA9KBfsvgHYUe17sQnP0OaA3nPxr1EDnf0VEYI23qTg";
    try {
      const resp = await fetch(
        `http://${window.location.hostname}:5000/retrieveNotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refresh_token}`
          },
          body: JSON.stringify({ filter: search })
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

export const retrieveAccountData = () => {
  const refresh_token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjMyMzIwOTcsIm5iZiI6MTU2MzIzMjA5NywianRpIjoiYzE4NWNjYWMtODAxZS00ZWQ2LWE5OTEtNzcyZGU2ODJlMGFkIiwiZXhwIjoxNTY1ODI0MDk3LCJpZGVudGl0eSI6IlJhem9yMTE2IiwidHlwZSI6InJlZnJlc2gifQ.LA9KBfsvgHYUe17sQnP0OaA3nPxr1EDnf0VEYI23qTg";
  return async dispatch => {
    try {
      const resp = await fetch(
        `http://${window.location.hostname}:5000/retrieveAccountData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refresh_token}`
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
        dispatch({ type: "LOGIN", json });
      }
    } catch (e) {
      console.log("Error logging in, Please try again later", e);
    }
  };
};

export const save = data => {
  const refresh_token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjMyMzIwOTcsIm5iZiI6MTU2MzIzMjA5NywianRpIjoiYzE4NWNjYWMtODAxZS00ZWQ2LWE5OTEtNzcyZGU2ODJlMGFkIiwiZXhwIjoxNTY1ODI0MDk3LCJpZGVudGl0eSI6IlJhem9yMTE2IiwidHlwZSI6InJlZnJlc2gifQ.LA9KBfsvgHYUe17sQnP0OaA3nPxr1EDnf0VEYI23qTg";

  return async dispatch => {
    try {
      const resp = await fetch(
        `http://${window.location.hostname}:5000/saveUpdateNote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refresh_token}`
          },
          body: JSON.stringify(data)
        }
      );

      if (resp.status === 200) {
        dispatch(getAllNotes());
        return;
      }
      // dispatch an error alert
    } catch (e) {
      console.log("Issue saving note, Please try again later!", e);
    }
  };
};
