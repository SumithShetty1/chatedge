import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";

const NotFound = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                mt: 9,
                p: 3,
                backgroundColor: "transparent",
                color: "white",
            }}
        >
            <Box sx={{ mt: 8, mb: 4 }}>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: "4rem", md: "6rem" },
                        fontWeight: 700,
                        color: "white",
                        mb: 2,
                        textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                    }}
                >
                    404
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: { xs: "1.5rem", md: "2rem" },
                        color: "white",
                        mb: 4,
                        opacity: 0.9,
                    }}
                >
                    Oops! Page Not Found
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        maxWidth: "600px",
                        color: "white",
                        opacity: 0.8
                    }}
                >
                    The page you're looking for doesn't exist or has been moved.
                </Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    size="large"
                    sx={{
                        px: 4,
                        py: 2,
                        fontSize: "1rem",
                        backgroundColor: "#00fffc",
                        color: "black",
                        "&:hover": {
                            backgroundColor: "#00e5d9",
                        },
                    }}
                >
                    Return to Home
                </Button>
            </Box>
            <Footer />
        </Box>
    );
};

export default NotFound;
