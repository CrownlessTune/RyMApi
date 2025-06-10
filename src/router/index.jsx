import { createBrowserRouter } from "react-router-dom";
import LayoutSelector from "@/components/LayoutSelector";

import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Characters from "@/pages/Characters";
import Community from "@/pages/Community";
import Regions from "@/pages/Regions";
import Enemies from "@/pages/Enemies";
import User from "@/pages/User";
import Error404 from "@/pages/Error404";

import PrivateRoute from "@/components/PrivateRoute"; // importa tu componente PrivateRoute

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutSelector />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "characters", element: <Characters /> },
      { path: "community", element: <Community /> },
      { path: "regions", element: <Regions /> },
      { path: "enemies", element: <Enemies /> },
      {
        path: "user",
        element: (
          <PrivateRoute>
            <User />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <Error404 /> },
    ],
  },
]);
