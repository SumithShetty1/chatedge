import { Box, Typography } from "@mui/material";

// Fixed footer component displaying copyright information
const Footer = () => {
  return (
    <footer>
      <Box
        component="footer"
        sx={{
          width: "100%",
          py: 2,
          px: 2,
          backgroundColor: "transparent",
          textAlign: "center",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "white",
            fontSize: "0.875rem",
            letterSpacing: "0.5px"
          }}
        >
          © {new Date().getFullYear()} ChatEdge. All rights reserved.
        </Typography>
      </Box>
    </footer>
  );
};

export default Footer;
