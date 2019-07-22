import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Router, Redirect } from "@reach/router";
import { useSelector } from "react-redux";
import Notes from "./pages/Notes_Page";
import Account from "./pages/Account_Page";
import { Register, Login } from "./pages/Register_Login_Page";
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding:0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f7f7f7;
  }
  * {
    box-sizing: border-box;
    scrollbar-width: thin;
  }
`;

const StyledRouter = styled(Router)`
  position: absolute;
  width: 100%;
  height: 100%;
  margin: inherit;
  display: flex;
  flex-direction: column;
`;

const HomePage = isLoggedIn =>
  isLoggedIn.isLoggedIn ? <Notes /> : <Redirect to="/login" noThrow />;
const AccountPage = isLoggedIn =>
  isLoggedIn.isLoggedIn ? <Account /> : <Redirect to="/login" noThrow />;
const LoginPage = isLoggedIn =>
  isLoggedIn.isLoggedIn ? <Redirect to="/" noThrow /> : <Login />;
const RegisterPage = isLoggedIn =>
  isLoggedIn.isLoggedIn ? <Redirect to="/" noThrow /> : <Register />;
export default () => {
  const isLoggedIn = useSelector(state => state.rootReducer.user.isLoggedIn);
  return (
    <>
      <GlobalStyle />
      <StyledRouter>
        <HomePage isLoggedIn={isLoggedIn} path="/" />
        <AccountPage isLoggedIn={isLoggedIn} path="/account" />
        <LoginPage isLoggedIn={isLoggedIn} path="login" />
        <RegisterPage isLoggedIn={isLoggedIn} path="/register" />
      </StyledRouter>
    </>
  );
};
