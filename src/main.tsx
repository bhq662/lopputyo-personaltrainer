import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Hero from "./components/Hero.tsx";
import Customerlist from "./components/Customerlist.tsx";
import Traininglist from "./components/Traininglist.tsx";
import Statistics from "./components/Statistics.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Hero /> },
      { path: "customers", element: <Customerlist /> },
      { path: "trainings", element: <Traininglist /> },
      { path: "statistics", element: <Statistics /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
