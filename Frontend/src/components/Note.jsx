import React from "react";
import styled from "styled-components";

const Note = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: .5em;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 1em;
  margin: .5em;
  /* margin: 0px 8px 8px 8px; */
  @media (max-width: 12000px) {
    max-width: 20%;
  }
  @media (max-width: 1200px) {
    max-width: 20%;
  }
  @media (max-width: 992px) {
    max-width: 28%;
  }
  @media (max-width: 768px) {
    max-width: 43%;
  }
  @media (max-width: 576px) {
    min-width: 100%;
    max-width: 100%;
    margin: 0.5em 0;
  }
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

export default ({ title, body, ...rest }) => (
  <Note {...rest}>
    <Title>{title}</Title>
    <Snippet dangerouslySetInnerHTML={{ __html: body }} />
  </Note>
);
