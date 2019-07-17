import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Router } from "@reach/router";
import Header from "./components/Header";
import Notes from "./pages/Notes_Page";
import Editor from "./components/Editor";
import Account from "./pages/Account_Page";
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  * {
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  margin: inherit;
`;

const HomePage = () => <Notes />;
const EditorPage = () => <Editor />;
const AccountPage = () => <Account />;

export default () => {
  const [editor, set] = useState(false);
  return (
    <Wrapper>
      <GlobalStyle />
      <Header displayEditor={() => set(!editor)} />
      <Router>
        <HomePage path="/" />
        <EditorPage path="/editor" callback={() => set(!editor)} />
        <AccountPage path="/account" />
      </Router>
    </Wrapper>
  );
};
