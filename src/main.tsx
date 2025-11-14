import './index.css';
import React from "react";
import App from './App.tsx';
import ReactDOM from "react-dom/client";
import Customerlist from './components/Customerlist.tsx';
import Traininglist from './components/Traininglist.tsx';
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  // import used components
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Customerlist />,
        index: true,
      },
      {
        path: "gettrainings",
        element: <Traininglist />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
