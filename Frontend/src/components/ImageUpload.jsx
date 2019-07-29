import React, { useRef } from "react";
import { updateAvatar } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

export default () => {
  const refresh_token = useSelector(
    state => state.rootReducer.user.refresh_token
  );
  const inputEl = useRef(null);
  const dispatch = useDispatch();

  const handleChange = e => {
    e.preventDefault();
    dispatch(updateAvatar(inputEl.current.files[0], refresh_token));
  };

  return (
    <input
      name="UploadFile"
      type="file"
      ref={inputEl}
      onChange={e => handleChange(e)}
    />
  );
};
