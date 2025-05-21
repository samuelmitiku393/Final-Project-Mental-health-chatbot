import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled, keyframes } from "@mui/material/styles";
import { motion } from "framer-motion";

// Background animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Centered full screen background
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea, #764ba2, #6b8dd6, #8e9eab)",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));

// Glass style login card
const StyledPaper = styled(Paper)(({ theme }) => ({
  backdropFilter: "blur(20px)",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  padding: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: 450,
  width: "100%",
  color: "#fff",
}));

// Styled fields
const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "#ccc",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ccc",
    },
    "&:hover fieldset": {
      borderColor: "#fff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff",
    },
  },
});

// Motion-enabled button
const MotionButton = styled(motion.button)({
  backgroundColor: "#ffffff33",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "12px 20px",
  fontWeight: "bold",
  width: "100%",
  marginTop: "1rem",
  marginBottom: "1rem",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "all 0.2s ease-in-out",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) throw new Error("Please fill in all fields");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      if (!response.data?.access_token || !response.data?.user) {
        throw new Error("Invalid server response format");
      }

      // Check if user has admin role
      if (response.data.user.role !== "admin") {
        throw new Error("Access restricted to administrators only");
      }

      await login(response.data.access_token, {
        email: response.data.user.email,
        role: response.data.user.role,
      });

      const origin = location.state?.from?.pathname || "/";
      navigate(origin);
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = "Invalid request data";
            break;
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 403:
            errorMessage = "Access restricted to administrators only";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 4,
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          Admin Panel for Haramaya University Mental Health Chatbot
        </Typography>

        <StyledPaper elevation={3}>
          <LockOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Admin Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", textAlign: "center" }}
          >
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Sign In"
              )}
            </MotionButton>
          </Box>
        </StyledPaper>
      </Container>
    </GradientBackground>
  );
};

export default Login;
