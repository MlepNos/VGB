import { useAppContext } from "../../hooks/useAppContext";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ComputerIcon from "@mui/icons-material/Computer";
import AppleIcon from "@mui/icons-material/Apple";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
const API = process.env.REACT_APP_API_URL;

const platformIcons = {
  PC: <ComputerIcon fontSize="small" />,
  "PlayStation 5": <SportsEsportsIcon fontSize="small" />,
  "PlayStation 4": <SportsEsportsIcon fontSize="small" />,
  "Xbox One": <SportsEsportsIcon fontSize="small" />,
  "Xbox Series S/X": <SportsEsportsIcon fontSize="small" />,
  "Nintendo Switch": <SportsScoreIcon fontSize="small" />,
  iOS: <PhoneIphoneIcon fontSize="small" />,
  macOS: <AppleIcon fontSize="small" />,
};

const Games = () => {
  const { games, fetchGames } = useAppContext();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/game/${id}`);
      toast.success("Game removed.");
      fetchGames();
    } catch (err) {
      toast.error("Failed to delete game");
    }
  };

  const isValidImage = (url) => url && url.startsWith("http");

  const formattedDate = (dateStr) => {
    return dateStr && !isNaN(new Date(dateStr))
      ? new Date(dateStr).toLocaleDateString()
      : "Unknown";
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Games Library
      </Typography>
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                width: "18vw",
                height: "55vh",
                minWidth: 250,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#1e1e1e",
                color: "white",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: "25vh", objectFit: "cover" }}
                image={
                  isValidImage(game.image_url)
                    ? game.image_url
                    : "https://via.placeholder.com/300x180?text=No+Image"
                }
                alt={game.name}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    noWrap
                    title={game.name}
                    sx={{ mb: 1, cursor: "pointer" }}
                    onClick={() => navigate(`/games/${game.id}`)}
                  >
                    {game.name}
                  </Typography>

                  <Typography variant="body2">
                    Genre: {game.genres?.trim() || "Unknown"}
                  </Typography>
                  <Typography variant="body2">
                    Released: {formattedDate(game.release_date)}
                  </Typography>
                  <Typography variant="body2">
                    ESRB: {game.esrb_rating?.trim() || "Not Rated"}
                  </Typography>
                  {game.vgb_score && (
  <Typography variant="body2">
    VGB Score: ⭐ {game.vgb_score}/10
  </Typography>
)}

                  {game.platforms && (
                    <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                      {game.platforms.split(", ").map((platform) => (
                        <Box
                          key={platform}
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          {platformIcons[platform] || <SportsScoreIcon fontSize="small" />}
                          <Typography variant="caption" sx={{ color: "gray" }}>
                            {platform}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleDelete(game.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Games;
