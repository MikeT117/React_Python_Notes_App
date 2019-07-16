import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`

const Note = styled.div`
  flex-grow: 1;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.12);
  max-width: 80%;
  min-width: 20%;
  margin: 8px 16px 8px 16px;
`

export default () => {
  const [notes, set] = useState(null);

  useEffect(() => {
    const data = async () => {
      const refresh_token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjMyMzIwOTcsIm5iZiI6MTU2MzIzMjA5NywianRpIjoiYzE4NWNjYWMtODAxZS00ZWQ2LWE5OTEtNzcyZGU2ODJlMGFkIiwiZXhwIjoxNTY1ODI0MDk3LCJpZGVudGl0eSI6IlJhem9yMTE2IiwidHlwZSI6InJlZnJlc2gifQ.LA9KBfsvgHYUe17sQnP0OaA3nPxr1EDnf0VEYI23qTg";
  
      const resp = await fetch("http://localhost:5000/retrieveAllNotes", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refresh_token}`
        },
      });
    
      const json = await resp.json();
      set(json);
    };
    data()
  }, [])
  
  console.log(notes)
  return <Wrapper>{notes && notes.map(d => <Note key={d.id}>{d.title}</Note>)}</Wrapper>
};
