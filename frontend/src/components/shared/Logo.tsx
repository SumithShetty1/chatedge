import { Link } from 'react-router-dom';
import Typography from "@mui/material/Typography";

// Logo component with clickable link to homepage
const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      marginRight: "auto",
      alignItems: "center",
      gap: "8px",
    }}
    >
      <Link to={"/"} style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        textDecoration: "none"
      }}>
        <img src="intellichat-logo.png" alt="Logo"
          width={"40px"}
          height={"35px"}
          className="image-inverted"
        />
        <Typography
          sx={{
            display: { md: "block", sm: "none", xs: "none" },
            mr: "auto",
            fontWeight: "800",
            textShadow: "2px 2px 20px #000",
          }}
        >
          <span style={{ fontSize: "25px" }}>IntelliChat</span>
        </Typography>
      </Link>
    </div>
  )
};

export default Logo;  
