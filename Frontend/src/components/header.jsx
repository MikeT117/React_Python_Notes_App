import React, { useState } from "react";
import styled from "styled-components";
import { navigate } from "@reach/router";
import Avatar from "./Avatar";
import {
  IoMdSearch,
  IoMdAdd,
  IoMdMenu,
  IoMdRefresh,
  IoMdCheckmark
} from "react-icons/io";
import Drawer from "./Drawer";
import { useDispatch, useSelector } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  background: #fff;
  align-items: center;
  padding: 1.5em 1.5em;
  background-color: ${props => props.bgColor || "#f7f7f7"};
`;

const SearchInput = styled.input`
  height: 32px;
  flex-grow: inherit;
  border-radius: inherit;
  border: none;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 0.9em;
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 0.5em;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  max-width: 100%;
  min-width: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-right: 1em;
  box-sizing: unset;
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

const Spacer = styled.div`
  flex-grow: 1;
`;

const SearchButtonWrapper = styled(ButtonWrapper)`
  align-items: center;
  padding: ${props => props.search && "0"};
  flex-grow: ${props => props.search && "1"};
  min-width: 0;
  & svg {
    padding: ${props => props.search && "0 .5em"};
    box-sizing: ${props => props.search && "unset"};
    min-width: 1.5em;
  }
  &:hover {
    cursor: pointer;
  }
`;

const AddButton = styled(ButtonWrapper)`
  @media (max-width: 768px) {
    border-radius: 50%;
    position: fixed;
    bottom: 1.5em;
    right: 1.5em;
    margin: 0;
    padding: 0.5em 0.5em;
    padding: 0.75em 0.75em;
    background-color: #04cef4;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    color: rgb(247, 247, 247);
    border: 1px solid rgba(0,0,0,0.0)
  }
  &:hover {
    cursor: pointer;
  }
`;

export default ({
  addNewNote,
  add,
  search,
  dark,
  bgColor,
  avatarPadding,
  sync
}) => {
  const [searchOpen, setSearch] = useState(false);
  const [drawerState, setDrawer] = useState(false);
  const syncStatus = useSelector(state => state.rootReducer.notes.synced);
  const dispatch = useDispatch();
  return (
    <Wrapper bgColor={bgColor}>
      <Drawer open={drawerState} close={() => setDrawer(false)} />
      <ButtonWrapper dark={dark} onClick={() => setDrawer(!drawerState)}>
        <IoMdMenu size="1.5em" />
      </ButtonWrapper>
      {search && (
        <SearchButtonWrapper search={searchOpen} dark={dark}>
          <IoMdSearch onClick={() => setSearch(!searchOpen)} size="1.5em" />
          {searchOpen && (
            <SearchInput
              placeholder="Search"
              onKeyDown={e => e.key === "Escape" && setSearch(false)}
              onChange={e =>
                dispatch({
                  type: "FILTER_NOTES",
                  payload: e.target.value.toLowerCase()
                })
              }
            />
          )}
        </SearchButtonWrapper>
      )}
      {!searchOpen && <Spacer />}
      {add && (
        <AddButton className="addButton" onClick={addNewNote} dark={dark}>
          <IoMdAdd size="1.5em" />
        </AddButton>
      )}
      <ButtonWrapper dark={dark} onClick={() => !syncStatus && sync}>
        {syncStatus ? (
          <IoMdCheckmark size="1.5em" />
        ) : (
          <IoMdRefresh size="1.5em" />
        )}
      </ButtonWrapper>
      <Avatar
        padding={avatarPadding}
        ringColor="#04cef4"
        onClick={() => navigate("/account")}
      />
    </Wrapper>
  );
};
