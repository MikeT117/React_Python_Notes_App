import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import defaultAvatar from "../assets/images/defaultAvatar.png";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-width: ${props => props.size || "42px"};
  max-width: 42px;
  height: ${props => props.size || "42px"};
  border-radius: 50%;
  background: ${props => props.ringColor};
  border: ${props => props.padding || "2px"} solid ${props => props.ringColor};
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`;

export default ({ children, ...props }) => {
  const avatarImg = useSelector(state => state.rootReducer.user.avatar);
  return (
    <Wrapper {...props}>
      <img
        src={avatarImg === "http://localhost:5000/static/profileImages/" ? defaultAvatar : avatarImg}
        alt="Avatar"
      />
      {children}
    </Wrapper>
  );
};
