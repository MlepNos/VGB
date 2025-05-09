// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "../../store/authContext";
import { toast } from "react-toastify";
const API = process.env.REACT_APP_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      login(res.data.user, res.data.token);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3, backgroundColor: "#f2f2f2", borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField fullWidth label="Email" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" fullWidth onClick={handleSubmit}>Login</Button>
    </Box>
  );
};

export default Login;
