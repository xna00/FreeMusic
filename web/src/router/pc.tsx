import { createBrowserRouter } from "react-router-dom";

import App from "../pages/App";
import Home from "../pages/pc/Home";
import Login from "../pages/mobile/Login";
import Player from "../pages/pc/Player";
import Search from "../pages/mobile/Search";
import Playlist from "../pages/pc/Playlist";
import Main from "../pages/pc/Main";

export const pcRouter = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "",
        element: <Home></Home>,
        children: [
          {
            path: "",
            element: <Main></Main>,
            children: [
              {
                path: "search",
                element: <Search></Search>,
              },
              {
                path: "playlist/:id",
                element: <Playlist></Playlist>,
              },
            ],
          },
          {
            path: "player",
            element: <Player></Player>,
          },
        ],
      },
    ],
  },
  {
    path: "/player",
    element: <Player></Player>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);
