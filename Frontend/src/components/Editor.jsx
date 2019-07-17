import React, { useState } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 0px 16px 0px 15px;
`;

const Overlay = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: 80;
`;

const Editor = styled.div`
  border-radius: 8px;
  background: #fff;
  padding: 8px;
  flex-grow: 1;
  z-index: 100;
`;

const StyledReactQuill = styled(ReactQuill)`
  background: inherit;
  border-radius: 8px;
  & > .ql-toolbar {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom: none;
  }
  & > .ql-container {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  & > button:last-child {
    margin-left: 8px;
  }
`;
const Button = styled.button`
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: none;
  padding: 8px;
  color: rgba(0, 0, 0, 0.87);
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 0.8em;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:focus {
    background: rgba(4, 206, 244, 0.12);
    outline: none;
  }
`;

const Title = styled.input`
  color: green;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 1.15em;
  color: rgba(0, 0, 0, 0.87);
  border: none;
  padding: 8px 8px;
  &:focus {
    outline: none;
  }
`;

export default ({ callback }) => {
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  return (
    <Wrapper>
      <Overlay onClick={callback} />
      <Editor>
        <Title
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <StyledReactQuill
          placeholder="Text here"
          theme="snow"
          value={body}
          onChange={e => setBody(e)}
        />
        <ButtonWrapper>
          <Button onClick={() => console.log(body)}>Discard</Button>
          <Button onClick={() => console.log(title)}>Save</Button>
        </ButtonWrapper>
      </Editor>
    </Wrapper>
  );
};
