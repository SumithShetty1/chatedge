import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from '../context/AuthContext';
import NavigationLink from './shared/NavigationLink';

// Header component with dynamic navigation based on auth status
const Header = () => {
  const auth = useAuth();

  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        {/* Application logo */}
        <Logo />
        <div>
          {/* Conditional rendering based on login status */}
          {auth?.isLoggedIn ? (
            // Logged-in user navigation
            <>
              <NavigationLink
                bg="#00fffc"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
              <NavigationLink
                bg="51538f"
                textColor="white"
                to="/"
                text="logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            // Guest user navigation
            <>
              <NavigationLink
                bg="#00fffc"
                to="/login"
                text="Login"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/signup"
                text="Signup"
              />
            </>)}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
