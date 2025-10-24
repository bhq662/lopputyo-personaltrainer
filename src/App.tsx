import Customerlist from "./components/Customerlist";

// style imports
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

// app bar import
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function App() {

  return (
    <>
      <Container maxWidth="lg">
        <AppBar position="static">
          <Toolbar>
            <Typography>Personal Training</Typography>
          </Toolbar>
        </AppBar>
        <Customerlist />
        <CssBaseline />
      </Container>
    </>
  )
}