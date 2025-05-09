import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Avatar,
  Divider,
  Grid,
  Button,
  TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../store/authContext";
import { toast } from "react-toastify";
const API = process.env.REACT_APP_API_URL;
const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
];

const UserProfile = () => {
  const { authUser, token, setAuthUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(authUser?.avatar_url || avatarOptions[0]);
  const [bio, setBio] = useState(authUser?.bio || "");
  const [createdAt, setCreatedAt] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  useEffect(() => {
    if (token) {
      fetchUserReviews();
      fetchUserProfile();
    }
  }, [token]);

  useEffect(() => {
    if (isEditingAvatar) {
      setTempAvatar(authUser?.avatar_url || avatarOptions[0]);
    }
  }, [isEditingAvatar, authUser]);

  const fetchUserReviews = async () => {
    try {
      const res = await axios.get(`${API}/review/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      toast.error("Failed to load your reviews");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBio(res.data.bio);
      setTempBio(res.data.bio || "");
      setCreatedAt(new Date(res.data.created_at).toLocaleDateString());
    } catch (err) {
      console.error("Failed to fetch profile info");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${API}/review/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      fetchUserReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handleAvatarSave = async () => {
    try {
      await axios.put(
        `${API}/profile/avatar`,
        { avatar_url: tempAvatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = { ...authUser, avatar_url: tempAvatar };
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);

      toast.success("Avatar updated");
      setIsEditingAvatar(false);
    } catch (err) {
      toast.error("Failed to update avatar");
    }
  };

  const handleBioSave = async () => {
    try {
      await axios.put(
        `${API}/profile/bio`,
        { bio: tempBio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBio(tempBio);
      toast.success("Bio updated");
      setIsEditingBio(false);
    } catch (err) {
      toast.error("Failed to update bio");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          backgroundColor: "#f2f2f2",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Avatar src={authUser?.avatar_url} sx={{ width: 72, height: 72 }} />
        <Box>
          <Typography variant="h5">{authUser?.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            {authUser?.email}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Joined: {createdAt || "Loading..."}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Bio:</strong>
            {isEditingBio ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  sx={{ mt: 1 }}
                />
                <Button onClick={handleBioSave} sx={{ mt: 1 }} variant="outlined">
                  Save Bio
                </Button>
              </>
            ) : (
              <> {bio || "No bio set."}</>
            )}
          </Typography>
          {!isEditingBio && (
            <Button
              size="small"
              sx={{ mt: 1 }}
              onClick={() => setIsEditingBio(true)}
            >
              Edit Bio
            </Button>
          )}
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Total Reviews:</strong> {reviews.length}
          </Typography>
        </Box>
        <Button onClick={() => setIsEditingAvatar(!isEditingAvatar)} sx={{ ml: "auto" }}>
          {isEditingAvatar ? "Cancel" : "Edit Avatar"}
        </Button>
      </Box>

      {isEditingAvatar && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Choose Your Avatar
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {avatarOptions.map((avatar) => (
              <Grid item key={avatar}>
                <Avatar
                  src={avatar}
                  sx={{
                    width: 64,
                    height: 64,
                    cursor: "pointer",
                    border:
                      tempAvatar === avatar
                        ? "2px solid #1976d2"
                        : "2px solid transparent",
                  }}
                  onClick={() => setTempAvatar(avatar)}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={handleAvatarSave}
            disabled={tempAvatar === authUser?.avatar_url}
          >
            Save Changes
          </Button>
        </>
      )}

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" gutterBottom>Your Reviews</Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews yet.</Typography>
      ) : (
        reviews.map((r) => (
          <Card
            key={r.id}
            sx={{
              display: "flex",
              mb: 2,
              backgroundColor: "#1e1e1e",
              color: "white",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              image={r.image_url || "https://via.placeholder.com/120x180?text=No+Image"}
              alt={r.game_name}
              sx={{ width: 120 }}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{r.game_name}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Score:</strong> ⭐ {r.score}/10
              </Typography>
              <Typography variant="body2">{r.comment}</Typography>
            </CardContent>
            <IconButton
              onClick={() => handleDelete(r.id)}
              color="error"
              sx={{ alignSelf: "start", m: 2 }}
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        ))
      )}
    </Box>
  );
};

export default UserProfile;
