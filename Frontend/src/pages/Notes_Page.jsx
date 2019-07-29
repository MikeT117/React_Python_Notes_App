import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Note from "../components/Note";
import Header from "../components/Header";
import Editor from "../components/Editor";
import { getAllNotes } from "../redux/actions";
import { editorLoadNewNote } from "../redux/actions";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  @media (max-width: 12000px) {
    justify-content: flex-start;
  }
  padding: 0 1.5em;
  @media (max-width: 900px) {
    justify-content: space-evenly;
  }
`;

export default (data, sync) => {
  const { userId, refresh_token } = data;
  const allNotes = useSelector(state => state.rootReducer.notes.all);
  const filteredNotes = useSelector(state => state.rootReducer.notes.filtered);
  const editorOpen = useSelector(state => state.rootReducer.notes.editor.open);
  const dispatch = useDispatch();

  const genTempId = () => {
    const highestId = Math.max.apply(Math, allNotes.map(d => d.id)) + 1;
    if (Number.isInteger(highestId)) return highestId;
    return 1;
  };

  useEffect(() => {
    dispatch(getAllNotes(refresh_token));
  }, [dispatch, refresh_token]);

  return (
    <>
      <Header
        sync={sync}
        add
        search
        setSearch={e => dispatch({ type: "FILTER_NOTES", payload: e })}
        addNewNote={() => dispatch(editorLoadNewNote(userId, genTempId()))}
      />

      <Wrapper>
        {allNotes &&
          filteredNotes.length === 0 &&
          allNotes.map(d => (
            <Note
              key={d.id}
              title={d.title}
              body={d.body}
              onClick={() =>
                dispatch({ type: "EDITOR_LOAD_EXISTING", payload: d.id })
              }
            />
          ))}
        {filteredNotes.length > 0 &&
          filteredNotes.map(d => (
            <Note
              key={d.id}
              title={d.title}
              body={d.body}
              onClick={() =>
                dispatch({ type: "EDITOR_LOAD_EXISTING", payload: d.id })
              }
            />
          ))}
      </Wrapper>
      {editorOpen && <Editor />}
    </>
  );
};
