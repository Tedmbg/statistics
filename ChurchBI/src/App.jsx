import Dashboard from "./pages/dashboard/Dashboard"
import { theme } from "./cutomeTheme";
import { ThemeProvider } from "@emotion/react";
import { Box, Button } from "@mui/material";
import Main from "./components/Main";
import './index.css';




function App() {
  return (
    <ThemeProvider theme={theme}>
        <Main/>
    </ThemeProvider>
  )
}

export default App
