import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Rating,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// ... your existing imports
import { useAuth } from "../../store/authContext";
const API = process.env.REACT_APP_API_URL;

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser, token } = useAuth(); // ✅ pull from context
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [score, setScore] = useState(0);
  const [averageScore, setAverageScore] = useState(null);
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [vgbScore, setVgbScore] = useState(game?.vgb_score || "");


const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF",
  "#FF6384", "#36A2EB", "#FFCE56", "#E7E9ED", "#B0BEC5"
];

  
  useEffect(() => {
    fetchGame();
    fetchReviews();
  }, [id]);

  const fetchGame = async () => {
    try {
      const res = await axios.get(`${API}/game/${id}`);
      setGame(res.data);
      setVgbScore(res.data.vgb_score || "");
    } catch (err) {
      console.error("Failed to fetch game", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/review/${id}`);
      setReviews(res.data);
      const scores = res.data.map((r) => r.score);
      if (scores.length) {
        const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
        setAverageScore(avg);

        const distribution = Array.from({ length: 10 }, (_, i) => i + 1).map((val) => ({
          name: val,
          value: scores.filter((s) => s === val).length,
        })).filter((d) => d.value > 0);
        setScoreDistribution(distribution);
      } else {
        setAverageScore(null);
        setScoreDistribution([]);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post(`${API}/review/${id}`, {
        comment,
        score,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review submitted!");
      setComment("");
      setScore(0);
      fetchReviews();
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${API}/review/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handleVgbScoreSubmit = async () => {
    try {
      await axios.post(`${API}/review/vgb-score/${id}`, {
        score: parseFloat(vgbScore),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("VGB score updated!");
      fetchGame();
    } catch (err) {
      toast.error("Failed to update VGB score");
    }
  };

  if (!game) return <Typography sx={{ p: 4 }}>Loading game...</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {/* Game Info Card */}
      <Card sx={{ display: "flex", gap: 2, backgroundColor: "#1e1e1e", color: "white", p: 2, borderRadius: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 300, height: 400, objectFit: "cover", borderRadius: 2 }}
          image={game.image_url || "https://via.placeholder.com/300x400?text=No+Image"}
          alt={game.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{game.name}</Typography>
          <Typography><strong>Genre:</strong> {game.genres || "Unknown"}</Typography>
          <Typography><strong>Platforms:</strong> {game.platforms || "Unknown"}</Typography>
          <Typography><strong>Stores:</strong> {game.stores || "Unknown"}</Typography>
          <Typography><strong>Release Date:</strong> {game.release_date}</Typography>
          <Typography><strong>ESRB Rating:</strong> {game.esrb_rating || "Not Rated"}</Typography>
          <Typography><strong>RAWG Rating:</strong> {game.rating || "N/A"} ({game.ratings_count} ratings)</Typography>
          {game.vgb_score && (
            <Typography><strong>VGB Score:</strong> ⭐ {game.vgb_score}/10</Typography>
          )}
          {averageScore && (
            <Typography><strong>authUser Score:</strong> ⭐ {averageScore}/10 from {reviews.length} reviews</Typography>
          )}
          <Typography sx={{ mt: 2 }}>{game.description || "No description available."}</Typography>
        </CardContent>
      </Card>

      {/* VGB Score Admin Form */}
      {authUser?.role === "admin" && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Set VGB Score</Typography>
          <TextField
            type="number"
            inputProps={{ min: 0, max: 10, step: 0.1 }}
            label="VGB Score"
            value={vgbScore}
            onChange={(e) => setVgbScore(e.target.value)}
            sx={{ mr: 2, width: 120 }}
          />
          <Button onClick={handleVgbScoreSubmit} variant="contained">Update</Button>
        </Box>
      )}

      {/* Review Submission */}
      {authUser ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Write a Review</Typography>
          <TextField
            label="Comment"
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography>Score:</Typography>
            <Rating name="score" value={score} onChange={(e, newValue) => setScore(newValue)} max={10} />
          </Box>
          <Button variant="contained" onClick={handleReviewSubmit}>Submit Review</Button>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ mt: 4 }}>
          Please log in to write a review.
        </Typography>
      )}

      {/* Score Chart */}
      {scoreDistribution.length > 0 && (
        <Box sx={{ my: 4, width: "100%", height: 250 }}>
          <Typography variant="h6">Score Distribution</Typography>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={scoreDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {scoreDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Review List */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Reviews</Typography>
        {reviews.map((r) => (
          <Box key={r.id} sx={{ borderBottom: "1px solid #444", mb: 2, pb: 1 }}>
            <Typography variant="subtitle2">
              {r.reviewer_name} — ⭐ {r.score}/10
              {authUser && (
                <IconButton
                  size="small"
                  color="error"
                  sx={{ float: "right" }}
                  onClick={() => handleDeleteReview(r.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Typography>
            <Typography variant="body2">{r.comment}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GameDetail;
