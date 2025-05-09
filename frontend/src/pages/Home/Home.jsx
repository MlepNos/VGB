import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1b1f23, #121212)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        padding: 4,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Welcome to DualSensers 🎮
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Discover, explore, and collect your favorite video games.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/games")}>
        Browse Games
      </Button>
    </Box>
  );
};

export default Home;
