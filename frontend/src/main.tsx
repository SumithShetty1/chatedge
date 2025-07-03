import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx'
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Configure axios defaults for all HTTP requests
axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

// Create a custom Material-UI theme
const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab, serif",
    allVariants: { color: "white" },
  },
})

// Find the root DOM element and render the application
createRoot(document.getElementById('root')!).render(
  // StrictMode helps identify potential problems in the app
  <StrictMode>
    {/* AuthProvider wraps the app to provide authentication context */}
    <AuthProvider>
      {/* BrowserRouter enables client-side routing */}
      <BrowserRouter>
        {/* ThemeProvider applies the custom Material-UI theme */}
        <ThemeProvider theme={theme}>
          {/* Toaster displays notification popups (from react-hot-toast) */}
          <Toaster position='top-right' />
          {/* The main App component */}
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
