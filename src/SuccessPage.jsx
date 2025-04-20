// src/pages/SuccessPage.jsx
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function SuccessPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f0fdf4",
        textAlign: "center",
        px: 2,
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 100, color: "green" }} />
      <Typography variant="h4" gutterBottom>
        Success!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        You can close the page now.
      </Typography>
    </Box>
  );
}

export default SuccessPage;
