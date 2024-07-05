import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./global.css";
import App from "./pages/App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Player from "./pages/Player";
import Search from "./pages/Search";
import Playlist from "./pages/Playlist";

navigator.serviceWorker
  .register("/sw.js", {
    type: "module",
    scope: "/",
  })
  .then((s) => {});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "",
        element: <Home></Home>,
      },
      {
        path: "search",
        element: <Search></Search>,
      },
      {
        path: "player",
        element: <Player></Player>,
      },
      {
        path: "playlist/:id",
        element: <Playlist></Playlist>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
