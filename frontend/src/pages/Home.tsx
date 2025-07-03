import React from "react";
import TypingAnim from "../components/typer/TypingAnim";
import { Box } from "@mui/material";
import Footer from "../components/footer/Footer";

// Home page component with typing animation and robot image
const Home = () => {

    return (
        <Box width={"100%"} height={"100%"}>
            <Box sx={{ display: 'flex', width: "100%", flexDirection: 'column', alignItems: "center", mx: "auto", mt: 15, }}>
                <Box>
                    {/* Typing animation component */}
                    <TypingAnim />
                </Box>
                <Box sx={{ width: "100%", display: "flex", flexDirection: { md: "row", xs: "column", sm: "column" }, gap: 5, my: 10, }}>
                    <img src="robot.png" alt="robot" style={{ width: "200px", margin: "auto" }} />
                </Box>
            </Box>

            {/* Footer component at bottom of page */}
            <Footer />
        </Box>
    )
}

export default Home
