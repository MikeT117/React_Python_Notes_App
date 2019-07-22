import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { navigate } from "@reach/router";

const Wrapper = styled(motion.div)`
  display: flex;
  position: fixed;
  flex-direction: column;
  height: 100%;
  width: 250px;
  z-index: 110;
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
    font-weight: 400;
    color: rgba(0, 0, 0, 0.8);
    padding: 1em 0 1em 1.5em;
    list-style-type: none;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
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
  padding: 0.25em 0.5em;
  border-radius: 0.5em;
  color: ${props =>
    !props.dark ? "rgba(0, 0, 0, 0.6)" : "rgb(247, 247, 247)"};
  border: 1px solid
    ${props => (!props.dark ? "rgba(0, 0, 0, 0.12)" : "rgb(247, 247, 247)")};
  & svg {
    color: inherit;
  }
`;

export default ({ open, close }) => {
  return (
    <Wrapper
      animate={{ x: open ? 250 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 100 }}
    >
      <DrawerHeader>
        <ButtonWrapper onClick={close}>
          <IoMdClose size="1.5em" />
        </ButtonWrapper>
      </DrawerHeader>

      <UL>
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/account")}>Account</li>
      </UL>
    </Wrapper>
  );
};
