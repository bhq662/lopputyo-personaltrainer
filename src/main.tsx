import './index.css';
import React from "react";
import App from './App.tsx';
import ReactDOM from "react-dom/client";
import Customerlist from './components/Customerlist.tsx';
import Traininglist from './components/Traininglist.tsx';
import { createBrowserRouter, RouterProvider } from "react-router";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const router = createBrowserRouter([
  // import used components
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/customers",
        element: <Customerlist />,
      },
      {
        path: "trainings",
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
