import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../components/Avatar";
import Header from "../components/Header";
import { retrieveAccountData } from "../redux/actions";;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AvatarBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  flex-grow: 1;
  padding: 32px;
`;

const UserFull = styled.h1`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1.5em;
`;

const H1 = styled.h1`
  text-align: center;
  margin: 0px 0px 0.5em 0px;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1.5em;
  padding: 1em;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 400px;
  flex-grow: 1;
  align-self: center;
  @media (max-width: 768px) {
    min-width: 320px;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
`;

const Item = styled.h2`
  font-weight: 400;
  font-family: "Open Sans", sans-serif;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.1em;
  margin: 0.5em 0;
`;

const ItemData = styled.h2`
  font-size: 1.2em;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
  color: rgba(0, 0, 0, 0.7);
  margin: 0.5em 0;
`;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  margin: inherit;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(#04cef4,#f7f7f7,#f7f7f7);
`;

export default (data, sync) => {
  const accData = useSelector(state => state.rootReducer.user.info);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(retrieveAccountData(data.refresh_token));
  }, [dispatch]);
  return (
    <Wrapper>
      <Header avatarPadding="none" bgColor="transparent" dark={true} sync={sync} />
      {accData && (
        <ContentWrapper>
          <AvatarBackground>
            <Avatar size={"182px"} padding="4px" ringColor="#f7f7f7" />
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
        </ContentWrapper>
      )}
    </Wrapper>
  );
};
