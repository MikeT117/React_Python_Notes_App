import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Router, Redirect } from "@reach/router";
import { useSelector } from "react-redux";
import Notes from "./pages/Notes_Page";
import Account from "./pages/Account_Page";
import { Register, Login } from "./pages/Register_Login_Page";
import useSyncPolling from "./hooks/useSyncPolling";

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

const HomePage = data =>
  data.isLoggedIn ? <Notes {...data} /> : <Redirect to="/login" noThrow />;
const AccountPage = data =>
  data.isLoggedIn ? (
    <Account refresh_token={data.refresh_token} />
  ) : (
    <Redirect to="/login" noThrow />
  );
const LoginPage = data =>
  data.isLoggedIn ? <Redirect to="/" noThrow /> : <Login />;

const RegisterPage = data =>
  data.isLoggedIn ? <Redirect to="/" noThrow /> : <Register />;

export default () => {
  const user = useSelector(state => state.rootReducer.user);
  useSyncPolling();
  return (
    <>
      <GlobalStyle />
      <StyledRouter>
        <HomePage {...user} path="/" />
        <AccountPage {...user} path="/account" />
        <LoginPage {...user} path="login" />
        <RegisterPage {...user} path="/register" />
      </StyledRouter>
    </>
  );
};
