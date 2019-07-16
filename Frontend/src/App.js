import React from "react";
import { createGlobalStyle } from "styled-components";
import Header from './components/header'
import NotesList from './components/notelist'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0px 16px 0px 16px;
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

export default () => {
  return <div className="App"><GlobalStyle /><Header /><NotesList /></div>;
}
