// components/AvatarPicker.jsx
import { Box, Avatar, Typography } from "@mui/material";

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
];

const AvatarPicker = ({ selected, onSelect }) => (
  <Box display="flex" gap={2} flexWrap="wrap">
    {avatars.map((url) => (
      <Box key={url} textAlign="center">
        <Avatar
          src={url}
          sx={{
            width: 64,
            height: 64,
            border: selected === url ? "3px solid #1976d2" : "2px solid gray",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onClick={() => onSelect(url)}
        />
        {selected === url && (
          <Typography variant="caption" color="primary">
            Selected
          </Typography>
        )}
      </Box>
    ))}
  </Box>
);

export default AvatarPicker;
