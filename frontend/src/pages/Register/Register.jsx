// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
const API = process.env.REACT_APP_API_URL;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/auth/register`, { username, email, password });
      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3, backgroundColor: "#f2f2f2", borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <TextField fullWidth label="Username" sx={{ mb: 2 }} value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField fullWidth label="Email" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" fullWidth onClick={handleSubmit}>Register</Button>
    </Box>
  );
};

export default Register;
