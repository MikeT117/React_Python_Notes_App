import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "./Avatar";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  background: #fff;
  align-content: center;
  padding: 16px 0px 16px 0px;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const SearchWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  flex-grow: 1;
  max-height: 40px;
  min-width: 70%;
`;

const SearchInput = styled.input`
  height: 100%;
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0px 2% 0px 2%;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 0.90em;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    outline: none;
  }
`;

export default ({ displayEditor }) => {
  const [search, set] = useState("");
  const handleEnter = e => {
    if (e.key === "Enter") {
      console.log(search);
    }
  };
  return (
    <Wrapper onClick={displayEditor}>
      <Spacer />
      <SearchWrapper>
        <SearchInput
          placeholder="Search"
          onKeyDown={handleEnter}
          value={search}
          onChange={e => set(e.target.value)}
        />
      </SearchWrapper>
      <Spacer />
      <Avatar />
    </Wrapper>
  );
};
