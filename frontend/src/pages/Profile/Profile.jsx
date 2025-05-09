// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../store/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) fetchUserReviews();
  }, [authUser]);

  const fetchUserReviews = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/review/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      toast.error("Failed to load user reviews");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3003/api/review/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      fetchUserReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (!authUser) {
    return <Typography sx={{ p: 4 }}>Please log in to view your profile.</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        {authUser.username}'s Profile
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {authUser.email}
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Your Reviews
      </Typography>

      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review.id}>
            <Card
              sx={{ backgroundColor: "#1e1e1e", color: "white", borderRadius: 2 }}
            >
              <CardMedia
                component="img"
                height="180"
                image={review.image_url || "https://via.placeholder.com/300x180?text=No+Image"}
                alt={review.name}
              />
              <CardContent>
                <Typography variant="h6" noWrap sx={{ cursor: "pointer" }} onClick={() => navigate(`/games/${review.game_id}`)}>
                  {review.name}
                </Typography>
                <Typography variant="body2">⭐ {review.score}/10</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  {review.comment}
                </Typography>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(review.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
