import React from "react";
import styled from "styled-components";
import Avatar from './avatar'
import Search from './searchbar'

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  background: #fff;
  align-content: center;
  padding: 16px 0px 16px 0px
`;

const Spacer = styled.div`
  flex-grow: 1;
`

export default () => <Wrapper><Spacer /><Search /><Spacer /><Avatar /></Wrapper>;
