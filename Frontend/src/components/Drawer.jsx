import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { IoMdArrowBack } from "react-icons/io";
import { navigate } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
const Wrapper = styled(motion.div)`
  display: flex;
  position: fixed;
  flex-direction: column;
  height: 100%;
  width: 250px;
  z-index: 50;
  background-color: #f7f7f7;
  left: -250px;
  top: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const UL = styled.ul`
  margin: 0;
  padding: 0;
  & > li {
    font-family: "Open Sans", sans-serif;
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.6);
    padding: 1em 0 1em 1.5em;
    list-style-type: none;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    &:hover {
      cursor: pointer;
    }
  }
  & li:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-content: center;
  padding: 1.5em;
  height: 90px;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25em 0.5em;
  border-radius: 0.5em;
  color: ${props =>
    !props.dark ? "rgba(0, 0, 0, 0.6)" : "rgb(247, 247, 247)"};
  border: 1px solid
    ${props => (!props.dark ? "rgba(0, 0, 0, 0.12)" : "rgb(247, 247, 247)")};
  & svg {
    color: inherit;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Overlay = styled.span`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.45);
  z-index: 40;
`;

const Span = styled.span`
  font-family: "Open Sans", sans-serif;
  padding-left: 0.5em;
`;
export default ({ open, close }) => {
  const userName = useSelector(state => state.rootReducer.user.username);
  const dispatch = useDispatch();
  return (
    <>
      {open && <Overlay onClick={close} />}
      <Wrapper
        onKeyUp={e => console.log(e.key)}
        animate={{ x: open ? 250 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 100 }}
      >
        <DrawerHeader>
          <ButtonWrapper onClick={close}>
            <IoMdArrowBack size="1.5em" />
            <Span>{userName}</Span>
          </ButtonWrapper>
        </DrawerHeader>
        <UL>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/account")}>Account</li>
          <li onClick={() => dispatch({ type: "LOGOUT" })}>Logout</li>
        </UL>
      </Wrapper>
    </>
  );
};
