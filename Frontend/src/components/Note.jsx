import React from "react";
import styled from "styled-components";

const Note = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
  margin: 0px 8px 8px 8px;
  max-width: 420px;
  min-width: 280px;
`;

const Title = styled.div`
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  justify-self: center;
  align-self: flex-start;
`;

const Snippet = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 0.75em;
`;

export default ({ title, body }) => (
  <Note>
    <Title>{title}</Title>
    <Snippet dangerouslySetInnerHTML={{ __html: body }} />
  </Note>
);
