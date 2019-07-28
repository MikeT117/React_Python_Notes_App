import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { login, register } from "../redux/actions";
import { navigate } from "@reach/router";
const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.5em;
  padding: 1em 2em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12);
  @media (max-width: 12000px) {
    max-width: 500px;
  }
  @media (max-width: 1200px) {
    max-width: 50%;
  }
  @media (max-width: 12000px) {
    max-width: 500px;
  }
  @media (max-width: 1200px) {
    max-width: 50%;
  }
  @media (max-width: 992px) {
    max-width: 65%;
  }
  @media (max-width: 768px) {
    max-width: 75%;
  }
  @media (max-width: 576px) {
    border: none;
    box-shadow: none;
    min-width: 100%;
  }
`;

const Form = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input`
  flex-grow: 1;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.85em;
  margin-bottom: 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5em;
  padding: 0.5em;
  outline: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
`;

const Label = styled.label`
  flex-grow: 1;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1em;
  padding: 0.5em 0 0.5em 0;
`;

const Title = styled.h1`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 0.5em;
`;

const Button = styled.button`
  display: flex;
  flex-grow: 1;
  margin-top: 1em;
  padding: 0.5em;
  justify-content: center;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1em;
  border-radius: 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: transparent;
  outline: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const P = styled.p`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1em;
  & > a {
    text-decoration: none;
  }
  @media (max-width: 576px) {
    font-size: 0.85em;
  }
`;

export const Register = () => {
  const [userDetails, set] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    email: ""
  });

  const handleRegister = () => register(userDetails) && navigate("/login");

  return (
    <Wrapper>
      <FormWrapper>
        <Title>Register</Title>
        <Form>
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            value={userDetails.username}
            onChange={e => set({ ...userDetails, username: e.target.value })}
            placeholder="Username"
          />
          <Label htmlFor="firstname">First Name</Label>
          <Input
            name="firstname"
            value={userDetails.firstname}
            onChange={e => set({ ...userDetails, firstname: e.target.value })}
            placeholder="First Name"
          />
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            name="lastname"
            value={userDetails.lastname}
            onChange={e => set({ ...userDetails, lastname: e.target.value })}
            placeholder="Last Name"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            value={userDetails.password}
            onChange={e => set({ ...userDetails, password: e.target.value })}
            placeholder="Password"
          />
          <Label htmlFor="email">Email Address</Label>
          <Input
            name="email"
            value={userDetails.email}
            onChange={e => set({ ...userDetails, email: e.target.value })}
            placeholder="Email Address"
          />
        </Form>
        <Button onClick={handleRegister}>Register</Button>
      </FormWrapper>
      <P>
        Already have an account? Login{" "}
        <a href={`http://${window.location.hostname}:3000/login`}>here?</a>
      </P>
    </Wrapper>
  );
};

export const Login = () => {
  const [userDetails, set] = useState({ usernameEmail: "", password: "" });
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <FormWrapper>
        <Title>Login</Title>
        <Form>
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            value={userDetails.usernameEmail}
            onChange={e =>
              set({ ...userDetails, usernameEmail: e.target.value })
            }
            placeholder="Username/Email"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            value={userDetails.password}
            onChange={e => set({ ...userDetails, password: e.target.value })}
            placeholder="Password"
          />
        </Form>
        <Button onClick={() => dispatch(login(userDetails))}>Login</Button>
      </FormWrapper>
      <P>
        Don't have an account? Why not register{" "}
        <a href={`http://${window.location.hostname}:3000/register`}>here?</a>
      </P>
    </Wrapper>
  );
};
