import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Hero from "./components/Hero.tsx";
import Customerlist from "./components/Customerlist.tsx";
import Traininglist from "./components/Traininglist.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Hero /> },          // only show Hero on "/"
      { path: "customers", element: <Customerlist /> },
      { path: "trainings", element: <Traininglist /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
