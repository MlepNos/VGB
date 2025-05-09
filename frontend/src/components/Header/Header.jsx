import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authContext";

const Header = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1b1f23" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          VGB
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/games">
          Games
        </Button>
        <Button color="inherit" component={Link} to="/discover">
          Discover
        </Button>

        {authUser ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            <Typography variant="body2" sx={{ mx: 2 }}>
              {authUser.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
