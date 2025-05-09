import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from "../../hooks/useAppContext";
const API = process.env.REACT_APP_API_URL;

const Discover = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { addGame } = useAppContext();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API}/game/external`, {
        params: { search },
      });
      setResults(response.data.results); // RAWG returns { results: [...] }
    } catch (err) {
      toast.error("Error searching games.");
    }
  };

  const handleSave = async (game) => {
    try {
      const res = await axios.post(`${API}/game`, game);
      toast.success(`🎮 ${game.name} saved to your library!`);
      addGame({
  ...game,
  image_url: game.background_image,
  genres: game.genres.map(g => g.name).join(", "),
  platforms: game.platforms.map(p => p.platform.name).join(", "),
  stores: game.stores.map(s => s.store.name).join(", "),
  esrb_rating: game.esrb_rating?.name || null,
  release_date: game.released,
}); // ✅ Instant update in context
    } catch (err) {
      if (err.response?.data?.message === "Game already exists") {
        toast.info(`${game.name} is already in your library.`);
      } else {
        toast.error("Failed to save game.");
        console.error(err);
      }
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Discover Games
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Search RAWG"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Grid container spacing={3}>
        {results.map((game) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#1b1f23",
                color: "white",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={game.background_image}
                alt={game.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>{game.name}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  Released: {game.released || "TBA"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  ⭐ {game.rating || "N/A"}
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "center", pb: 2 }}>
                <Button
                  onClick={() => handleSave(game)}
                  variant="contained"
                  size="small"
                  startIcon={<span>➕</span>}
                >
                  Add to Library
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Discover;
