import { createBrowserRouter } from "react-router-dom";

import App from "../pages/App";
import Home from "../pages/mobile/Home";
import Login from "../pages/mobile/Login";
import Player from "../pages/mobile/Player";
import Search from "../pages/mobile/Search";
import Playlist from "../pages/mobile/Playlist";

export const mobileRouter = createBrowserRouter([
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
