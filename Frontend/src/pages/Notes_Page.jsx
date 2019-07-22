import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Note from "../components/Note";
import Header from "../components/Header";
import Editor from "../components/Editor";
import { getAllNotes } from "../api";

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

export default () => {
  const notes = useSelector(state => state.rootReducer.notes.main);

  const [editor, setEditor] = useState({
    newNote: true,
    open: false,
    noteData: null
  });

  const [saving, setSaving] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllNotes());
  }, []);

  return (
    <>
      <Header
        add
        search
        saving={saving}
        newNote={() => setEditor({ ...editor, newNote: true, open: true })}
      />
      <Wrapper>
        {notes &&
          notes.map(d => (
            <Note
              key={d.id}
              title={d.title}
              body={d.body}
              onClick={() =>
                setEditor({
                  ...editor,
                  newNote: false,
                  open: true,
                  noteData: [d.id, d.title, d.body]
                })
              }
            />
          ))}
      </Wrapper>

      {editor.open && (
        <Editor
          {...editor}
          saving={e => setSaving(e)}
          close={() => setEditor({ ...editor, open: false })}
        />
      )}
    </>
  );
};
