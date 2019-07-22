import React from "react";
import styled from "styled-components";
import vegetaBlue from "../assets/images/VegetaBlue.jpg";

const Wrapper = styled.div`
  width: ${props => props.size || "42px"};
  height: ${props => props.size || "42px"};
  border-radius: 50%;
  padding: ${props => props.padding || "2px"};
  background: ${props => props.ringColor};
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`;

export default ({ ...props }) => {
  return (
    <Wrapper {...props}>
      <Avatar src={vegetaBlue} />
    </Wrapper>
  );
};
