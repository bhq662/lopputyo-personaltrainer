import { Outlet } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import ApplicationBar from "./components/ApplicationBar";

export default function App() {
  return (
    <>
      <CssBaseline>
        <ApplicationBar />
        <Outlet /> {/* Child routes render here */}
      </CssBaseline>
    </>
  );
}