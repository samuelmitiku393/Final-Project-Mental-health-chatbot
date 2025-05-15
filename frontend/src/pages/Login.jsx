import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const AuthContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1f2b 0%, #2f3645 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const FormBox = styled.form`
  background-color: rgba(30, 37, 51, 0.9);
  padding: 40px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  width: 380px;
  color: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 5px;
  font-size: 24px;
  color: #7fd1ae;
  font-weight: 600;
`;

const Subtitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 20px;
  color: #a0a8c0;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 15px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #3a4556;
  background-color: #2a3342;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #7fd1ae;
    box-shadow: 0 0 0 2px rgba(127, 209, 174, 0.2);
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: linear-gradient(to right, #7fd1ae, #5db391);
  border: none;
  border-radius: 8px;
  color: #1e2533;
  cursor: pointer;
  margin-top: 15px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(127, 209, 174, 0.3);

  &:hover {
    background: linear-gradient(to right, #6dc0a0, #4ca181);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(127, 209, 174, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #a0a8c0;
  border: 1px solid #3a4556;
  box-shadow: none;
  margin-top: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    transform: translateY(-1px);
  }
`;

const Message = styled.p`
  margin: 10px 0;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
`;

const ErrorMessage = styled(Message)`
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const SuccessMessage = styled(Message)`
  color: #51cf66;
  background-color: rgba(81, 207, 102, 0.1);
  border: 1px solid rgba(81, 207, 102, 0.3);
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #6b7280;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #3a4556;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <FormBox onSubmit={handleLogin}>
        <Title>Mental Health Chatbot</Title>
        <Subtitle>For Haramaya University</Subtitle>
        <h3>Login to Your Account</h3>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Divider>or</Divider>

        <SecondaryButton type="button" onClick={() => navigate("/register")}>
          Create New Account
        </SecondaryButton>
      </FormBox>
    </AuthContainer>
  );
}

export default Login;
