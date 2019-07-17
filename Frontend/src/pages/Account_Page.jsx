import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "../components/Avatar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AvatarBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #04cef4;
  flex-grow: 1;
  padding: 32px;
`;

const UserFull = styled.h1`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  font-size: 1.25em;
`;

const AccountDetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px 16px;
  justify-content: space-between;
`;

const H1 = styled.h1`
  text-align: center;
  margin: 0px 0px 8px 0px;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1.5em;
  padding: 16px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 400px;
  flex-grow: 1;
  align-self: center;
`;

const Item = styled.h2`
  font-weight: 400;
  font-family: "Open Sans", sans-serif;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.1em;
  margin: 4px 0px;
`;

const ItemData = styled.h2`
  font-size: 1.2em;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
  color: rgba(0, 0, 0, 0.7);
  margin: 4px 0px;
`;

export default () => {
  const [accData, set] = useState(null);
  useEffect(() => {
    const retrieveAccountData = async () => {
      const refresh_token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjMyMzIwOTcsIm5iZiI6MTU2MzIzMjA5NywianRpIjoiYzE4NWNjYWMtODAxZS00ZWQ2LWE5OTEtNzcyZGU2ODJlMGFkIiwiZXhwIjoxNTY1ODI0MDk3LCJpZGVudGl0eSI6IlJhem9yMTE2IiwidHlwZSI6InJlZnJlc2gifQ.LA9KBfsvgHYUe17sQnP0OaA3nPxr1EDnf0VEYI23qTg";
      const resp = await fetch("http://localhost:5000/retrieveAccountData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refresh_token}`
        }
      });
      const json = await resp.json();
      set(json);
    };
    retrieveAccountData();
  }, []);
  return (
    accData && (
      <Wrapper>
        <AvatarBackground>
          <Avatar size={"160px"} />
          <UserFull>{accData.username}</UserFull>
        </AvatarBackground>
        <H1>Account Details</H1>
        <Wrap>
          <Item>First Name</Item>
          <ItemData>{accData.firstname}</ItemData>
        </Wrap>
        <Wrap>
          <Item>Last Name</Item>
          <ItemData>{accData.lastname}</ItemData>
        </Wrap>
        <Wrap>
          <Item>Email</Item>
          <ItemData>{accData.email}</ItemData>
        </Wrap>
        <Wrap>
          <Item>Last Login</Item>
          <ItemData>{accData.timeStampLastLogin}</ItemData>
        </Wrap>
        <AccountDetailsWrapper />
      </Wrapper>
    )
  );
};
