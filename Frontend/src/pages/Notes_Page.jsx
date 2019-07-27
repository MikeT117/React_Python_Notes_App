import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Note from "../components/Note";
import Header from "../components/Header";
import Editor from "../components/Editor";
import { getAllNotes } from "../api";
import { syncToBackend } from "../api";

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

export default data => {
  const { userId, refresh_token } = data;

  const allNotes = useSelector(state => state.rootReducer.notes.all);
  const filteredNotes = useSelector(state => state.rootReducer.notes.filtered);
  const unsyncedNotes = useSelector(state => state.rootReducer.notes.unsynced);
  const deletedNotes = useSelector(state => state.rootReducer.notes.deleted);
  const [editor, setEditor] = useState({ open: false, note: null });
  const dispatch = useDispatch();
  const initiateSync = () => {
    unsyncedNotes.length > 0 &&
      unsyncedNotes.map(d => dispatch(syncToBackend(refresh_token, d)));
    deletedNotes.length > 0 &&
      deletedNotes.map(d =>
        dispatch(
          syncToBackend(
            refresh_token,
            d,
            "deleteNote",
            "SYNC_WITH_BACKEND_DELETE"
          )
        )
      );
    // dispatch({ type: "SYNC_COMPLETED_SUCCESSFULY" });
  };

  useEffect(() => {
    dispatch(getAllNotes(refresh_token));
  }, [dispatch]);
  return (
    <>
      <Header
        add
        search
        setSearch={e => dispatch({ type: "FILTER_NOTES", payload: e })}
        initiateSync={initiateSync}
        newNote={() =>
          setEditor({
            ...editor,
            open: true,
            note: {
              title: "",
              body: "",
              newNote: true,
              user: userId,
              id: Math.max.apply(Math, allNotes.map(d => d.id)) + 1
            }
          })
        }
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
                setEditor({
                  ...editor,
                  open: true,
                  note: { ...d, newNote: false }
                })
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
                setEditor({
                  ...editor,
                  open: true,
                  note: { ...d, newNote: false }
                })
              }
            />
          ))}
      </Wrapper>
      {editor.open && (
        <Editor
          {...editor}
          close={() => setEditor({ ...editor, open: false })}
        />
      )}
    </>
  );
};
