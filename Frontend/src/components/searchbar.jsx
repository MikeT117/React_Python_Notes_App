import React,  { useState } from 'react'
import styled from 'styled-components'

const SearchWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  flex-grow: 1;
  max-height: 40px;
  min-width: 70%;
`

const SearchInput = styled.input`
  height: 100%;
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.12);
  padding: 0px 2% 0px 2%;
  font-family: 'Open Sans', sans-serif;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:focus {
    border: 1px solid rgba(0,0,0,0.24);
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    outline: none;
  }
`


export default () => {
  const [search, set] = useState("")
  return (
  <SearchWrapper>
    <SearchInput placeholder="Search" value={search} onChange={(e) => {set(e.target.value); console.log(search)}}/>
  </SearchWrapper>
  );
}