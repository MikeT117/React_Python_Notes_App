import React from "react";
import styled from "styled-components";
import vegetaBlue from "../assets/images/VegetaBlue.jpg";


const Wrapper = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  padding: 2px;
  background: ${props => props.ringColor}; 
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`

export default () => {
  return (
  <Wrapper ringColor='#04cef4'><Avatar src={vegetaBlue}/></Wrapper>
  )
};
