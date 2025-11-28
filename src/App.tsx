import { Outlet } from "react-router-dom";
import ApplicationBar from "./components/ApplicationBar";

export default function App() {
  return (
    <>
      <ApplicationBar />
      <Outlet /> {/* Child routes render here */}
    </>
  );
}